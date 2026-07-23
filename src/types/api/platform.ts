export type PlatformPlan = "free" | "basic" | "pro" | "enterprise";
export type PlatformStoreStatus = "active" | "inactive" | "suspended";

export interface PlatformStore {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  plan: PlatformPlan;
  status: PlatformStoreStatus;
  usersCount: number;
  createdAt: string;
}

export interface PlatformSummary {
  storesTotal: number;
  storesActive: number;
  storesSuspended: number;
  storesInactive: number;
  usersTotal: number;
  byPlan: Record<string, number>;
}

export interface PlatformStoreUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreatePlatformStoreDto {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: string;
  plan?: PlatformPlan;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
}

export interface UpdatePlatformStoreDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  plan?: PlatformPlan;
  status?: PlatformStoreStatus;
}
