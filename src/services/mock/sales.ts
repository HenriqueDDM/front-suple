import type { Sale } from "@/types";

export const sales: Sale[] = [
  {
    id: "s1",
    code: "#1042",
    customerId: "c2",
    customerName: "Juliana Souza",
    items: [
      { productId: "p1", productName: "Whey Protein Concentrado 900g", quantity: 1, unitPrice: 129.9 },
      { productId: "p2", productName: "Creatina Monohidratada 300g", quantity: 1, unitPrice: 99.9 },
    ],
    discount: 10,
    total: 219.8,
    paymentMethod: "pix",
    createdAt: "2026-07-01T14:22:00",
  },
  {
    id: "s2",
    code: "#1041",
    customerId: "c4",
    customerName: "Camila Rodrigues",
    items: [
      { productId: "p7", productName: "Whey Isolado 900g", quantity: 1, unitPrice: 189.9 },
      { productId: "p4", productName: "Pré-treino Insane 300g", quantity: 1, unitPrice: 119.9 },
    ],
    discount: 0,
    total: 309.8,
    paymentMethod: "credit",
    createdAt: "2026-06-30T18:05:00",
  },
  {
    id: "s3",
    code: "#1040",
    customerId: "c1",
    customerName: "Rafael Almeida",
    items: [
      { productId: "p1", productName: "Whey Protein Concentrado 900g", quantity: 2, unitPrice: 129.9 },
    ],
    discount: 20,
    total: 239.8,
    paymentMethod: "debit",
    createdAt: "2026-06-28T10:47:00",
  },
  {
    id: "s4",
    code: "#1039",
    customerId: null,
    customerName: "Consumidor final",
    items: [
      { productId: "p5", productName: "Multivitamínico A-Z 90 tabs", quantity: 1, unitPrice: 45.9 },
      { productId: "p6", productName: "Ômega 3 1000mg 120 caps", quantity: 1, unitPrice: 89.9 },
    ],
    discount: 0,
    total: 135.8,
    paymentMethod: "cash",
    createdAt: "2026-06-28T09:12:00",
  },
  {
    id: "s5",
    code: "#1038",
    customerId: "c3",
    customerName: "Marcos Pereira",
    items: [
      { productId: "p8", productName: "Termogênico Lipo 6 Black", quantity: 1, unitPrice: 159.9 },
    ],
    discount: 0,
    total: 159.9,
    paymentMethod: "pix",
    createdAt: "2026-06-27T16:30:00",
  },
];

// Sales for the last 30 days chart.
// Deterministic pseudo-random so SSR and client render identical values (no hydration mismatch).
const pseudoRandom = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const salesTrend = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 800 + Math.round(Math.sin(i / 3) * 350 + pseudoRandom(i) * 400);
  return {
    date: date.toISOString().slice(0, 10),
    label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    revenue: base,
    orders: Math.max(3, Math.round(base / 90)),
  };
});

export const salesByCategory = [
  { category: "Proteínas", value: 12400 },
  { category: "Pré-treino", value: 6800 },
  { category: "Creatinas", value: 5200 },
  { category: "Termogênicos", value: 4100 },
  { category: "Vitaminas", value: 2600 },
  { category: "Aminoácidos", value: 1900 },
];

export const topProducts = [
  { name: "Whey Protein Concentrado 900g", units: 128, revenue: 16627.2 },
  { name: "Creatina Monohidratada 300g", units: 96, revenue: 9590.4 },
  { name: "Pré-treino Insane 300g", units: 74, revenue: 8872.6 },
  { name: "Whey Isolado 900g", units: 58, revenue: 11014.2 },
  { name: "Termogênico Lipo 6 Black", units: 41, revenue: 6555.9 },
  { name: "Multivitamínico A-Z 90 tabs", units: 39, revenue: 1790.1 },
  { name: "Ômega 3 1000mg 120 caps", units: 33, revenue: 2966.7 },
  { name: "BCAA 2:1:1 120 cápsulas", units: 28, revenue: 1817.2 },
  { name: "Barra de Proteína 60g", units: 24, revenue: 287.6 },
  { name: "Glutamina 300g", units: 19, revenue: 1330.0 },
];
