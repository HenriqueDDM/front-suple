import { memo, useMemo } from "react";
import type { Product } from "@/types";
import { ProductThumbnail } from "@/shared/components/ProductThumbnail";
import { StockBadge } from "@/shared/components/StockBadge";

interface LowStockItemProps {
  product: Product;
}

const LowStockItem = memo(function LowStockItem({ product }: LowStockItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <ProductThumbnail
        imageUrl={product.imageUrl}
        name={product.name}
        subtitle={`${product.quantity} un · mín. ${product.minStock}`}
        className="min-w-0 flex-1"
      />
      <StockBadge quantity={product.quantity} minStock={product.minStock} />
    </div>
  );
});

interface LowStockListProps {
  products: Product[];
}

export const LowStockList = memo(function LowStockList({ products }: LowStockListProps) {
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.quantity <= product.minStock),
    [products],
  );

  if (lowStockProducts.length === 0) {
    return (
      <p className="sr-only" role="status">
        Nenhum produto com estoque baixo.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {lowStockProducts.map((product) => (
        <LowStockItem key={product.id} product={product} />
      ))}
    </div>
  );
});
