import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { env } from "@/config/env";
import { getAccessToken } from "@/services/api/auth-store";
import { readCachedAuthUser } from "@/services/api/auth";
import { isPlatformAdmin } from "@/types/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    // Token vive no sessionStorage (só no browser). No SSR não bloqueia;
    // o client redireciona se não houver sessão.
    if (typeof window === "undefined") return;
    if (env.useMockApi) return;
    if (!getAccessToken()) {
      throw redirect({ to: "/login" });
    }
    const user = readCachedAuthUser();
    if (isPlatformAdmin(user)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLayout,
});
