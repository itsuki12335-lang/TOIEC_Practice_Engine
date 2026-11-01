import { describe, expect, it } from "vitest";
import {
  invalidNonNegativeNumber,
  invalidPositiveNumber,
  invalidSectionScore,
  invalidString,
  invalidTOEICScore,
} from "../../src/models/BaseEntity.js";

describe("BaseEntity Helper Functions", () => {
  describe("invalidString", () => {
    it("trả về true khi chuỗi rỗng hoặc chỉ có khoảng trắng", () => {
      expect(invalidString("")).toBe(true);
      expect(invalidString("   ")).toBe(true);
      expect(invalidString("\t\n")).toBe(true);
    });

    it("trả về false khi chuỗi có ký tự hợp lệ", () => {
      expect(invalidString("a")).toBe(false);
      expect(invalidString("  abc  ")).toBe(false);
      expect(invalidString("TOEIC Test")).toBe(false);
    });
  });

  describe("invalidPositiveNumber", () => {
    it("trả về true khi số nhỏ hơn 1 hoặc không phải số nguyên", () => {
      expect(invalidPositiveNumber(0)).toBe(true);
      expect(invalidPositiveNumber(-5)).toBe(true);
      expect(invalidPositiveNumber(1.5)).toBe(true);
      expect(invalidPositiveNumber(-0.1)).toBe(true);
    });

    it("trả về false khi số là số nguyên dương >= 1", () => {
      expect(invalidPositiveNumber(1)).toBe(false);
      expect(invalidPositiveNumber(100)).toBe(false);
      expect(invalidPositiveNumber(200)).toBe(false);
    });
  });

  describe("invalidTOEICScore", () => {
    it("trả về true khi điểm ngoài khoảng 10 - 990", () => {
      expect(invalidTOEICScore(9)).toBe(true);
      expect(invalidTOEICScore(0)).toBe(true);
      expect(invalidTOEICScore(-10)).toBe(true);
      expect(invalidTOEICScore(991)).toBe(true);
      expect(invalidTOEICScore(1000)).toBe(true);
    });

    it("trả về true khi điểm không chia hết cho 5 hoặc không phải số nguyên", () => {
      expect(invalidTOEICScore(12)).toBe(true);
      expect(invalidTOEICScore(503)).toBe(true);
      expect(invalidTOEICScore(500.5)).toBe(true);
    });

    it("trả về false khi điểm hợp lệ từ 10 đến 990 và là bội số của 5", () => {
      expect(invalidTOEICScore(10)).toBe(false);
      expect(invalidTOEICScore(15)).toBe(false);
      expect(invalidTOEICScore(500)).toBe(false);
      expect(invalidTOEICScore(750)).toBe(false);
      expect(invalidTOEICScore(990)).toBe(false);
    });
  });

  describe("invalidNonNegativeNumber", () => {
    it("trả về true khi số âm hoặc không phải số nguyên", () => {
      expect(invalidNonNegativeNumber(-1)).toBe(true);
      expect(invalidNonNegativeNumber(-100)).toBe(true);
      expect(invalidNonNegativeNumber(0.5)).toBe(true);
      expect(invalidNonNegativeNumber(2.99)).toBe(true);
    });

    it("trả về false khi số nguyên không âm (>= 0)", () => {
      expect(invalidNonNegativeNumber(0)).toBe(false);
      expect(invalidNonNegativeNumber(1)).toBe(false);
      expect(invalidNonNegativeNumber(100)).toBe(false);
    });
  });

  describe("invalidSectionScore", () => {
    it("trả về true khi điểm thành phần ngoài khoảng 5 - 495", () => {
      expect(invalidSectionScore(0)).toBe(true);
      expect(invalidSectionScore(4)).toBe(true);
      expect(invalidSectionScore(-5)).toBe(true);
      expect(invalidSectionScore(496)).toBe(true);
      expect(invalidSectionScore(500)).toBe(true);
    });

    it("trả về true khi điểm không chia hết cho 5 hoặc không phải số nguyên", () => {
      expect(invalidSectionScore(7)).toBe(true);
      expect(invalidSectionScore(252)).toBe(true);
      expect(invalidSectionScore(300.5)).toBe(true);
    });

    it("trả về false khi điểm hợp lệ từ 5 đến 495 và chia hết cho 5", () => {
      expect(invalidSectionScore(5)).toBe(false);
      expect(invalidSectionScore(10)).toBe(false);
      expect(invalidSectionScore(250)).toBe(false);
      expect(invalidSectionScore(490)).toBe(false);
      expect(invalidSectionScore(495)).toBe(false);
    });
  });
});
