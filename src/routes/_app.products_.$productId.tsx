import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const productProfilePage = lazyPage(
  () => import("@/features/products"),
  "ProductProfilePage",
);

export const Route = createFileRoute("/_app/products_/$productId")({
  ...productProfilePage,
});
