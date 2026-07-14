import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const stockPage = lazyPage(() => import("@/features/stock"), "StockPage");

export const Route = createFileRoute("/_app/stock")({
  ...stockPage,
});
