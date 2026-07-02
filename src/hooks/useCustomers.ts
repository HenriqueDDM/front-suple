import { useState } from "react";
import { customers as seed } from "@/services/mock/customers";
import type { Customer } from "@/types";

export function useCustomers() {
  const [items, setItems] = useState<Customer[]>(seed);

  const createCustomer = (
    data: Omit<Customer, "id" | "lastPurchase" | "totalSpent">,
  ) => {
    setItems((prev) => [
      { ...data, id: crypto.randomUUID(), lastPurchase: null, totalSpent: 0 },
      ...prev,
    ]);
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCustomer = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, createCustomer, updateCustomer, deleteCustomer };
}
