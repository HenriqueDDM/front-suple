import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const productsPage = lazyPage(() => import("@/features/products"), "ProductsPage");

export const Route = createFileRoute("/_app/products")({
  head: () => ({
    meta: [{ title: "Produtos — Tradutto Suplementos" }],
  }),
  ...productsPage,
});
