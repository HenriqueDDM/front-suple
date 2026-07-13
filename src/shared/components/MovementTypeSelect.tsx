import type { MovementType } from "@/types";
import { movementTypeLabel } from "@/shared/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const MOVEMENT_TYPES = Object.keys(movementTypeLabel) as MovementType[];

function isMovementType(value: string): value is MovementType {
  return MOVEMENT_TYPES.includes(value as MovementType);
}

interface MovementTypeSelectProps {
  value: MovementType;
  onValueChange: (value: MovementType) => void;
}

export function MovementTypeSelect({ value, onValueChange }: MovementTypeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (isMovementType(next)) onValueChange(next);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MOVEMENT_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {movementTypeLabel[type]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
