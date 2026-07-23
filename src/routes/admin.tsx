import { createFileRoute, redirect } from "@tanstack/react-router";
import { PlatformLayout } from "@/features/platform";
import { env } from "@/config/env";
import { getAccessToken } from "@/services/api/auth-store";
import { readCachedAuthUser } from "@/services/api/auth";
import { isPlatformAdmin } from "@/types/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (env.useMockApi) return;
    if (!getAccessToken()) {
      throw redirect({ to: "/login" });
    }
    const user = readCachedAuthUser();
    if (user && !isPlatformAdmin(user)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: PlatformLayout,
});
