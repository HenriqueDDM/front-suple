import { memo, useCallback } from "react";
import { Gift, Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/shared/utils/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

interface CartLineItemProps {
  product: Product;
  quantity: number;
  isGift?: boolean;
  onChangeQuantity: (productId: string, delta: number, isGift: boolean) => void;
  onRemove: (productId: string, isGift: boolean) => void;
}

export const CartLineItem = memo(function CartLineItem({
  product,
  quantity,
  isGift = false,
  onChangeQuantity,
  onRemove,
}: CartLineItemProps) {
  const handleDecrease = useCallback(
    () => onChangeQuantity(product.id, -1, isGift),
    [onChangeQuantity, isGift, product.id],
  );
  const handleIncrease = useCallback(
    () => onChangeQuantity(product.id, 1, isGift),
    [onChangeQuantity, isGift, product.id],
  );
  const handleRemove = useCallback(
    () => onRemove(product.id, isGift),
    [onRemove, isGift, product.id],
  );

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium">{product.name}</p>
          {isGift ? (
            <Badge variant="secondary" className="shrink-0 gap-0.5 px-1.5 py-0 text-[10px]">
              <Gift className="h-2.5 w-2.5" /> Brinde
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {isGift ? "Grátis" : formatCurrency(product.salePrice)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleDecrease}
          aria-label="Diminuir quantidade"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm" aria-live="polite">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleIncrease}
          aria-label="Aumentar quantidade"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={handleRemove}
          aria-label="Remover item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
});
