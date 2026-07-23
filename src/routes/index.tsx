import { createFileRoute } from "@tanstack/react-router";
import { lazyPage } from "@/shared/lib/lazyPage";

const landingPage = lazyPage(() => import("@/features/landing"), "LandingPage");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Tradutto Suplementos — PDV, estoque e recompra com IA",
      },
      {
        name: "description",
        content:
          "Sistema pra loja de suplementos: PDV, estoque, clientes e alertas de recompra. Planos Essencial, Completo com IA e implantação sob medida.",
      },
    ],
  }),
  ...landingPage,
});
