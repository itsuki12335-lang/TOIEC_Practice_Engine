import { DomainError } from "../BaseError/DomainError.js";
// Lỗi không tìm thấy người dùng
export class LearnerNotFoundError extends DomainError {
  constructor(public readonly learnerId: string) {
    super(`Không tìm thấy người dùng có ID : ${learnerId}`);
    this.learnerId = learnerId;
  }
}
