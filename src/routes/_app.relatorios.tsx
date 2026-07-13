import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const reportsPage = lazyPage(() => import("@/features/reports"), "ReportsPage");

export const Route = createFileRoute("/_app/relatorios")({
  ...reportsPage,
});
