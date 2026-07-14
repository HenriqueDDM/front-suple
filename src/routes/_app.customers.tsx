import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const customersPage = lazyPage(() => import("@/features/customers"), "CustomersPage");

export const Route = createFileRoute("/_app/customers")({
  ...customersPage,
});
