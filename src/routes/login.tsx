import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const loginPage = lazyPage(() => import("@/features/auth"), "LoginPage");

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Entrar — Tradutto Suplementos" }],
  }),
  ...loginPage,
});
