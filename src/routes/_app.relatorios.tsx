import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/pages/ReportsPage";

export const Route = createFileRoute("/_app/relatorios")({
  head: () => ({
    meta: [{ title: "Relatórios — Supl" }],
  }),
  component: ReportsPage,
});
