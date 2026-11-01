import { describe, expect, it } from "vitest";
import { QuestionGroup } from "../../src/models/Entity/QuestionGroup.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";

describe("Entity: QuestionGroup", () => {
  it("khởi tạo thành công nhóm câu hỏi hợp lệ", () => {
    const group = new QuestionGroup({
      id: "grp-1",
      examId: "exam-1",
      part: 3,
      passage: "W: Good morning...\nM: Hi...",
      order: 1,
      passageType: "conversation",
    });

    expect(group.id).toBe("grp-1");
    expect(group.examId).toBe("exam-1");
    expect(group.part).toBe(3);
    expect(group.passage).toContain("Good morning");
    expect(group.order).toBe(1);
    expect(group.passageType).toBe("conversation");
    expect(group.createdAt).toBeInstanceOf(Date);
  });

  it("ném InvalidStringError khi id, examId, passage để trống", () => {
    expect(
      () =>
        new QuestionGroup({
          id: "",
          examId: "exam-1",
          part: 7,
          passage: "Valid passage",
          order: 1,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "   ",
          part: 7,
          passage: "Valid passage",
          order: 1,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "exam-1",
          part: 7,
          passage: "",
          order: 1,
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidStringError khi passageType được truyền nhưng rỗng", () => {
    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "exam-1",
          part: 7,
          passage: "Passage",
          order: 1,
          passageType: "   ",
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidNumberError khi order <= 0 hoặc không phải số nguyên", () => {
    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "exam-1",
          part: 7,
          passage: "Passage",
          order: 0,
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "exam-1",
          part: 7,
          passage: "Passage",
          order: -2,
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new QuestionGroup({
          id: "grp-1",
          examId: "exam-1",
          part: 7,
          passage: "Passage",
          order: 1.5,
        }),
    ).toThrow(InvalidNumberError);
  });
});
