import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  Package,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { useProductProfile } from "@/features/products/hooks/useProductProfile";
import { ProductThumbnailInline } from "@/shared/components/ProductThumbnail";
import { StockBadge } from "@/shared/components/StockBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { StatsCard } from "@/shared/components/StatsCard";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  paymentMethodLabel,
} from "@/shared/utils/format";

const PAGE_SIZE = 10;

function whatsappUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function timesLabel(n: number): string {
  return n === 1 ? "1 vez" : `${n} vezes`;
}

export function ProductProfilePage() {
  const { productId } = useParams({ from: "/_app/products_/$productId" });
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProductProfile(productId);
  const [buyersVisible, setBuyersVisible] = useState(PAGE_SIZE);
  const [salesVisible, setSalesVisible] = useState(PAGE_SIZE);

  const margin = useMemo(() => {
    if (!profile) return null;
    const { salePrice, purchasePrice } = profile.product;
    if (salePrice <= 0) return null;
    return Math.round(((salePrice - purchasePrice) / salePrice) * 100);
  }, [profile]);

  const visibleBuyers = useMemo(
    () => profile?.buyers.slice(0, buyersVisible) ?? [],
    [profile?.buyers, buyersVisible],
  );

  const visibleSales = useMemo(
    () => profile?.recentSales.slice(0, salesVisible) ?? [],
    [profile?.recentSales, salesVisible],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: "/products" })}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <EmptyState
          icon={Package}
          title="Produto não encontrado"
          description="O produto pode ter sido removido ou o link é inválido."
        />
      </div>
    );
  }

  const { product, stats } = profile;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" /> Produtos
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <ProductThumbnailInline
              imageUrl={product.imageUrl}
              name={product.name}
              size="lg"
            />
            <div className="min-w-0 space-y-2">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>·</span>
                <span>{product.category}</span>
                {product.barcode ? (
                  <>
                    <span>·</span>
                    <span>EAN {product.barcode}</span>
                  </>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StockBadge quantity={product.quantity} minStock={product.minStock} />
                <span className="text-sm text-muted-foreground">
                  {formatNumber(product.quantity)} un. · mín. {product.minStock}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Preço de venda</p>
            <p className="text-2xl font-semibold">{formatCurrency(product.salePrice)}</p>
            <p className="text-xs text-muted-foreground">
              Custo {formatCurrency(product.purchasePrice)}
              {margin != null ? ` · margem ${margin}%` : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard
          title="Unidades vendidas"
          value={formatNumber(stats.unitsSold)}
          icon={Package}
          accent="primary"
        />
        <StatsCard
          title="Vendas"
          value={formatNumber(stats.saleCount)}
          icon={ReceiptText}
          accent="success"
        />
        <StatsCard
          title="Compradores"
          value={formatNumber(stats.uniqueBuyers)}
          icon={Users}
          accent="warning"
        />
        <StatsCard
          title="Receita"
          value={formatCurrency(stats.revenue)}
          icon={Wallet}
          accent="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Compradores</CardTitle>
            <CardDescription>Quem já levou este produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.buyers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Sem compradores identificados"
                description="Vendas com cliente vinculado aparecem aqui."
              />
            ) : (
              <>
                {visibleBuyers.map((buyer) => {
                  const waUrl = whatsappUrl(buyer.phone);
                  return (
                    <div
                      key={buyer.customerId}
                      className="rounded-lg border border-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to="/customers/$customerId"
                            params={{ customerId: buyer.customerId }}
                            className="truncate font-medium hover:underline"
                          >
                            {buyer.customerName}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {timesLabel(buyer.purchaseCount)} ·{" "}
                            {formatNumber(buyer.totalQuantity)} un. · última{" "}
                            {formatDate(buyer.lastPurchase)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {buyer.recurrent ? (
                            <Badge variant="secondary" className="gap-1">
                              <RefreshCw className="h-3 w-3" />
                              recorrente
                            </Badge>
                          ) : null}
                          {waUrl ? (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {profile.buyers.length > buyersVisible ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setBuyersVisible((value) => value + PAGE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Ver mais ({profile.buyers.length - buyersVisible})
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Extrato de vendas</CardTitle>
            <CardDescription>Histórico deste SKU nas vendas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.recentSales.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Sem vendas"
                description="Este produto ainda não aparece em nenhuma venda."
              />
            ) : (
              <>
                {visibleSales.map((sale) => (
                  <div
                    key={sale.saleId}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{sale.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.customerId ? (
                          <Link
                            to="/customers/$customerId"
                            params={{ customerId: sale.customerId }}
                            className="hover:underline"
                          >
                            {sale.customerName}
                          </Link>
                        ) : (
                          sale.customerName
                        )}{" "}
                        · {formatDateTime(sale.createdAt)} ·{" "}
                        {paymentMethodLabel[sale.paymentMethod]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(sale.lineTotal)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.quantity} un. · {formatCurrency(sale.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
                {profile.recentSales.length > salesVisible ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSalesVisible((value) => value + PAGE_SIZE)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    Ver mais ({profile.recentSales.length - salesVisible})
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
