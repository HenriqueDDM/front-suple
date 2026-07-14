import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Cake,
  PackageX,
  UserRoundX,
  type LucideIcon,
} from "lucide-react";
import { getCustomersService, getProductsService, queryKeys } from "@/services";
import { stockStatus } from "@/shared/utils/format";
import type { Customer, Product } from "@/types";

const DISMISSED_KEY = "supl.notifications.dismissed";
const INACTIVE_DAYS = 45;
const BIRTHDAY_WINDOW_DAYS = 7;

export type StoreNotificationKind =
  | "out_of_stock"
  | "low_stock"
  | "birthday"
  | "inactive_customer";

export type StoreNotificationTarget =
  | { type: "stock" }
  | { type: "customer"; customerId: string };

export interface StoreNotification {
  id: string;
  kind: StoreNotificationKind;
  title: string;
  description: string;
  target: StoreNotificationTarget;
}

const KIND_ICON: Record<StoreNotificationKind, LucideIcon> = {
  out_of_stock: PackageX,
  low_stock: AlertTriangle,
  birthday: Cake,
  inactive_customer: UserRoundX,
};

const KIND_ACCENT: Record<StoreNotificationKind, string> = {
  out_of_stock: "bg-destructive/10 text-destructive",
  low_stock: "bg-warning/15 text-warning",
  birthday: "bg-primary/10 text-primary",
  inactive_customer: "bg-muted text-muted-foreground",
};

export function notificationIcon(kind: StoreNotificationKind): LucideIcon {
  return KIND_ICON[kind];
}

export function notificationAccent(kind: StoreNotificationKind): string {
  return KIND_ACCENT[kind];
}

function readDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? new Set(parsed.filter((id) => typeof id === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function writeDismissed(ids: Set<string>) {
  sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysUntilBirthday(birthDate: string, today: Date): number | null {
  if (!birthDate) return null;
  const parsed = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const thisYear = new Date(today.getFullYear(), parsed.getMonth(), parsed.getDate());
  const target =
    thisYear >= startOfDay(today)
      ? thisYear
      : new Date(today.getFullYear() + 1, parsed.getMonth(), parsed.getDate());

  return Math.round((target.getTime() - startOfDay(today).getTime()) / 86_400_000);
}

function buildProductNotifications(products: Product[]): StoreNotification[] {
  const items: StoreNotification[] = [];

  for (const product of products) {
    const status = stockStatus(product.quantity, product.minStock);
    if (status === "out_of_stock") {
      items.push({
        id: `stock-out-${product.id}`,
        kind: "out_of_stock",
        title: `${product.name} esgotado`,
        description: "Sem unidades para vender. Reponha o estoque.",
        target: { type: "stock" },
      });
    } else if (status === "low_stock") {
      items.push({
        id: `stock-low-${product.id}`,
        kind: "low_stock",
        title: `${product.name} em baixa`,
        description: `Restam ${product.quantity} un. (mín. ${product.minStock}).`,
        target: { type: "stock" },
      });
    }
  }

  return items;
}

function buildCustomerNotifications(customers: Customer[]): StoreNotification[] {
  const today = new Date();
  const items: StoreNotification[] = [];
  const inactiveCutoff = today.getTime() - INACTIVE_DAYS * 86_400_000;

  for (const customer of customers) {
    const days = daysUntilBirthday(customer.birthDate, today);
    if (days !== null && days >= 0 && days <= BIRTHDAY_WINDOW_DAYS) {
      items.push({
        id: `bday-${customer.id}-${today.getFullYear()}`,
        kind: "birthday",
        title:
          days === 0
            ? `Aniversário de ${customer.name} hoje`
            : `Aniversário de ${customer.name} em ${days} dia(s)`,
        description: "Bom momento para uma oferta ou mensagem de recompra.",
        target: { type: "customer", customerId: customer.id },
      });
    }

    if (customer.lastPurchase) {
      const last = new Date(`${customer.lastPurchase}T12:00:00`).getTime();
      if (!Number.isNaN(last) && last < inactiveCutoff) {
        items.push({
          id: `inactive-${customer.id}`,
          kind: "inactive_customer",
          title: `${customer.name} sem comprar há tempo`,
          description: `Última compra há mais de ${INACTIVE_DAYS} dias. Vale um follow-up.`,
          target: { type: "customer", customerId: customer.id },
        });
      }
    } else {
      items.push({
        id: `inactive-${customer.id}`,
        kind: "inactive_customer",
        title: `${customer.name} ainda não comprou`,
        description: "Cliente cadastrado sem nenhum pedido registrado.",
        target: { type: "customer", customerId: customer.id },
      });
    }
  }

  return items;
}

const productsService = getProductsService();
const customersService = getCustomersService();

export function useStoreNotifications() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<Set<string>>(() => readDismissed());

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

  const all = useMemo(() => {
    const products = productsQuery.data ?? [];
    const customers = customersQuery.data ?? [];
    const priority: Record<StoreNotificationKind, number> = {
      out_of_stock: 0,
      low_stock: 1,
      birthday: 2,
      inactive_customer: 3,
    };

    return [...buildProductNotifications(products), ...buildCustomerNotifications(customers)]
      .sort((a, b) => priority[a.kind] - priority[b.kind])
      .slice(0, 20);
  }, [customersQuery.data, productsQuery.data]);

  const notifications = useMemo(
    () => all.filter((item) => !dismissed.has(item.id)),
    [all, dismissed],
  );

  const dismiss = useCallback((id: string) => {
    setDismissed((current) => {
      const next = new Set(current);
      next.add(id);
      writeDismissed(next);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed((current) => {
      const next = new Set(current);
      for (const item of all) next.add(item.id);
      writeDismissed(next);
      return next;
    });
  }, [all]);

  const openNotification = useCallback(
    (item: StoreNotification) => {
      dismiss(item.id);

      if (item.target.type === "stock") {
        void navigate({ to: "/stock" });
        return;
      }

      void navigate({
        to: "/customers/$customerId",
        params: { customerId: item.target.customerId },
      });
    },
    [dismiss, navigate],
  );

  return {
    notifications,
    unreadCount: notifications.length,
    isLoading: productsQuery.isLoading || customersQuery.isLoading,
    dismiss,
    dismissAll,
    openNotification,
  };
}
