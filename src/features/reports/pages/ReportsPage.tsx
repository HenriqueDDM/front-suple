import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Receipt,
  Percent,
} from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCard } from "@/shared/components/StatsCard";
import { LowStockList } from "@/shared/components/LowStockList";
import { DataTable } from "@/shared/components/DataTable";
import { ChartCard } from "@/shared/components/charts/ChartCard";
import { ChartCurrencyTooltip } from "@/shared/components/charts/ChartCurrencyTooltip";
import {
  CHART_GRID_PROPS,
  CHART_MARGIN,
  CHART_Y_AXIS_PROPS,
} from "@/shared/components/charts/chartStyles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useReports } from "@/features/reports/hooks/useReports";
import {
  REPORT_PERIOD_PRESETS,
  buildReportPeriod,
  formatPeriodLabel,
  type ReportPeriodPreset,
} from "@/features/reports/utils/period";
import { formatCurrency, formatDateTime, formatNumber, paymentMethodLabel } from "@/shared/utils/format";
import { CHART_COLORS } from "@/shared/constants/chart";
import { cn } from "@/lib/utils";
import type { ReportPeriod } from "@/types/api";

const DEFAULT_CHART_TOOLTIP = <ChartCurrencyTooltip />;

export function ReportsPage() {
  const { items: products } = useProducts();
  const [preset, setPreset] = useState<ReportPeriodPreset>("30d");
  const [customPeriod, setCustomPeriod] = useState<ReportPeriod>(() =>
    buildReportPeriod("month"),
  );

  const period = useMemo(
    () => buildReportPeriod(preset, customPeriod),
    [customPeriod, preset],
  );

  const { salesTrend, salesByCategory, topProducts, summary, sales, isLoading, error } =
    useReports(period);

  const periodSales = useMemo(() => {
    return sales
      .filter((sale) => {
        const key = sale.createdAt.slice(0, 10);
        return key >= period.from && key <= period.to;
      })
      .slice(0, 12);
  }, [period.from, period.to, sales]);

  const { chartData, chartTitle, stats } = useMemo(() => {
    const useDaily = salesTrend.length <= 14;
    const chart = useDaily
      ? salesTrend.map((day) => ({ label: day.label, revenue: day.revenue }))
      : Array.from({ length: Math.ceil(salesTrend.length / 7) }).map((_, weekIndex) => {
          const slice = salesTrend.slice(weekIndex * 7, weekIndex * 7 + 7);
          return {
            label: `Sem ${weekIndex + 1}`,
            revenue: slice.reduce((sum, day) => sum + day.revenue, 0),
          };
        });

    const revenue = summary?.revenue ?? 0;
    const profit = summary?.profit ?? 0;
    const margin = summary?.marginPercent ?? (revenue > 0 ? Math.round((profit / revenue) * 100) : 0);

    return {
      chartData: chart,
      chartTitle: useDaily ? "Vendas por dia" : "Vendas por semana",
      stats: {
        revenue: formatCurrency(revenue),
        profit: formatCurrency(profit),
        margin: `${margin}%`,
        orders: formatNumber(summary?.orders ?? 0),
        averageTicket: formatCurrency(summary?.averageTicket ?? 0),
        unitsSold: formatNumber(summary?.unitsSold ?? 0),
        activeCustomers: String(summary?.activeCustomers ?? 0),
        periodLabel: formatPeriodLabel(period),
      },
    };
  }, [period, salesTrend, summary]);

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Análise de desempenho da loja por período."
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {REPORT_PERIOD_PRESETS.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={preset === item.id ? "default" : "outline"}
                onClick={() => setPreset(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {preset === "custom" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md">
              <div className="space-y-1.5">
                <Label htmlFor="report-from">De</Label>
                <Input
                  id="report-from"
                  type="date"
                  value={customPeriod.from}
                  max={customPeriod.to}
                  onChange={(event) =>
                    setCustomPeriod((current) => ({ ...current, from: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="report-to">Até</Label>
                <Input
                  id="report-to"
                  type="date"
                  value={customPeriod.to}
                  min={customPeriod.from}
                  onChange={(event) =>
                    setCustomPeriod((current) => ({ ...current, to: event.target.value }))
                  }
                />
              </div>
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Período: <span className="font-medium text-foreground">{stats.periodLabel}</span>
            {isLoading ? " · atualizando…" : null}
          </p>
          {error ? (
            <p className="text-sm text-destructive">
              Não foi possível carregar os relatórios. Verifique se o backend está rodando e tente
              novamente.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Faturamento"
          value={stats.revenue}
          icon={DollarSign}
          hint={stats.periodLabel}
          accent="primary"
        />
        <StatsCard
          title="Lucro"
          value={stats.profit}
          icon={TrendingUp}
          hint={`margem ${stats.margin}`}
          accent="success"
        />
        <StatsCard
          title="Margem"
          value={stats.margin}
          icon={Percent}
          hint="lucro / faturamento"
          accent="success"
        />
        <StatsCard
          title="Vendas"
          value={stats.orders}
          icon={Receipt}
          hint="pedidos no período"
          accent="warning"
        />
        <StatsCard
          title="Ticket médio"
          value={stats.averageTicket}
          icon={DollarSign}
          hint="faturamento / vendas"
          accent="primary"
        />
        <StatsCard
          title="Clientes ativos"
          value={stats.activeCustomers}
          icon={Users}
          hint="compraram no período"
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title={chartTitle}
          description={`Faturamento no período · ${stats.unitsSold} unidades`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={CHART_MARGIN}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis {...CHART_Y_AXIS_PROPS} />
              <ReTooltip content={DEFAULT_CHART_TOOLTIP} cursor={{ fill: "var(--accent)" }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vendas por categoria" description="Distribuição do faturamento no período">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesByCategory}
                dataKey="value"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {salesByCategory.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip content={DEFAULT_CHART_TOOLTIP} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 produtos</CardTitle>
            <CardDescription>Mais vendidos no período, com margem</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <DataTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Unid.</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">Margem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        Nenhuma venda neste período.
                      </TableCell>
                    </TableRow>
                  ) : (
                    topProducts.map((product, index) => (
                      <TableRow key={product.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-xs font-medium text-accent-foreground">
                              {index + 1}
                            </span>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{product.units}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(product.revenue)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            product.marginPercent >= 30
                              ? "text-success"
                              : product.marginPercent < 15
                                ? "text-destructive"
                                : "text-foreground",
                          )}
                        >
                          {product.marginPercent}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </DataTable>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos com estoque baixo
            </CardTitle>
            <CardDescription>Necessitam reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockList products={products} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendas do período</CardTitle>
          <CardDescription>Últimas vendas dentro do filtro selecionado</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <DataTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Nenhuma venda neste período.
                    </TableCell>
                  </TableRow>
                ) : (
                  periodSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.code}</TableCell>
                      <TableCell>{sale.customerName || "Consumidor final"}</TableCell>
                      <TableCell>{paymentMethodLabel[sale.paymentMethod]}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(sale.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(sale.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </DataTable>
        </CardContent>
      </Card>
    </>
  );
}
