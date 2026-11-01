import { describe, expect, it } from "vitest";
import { Exam } from "../../src/models/Entity/Exam.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";

describe("Entity: Exam", () => {
  it("khởi tạo thành công đề thi hợp lệ", () => {
    const exam = new Exam({
      id: "exam-01",
      title: "ETS TOEIC 2026 Test 1",
      durationMinutes: 120,
      status: "PUBLISHED",
      totalQuestions: 200,
      source: "ETS Official",
      description: "Đề thi thử đầy đủ",
    });

    expect(exam.id).toBe("exam-01");
    expect(exam.title).toBe("ETS TOEIC 2026 Test 1");
    expect(exam.durationMinutes).toBe(120);
    expect(exam.status).toBe("PUBLISHED");
    expect(exam.totalQuestions).toBe(200);
    expect(exam.source).toBe("ETS Official");
    expect(exam.createdAt).toBeInstanceOf(Date);
  });

  it("ném InvalidStringError khi id hoặc title rỗng", () => {
    expect(
      () =>
        new Exam({
          id: "",
          title: "TOEIC Test",
          durationMinutes: 120,
          status: "DRAFT",
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "   ",
          durationMinutes: 120,
          status: "DRAFT",
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidNumberError khi durationMinutes không phải số nguyên dương", () => {
    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "Test",
          durationMinutes: 0,
          status: "DRAFT",
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "Test",
          durationMinutes: -10,
          status: "DRAFT",
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "Test",
          durationMinutes: 45.5,
          status: "DRAFT",
        }),
    ).toThrow(InvalidNumberError);
  });

  it("ném InvalidNumberError khi totalQuestions được truyền nhưng không phải số nguyên dương", () => {
    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "Test",
          durationMinutes: 120,
          status: "DRAFT",
          totalQuestions: 0,
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new Exam({
          id: "exam-1",
          title: "Test",
          durationMinutes: 120,
          status: "DRAFT",
          totalQuestions: -5,
        }),
    ).toThrow(InvalidNumberError);
  });
});
