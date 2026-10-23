import { DomainError } from "../BaseError/DomainError.js";
// Câu hỏi này không nằm trong đề thi hiện tại
export class QuestionNotInExamError extends DomainError {
  constructor() {
    super(`Câu hỏi không thuộc đề thi hiện tại`);
  }
}
