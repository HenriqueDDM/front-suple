import { env } from "@/config/env";
import {
  clearAuthSession,
  getAccessToken,
  getAuthUser,
  setAccessToken,
  setAuthUser,
} from "@/services/api/auth-store";
import { ApiError } from "@/services/api/errors";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/types/auth";

function toAuthUser(data: LoginResponse | AuthUser): AuthUser {
  return {
    userId: data.userId,
    storeId: data.storeId,
    role: data.role,
    email: data.email,
    name: data.name || data.email.split("@")[0] || "Usuário",
  };
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  const response = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : "E-mail ou senha inválidos.";
    throw new ApiError(
      response.status === 401 ? "E-mail ou senha inválidos." : message,
      response.status,
      body,
    );
  }

  const data = (await response.json()) as LoginResponse;
  setAccessToken(data.accessToken);
  const user = toAuthUser(data);
  setAuthUser(user);
  return user;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError("Não autenticado", 401);
  }

  const response = await fetch(`${env.apiBaseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    clearAuthSession();
    throw new ApiError("Sessão expirada", response.status);
  }

  const data = (await response.json()) as AuthUser;
  const user = toAuthUser(data);
  setAuthUser(user);
  return user;
}

export function logoutSession(): void {
  clearAuthSession();
}

export function readCachedAuthUser(): AuthUser | null {
  return getAuthUser();
}

export function isAuthenticated(): boolean {
  if (env.useMockApi) return true;
  return Boolean(getAccessToken());
}
