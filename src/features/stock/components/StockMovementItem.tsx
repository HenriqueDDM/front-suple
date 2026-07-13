import { memo } from "react";
import type { StockMovement } from "@/types";
import { MovementTypeBadge } from "@/shared/components/MovementTypeBadge";
import { formatDateTime } from "@/shared/utils/format";

interface StockMovementItemProps {
  movement: StockMovement;
}

export const StockMovementItem = memo(function StockMovementItem({
  movement,
}: StockMovementItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <MovementTypeBadge type={movement.type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{movement.productName}</p>
        <p className="truncate text-xs text-muted-foreground">{movement.reason}</p>
      </div>
      <span className="shrink-0 text-sm font-medium">
        {movement.quantity > 0 ? "+" : ""}
        {movement.quantity}
      </span>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {formatDateTime(movement.createdAt)}
      </span>
    </div>
  );
});
