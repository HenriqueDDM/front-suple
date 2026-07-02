import { useState } from "react";
import { stockMovements as seed } from "@/services/mock/stock";
import type { StockMovement } from "@/types";

export function useStockMovements() {
  const [items, setItems] = useState<StockMovement[]>(seed);

  const createMovement = (data: Omit<StockMovement, "id" | "createdAt">) => {
    setItems((prev) => [
      { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  return { items, createMovement };
}
