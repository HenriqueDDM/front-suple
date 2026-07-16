import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  MessageCircle,
  Package,
  Pencil,
  Phone,
  Repeat,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { EmptyState } from "@/shared/components/EmptyState";
import { StatsCard } from "@/shared/components/StatsCard";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useFormState } from "@/shared/hooks/useFormState";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  paymentMethodLabel,
} from "@/shared/utils/format";
import { getCustomersService, queryKeys } from "@/services";
import type { CreateCustomerDto } from "@/types/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PAGE_SIZE = 10;
const customersService = getCustomersService();

function whatsappUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function NextPurchaseBadge({ days }: { days: number | null }) {
  if (days == null) return null;
  if (days < 0) {
    return <Badge variant="destructive">{Math.abs(days)}d atrasado</Badge>;
  }
  if (days === 0) {
    return <Badge variant="secondary">hoje</Badge>;
  }
  if (days <= 7) {
    return <Badge variant="secondary">em {days}d</Badge>;
  }
  return null;
}

function timesLabel(n: number): string {
  return n === 1 ? "1 vez" : `${n} vezes`;
}

export function CustomerProfilePage() {
  const { customerId } = useParams({ from: "/_app/customers_/$customerId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useCustomerProfile(customerId);
  const [historyVisible, setHistoryVisible] = useState(PAGE_SIZE);
  const [patternsVisible, setPatternsVisible] = useState(PAGE_SIZE);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { form, setField, reset } = useFormState<CreateCustomerDto>({
    name: "",
    phone: "",
    email: "",
    cpf: "",
    birthDate: "",
    notes: "",
  });

  const invalidateCustomer = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.profile(customerId),
      }),
    ]);
  }, [customerId, queryClient]);

  const handleOpenEdit = useCallback(() => {
    if (!profile) return;
    const { id: _id, lastPurchase: _lastPurchase, totalSpent: _totalSpent, ...rest } =
      profile.customer;
    reset(rest);
    setIsEditOpen(true);
  }, [profile, reset]);

  const handleSaveEdit = useCallback(async () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    await customersService.update(customerId, form);
    await invalidateCustomer();
    toast.success("Cliente atualizado.");
    setIsEditOpen(false);
  }, [customerId, form, invalidateCustomer]);

  const visiblePurchases = useMemo(
    () => profile?.purchases.slice(0, historyVisible) ?? [],
    [profile?.purchases, historyVisible],
  );

  const visiblePatterns = useMemo(
    () => profile?.productPatterns.slice(0, patternsVisible) ?? [],
    [profile?.productPatterns, patternsVisible],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: "/customers" })}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <EmptyState
          icon={ShoppingBag}
          title="Cliente não encontrado"
          description="O cliente pode ter sido removido ou o link é inválido."
        />
      </div>
    );
  }

  const { customer, kpis } = profile;
  const waUrl = whatsappUrl(customer.phone);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" /> Clientes
          </Link>
        </Button>
        <Button size="sm" onClick={handleOpenEdit}>
          <Pencil className="h-4 w-4" /> Editar cliente
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <UserAvatar name={customer.name} className="h-14 w-14" fallbackClassName="text-sm" />
            <div className="min-w-0 space-y-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{customer.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {customer.phone ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </span>
                ) : null}
                {customer.email ? <span className="break-all">{customer.email}</span> : null}
                {customer.cpf ? <span>CPF {customer.cpf}</span> : null}
              </div>
              {customer.notes ? (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{customer.notes}</p>
              ) : null}
            </div>
          </div>

          {waUrl ? (
            <Button asChild className="shrink-0 bg-[#25D366] text-white hover:bg-[#22c55e]">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Total gasto"
          value={formatCurrency(kpis.totalSpent)}
          icon={Wallet}
          accent="primary"
        />
        <StatsCard
          title="Compras"
          value={formatNumber(kpis.purchaseCount)}
          icon={ShoppingBag}
          accent="success"
        />
        <StatsCard
          title="Ticket médio"
          value={formatCurrency(kpis.averageTicket)}
          icon={TrendingUp}
          accent="warning"
        />
        <StatsCard
          title="Última compra"
          value={formatDate(kpis.lastPurchase)}
          icon={CalendarClock}
          accent="primary"
        />
        <StatsCard
          title="Intervalo médio"
          value={
            kpis.averageIntervalDays != null ? `${kpis.averageIntervalDays} dias` : "—"
          }
          icon={Repeat}
          hint={kpis.averageIntervalDays != null ? "entre compras" : "precisa de 2+ compras"}
          accent="success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de compras</CardTitle>
            <CardDescription>Vendas vinculadas a este cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.purchases.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Nenhuma compra"
                description="Vincule o cliente no PDV para montar o histórico."
              />
            ) : (
              <>
                {visiblePurchases.map((sale) => (
                  <div
                    key={sale.id}
                    className="rounded-lg border border-border px-4 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{sale.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(sale.createdAt)} ·{" "}
                          {paymentMethodLabel[sale.paymentMethod]}
                        </p>
                        {sale.notes ? (
                          <p className="mt-1 text-xs text-muted-foreground">{sale.notes}</p>
                        ) : null}
                      </div>
                      <p className="font-semibold">{formatCurrency(sale.total)}</p>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {sale.items.map((item) => (
                        <li key={`${sale.id}-${item.productId}-${item.isGift ? "gift" : "paid"}`}>
                          {item.quantity}x {item.productName}
                          {item.isGift ? (
                            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                              Brinde
                            </Badge>
                          ) : (
                            <> · {formatCurrency(item.quantity * item.unitPrice)}</>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {profile.purchases.length > historyVisible ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setHistoryVisible((value) => value + PAGE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Ver mais ({profile.purchases.length - historyVisible})
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos habituais</CardTitle>
            <CardDescription>Frequência e próxima compra estimada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.productPatterns.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Sem padrões ainda"
                description="Compras repetidas revelam o ciclo do cliente."
              />
            ) : (
              <>
                {visiblePatterns.map((pattern) => (
                  <div
                    key={pattern.productId}
                    className="rounded-lg border border-border px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{pattern.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {timesLabel(pattern.purchaseCount)} ·{" "}
                          {formatNumber(pattern.totalQuantity)} un.
                          {pattern.averageIntervalDays != null
                            ? ` · a cada ~${pattern.averageIntervalDays}d`
                            : ""}
                        </p>
                      </div>
                      <NextPurchaseBadge days={pattern.daysUntilNext} />
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-xs",
                        pattern.daysUntilNext != null && pattern.daysUntilNext < 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      Última: {formatDate(pattern.lastPurchase)}
                      {pattern.nextExpected
                        ? ` · Próxima prev.: ${formatDate(pattern.nextExpected)}`
                        : ""}
                    </p>
                  </div>
                ))}
                {profile.productPatterns.length > patternsVisible ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setPatternsVisible((value) => value + PAGE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Ver mais ({profile.productPatterns.length - patternsVisible})
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Editar cliente"
        onSubmit={handleSaveEdit}
        className="sm:max-w-lg"
      >
        <FormGrid>
          <FormField label="Nome" className="sm:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
          </FormField>
          <FormField label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
            />
          </FormField>
          <FormField label="CPF">
            <Input value={form.cpf} onChange={(event) => setField("cpf", event.target.value)} />
          </FormField>
          <FormField label="Nascimento">
            <Input
              type="date"
              value={form.birthDate}
              onChange={(event) => setField("birthDate", event.target.value)}
            />
          </FormField>
          <FormField label="Observações" className="sm:col-span-2">
            <Textarea
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
              rows={3}
            />
          </FormField>
        </FormGrid>
      </FormDialog>
    </div>
  );
}
