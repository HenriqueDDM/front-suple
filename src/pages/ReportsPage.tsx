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
import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/StatsCard";
import { StockBadge } from "@/components/StockBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { salesByCategory, salesTrend, topProducts } from "@/services/mock/sales";
import { products } from "@/services/mock/products";
import { formatCurrency, formatNumber } from "@/utils/format";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

function TooltipBox({ active, payload, label, prefix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{label ?? payload[0].name}</p>
      <p className="text-muted-foreground">
        {prefix}
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function ReportsPage() {
  const revenue = salesTrend.reduce((s, d) => s + d.revenue, 0);
  const profit = revenue * 0.38;
  const unitsSold = topProducts.reduce((s, p) => s + p.units, 0);
  const lowStock = products.filter((p) => p.quantity <= p.minStock);

  // weekly aggregation for the bar chart
  const weekly = Array.from({ length: 4 }).map((_, i) => {
    const slice = salesTrend.slice(i * 7, i * 7 + 7);
    return {
      label: `Sem ${i + 1}`,
      revenue: slice.reduce((s, d) => s + d.revenue, 0),
    };
  });

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Análise de desempenho da loja."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Faturamento"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          trend={14.2}
          hint="30 dias"
          accent="primary"
        />
        <StatsCard
          title="Lucro"
          value={formatCurrency(profit)}
          icon={TrendingUp}
          trend={9.6}
          hint="margem 38%"
          accent="success"
        />
        <StatsCard
          title="Produtos vendidos"
          value={formatNumber(unitsSold)}
          icon={Package}
          hint="unidades"
          accent="warning"
        />
        <StatsCard
          title="Clientes ativos"
          value="128"
          icon={Users}
          trend={6.4}
          hint="30 dias"
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por semana</CardTitle>
            <CardDescription>Faturamento semanal (R$)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ left: -12, right: 8, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <ReTooltip content={<TooltipBox />} cursor={{ fill: "var(--accent)" }} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas por categoria</CardTitle>
            <CardDescription>Distribuição do faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
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
                    {salesByCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip content={<TooltipBox />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 produtos</CardTitle>
            <CardDescription>Mais vendidos no período</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Unid.</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p, i) => (
                    <TableRow key={p.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-xs font-medium text-accent-foreground">
                            {i + 1}
                          </span>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{p.units}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(p.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos com estoque baixo</CardTitle>
            <CardDescription>Necessitam reposição</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.quantity} un · mín. {p.minStock}
                  </p>
                </div>
                <StockBadge quantity={p.quantity} minStock={p.minStock} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
