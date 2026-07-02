import { useState } from "react";
import { products as seed } from "@/services/mock/products";
import type { Product } from "@/types";

/**
 * In-memory products store. Swap the seed + mutations for API calls
 * (NestJS) later — the component contract stays the same.
 */
export function useProducts() {
  const [items, setItems] = useState<Product[]>(seed);

  const createProduct = (data: Omit<Product, "id">) => {
    setItems((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProduct = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, createProduct, updateProduct, deleteProduct };
}
