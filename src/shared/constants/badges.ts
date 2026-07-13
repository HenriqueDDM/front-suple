import type { MovementType, StockStatus } from "@/types";

export const SEMANTIC_BADGE_STYLES = {
  success: "bg-success/12 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/25",
  destructive: "bg-destructive/12 text-destructive border-destructive/20",
} as const;

export const STOCK_STATUS_BADGE_STYLES: Record<StockStatus, string> = {
  in_stock: SEMANTIC_BADGE_STYLES.success,
  low_stock: SEMANTIC_BADGE_STYLES.warning,
  out_of_stock: SEMANTIC_BADGE_STYLES.destructive,
};

export const MOVEMENT_TYPE_BADGE_STYLES: Record<MovementType, string> = {
  entry: SEMANTIC_BADGE_STYLES.success,
  exit: SEMANTIC_BADGE_STYLES.destructive,
  adjustment: SEMANTIC_BADGE_STYLES.warning,
};
