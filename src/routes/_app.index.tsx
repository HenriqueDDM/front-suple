import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const dashboardPage = lazyPage(() => import("@/features/dashboard"), "DashboardPage");

export const Route = createFileRoute("/_app/")({
  ...dashboardPage,
});
