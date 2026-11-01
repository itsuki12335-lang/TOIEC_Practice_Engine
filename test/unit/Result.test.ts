import { describe, expect, it } from "vitest";
import { Result } from "../../src/models/Entity/Result.js";
import { PartNumber } from "../../src/models/BaseEntity.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";
import { InvalidResultQuestionError } from "../../src/errors/GradingAndResult/InvalidResultQuestionError.js";
import { InvalidNumberError } from "../../src/errors/InvalidError/InvalidNumberError.js";
import { InvalidScaledError } from "../../src/errors/GradingAndResult/InvalidScaledError.js";
import { InvalidNonNegativeNumberError } from "../../src/errors/InvalidError/InvalidNonNegativeNumber.js";

describe("Entity: Result", () => {
  // Bộ dữ liệu mẫu chuẩn hợp lệ
  const validCorrectByPart: Record<PartNumber, number> = {
    1: 5,  // max 6
    2: 20, // max 25
    3: 30, // max 39
    4: 25, // max 30  -> totalLis = 80
    5: 25, // max 30
    6: 10, // max 16
    7: 40, // max 54  -> totalRead = 75
  };

  const validAccuracyByPart: Record<PartNumber, number> = {
    1: (5 / 6) * 100,
    2: (20 / 25) * 100,
    3: (30 / 39) * 100,
    4: (25 / 30) * 100,
    5: (25 / 30) * 100,
    6: (10 / 16) * 100,
    7: (40 / 54) * 100,
  };

  it("khởi tạo thành công kết quả thi TOEIC hợp lệ", () => {
    const result = new Result({
      id: "res-1",
      attemptId: "att-1",
      correctByPart: validCorrectByPart,
      listeningRaw: 80,
      readingRaw: 75,
      listeningScaled: 415,
      readingScaled: 365,
      totalScaled: 780, // 415 + 365
      totalQuestion: 200,
      unansweredCount: 10,
      accuracyByPart: validAccuracyByPart,
      totalTimeSecond: 5400,
    });

    expect(result.id).toBe("res-1");
    expect(result.listeningRaw).toBe(80);
    expect(result.readingRaw).toBe(75);
    expect(result.totalScaled).toBe(780);
    expect(result.gradedAt).toBeInstanceOf(Date);
  });

  it("ném InvalidStringError khi id hoặc attemptId để trống", () => {
    expect(
      () =>
        new Result({
          id: "",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidStringError);

    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "   ",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidStringError);
  });

  it("ném InvalidResultQuestionError khi số câu đúng của 1 Part bị âm hoặc vượt quá số câu của Part đó", () => {
    // Part 1 chỉ có 6 câu nhưng làm đúng 7 câu
    const invalidPart1 = { ...validCorrectByPart, 1: 7 };
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: invalidPart1,
          listeningRaw: 82,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);

    // Part 2 bị âm
    const negativePart2 = { ...validCorrectByPart, 2: -1 };
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: negativePart2,
          listeningRaw: 59,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);
  });

  it("ném InvalidNumberError khi accuracyByPart có giá trị ngoài khoảng 0 - 100", () => {
    const invalidAcc = { ...validAccuracyByPart, 1: 105 };
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: invalidAcc,
        }),
    ).toThrow(InvalidNumberError);

    const negativeAcc = { ...validAccuracyByPart, 1: -5 };
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: negativeAcc,
        }),
    ).toThrow(InvalidNumberError);
  });

  it("ném InvalidResultQuestionError khi listeningRaw hoặc readingRaw lệch với tổng câu đúng các Part", () => {
    // totalLis thực tế = 80 nhưng truyền 85
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 85,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);

    // totalRead thực tế = 75 nhưng truyền 70
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 70,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);
  });

  it("ném InvalidScaledError khi listeningScaled hoặc readingScaled ngoài 5 - 495 hoặc không chia hết cho 5", () => {
    // listeningScaled = 0 (nhỏ nhất là 5)
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 0,
          readingScaled: 365,
          totalScaled: 365,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidScaledError);

    // readingScaled = 500 (lớn nhất là 495)
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 500,
          totalScaled: 915,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidScaledError);

    // Không chia hết cho 5
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 412,
          readingScaled: 365,
          totalScaled: 777,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidScaledError);
  });

  it("ném InvalidScaledError khi totalScaled lệch tổng điểm 2 phần hoặc không theo chuẩn TOEIC", () => {
    // 415 + 365 = 780 nhưng truyền 800
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 800,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidScaledError);

    // Không chia hết cho 5
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 781,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidScaledError);
  });

  it("ném InvalidResultQuestionError khi totalQuestion nhỏ hơn tổng số câu làm đúng hoặc > 200", () => {
    // totalLis + totalRead = 155 nhưng totalQuestion chỉ có 150
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          totalQuestion: 150,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);

    // totalQuestion > 200
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          totalQuestion: 205,
          accuracyByPart: validAccuracyByPart,
        }),
    ).toThrow(InvalidResultQuestionError);
  });

  it("ném InvalidNonNegativeNumberError khi unansweredCount hoặc totalTimeSecond bị âm", () => {
    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
          unansweredCount: -1,
        }),
    ).toThrow(InvalidNonNegativeNumberError);

    expect(
      () =>
        new Result({
          id: "res-1",
          attemptId: "att-1",
          correctByPart: validCorrectByPart,
          listeningRaw: 80,
          readingRaw: 75,
          listeningScaled: 415,
          readingScaled: 365,
          totalScaled: 780,
          accuracyByPart: validAccuracyByPart,
          totalTimeSecond: -100,
        }),
    ).toThrow(InvalidNonNegativeNumberError);
  });
});
