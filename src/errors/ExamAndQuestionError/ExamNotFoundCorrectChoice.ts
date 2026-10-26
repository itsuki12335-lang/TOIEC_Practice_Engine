import { DomainError } from "../BaseError/DomainError.js";
// Lỗi 1 câu không có đáp án đúng nào
export class ExamNotFoundCorrectChoiceError extends DomainError {
  constructor() {
    super(`Một câu hỏi không được phép không có đáp án đúng nào`);
  }
}
