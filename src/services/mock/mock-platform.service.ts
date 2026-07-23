import type { IPlatformService } from "@/services/interfaces/platform.service";
import type {
  CreatePlatformStoreDto,
  PlatformStore,
  PlatformStoreUser,
  PlatformSummary,
  UpdatePlatformStoreDto,
} from "@/types/api/platform";

const now = new Date().toISOString();

let stores: PlatformStore[] = [
  {
    id: "mock-store-1",
    name: "Tradutto Suplementos A",
    cnpj: "11.111.111/0001-11",
    email: "contato@loja-a.com",
    phone: "(11) 99999-0001",
    address: "Rua A, 100",
    plan: "pro",
    status: "active",
    usersCount: 1,
    createdAt: now,
  },
  {
    id: "mock-store-2",
    name: "Tradutto Suplementos B",
    cnpj: "22.222.222/0001-22",
    email: "contato@loja-b.com",
    phone: "(21) 99999-0002",
    address: "Av. B, 200",
    plan: "basic",
    status: "active",
    usersCount: 1,
    createdAt: now,
  },
];

export const mockPlatformService: IPlatformService = {
  async getSummary(): Promise<PlatformSummary> {
    const byPlan: Record<string, number> = { free: 0, basic: 0, pro: 0, enterprise: 0 };
    let storesActive = 0;
    let storesSuspended = 0;
    let storesInactive = 0;
    for (const store of stores) {
      byPlan[store.plan] = (byPlan[store.plan] ?? 0) + 1;
      if (store.status === "active") storesActive += 1;
      else if (store.status === "suspended") storesSuspended += 1;
      else storesInactive += 1;
    }
    return {
      storesTotal: stores.length,
      storesActive,
      storesSuspended,
      storesInactive,
      usersTotal: stores.reduce((sum, store) => sum + store.usersCount, 0),
      byPlan,
    };
  },

  async listStores() {
    return [...stores];
  },

  async getStore(id: string) {
    const store = stores.find((item) => item.id === id);
    if (!store) throw new Error("Store not found");
    return store;
  },

  async listStoreUsers(id: string): Promise<PlatformStoreUser[]> {
    return [
      {
        id: `user-${id}`,
        name: "Admin da loja",
        email: `admin@${id}.com`,
        role: "ADMIN",
        createdAt: now,
      },
    ];
  },

  async createStore(dto: CreatePlatformStoreDto) {
    const store: PlatformStore = {
      id: `mock-store-${Date.now()}`,
      name: dto.name,
      cnpj: dto.cnpj,
      email: dto.email,
      phone: dto.phone,
      address: dto.address ?? "",
      plan: dto.plan ?? "basic",
      status: "active",
      usersCount: 1,
      createdAt: new Date().toISOString(),
    };
    stores = [store, ...stores];
    return store;
  },

  async updateStore(id: string, dto: UpdatePlatformStoreDto) {
    const index = stores.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Store not found");
    stores[index] = { ...stores[index], ...dto };
    return stores[index];
  },
};
