import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, User, X } from "lucide-react";
import type { Customer } from "@/types";
import { WALK_IN_CUSTOMER_ID } from "@/shared/constants/sales";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function matchesCustomer(customer: Customer, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  if (customer.name.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  const queryDigits = normalizeDigits(query);
  if (queryDigits.length >= 3) {
    if (normalizeDigits(customer.cpf).includes(queryDigits)) return true;
    if (normalizeDigits(customer.phone).includes(queryDigits)) return true;
  }

  return false;
}

interface CustomerSearchSelectProps {
  customers: Customer[];
  value: string;
  onChange: (customerId: string) => void;
}

export const CustomerSearchSelect = memo(function CustomerSearchSelect({
  customers,
  value,
  onChange,
}: CustomerSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCustomer = useMemo(
    () => (value === WALK_IN_CUSTOMER_ID ? null : customers.find((c) => c.id === value)),
    [customers, value],
  );

  const filteredCustomers = useMemo(
    () => customers.filter((customer) => matchesCustomer(customer, searchQuery)),
    [customers, searchQuery],
  );

  const handleSelect = useCallback(
    (customerId: string) => {
      onChange(customerId);
      setSearchQuery("");
      setIsOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange(WALK_IN_CUSTOMER_ID);
    setSearchQuery("");
    setIsOpen(false);
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {selectedCustomer && !isOpen ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{selectedCustomer.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {[selectedCustomer.phone, selectedCustomer.cpf].filter(Boolean).join(" · ")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setIsOpen(true)}
            aria-label="Alterar cliente"
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleClear}
            aria-label="Remover cliente"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar por nome, CPF ou WhatsApp..."
            className="pl-9"
          />
        </div>
      )}

      {isOpen ? (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-popover shadow-md">
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent",
              value === WALK_IN_CUSTOMER_ID && "bg-accent",
            )}
            onClick={() => handleSelect(WALK_IN_CUSTOMER_ID)}
          >
            {value === WALK_IN_CUSTOMER_ID ? (
              <Check className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <span className="h-4 w-4 shrink-0" />
            )}
            <span>Consumidor final</span>
          </button>

          {filteredCustomers.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhum cliente encontrado.
            </p>
          ) : (
            filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className={cn(
                  "flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-accent",
                  value === customer.id && "bg-accent",
                )}
                onClick={() => handleSelect(customer.id)}
              >
                {value === customer.id ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <span className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{customer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[customer.phone, customer.cpf].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
});
