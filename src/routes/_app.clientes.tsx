import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/pages/CustomersPage";

export const Route = createFileRoute("/_app/clientes")({
  head: () => ({
    meta: [{ title: "Clientes — Supl" }],
  }),
  component: CustomersPage,
});
