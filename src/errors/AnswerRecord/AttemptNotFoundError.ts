import { DomainError } from "../BaseError/DomainError.js";
// Lỗi nhập vào mã lần thi không tồn tại
export class AttemptNotFoundError extends DomainError {
  constructor(public readonly attemptId: string) {
    super(`Không tồn tại mã lượt thi có ID :${attemptId}`);
  }
}
