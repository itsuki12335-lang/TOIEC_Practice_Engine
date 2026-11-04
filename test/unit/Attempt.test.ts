import { describe, expect, it } from "vitest";
import { Attempt } from "../../src/models/Entity/Attempt.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { QuestionNotFoundError } from "../../src/errors/ExamAndQuestionError/QuestionNotFoundError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";
import { InvalidDateError } from "../../src/errors/InvalidError/InvalidDateError.js";

describe("Entity: Attempt", () => {
  const sampleQuestionIds = ["q-1", "q-2", "q-3"];

  it("khởi tạo thành công lượt làm bài ở trạng thái WAITING", () => {
    const attempt = new Attempt({
      id: "att-1",
      learnerId: "l-1",
      examId: "exam-1",
      status: "WAITING",
      mode: "FULL_EXAM",
      questionIds: sampleQuestionIds,
      timeLimitSeconds: 7200,
    });

    expect(attempt.id).toBe("att-1");
    expect(attempt.status).toBe("WAITING");
    expect(attempt.startedAt).toBeNull();
    expect(attempt.submittedAt).toBeNull();
    expect(attempt.questionIds).toEqual(sampleQuestionIds);
  });

  it("khởi tạo thành công lượt làm bài ở trạng thái IN_PROGRESS", () => {
    const start = new Date("2026-10-25T08:00:00.000Z");
    const attempt = new Attempt({
      id: "att-2",
      learnerId: "l-1",
      examId: "exam-1",
      status: "IN_PROGRESS",
      mode: "FULL_EXAM",
      questionIds: sampleQuestionIds,
      createdAt: start,
      startedAt: start,
      currentQuestionIndex: 1,
    });

    expect(attempt.status).toBe("IN_PROGRESS");
    expect(attempt.startedAt).toEqual(start);
    expect(attempt.submittedAt).toBeNull();
    expect(attempt.currentQuestionIndex).toBe(1);
  });

  it("khởi tạo thành công lượt làm bài ở trạng thái SUBMITTED", () => {
    const created = new Date("2026-10-25T08:00:00.000Z");
    const started = new Date("2026-10-25T08:05:00.000Z");
    const submitted = new Date("2026-10-25T09:30:00.000Z");

    const attempt = new Attempt({
      id: "att-3",
      learnerId: "l-1",
      examId: "exam-1",
      status: "SUBMITTED",
      mode: "FULL_EXAM",
      questionIds: sampleQuestionIds,
      createdAt: created,
      startedAt: started,
      submittedAt: submitted,
    });

    expect(attempt.status).toBe("SUBMITTED");
    expect(attempt.startedAt).toEqual(started);
    expect(attempt.submittedAt).toEqual(submitted);
  });

  it("ném InvalidStringError khi id, learnerId, examId rỗng hoặc chứa questionId rỗng", () => {
    expect(
      () =>
        new Attempt({
          id: "",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "   ",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: ["q-1", "  ", "q-3"],
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném QuestionNotFoundError khi mảng questionIds rỗng", () => {
    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: [],
        }),
    ).toThrow(QuestionNotFoundError);
  });

  it("ném InvalidNumberError khi timeLimitSeconds hoặc currentQuestionIndex không hợp lệ", () => {
    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
          timeLimitSeconds: 0,
        }),
    ).toThrow(InvalidNumberError);

    // currentQuestionIndex < 0
    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
          currentQuestionIndex: -1,
        }),
    ).toThrow(InvalidNumberError);

    // currentQuestionIndex vượt quá độ dài questionIds (sampleQuestionIds length = 3)
    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "WAITING",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
          currentQuestionIndex: 4,
        }),
    ).toThrow(InvalidNumberError);
  });

  it("ném InvalidDateError khi startedAt sớm hơn createdAt", () => {
    const created = new Date("2026-10-25T08:00:00.000Z");
    const invalidStarted = new Date("2026-10-25T07:59:00.000Z");

    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "IN_PROGRESS",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
          createdAt: created,
          startedAt: invalidStarted,
        }),
    ).toThrow(InvalidDateError);
  });

  it("ném InvalidDateError khi submittedAt sớm hơn startedAt", () => {
    const created = new Date("2026-10-25T08:00:00.000Z");
    const started = new Date("2026-10-25T08:10:00.000Z");
    const invalidSubmitted = new Date("2026-10-25T08:05:00.000Z");

    expect(
      () =>
        new Attempt({
          id: "att-1",
          learnerId: "l-1",
          examId: "exam-1",
          status: "SUBMITTED",
          mode: "FULL_EXAM",
          questionIds: sampleQuestionIds,
          createdAt: created,
          startedAt: started,
          submittedAt: invalidSubmitted,
        }),
    ).toThrow(InvalidDateError);
  });
});
