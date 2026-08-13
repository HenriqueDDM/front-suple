import type { IUsersService } from "@/services/interfaces/users.service";
import type { CreateStoreUserDto, StoreUser } from "@/types/api/users";

class MockUsersService implements IUsersService {
  private store: StoreUser[] = [
    {
      id: "u-admin",
      name: "Admin Loja",
      email: "admin@loja-a.com",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
    },
  ];

  async findAll(): Promise<StoreUser[]> {
    return [...this.store];
  }

  async create(dto: CreateStoreUserDto): Promise<StoreUser> {
    if (this.store.some((user) => user.email === dto.email.trim().toLowerCase())) {
      throw new Error("Email already in use");
    }
    const user: StoreUser = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role,
      createdAt: new Date().toISOString(),
    };
    this.store = [...this.store, user];
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = this.store.find((item) => item.id === id);
    if (!user) throw new Error("User not found");
    const admins = this.store.filter((item) => item.role === "ADMIN");
    if (user.role === "ADMIN" && admins.length <= 1) {
      throw new Error("Cannot remove the last store admin");
    }
    this.store = this.store.filter((item) => item.id !== id);
  }
}

export const mockUsersService = new MockUsersService();
