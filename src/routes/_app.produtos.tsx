import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/pages/ProductsPage";

export const Route = createFileRoute("/_app/produtos")({
  head: () => ({
    meta: [{ title: "Produtos — Supl" }],
  }),
  component: ProductsPage,
});
