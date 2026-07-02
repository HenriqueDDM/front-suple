import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { stockStatus, stockStatusLabel } from "@/utils/format";

export function StockBadge({
  quantity,
  minStock,
}: {
  quantity: number;
  minStock: number;
}) {
  const status = stockStatus(quantity, minStock);
  const styles = {
    in_stock: "bg-success/12 text-success border-success/20",
    low_stock: "bg-warning/15 text-warning border-warning/25",
    out_of_stock: "bg-destructive/12 text-destructive border-destructive/20",
  }[status];

  return (
    <Badge variant="outline" className={cn("font-medium", styles)}>
      {stockStatusLabel[status]}
    </Badge>
  );
}
