import { describe, expect, it } from "vitest";
import { AnswerRecord } from "../../src/models/Entity/AnswerRecord.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";

describe("Entity: AnswerRecord", () => {
  it("khởi tạo thành công khi thí sinh đã chọn đáp án", () => {
    const record = new AnswerRecord({
      id: "ans-1",
      attemptId: "att-1",
      questionId: "q-1",
      selectedLabel: "B",
      isCorrect: true,
      timeSpentSeconds: 45,
      isFlagged: true,
      changeCount: 1,
    });

    expect(record.id).toBe("ans-1");
    expect(record.selectedLabel).toBe("B");
    expect(record.isCorrect).toBe(true);
    expect(record.timeSpentSeconds).toBe(45);
    expect(record.isFlagged).toBe(true);
    expect(record.changeCount).toBe(1);
    expect(record.answeredAt).toBeInstanceOf(Date);
  });

  it("xử lý đúng khi thí sinh bỏ trống (selectedLabel: null)", () => {
    const record = new AnswerRecord({
      id: "ans-2",
      attemptId: "att-1",
      questionId: "q-2",
      selectedLabel: null,
      isCorrect: true, // cố tình truyền true để test
    });

    expect(record.selectedLabel).toBeNull();
    // Bỏ trống thì bắt buộc isCorrect = false và answeredAt = null
    expect(record.isCorrect).toBe(false);
    expect(record.answeredAt).toBeNull();
    expect(record.isFlagged).toBe(false); // default
  });

  it("ném InvalidStringError khi id, attemptId, questionId rỗng", () => {
    expect(
      () =>
        new AnswerRecord({
          id: "",
          attemptId: "att-1",
          questionId: "q-1",
          selectedLabel: "A",
          isCorrect: true,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new AnswerRecord({
          id: "ans-1",
          attemptId: "   ",
          questionId: "q-1",
          selectedLabel: "A",
          isCorrect: true,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new AnswerRecord({
          id: "ans-1",
          attemptId: "att-1",
          questionId: "",
          selectedLabel: "A",
          isCorrect: true,
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidNumberError khi timeSpentSeconds hoặc changeCount âm hoặc số lẻ", () => {
    expect(
      () =>
        new AnswerRecord({
          id: "ans-1",
          attemptId: "att-1",
          questionId: "q-1",
          selectedLabel: "A",
          isCorrect: true,
          timeSpentSeconds: -10,
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new AnswerRecord({
          id: "ans-1",
          attemptId: "att-1",
          questionId: "q-1",
          selectedLabel: "A",
          isCorrect: true,
          timeSpentSeconds: 12.5,
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new AnswerRecord({
          id: "ans-1",
          attemptId: "att-1",
          questionId: "q-1",
          selectedLabel: "A",
          isCorrect: true,
          changeCount: -1,
        }),
    ).toThrow(InvalidNumberError);
  });
});
