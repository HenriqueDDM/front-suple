import { memo, useCallback } from "react";
import type { Product } from "@/types";
import { ProductThumbnail } from "@/shared/components/ProductThumbnail";
import { formatCurrency } from "@/shared/utils/format";

interface SalesProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const SalesProductCard = memo(function SalesProductCard({
  product,
  onAddToCart,
}: SalesProductCardProps) {
  const handleClick = useCallback(() => onAddToCart(product), [onAddToCart, product]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Adicionar ${product.name} ao carrinho`}
      className="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-border p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <ProductThumbnail
        imageUrl={product.imageUrl}
        name={product.name}
        subtitle={product.brand}
        size="lg"
        className="min-w-0 flex-1"
      />
      <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-primary">
        {formatCurrency(product.salePrice)}
      </span>
    </button>
  );
});
