import { describe, expect, it } from "vitest";
import { Learner } from "../../src/models/Entity/Learner.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidScoreTOEICError } from "../../src/errors/InvalidError/InvalidScoreTOEICError.js";
import { InvalidDateError } from "../../src/errors/InvalidError/InvalidDateError.js";

describe("Entity: Learner", () => {
  it("khởi tạo thành công học viên với dữ liệu hợp lệ", () => {
    const now = new Date("2026-10-01T00:00:00.000Z");
    const future = new Date("2026-12-01T00:00:00.000Z");

    const learner = new Learner({
      id: "learner-1",
      name: "Nguyễn Văn Nam",
      targetScore: 800,
      currentLevel: 550,
      createdAt: now,
      examDate: future,
    });

    expect(learner.id).toBe("learner-1");
    expect(learner.name).toBe("Nguyễn Văn Nam");
    expect(learner.targetScore).toBe(800);
    expect(learner.currentLevel).toBe(550);
    expect(learner.createdAt).toBe(now);
    expect(learner.examDate).toBe(future);
  });

  it("ném InvalidStringError khi id hoặc name rỗng", () => {
    expect(() => new Learner({ id: "", name: "Nam" })).toThrow(InvalidStringError);
    expect(() => new Learner({ id: "l-1", name: "   " })).toThrow(
      InvalidStringError,
    );
  });

  it("ném InvalidScoreTOEICError khi targetScore hoặc currentLevel không theo chuẩn TOEIC", () => {
    // Ngoài khoảng 10 - 990
    expect(
      () => new Learner({ id: "l-1", name: "Nam", targetScore: 5 }),
    ).toThrow(InvalidScoreTOEICError);
    expect(
      () => new Learner({ id: "l-1", name: "Nam", targetScore: 995 }),
    ).toThrow(InvalidScoreTOEICError);

    // Không chia hết cho 5
    expect(
      () => new Learner({ id: "l-1", name: "Nam", targetScore: 752 }),
    ).toThrow(InvalidScoreTOEICError);
    expect(
      () => new Learner({ id: "l-1", name: "Nam", currentLevel: 453 }),
    ).toThrow(InvalidScoreTOEICError);
  });

  it("ném InvalidDateError khi examDate sớm hơn createdAt", () => {
    const createdAt = new Date("2026-10-15T00:00:00.000Z");
    const pastExamDate = new Date("2026-10-10T00:00:00.000Z");

    expect(
      () =>
        new Learner({
          id: "l-1",
          name: "Nam",
          createdAt,
          examDate: pastExamDate,
        }),
    ).toThrow(InvalidDateError);
  });
});
