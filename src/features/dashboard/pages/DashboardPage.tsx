import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCard } from "@/shared/components/StatsCard";
import { LowStockList } from "@/shared/components/LowStockList";
import { DataTable } from "@/shared/components/DataTable";
import { ChartCard } from "@/shared/components/charts/ChartCard";
import { ChartCurrencyTooltip } from "@/shared/components/charts/ChartCurrencyTooltip";
import {
  CHART_GRID_PROPS,
  CHART_MARGIN,
  CHART_X_AXIS_PROPS,
  CHART_Y_AXIS_PROPS,
} from "@/shared/components/charts/chartStyles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useReports } from "@/features/reports/hooks/useReports";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/shared/utils/format";

const REVENUE_CHART_TOOLTIP = <ChartCurrencyTooltip valueLabel="Faturamento:" />;

export function DashboardPage() {
  const { items: products } = useProducts();
  const { sales, salesTrend, dashboardStats } = useReports();

  const stats = useMemo(() => {
    if (!dashboardStats) {
      return {
        revenue: formatCurrency(0),
        orders: "0",
        productCount: String(products.length),
        customerCount: "0",
      };
    }

    return {
      revenue: formatCurrency(dashboardStats.revenueToday),
      orders: String(dashboardStats.ordersToday),
      productCount: String(dashboardStats.productCount),
      customerCount: String(dashboardStats.customerCount),
    };
  }, [dashboardStats, products.length]);

  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral da sua loja de suplementos." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Faturamento Hoje"
          value={stats.revenue}
          icon={DollarSign}
          hint="total confirmado"
          accent="primary"
        />
        <StatsCard
          title="Vendas do Dia"
          value={stats.orders}
          icon={ShoppingCart}
          hint="pedidos"
          accent="success"
        />
        <StatsCard
          title="Produtos Cadastrados"
          value={stats.productCount}
          icon={Package}
          hint="itens ativos"
          accent="warning"
        />
        <StatsCard
          title="Clientes"
          value={stats.customerCount}
          icon={Users}
          hint="cadastrados"
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Vendas dos últimos 30 dias"
          description="Faturamento diário (R$)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="label" {...CHART_X_AXIS_PROPS} interval={4} />
              <YAxis {...CHART_Y_AXIS_PROPS} />
              <ReTooltip content={REVENUE_CHART_TOOLTIP} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#rev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Estoque baixo</CardTitle>
            <CardDescription>Repor com prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockList products={products} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas vendas</CardTitle>
          <CardDescription>Transações mais recentes</CardDescription>
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
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.code}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{paymentMethodLabel[sale.paymentMethod]}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(sale.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(sale.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTable>
        </CardContent>
      </Card>
    </>
  );
}
