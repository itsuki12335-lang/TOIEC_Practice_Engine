import { DomainError } from "../BaseError/DomainError.js";
// Không tìm thấy mã đề thi
export class ExamNotFoundError extends DomainError {
  constructor(public readonly examId: string) {
    super(`Không tìm thấy bài kiểm tra có ID : ${examId}`);
  }
}
