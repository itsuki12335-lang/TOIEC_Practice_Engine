import { DomainError } from "../BaseError/DomainError.js";
// Không tìm thấy mã câu hỏi
export class QuestionNotFoundError extends DomainError {
  constructor(public readonly questionId?: string) {
    super(
      questionId
        ? `Không tìm thấy câu hỏi có ID : ${questionId}`
        : `Hiện chưa có câu hỏi nào`,
    );
  }
}
