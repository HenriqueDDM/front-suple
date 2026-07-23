import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const settingsPage = lazyPage(() => import("@/features/settings"), "SettingsPage");

export type SettingsTab = "store" | "theme" | "prefs" | "fiscal";

function parseSettingsTab(value: unknown): SettingsTab {
  if (value === "store" || value === "theme" || value === "prefs" || value === "fiscal") {
    return value;
  }
  return "store";
}

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{ title: "Configurações — Tradutto Suplementos" }],
  }),
  validateSearch: (search: Record<string, unknown>): { tab: SettingsTab } => ({
    tab: parseSettingsTab(search.tab),
  }),
  ...settingsPage,
});
