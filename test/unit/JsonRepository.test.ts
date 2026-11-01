import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { JsonRepository } from "../../src/repositories/JSONRepository.js";
import { BaseEntity } from "../../src/models/BaseEntity.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { DataCorruptedError } from "../../src/errors/Repository/DataCorruptedError.js";
import { EntityAlreadyExistsError } from "../../src/errors/Repository/EntityAlreadyExitsError.js";
import { EntityNotFoundError } from "../../src/errors/Repository/EntityNotFoundError.js";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

interface TestItem extends BaseEntity {
  id: string;
  name: string;
  score: number;
}

describe("Repository: JsonRepository", () => {
  let tempDir: string;
  let testFilePath: string;
  let repo: JsonRepository<TestItem>;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "toeic-repo-test-"));
    testFilePath = join(tempDir, "items.json");
    // Khởi tạo file rỗng chuẩn JSON
    await writeFile(testFilePath, "[]", "utf-8");
    repo = new JsonRepository<TestItem>(testFilePath, "TestItem");
  });

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("ném InvalidStringError khi filePath hoặc entityName để trống trong constructor", () => {
    expect(() => new JsonRepository<TestItem>("", "TestItem")).toThrow(
      InvalidStringError,
    );
    expect(() => new JsonRepository<TestItem>("path.json", "   ")).toThrow(
      InvalidStringError,
    );
  });

  it("findAll trả về mảng rỗng [] khi file chứa mảng rỗng", async () => {
    const items = await repo.findAll();
    expect(items).toEqual([]);
  });

  it("findAll trả về mảng rỗng [] khi file hoàn toàn trống (chuỗi rỗng)", async () => {
    await writeFile(testFilePath, "", "utf-8");
    const items = await repo.findAll();
    expect(items).toEqual([]);
  });

  it("ném DataCorruptedError khi file chứa JSON bị hỏng cú pháp", async () => {
    await writeFile(testFilePath, "{ broken json content", "utf-8");
    await expect(repo.findAll()).rejects.toThrow(DataCorruptedError);
  });

  it("add: thêm mới thành công một phần tử và lưu vào file", async () => {
    const item: TestItem = { id: "item-1", name: "Item One", score: 100 };
    await repo.add(item);

    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0]).toEqual(item);

    const found = await repo.findById("item-1");
    expect(found).toEqual(item);
  });

  it("add: bảo vệ tham chiếu bằng clone (sửa biến bên ngoài không ảnh hưởng dữ liệu trong kho)", async () => {
    const item: TestItem = { id: "item-1", name: "Item One", score: 100 };
    await repo.add(item);

    // Thay đổi thuộc tính của object sau khi add
    item.name = "Mutated Name";
    item.score = 999;

    const inRepo = await repo.findById("item-1");
    expect(inRepo?.name).toBe("Item One");
    expect(inRepo?.score).toBe(100);
  });

  it("add: ném EntityAlreadyExistsError khi thêm phần tử có ID đã tồn tại", async () => {
    const item: TestItem = { id: "item-dup", name: "Original", score: 50 };
    await repo.add(item);

    const duplicateItem: TestItem = {
      id: "item-dup",
      name: "Duplicate",
      score: 80,
    };
    await expect(repo.add(duplicateItem)).rejects.toThrow(
      EntityAlreadyExistsError,
    );
  });

  it("findById: trả về null khi không tìm thấy ID", async () => {
    const result = await repo.findById("non-existent-id");
    expect(result).toBeNull();
  });

  it("update: cập nhật thành công phần tử có cùng ID", async () => {
    await repo.add({ id: "item-1", name: "First", score: 10 });
    await repo.add({ id: "item-2", name: "Second", score: 20 });

    const updatedItem: TestItem = {
      id: "item-1",
      name: "First Updated",
      score: 99,
    };
    await repo.update(updatedItem);

    const found = await repo.findById("item-1");
    expect(found).toEqual(updatedItem);

    // Thứ tự trong mảng vẫn được bảo toàn (item-1 vẫn ở vị trí đầu)
    const all = await repo.findAll();
    expect(all[0]?.id).toBe("item-1");
    expect(all[1]?.id).toBe("item-2");
  });

  it("update: ném EntityNotFoundError khi cập nhật ID không tồn tại trong kho", async () => {
    const ghostItem: TestItem = { id: "ghost", name: "Ghost", score: 0 };
    await expect(repo.update(ghostItem)).rejects.toThrow(EntityNotFoundError);
  });

  it("delete: xóa thành công phần tử theo ID", async () => {
    await repo.add({ id: "item-1", name: "First", score: 10 });
    await repo.add({ id: "item-2", name: "Second", score: 20 });

    await repo.delete("item-1");

    const found = await repo.findById("item-1");
    expect(found).toBeNull();

    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0]?.id).toBe("item-2");
  });

  it("delete: ném EntityNotFoundError khi xóa ID không tồn tại", async () => {
    await expect(repo.delete("unknown-id")).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  it("filter: lọc chính xác các phần tử thỏa mãn điều kiện predicate", async () => {
    await repo.add({ id: "item-1", name: "Alpha", score: 50 });
    await repo.add({ id: "item-2", name: "Beta", score: 80 });
    await repo.add({ id: "item-3", name: "Gamma", score: 95 });

    // Lọc các item có score >= 80
    const highScores = await repo.filter((item) => item.score >= 80);
    expect(highScores.length).toBe(2);
    expect(highScores.map((i) => i.id)).toEqual(["item-2", "item-3"]);

    // Lọc không khớp ai
    const emptyFilter = await repo.filter((item) => item.score > 100);
    expect(emptyFilter).toEqual([]);
  });

  it("clone: tạo ra bản sao độc lập", () => {
    const original: TestItem = { id: "orig", name: "Original", score: 123 };
    const cloned = repo.clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original); // Khác địa chỉ vùng nhớ RAM
  });
});
