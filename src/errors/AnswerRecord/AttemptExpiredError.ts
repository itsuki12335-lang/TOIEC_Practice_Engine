import { DomainError } from "../BaseError/DomainError.js";
// Lỗi nộp bài khi đã hết giờ làm bài
export class AttemptAlreadySubmitedError extends DomainError {
  constructor() {
    super(`Đã hết giờ nộp bài`);
  }
}
