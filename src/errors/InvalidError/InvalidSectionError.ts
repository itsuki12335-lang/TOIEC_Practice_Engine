import { DomainError } from "../BaseError/DomainError.js";

export class InvalidSectionError extends DomainError {
  constructor(num: number) {
    super(
      `Section phải là số nguyên dương từ 1 đến 7 . Số hiện tại không hợp lệ : ${num}`,
    );
  }
}
