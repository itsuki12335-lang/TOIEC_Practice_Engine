import { DomainError } from "../BaseError/DomainError.js";

export class QuestionNotInExamError extends DomainError {
  constructor() {
    super(`Câu hỏi không thuộc đề thi hiện tại`);
  }
}
