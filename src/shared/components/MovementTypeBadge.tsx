import { memo } from "react";
import type { MovementType } from "@/types";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";
import { MOVEMENT_TYPE_BADGE_STYLES } from "@/shared/constants/badges";
import { movementTypeLabel } from "@/shared/utils/format";

interface MovementTypeBadgeProps {
  type: MovementType;
  className?: string;
}

export const MovementTypeBadge = memo(function MovementTypeBadge({
  type,
  className,
}: MovementTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn(MOVEMENT_TYPE_BADGE_STYLES[type], className)}>
      {movementTypeLabel[type]}
    </Badge>
  );
});
