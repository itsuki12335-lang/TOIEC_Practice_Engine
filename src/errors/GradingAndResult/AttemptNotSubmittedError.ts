import { DomainError } from "../BaseError/DomainError.js";
// Lỗi chưa nộp bài kiểm tra
export class AttemptNotSubmittedError extends DomainError {
  constructor() {
    super(`Bài kiểm tra chưa được nộp. Không thể chấm điểm`);
  }
}
