import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const productsPage = lazyPage(() => import("@/features/products"), "ProductsPage");

export const Route = createFileRoute("/_app/produtos")({
  head: () => ({
    meta: [{ title: "Produtos — Supl" }],
  }),
  ...productsPage,
});
