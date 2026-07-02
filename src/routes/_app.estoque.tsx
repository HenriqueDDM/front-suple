import { createFileRoute } from "@tanstack/react-router";
import { StockPage } from "@/pages/StockPage";

export const Route = createFileRoute("/_app/estoque")({
  head: () => ({
    meta: [{ title: "Estoque — Supl" }],
  }),
  component: StockPage,
});
