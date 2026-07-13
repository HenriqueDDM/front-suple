import { useEffect, useState, type ReactNode } from "react";
import { env } from "@/config/env";
import { ensureApiReady } from "@/services/api/bootstrap";

export function ApiBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(env.useMockApi);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (env.useMockApi) return;

    ensureApiReady()
      .then(() => setReady(true))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (env.useMockApi) return children;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold text-foreground">Erro ao conectar ao backend</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Certifique-se de que o backend está em{" "}
            <code className="rounded bg-muted px-1">{env.apiBaseUrl}</code> com migrations e seeds
            aplicados.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Conectando ao backend...</p>
      </div>
    );
  }

  return children;
}
