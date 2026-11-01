import { BaseEntity } from "../models/BaseEntity.js";

export interface IRepository<T extends BaseEntity> {
  add(item: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
  update(item: T): Promise<void>;
  filter(predicate: (item: T) => boolean): Promise<T[]>;
}
