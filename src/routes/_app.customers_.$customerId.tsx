import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const customerProfilePage = lazyPage(
  () => import("@/features/customers"),
  "CustomerProfilePage",
);

export const Route = createFileRoute("/_app/customers_/$customerId")({
  ...customerProfilePage,
});
