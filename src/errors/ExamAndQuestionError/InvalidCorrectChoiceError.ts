import { DomainError } from "../BaseError/DomainError.js";
// Số lượng đáp án đúng của 1 câu khác 1
export class InvalidCorrectChoiceError extends DomainError {
  constructor() {
    super(`Một câu hỏi chỉ được phép có duy nhất 1 đáp án đúng`);
  }
}
