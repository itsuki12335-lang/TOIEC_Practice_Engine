import { DomainError } from "../BaseError/DomainError.js";
// Tránh nộp bài nhiều lần
export class AttemptAlreadySubmitedError extends DomainError {
  constructor() {
    super(`Đã nộp bài thành công trước đó.Không thể nộp nữa`);
  }
}
