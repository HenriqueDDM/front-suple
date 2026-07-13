import { useId, type ReactNode } from "react";
import { Label } from "@/shared/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  const labelId = useId();

  return (
    <div className={cn("space-y-2", className)} role="group" aria-labelledby={labelId}>
      <Label id={labelId}>{label}</Label>
      {children}
    </div>
  );
}
