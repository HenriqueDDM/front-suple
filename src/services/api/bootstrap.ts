import { env } from "@/config/env";
import { getAccessToken, setAccessToken } from "@/services/api/auth-store";
import { ApiError } from "@/services/api/errors";

interface AuthResponse {
  accessToken: string;
}

let bootstrapPromise: Promise<void> | null = null;

export function ensureApiReady(): Promise<void> {
  if (env.useMockApi) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();
  if (getAccessToken()) return Promise.resolve();

  if (!bootstrapPromise) {
    bootstrapPromise = loginWithDevCredentials().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}

async function loginWithDevCredentials(): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.devEmail,
      password: env.devPassword,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ApiError(
      "Não foi possível autenticar com o backend. Verifique se o servidor está rodando e se as seeds foram aplicadas.",
      response.status,
      body,
    );
  }

  const data = (await response.json()) as AuthResponse;
  setAccessToken(data.accessToken);
}
