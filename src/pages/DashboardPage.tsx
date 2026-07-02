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
import { Badge } from "@/components/ui/badge";
import { sales, salesTrend } from "@/services/mock/sales";
import { products } from "@/services/mock/products";
import { customers } from "@/services/mock/customers";
import { formatCurrency, formatDateTime, paymentMethodLabel } from "@/utils/format";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{label}</p>
      <p className="text-muted-foreground">
        Faturamento:{" "}
        <span className="font-medium text-primary">
          {formatCurrency(payload[0].value)}
        </span>
      </p>
    </div>
  );
}

export function DashboardPage() {
  const lowStock = products.filter((p) => p.quantity <= p.minStock);
  const revenueToday = salesTrend[salesTrend.length - 1].revenue;
  const ordersToday = salesTrend[salesTrend.length - 1].orders;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua loja de suplementos."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Faturamento Hoje"
          value={formatCurrency(revenueToday)}
          icon={DollarSign}
          trend={12.5}
          hint="vs. ontem"
          accent="primary"
        />
        <StatsCard
          title="Vendas do Dia"
          value={String(ordersToday)}
          icon={ShoppingCart}
          trend={4.2}
          hint="pedidos"
          accent="success"
        />
        <StatsCard
          title="Produtos Cadastrados"
          value={String(products.length)}
          icon={Package}
          hint="itens ativos"
          accent="warning"
        />
        <StatsCard
          title="Clientes"
          value={String(customers.length)}
          icon={Users}
          trend={8.1}
          hint="este mês"
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Vendas dos últimos 30 dias</CardTitle>
            <CardDescription>Faturamento diário (R$)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ left: -12, right: 8, top: 4 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <ReTooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estoque baixo</CardTitle>
            <CardDescription>Repor com prioridade</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Últimas vendas</CardTitle>
          <CardDescription>Transações mais recentes</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
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
                {sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.code}</TableCell>
                    <TableCell>{s.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {paymentMethodLabel[s.paymentMethod]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(s.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(s.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
