import { describe, expect, it } from "vitest";
import { Choice } from "../../src/models/Entity/Choice.js";
import { ChoiceLabel } from "../../src/models/BaseEntity.js";
import { InvalidChoiceLabelError } from "../../src/errors/AnswerRecord/InvalidChoiceLabelError.js";
import { InvalidStringError } from "../../src/errors/InvalidError/InvalidStringError.js";

describe("Entity: Choice", () => {
  it("khởi tạo thành công với dữ liệu hợp lệ (có explanation)", () => {
    const choice = new Choice("A", "Đáp án đúng", true, "Vì nó giải thích rõ ràng");
    expect(choice.label).toBe("A");
    expect(choice.text).toBe("Đáp án đúng");
    expect(choice.isCorrect).toBe(true);
    expect(choice.explanation).toBe("Vì nó giải thích rõ ràng");
  });

  it("khởi tạo thành công không có explanation", () => {
    const choice = new Choice("B", "Lựa chọn B", false);
    expect(choice.label).toBe("B");
    expect(choice.text).toBe("Lựa chọn B");
    expect(choice.isCorrect).toBe(false);
    expect(choice.explanation).toBeUndefined();
  });

  it("ném InvalidChoiceLabelError khi nhãn không thuộc A, B, C, D", () => {
    expect(() => new Choice("E" as ChoiceLabel, "Lựa chọn E", false)).toThrow(
      InvalidChoiceLabelError,
    );
    expect(() => new Choice("1" as ChoiceLabel, "Lựa chọn 1", false)).toThrow(
      InvalidChoiceLabelError,
    );
  });

  it("ném InvalidStringError khi text rỗng hoặc chỉ có khoảng trắng", () => {
    expect(() => new Choice("A", "", false)).toThrow(InvalidStringError);
    expect(() => new Choice("A", "   ", false)).toThrow(InvalidStringError);
  });

  it("ném InvalidStringError khi explanation được truyền nhưng rỗng hoặc chỉ có khoảng trắng", () => {
    expect(() => new Choice("A", "Hợp lệ", false, "")).toThrow(InvalidStringError);
    expect(() => new Choice("A", "Hợp lệ", false, "   ")).toThrow(
      InvalidStringError,
    );
  });
});
