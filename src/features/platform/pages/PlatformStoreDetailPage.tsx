import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  usePlatformStore,
  usePlatformStoreMutations,
  usePlatformStoreUsers,
} from "@/features/platform/hooks/usePlatform";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
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
import type { PlatformPlan, PlatformStoreStatus } from "@/types/api";
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

export function PlatformStoreDetailPage() {
  const { storeId } = useParams({ from: "/admin/stores_/$storeId" });
  const storeQuery = usePlatformStore(storeId);
  const usersQuery = usePlatformStoreUsers(storeId);
  const { updateStore } = usePlatformStoreMutations();
  const store = storeQuery.data;

  const save = async (dto: { plan?: PlatformPlan; status?: PlatformStoreStatus }) => {
    try {
      await updateStore.mutateAsync({ id: storeId, dto });
      toast.success("Loja atualizada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar");
    }
  };

  if (storeQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando loja...</p>;
  }

  if (!store) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Loja não encontrada.</p>
        <Button asChild variant="outline">
          <Link to="/admin/stores">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={store.name}
        description={`${store.email} · ${store.cnpj}`}
        actions={
          <Button asChild variant="outline">
            <Link to="/admin/stores">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dados da loja</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Telefone" value={store.phone || "—"} />
            <Info label="Endereço" value={store.address || "—"} />
            <Info
              label="Criada em"
              value={new Date(store.createdAt).toLocaleString("pt-BR")}
            />
            <Info label="Usuários" value={String(store.usersCount)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plano e acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Plano</p>
              <Select
                value={store.plan}
                onValueChange={(value) => void save({ plan: value as PlatformPlan })}
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
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <Badge>{STATUS_LABEL[store.status]}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void save({ status: "active" })}
                >
                  Ativar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void save({ status: "suspended" })}
                >
                  Suspender
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void save({ status: "inactive" })}
                >
                  Inativar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usuários da loja</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Criado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(usersQuery.data ?? []).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
              {(usersQuery.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    Nenhum usuário.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
