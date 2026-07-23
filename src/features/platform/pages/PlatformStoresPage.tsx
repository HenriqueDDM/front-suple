import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import {
  usePlatformStoreMutations,
  usePlatformStores,
} from "@/features/platform/hooks/usePlatform";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import type { CreatePlatformStoreDto, PlatformPlan, PlatformStoreStatus } from "@/types/api";
import { toast } from "sonner";

const PLAN_LABEL: Record<PlatformPlan, string> = {
  free: "Free",
  basic: "Essencial",
  pro: "Completo IA",
  enterprise: "Enterprise",
};

const STATUS_LABEL: Record<PlatformStoreStatus, string> = {
  active: "Ativa",
  inactive: "Inativa",
  suspended: "Suspensa",
};

const emptyForm: CreatePlatformStoreDto = {
  name: "",
  cnpj: "",
  email: "",
  phone: "",
  address: "",
  plan: "basic",
  adminName: "",
  adminEmail: "",
  adminPassword: "password123",
};

export function PlatformStoresPage() {
  const storesQuery = usePlatformStores();
  const { createStore, updateStore } = usePlatformStoreMutations();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreatePlatformStoreDto>(emptyForm);

  const stores = useMemo(() => {
    const list = storesQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((store) =>
      [store.name, store.email, store.cnpj, store.phone].join(" ").toLowerCase().includes(q),
    );
  }, [query, storesQuery.data]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createStore.mutateAsync(form);
      toast.success("Loja criada com sucesso");
      setOpen(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar loja");
    }
  };

  const setStatus = async (id: string, status: PlatformStoreStatus) => {
    try {
      await updateStore.mutateAsync({ id, dto: { status } });
      toast.success(`Status atualizado: ${STATUS_LABEL[status]}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar status");
    }
  };

  const setPlan = async (id: string, plan: PlatformPlan) => {
    try {
      await updateStore.mutateAsync({ id, dto: { plan } });
      toast.success(`Plano atualizado: ${PLAN_LABEL[plan]}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar plano");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lojas"
        description="Crie, suspenda e altere planos das lojas."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Nova loja
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome, e-mail ou CNPJ"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loja</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <Link
                    to="/admin/stores/$storeId"
                    params={{ storeId: store.id }}
                    className="font-medium hover:underline"
                  >
                    {store.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{store.email}</p>
                  <p className="text-xs text-muted-foreground">{store.cnpj}</p>
                </TableCell>
                <TableCell>
                  <Select
                    value={store.plan}
                    onValueChange={(value) => void setPlan(store.id, value as PlatformPlan)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PLAN_LABEL) as PlatformPlan[]).map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {PLAN_LABEL[plan]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <StatusBadge status={store.status} />
                </TableCell>
                <TableCell>{store.usersCount}</TableCell>
                <TableCell className="space-x-2 text-right">
                  {store.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void setStatus(store.id, "suspended")}
                    >
                      Suspender
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void setStatus(store.id, "active")}
                    >
                      Ativar
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/admin/stores/$storeId" params={{ storeId: store.id }}>
                      Detalhe
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhuma loja encontrada.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova loja</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(event) => void handleCreate(event)}>
            <Field label="Nome da loja">
              <Input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CNPJ">
                <Input
                  required
                  value={form.cnpj}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cnpj: event.target.value }))
                  }
                />
              </Field>
              <Field label="Telefone">
                <Input
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="E-mail da loja">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </Field>
            <Field label="Endereço">
              <Input
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({ ...current, address: event.target.value }))
                }
              />
            </Field>
            <Field label="Plano">
              <Select
                value={form.plan}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, plan: value as PlatformPlan }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PLAN_LABEL) as PlatformPlan[]).map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {PLAN_LABEL[plan]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Admin (nome)">
                <Input
                  required
                  value={form.adminName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, adminName: event.target.value }))
                  }
                />
              </Field>
              <Field label="Admin (e-mail)">
                <Input
                  required
                  type="email"
                  value={form.adminEmail}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, adminEmail: event.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Senha inicial do admin">
              <Input
                type="text"
                value={form.adminPassword}
                onChange={(event) =>
                  setForm((current) => ({ ...current, adminPassword: event.target.value }))
                }
              />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createStore.isPending}>
                {createStore.isPending ? "Criando..." : "Criar loja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: PlatformStoreStatus }) {
  const tone =
    status === "active"
      ? "bg-emerald-500/15 text-emerald-700"
      : status === "suspended"
        ? "bg-amber-500/15 text-amber-700"
        : "bg-muted text-muted-foreground";
  return <Badge className={tone}>{STATUS_LABEL[status]}</Badge>;
}
