import type {
  CreatePlatformStoreDto,
  PlatformStore,
  PlatformStoreUser,
  PlatformSummary,
  UpdatePlatformStoreDto,
} from "@/types/api/platform";

export interface IPlatformService {
  getSummary(): Promise<PlatformSummary>;
  listStores(): Promise<PlatformStore[]>;
  getStore(id: string): Promise<PlatformStore>;
  listStoreUsers(id: string): Promise<PlatformStoreUser[]>;
  createStore(dto: CreatePlatformStoreDto): Promise<PlatformStore>;
  updateStore(id: string, dto: UpdatePlatformStoreDto): Promise<PlatformStore>;
}
