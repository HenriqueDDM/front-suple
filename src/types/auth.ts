export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "SELLER";

export interface AuthUser {
  userId: string;
  storeId: string | null;
  role: UserRole;
  email: string;
  name: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export function isPlatformAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === "SUPER_ADMIN";
}
