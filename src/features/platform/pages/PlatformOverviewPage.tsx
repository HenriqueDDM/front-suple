import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, PauseCircle, ShieldAlert, Users } from "lucide-react";
import { usePlatformSummary, usePlatformStores } from "@/features/platform/hooks/usePlatform";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  basic: "Essencial",
  pro: "Completo com IA",
  enterprise: "Enterprise",
};

export function PlatformOverviewPage() {
  const summaryQuery = usePlatformSummary();
  const storesQuery = usePlatformStores();
  const summary = summaryQuery.data;
  const recent = (storesQuery.data ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description="Resumo das lojas e planos da plataforma Tradutto Suplementos."
        actions={
          <Button asChild>
            <Link to="/admin/stores">Gerenciar lojas</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<Building2 className="h-4 w-4" />}
          label="Lojas"
          value={summary?.storesTotal ?? "—"}
        />
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Usuários"
          value={summary?.usersTotal ?? "—"}
        />
        <Kpi
          icon={<PauseCircle className="h-4 w-4" />}
          label="Suspensas"
          value={summary?.storesSuspended ?? "—"}
        />
        <Kpi
          icon={<ShieldAlert className="h-4 w-4" />}
          label="Inativas"
          value={summary?.storesInactive ?? "—"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lojas por plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(summary?.byPlan ?? {}).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{PLAN_LABEL[plan] ?? plan}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            {!summary ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lojas recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((store) => (
              <Link
                key={store.id}
                to="/admin/stores/$storeId"
                params={{ storeId: store.id }}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {PLAN_LABEL[store.plan] ?? store.plan} · {store.status}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{store.usersCount} user(s)</span>
              </Link>
            ))}
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma loja ainda.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
