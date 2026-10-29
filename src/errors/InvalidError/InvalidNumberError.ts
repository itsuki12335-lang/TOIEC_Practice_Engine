import { DomainError } from "../BaseError/DomainError.js";
// Lỗi không phải số nguyên dương
export class InvalidNumberError extends DomainError {
  constructor(readonly num?: number) {
    super(
      num !== undefined
        ? `Phải là số nguyên dương.Số hiện tại : ${num}`
        : `Phải là số dương nằm trong khoảng từ 0 - 100`,
    );
  }
}
