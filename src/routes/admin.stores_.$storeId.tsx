import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const storeDetailPage = lazyPage(
  () => import("@/features/platform"),
  "PlatformStoreDetailPage",
);

export const Route = createFileRoute("/admin/stores_/$storeId")({
  head: () => ({
    meta: [{ title: "Loja — Admin Tradutto" }],
  }),
  ...storeDetailPage,
});
