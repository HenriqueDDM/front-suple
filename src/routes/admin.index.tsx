import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const overviewPage = lazyPage(() => import("@/features/platform"), "PlatformOverviewPage");

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin — Tradutto Suplementos" }],
  }),
  ...overviewPage,
});
