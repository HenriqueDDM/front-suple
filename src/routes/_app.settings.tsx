import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const settingsPage = lazyPage(() => import("@/features/settings"), "SettingsPage");

export type SettingsTab = "store" | "theme" | "prefs";

function parseSettingsTab(value: unknown): SettingsTab {
  if (value === "store" || value === "theme" || value === "prefs") {
    return value;
  }
  return "store";
}

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{ title: "Configurações — Supl" }],
  }),
  validateSearch: (search: Record<string, unknown>): { tab: SettingsTab } => ({
    tab: parseSettingsTab(search.tab),
  }),
  ...settingsPage,
});
