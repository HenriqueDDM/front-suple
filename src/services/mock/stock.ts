import type { StockMovement } from "@/types";

export const stockMovements: StockMovement[] = [
  {
    id: "m1",
    productId: "p1",
    productName: "Whey Protein Concentrado 900g",
    type: "entry",
    quantity: 30,
    reason: "Reposição fornecedor Growth",
    createdAt: "2026-07-01T08:00:00",
  },
  {
    id: "m2",
    productId: "p2",
    productName: "Creatina Monohidratada 300g",
    type: "exit",
    quantity: 4,
    reason: "Venda #1042",
    createdAt: "2026-07-01T14:22:00",
  },
  {
    id: "m3",
    productId: "p6",
    productName: "Ômega 3 1000mg 120 caps",
    type: "adjustment",
    quantity: -2,
    reason: "Ajuste de inventário",
    createdAt: "2026-06-30T17:40:00",
  },
  {
    id: "m4",
    productId: "p3",
    productName: "BCAA 2:1:1 120 cápsulas",
    type: "exit",
    quantity: 8,
    reason: "Venda promocional",
    createdAt: "2026-06-29T11:15:00",
  },
  {
    id: "m5",
    productId: "p8",
    productName: "Termogênico Lipo 6 Black",
    type: "entry",
    quantity: 20,
    reason: "Compra Import Health",
    createdAt: "2026-06-27T09:30:00",
  },
];
