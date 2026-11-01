import { InvalidStringError } from "../errors/InvalidError/InvalidStringError.js";
import { DataCorruptedError } from "../errors/Repository/DataCorruptedError.js";
import { BaseEntity, invalidString } from "../models/BaseEntity.js";
import { readFile, writeFile } from "fs/promises";
import { IRepository } from "./IRepository.js";
import { EntityAlreadyExistsError } from "../errors/Repository/EntityAlreadyExitsError.js";
import { EntityNotFoundError } from "../errors/Repository/EntityNotFoundError.js";

export class JsonRepository<T extends BaseEntity> implements IRepository<T> {
  constructor(
    protected readonly filePath: string,
    protected readonly entityName: string,
  ) {
    if (invalidString(filePath)) throw new InvalidStringError(filePath);
    if (invalidString(entityName)) throw new InvalidStringError(entityName);
  }
  private async readData(): Promise<T[]> {
    let str: string;
    try {
      str = await readFile(this.filePath, "utf-8");
      if (!invalidString(str)) return JSON.parse(str);
      else return [];
    } catch (error) {
      throw new DataCorruptedError({
        filePath: this.filePath,
        reason: String(error),
      });
    }
  }
  private async writeData(wrt: T[]): Promise<void> {
    const str = JSON.stringify(wrt, null, 2);
    await writeFile(this.filePath, str);
  }
  clone(obj: T): T {
    const cloneObj = structuredClone(obj);
    return cloneObj;
  }
  async add(item: T): Promise<void> {
    const data = await this.readData();
    const target = data.findIndex((temp) => temp.id === item.id);
    if (target === -1) {
      data.push(this.clone(item));
      await this.writeData(data);
    } else {
      throw new EntityAlreadyExistsError(item.id);
    }
  }
  async findById(id: string): Promise<T | null> {
    const data = await this.readData();
    const target = data.find((temp) => temp.id === id);
    if (target) return target;
    else return null;
  }
  async findAll(): Promise<T[]> {
    return await this.readData();
  }
  async delete(id: string): Promise<void> {
    const data = await this.readData();
    const target = data.findIndex((temp) => temp.id === id);
    if (target !== -1) {
      data.splice(target, 1);
      await this.writeData(data);
    } else throw new EntityNotFoundError(id);
  }
  async update(item: T): Promise<void> {
    const data = await this.readData();
    const target = data.findIndex((temp) => temp.id === item.id);
    if (target !== -1) {
      data[target] = this.clone(item);
      await this.writeData(data);
    } else throw new EntityNotFoundError(item.id);
  }
  async filter(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readData();
    const newArr: T[] = data.filter(predicate);
    return newArr;
  }
}
