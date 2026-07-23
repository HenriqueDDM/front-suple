import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const storesPage = lazyPage(() => import("@/features/platform"), "PlatformStoresPage");

export const Route = createFileRoute("/admin/stores")({
  head: () => ({
    meta: [{ title: "Lojas — Admin Tradutto" }],
  }),
  ...storesPage,
});
