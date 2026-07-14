import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const salesPage = lazyPage(() => import("@/features/sales"), "SalesPage");

export const Route = createFileRoute("/_app/sales")({
  ...salesPage,
});
