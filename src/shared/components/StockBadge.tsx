import { memo } from "react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";
import { stockStatus, stockStatusLabel } from "@/shared/utils/format";
import { STOCK_STATUS_BADGE_STYLES } from "@/shared/constants/badges";

interface StockBadgeProps {
  quantity: number;
  minStock: number;
}

export const StockBadge = memo(function StockBadge({ quantity, minStock }: StockBadgeProps) {
  const status = stockStatus(quantity, minStock);

  return (
    <Badge variant="outline" className={cn("font-medium", STOCK_STATUS_BADGE_STYLES[status])}>
      {stockStatusLabel[status]}
    </Badge>
  );
});
