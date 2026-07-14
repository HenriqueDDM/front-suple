import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Users,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  BarChart3,
  Settings,
  Search,
  type LucideIcon,
} from "lucide-react";
import { SearchInput } from "@/shared/components/SearchInput";
import { NAV_ITEMS } from "@/shared/constants/navigation";
import { getProductsService, getCustomersService, queryKeys } from "@/services";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
};

const ICON_BY_URL: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/products": Package,
  "/customers": Users,
  "/sales": ShoppingCart,
  "/stock": Boxes,
  "/reports": BarChart3,
  "/settings": Settings,
};

const productsService = getProductsService();
const customersService = getCustomersService();

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function GlobalSearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const productsQuery = useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productsService.findAll(),
    staleTime: 60_000,
  });

  const customersQuery = useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: () => customersService.findAll(),
    staleTime: 60_000,
  });

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 1) return [] as SearchResult[];

    const pageResults: SearchResult[] = NAV_ITEMS.filter((item) =>
      normalize(item.title).includes(q),
    ).map((item) => ({
      id: `page-${item.url}`,
      label: item.title,
      hint: "Página",
      icon: ICON_BY_URL[item.url] ?? Search,
      to: item.url,
      search: item.search,
    }));

    const productResults: SearchResult[] = (productsQuery.data ?? [])
      .filter((product) =>
        [product.name, product.brand, product.category, product.barcode]
          .filter(Boolean)
          .some((field) => normalize(String(field)).includes(q)),
      )
      .slice(0, 6)
      .map((product) => ({
        id: `product-${product.id}`,
        label: product.name,
        hint: `${product.brand} · ${product.category}`,
        icon: Package,
        to: "/products/$productId",
        params: { productId: product.id },
      }));

    const customerResults: SearchResult[] = (customersQuery.data ?? [])
      .filter((customer) =>
        [customer.name, customer.email, customer.cpf, customer.phone]
          .filter(Boolean)
          .some((field) => normalize(String(field)).includes(q)),
      )
      .slice(0, 6)
      .map((customer) => ({
        id: `customer-${customer.id}`,
        label: customer.name,
        hint: customer.phone || customer.email || "Cliente",
        icon: Users,
        to: "/customers/$customerId",
        params: { customerId: customer.id },
      }));

    return [...pageResults, ...productResults, ...customerResults].slice(0, 12);
  }, [query, productsQuery.data, customersQuery.data]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToResult = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      setQuery("");
      void navigate({
        to: result.to as never,
        params: (result.params ?? {}) as never,
        search: (result.search ?? {}) as never,
      });
    },
    [navigate],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      goToResult(results[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar páginas, produtos ou clientes..."
        ariaLabel="Busca global"
      />

      {open && query.trim().length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">Nenhum resultado para “{query}”.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <li key={result.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                        index === activeIndex ? "bg-accent" : "hover:bg-accent/70",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToResult(result)}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-foreground">
                          {result.label}
                        </span>
                        {result.hint ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {result.hint}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
