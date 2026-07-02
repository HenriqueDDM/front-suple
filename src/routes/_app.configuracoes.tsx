import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/SettingsPage";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({
    meta: [{ title: "Configurações — Supl" }],
  }),
  component: SettingsPage,
});
