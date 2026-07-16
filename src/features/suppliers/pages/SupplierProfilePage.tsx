import { useCallback } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Building2, CalendarClock, Download, FileText, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPurchasesService, getSuppliersService, queryKeys } from "@/services";
import { EmptyState } from "@/shared/components/EmptyState";
import { StatsCard } from "@/shared/components/StatsCard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatCurrency, formatDate, formatDateTime } from "@/shared/utils/format";
import { toast } from "sonner";

const suppliersService = getSuppliersService();
const purchasesService = getPurchasesService();

function paymentMethodLabel(method: string): string {
  switch (method) {
    case "boleto":
      return "Boleto";
    case "pix":
      return "Pix";
    case "cash":
      return "Dinheiro";
    default:
      return method || "—";
  }
}

export function SupplierProfilePage() {
  const { supplierId } = useParams({ from: "/_app/suppliers_/$supplierId" });
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: queryKeys.suppliers.profile(supplierId),
    queryFn: () => suppliersService.getProfile(supplierId),
  });

  const handleDownloadXml = useCallback(async (purchaseId: string) => {
    try {
      const xml = await purchasesService.getXml(purchaseId);
      if (!xml) {
        toast.error("XML não disponível para esta nota.");
        return;
      }
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `nfe-${purchaseId}.xml`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Não foi possível baixar o XML.");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: "/suppliers" })}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <EmptyState
          icon={Building2}
          title="Fornecedor não encontrado"
          description="O fornecedor pode ter sido removido ou o link é inválido."
        />
      </div>
    );
  }

  const { supplier, kpis, purchases } = profile;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/suppliers">
            <ArrowLeft className="h-4 w-4" /> Fornecedores
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <h1 className="text-2xl font-semibold tracking-tight">{supplier.name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {supplier.cnpj ? <span>CNPJ {supplier.cnpj}</span> : null}
            {supplier.phone ? <span>{supplier.phone}</span> : null}
            {supplier.email ? <span>{supplier.email}</span> : null}
          </div>
          {supplier.notes ? (
            <p className="mt-3 text-sm text-muted-foreground">{supplier.notes}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard
          title="Total comprado"
          value={formatCurrency(kpis.totalPurchased)}
          icon={Wallet}
          accent="primary"
        />
        <StatsCard
          title="Notas"
          value={String(kpis.purchaseCount)}
          icon={FileText}
          accent="success"
        />
        <StatsCard
          title="Ticket médio"
          value={formatCurrency(kpis.averageTicket)}
          icon={Building2}
          accent="warning"
        />
        <StatsCard
          title="Última compra"
          value={formatDate(kpis.lastPurchase)}
          icon={CalendarClock}
          accent="primary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de compras</CardTitle>
          <CardDescription>Notas importadas deste fornecedor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {purchases.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhuma compra registrada"
              description="Importe uma NF-e no estoque para montar o histórico."
            />
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="rounded-lg border border-border px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {purchase.number ? `NF ${purchase.number}` : "Nota importada"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(purchase.createdAt)}
                      {purchase.issueDate ? ` · Emissão ${formatDate(purchase.issueDate)}` : ""}
                      {" · "}
                      {paymentMethodLabel(purchase.paymentMethod)}
                    </p>
                    {purchase.paymentMethod === "boleto" && purchase.installments.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {purchase.installments.map((installment, index) => (
                          <Badge key={`${purchase.id}-${index}`} variant="secondary">
                            {installment.number || index + 1}: {formatDate(installment.dueDate)} ·{" "}
                            {formatCurrency(installment.amount)}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{formatCurrency(purchase.total)}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleDownloadXml(purchase.id)}
                    >
                      <Download className="h-4 w-4" /> XML
                    </Button>
                  </div>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {purchase.items.map((item, index) => (
                    <li key={`${purchase.id}-${index}`}>
                      {item.quantity}x {item.description} · custo{" "}
                      {formatCurrency(item.unitCost)} · venda {formatCurrency(item.salePrice)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
