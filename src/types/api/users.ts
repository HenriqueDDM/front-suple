import type { UserRole } from "@/types/auth";

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: Exclude<UserRole, "SUPER_ADMIN">;
  createdAt: string;
}

export interface CreateStoreUserDto {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "SUPER_ADMIN">;
}
