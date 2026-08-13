import type { CreateStoreUserDto, StoreUser } from "@/types/api/users";

export interface IUsersService {
  findAll(): Promise<StoreUser[]>;
  create(dto: CreateStoreUserDto): Promise<StoreUser>;
  remove(id: string): Promise<void>;
}
