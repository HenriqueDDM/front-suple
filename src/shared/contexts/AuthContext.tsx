import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { env } from "@/config/env";
import {
  fetchCurrentUser,
  loginWithCredentials,
  logoutSession,
  readCachedAuthUser,
} from "@/services/api/auth";
import { getAccessToken } from "@/services/api/auth-store";
import type { AuthUser, LoginCredentials } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER: AuthUser = {
  userId: "mock-user",
  storeId: "mock-store",
  role: "ADMIN",
  email: "admin@loja-a.com",
  name: "Administrador",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (env.useMockApi) return MOCK_USER;
    return readCachedAuthUser();
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (env.useMockApi) return false;
    return Boolean(getAccessToken());
  });

  useEffect(() => {
    if (env.useMockApi) return;

    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetchCurrentUser()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const currentUser = await loginWithCredentials(credentials);
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(() => {
    logoutSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: env.useMockApi ? true : Boolean(user && getAccessToken()),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
