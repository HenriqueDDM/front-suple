import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const settingsPage = lazyPage(() => import("@/features/settings"), "SettingsPage");

export const Route = createFileRoute("/_app/configuracoes")({
  ...settingsPage,
});
