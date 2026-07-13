import type { PaymentMethod } from "@/types";
import { paymentMethodLabel } from "@/shared/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const PAYMENT_METHODS = Object.keys(paymentMethodLabel) as PaymentMethod[];

function isPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.includes(value as PaymentMethod);
}

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onValueChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelect({ value, onValueChange }: PaymentMethodSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (isPaymentMethod(next)) onValueChange(next);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_METHODS.map((method) => (
          <SelectItem key={method} value={method}>
            {paymentMethodLabel[method]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
