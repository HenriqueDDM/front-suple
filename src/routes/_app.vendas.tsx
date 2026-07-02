import { createFileRoute } from "@tanstack/react-router";
import { SalesPage } from "@/pages/SalesPage";

export const Route = createFileRoute("/_app/vendas")({
  head: () => ({
    meta: [{ title: "Vendas — Supl" }],
  }),
  component: SalesPage,
});
