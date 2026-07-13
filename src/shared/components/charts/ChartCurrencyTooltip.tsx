import { memo } from "react";
import { formatCurrency } from "@/shared/utils/format";

interface ChartCurrencyTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
  prefix?: string;
  valueLabel?: string;
}

export const ChartCurrencyTooltip = memo(function ChartCurrencyTooltip({
  active,
  payload,
  label,
  prefix = "",
  valueLabel,
}: ChartCurrencyTooltipProps) {
  if (!active || !payload?.length) return null;

  const formattedValue = formatCurrency(payload[0].value);

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{label ?? payload[0].name}</p>
      <p className="text-muted-foreground">
        {valueLabel ? (
          <>
            {valueLabel} <span className="font-medium text-primary">{formattedValue}</span>
          </>
        ) : (
          <>
            {prefix}
            {formattedValue}
          </>
        )}
      </p>
    </div>
  );
});
