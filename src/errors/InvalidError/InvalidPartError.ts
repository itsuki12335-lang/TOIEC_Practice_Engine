import { DomainError } from "../BaseError/DomainError.js";

export class InvalidPartError extends DomainError {
  constructor(num?: number) {
    super(
      num !== undefined
        ? `Part phải là số nguyên dương từ 1 đến 7.Part hiện tại ${num}`
        : `Part phải là số nguyên dương`,
    );
  }
}
