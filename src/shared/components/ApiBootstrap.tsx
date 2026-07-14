import { useEffect, type ReactNode } from "react";
import { env } from "@/config/env";
import { useAuth } from "@/shared/contexts/AuthContext";

/** Waits for AuthProvider session hydration before rendering app routes. */
export function ApiBootstrap({ children }: { children: ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    // Hydration is owned by AuthProvider.
  }, []);

  if (env.useMockApi) return children;

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Carregando sessão...</p>
      </div>
    );
  }

  return children;
}
