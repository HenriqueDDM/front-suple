import { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}

export const SearchInput = memo(function SearchInput({
  value = "",
  onChange,
  placeholder = "Pesquisar...",
  className,
  readOnly = false,
  ariaLabel,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={placeholder}
        className="pl-9"
        readOnly={readOnly}
        aria-label={ariaLabel ?? placeholder}
      />
    </div>
  );
});
