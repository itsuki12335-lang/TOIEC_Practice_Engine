import { describe, expect, it } from "vitest";
import { Question } from "../../src/models/Entity/Question.js";
import { Choice } from "../../src/models/Entity/Choice.js";
import { PartNumber } from "../../src/models/BaseEntity.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";
import { InvalidPartError } from "../../src/errors/InvalidError/InvalidPartError.js";
import { InvalidChoiceCountError } from "../../src/errors/ExamAndQuestionError/InvalidChoiceCountError.js";
import { InvalidChoiceLabelError } from "../../src/errors/AnswerRecord/InvalidChoiceLabelError.js";
import { InvalidCorrectChoiceError } from "../../src/errors/ExamAndQuestionError/InvalidCorrectChoiceError.js";

describe("Entity: Question", () => {
  const createValid4Choices = (correctLabel: "A" | "B" | "C" | "D" = "B"): Choice[] => [
    new Choice("A", "Option A", correctLabel === "A"),
    new Choice("B", "Option B", correctLabel === "B"),
    new Choice("C", "Option C", correctLabel === "C"),
    new Choice("D", "Option D", correctLabel === "D"),
  ];

  const createValid3Choices = (correctLabel: "A" | "B" | "C" = "A"): Choice[] => [
    new Choice("A", "Option A", correctLabel === "A"),
    new Choice("B", "Option B", correctLabel === "B"),
    new Choice("C", "Option C", correctLabel === "C"),
  ];

  it("khởi tạo thành công câu hỏi 4 lựa chọn (Part 1, 3, 4, 5, 6, 7)", () => {
    const q = new Question({
      id: "q-1",
      examId: "exam-1",
      part: 5,
      order: 101,
      content: "Choose the correct word...",
      choices: createValid4Choices("C"),
      explanation: "Giải thích câu 101",
      topicIds: ["grammar", "vocabulary"],
      difficulty: 2,
    });

    expect(q.id).toBe("q-1");
    expect(q.part).toBe(5);
    expect(q.order).toBe(101);
    expect(q.choices.length).toBe(4);
    expect(q.correctChoice.label).toBe("C");
    expect(q.getCorrectChoice().label).toBe("C");
    expect(q.createdAt).toBeInstanceOf(Date);
  });

  it("khởi tạo thành công câu hỏi Part 2 (3 lựa chọn A, B, C)", () => {
    const q = new Question({
      id: "q-part2",
      examId: "exam-1",
      part: 2,
      order: 7,
      content: "Where is the meeting?",
      choices: createValid3Choices("B"),
    });

    expect(q.part).toBe(2);
    expect(q.choices.length).toBe(3);
    expect(q.correctChoice.label).toBe("B");
    expect(q.getCorrectChoice().label).toBe("B");
  });

  it("ném InvalidStringError khi id, examId, content rỗng", () => {
    expect(
      () =>
        new Question({
          id: "",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid content",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "   ",
          part: 5,
          order: 1,
          content: "Valid content",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidNumberError khi order không phải số nguyên dương", () => {
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 0,
          content: "Valid content",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: -1,
          content: "Valid content",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidNumberError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 2.5,
          content: "Valid content",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidNumberError);
  });

  it("ném InvalidPartError khi part ngoài 1 đến 7", () => {
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 0 as PartNumber,
          order: 1,
          content: "Valid",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidPartError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 8 as PartNumber,
          order: 1,
          content: "Valid",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidPartError);
  });

  it("ném InvalidChoiceCountError khi số lượng lựa chọn không khớp chuẩn Part", () => {
    // Part 5 yêu cầu 4 nhưng chỉ truyền 3
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: createValid3Choices(),
        }),
    ).toThrow(InvalidChoiceCountError);

    // Part 2 yêu cầu 3 nhưng lại truyền 4
    expect(
      () =>
        new Question({
          id: "q-part2",
          examId: "exam-1",
          part: 2,
          order: 7,
          content: "Valid",
          choices: createValid4Choices(),
        }),
    ).toThrow(InvalidChoiceCountError);
  });

  it("ném InvalidChoiceLabelError khi Part 2 chứa nhãn 'D'", () => {
    // Part 2 có 3 lựa chọn nhưng lại gồm A, B, D (thiếu C)
    const choicesWithD: Choice[] = [
      new Choice("A", "Op A", true),
      new Choice("B", "Op B", false),
      new Choice("D", "Op D", false),
    ];

    expect(
      () =>
        new Question({
          id: "q-part2",
          examId: "exam-1",
          part: 2,
          order: 7,
          content: "Valid",
          choices: choicesWithD,
        }),
    ).toThrow(InvalidChoiceLabelError);
  });

  it("ném InvalidChoiceLabelError khi trùng lặp nhãn lựa chọn (ví dụ 2 đáp án A)", () => {
    const duplicateLabels: Choice[] = [
      new Choice("A", "Option A1", true),
      new Choice("A", "Option A2", false),
      new Choice("B", "Option B", false),
      new Choice("C", "Option C", false),
    ];

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: duplicateLabels,
        }),
    ).toThrow(InvalidChoiceLabelError);
  });

  it("ném InvalidCorrectChoiceError khi không có đáp án đúng nào hoặc có nhiều hơn 1 đáp án đúng", () => {
    // 0 đáp án đúng
    const noCorrect: Choice[] = [
      new Choice("A", "A", false),
      new Choice("B", "B", false),
      new Choice("C", "C", false),
      new Choice("D", "D", false),
    ];
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: noCorrect,
        }),
    ).toThrow(InvalidCorrectChoiceError);

    // 2 đáp án đúng
    const twoCorrect: Choice[] = [
      new Choice("A", "A", true),
      new Choice("B", "B", true),
      new Choice("C", "C", false),
      new Choice("D", "D", false),
    ];
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: twoCorrect,
        }),
    ).toThrow(InvalidCorrectChoiceError);
  });

  it("ném InvalidStringError khi groupIds, explanation hoặc topicIds chứa chuỗi rỗng", () => {
    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: createValid4Choices(),
          groupIds: "   ",
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: createValid4Choices(),
          explanation: "",
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Question({
          id: "q-1",
          examId: "exam-1",
          part: 5,
          order: 1,
          content: "Valid",
          choices: createValid4Choices(),
          topicIds: ["grammar", ""],
        }),
    ).toThrow(InvalidStringError);
  });
});
