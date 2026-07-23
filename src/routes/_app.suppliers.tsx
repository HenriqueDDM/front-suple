import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const suppliersPage = lazyPage(() => import("@/features/suppliers"), "SuppliersPage");

export const Route = createFileRoute("/_app/suppliers")({
  head: () => ({
    meta: [{ title: "Fornecedores — Tradutto Suplementos" }],
  }),
  ...suppliersPage,
});
