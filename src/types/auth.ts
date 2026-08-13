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

export function isStoreAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === "ADMIN";
}

export function canManageSales(user: AuthUser | null | undefined): boolean {
  return user?.role === "ADMIN" || user?.role === "MANAGER";
}
