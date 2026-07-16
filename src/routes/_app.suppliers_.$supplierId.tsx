import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const supplierProfilePage = lazyPage(
  () => import("@/features/suppliers"),
  "SupplierProfilePage",
);

export const Route = createFileRoute("/_app/suppliers_/$supplierId")({
  ...supplierProfilePage,
});
