export type UserRole = "ADMIN" | "MANAGER" | "SELLER";

export interface AuthUser {
  userId: string;
  storeId: string;
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
