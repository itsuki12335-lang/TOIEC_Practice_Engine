import { DomainError } from "../BaseError/DomainError.js";

export class InvalidNonNegativeNumberError extends DomainError {
  constructor(inputNum?: number) {
    super(
      inputNum
        ? `Phải là số nguyên không âm : ${inputNum}`
        : `Phải là số nguyên không âm`,
    );
  }
}
