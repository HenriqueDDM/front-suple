import { useMemo } from "react";
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
import { DollarSign, TrendingUp, Package, Users } from "lucide-react";
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
import { useProducts } from "@/features/products/hooks/useProducts";
import { useReports } from "@/features/reports/hooks/useReports";
import { formatCurrency, formatNumber } from "@/shared/utils/format";
import { CHART_COLORS } from "@/shared/constants/chart";

const DEFAULT_CHART_TOOLTIP = <ChartCurrencyTooltip />;

export function ReportsPage() {
  const { items: products } = useProducts();
  const { salesTrend, salesByCategory, topProducts, summary } = useReports();

  const { weeklyRevenue, stats } = useMemo(() => {
    const weekly = Array.from({ length: 4 }).map((_, weekIndex) => {
      const slice = salesTrend.slice(weekIndex * 7, weekIndex * 7 + 7);
      return {
        label: `Sem ${weekIndex + 1}`,
        revenue: slice.reduce((sum, day) => sum + day.revenue, 0),
      };
    });

    return {
      weeklyRevenue: weekly,
      stats: {
        revenue: formatCurrency(summary?.revenue ?? 0),
        profit: formatCurrency(summary?.profit ?? 0),
        unitsSold: formatNumber(summary?.unitsSold ?? 0),
        activeCustomers: String(summary?.activeCustomers ?? 0),
      },
    };
  }, [salesTrend, summary]);

  return (
    <>
      <PageHeader title="Relatórios" description="Análise de desempenho da loja." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Faturamento"
          value={stats.revenue}
          icon={DollarSign}
          trend={14.2}
          hint="30 dias"
          accent="primary"
        />
        <StatsCard
          title="Lucro"
          value={stats.profit}
          icon={TrendingUp}
          trend={9.6}
          hint="margem 38%"
          accent="success"
        />
        <StatsCard
          title="Produtos vendidos"
          value={stats.unitsSold}
          icon={Package}
          hint="unidades"
          accent="warning"
        />
        <StatsCard
          title="Clientes ativos"
          value={stats.activeCustomers}
          icon={Users}
          trend={6.4}
          hint="30 dias"
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Vendas por semana" description="Faturamento semanal (R$)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyRevenue} margin={CHART_MARGIN}>
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

        <ChartCard title="Vendas por categoria" description="Distribuição do faturamento">
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
            <CardDescription>Mais vendidos no período</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <DataTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Unid.</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTable>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos com estoque baixo</CardTitle>
            <CardDescription>Necessitam reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockList products={products} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
