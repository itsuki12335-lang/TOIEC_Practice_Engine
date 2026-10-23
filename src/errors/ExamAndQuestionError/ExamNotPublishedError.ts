import { DomainError } from "../BaseError/DomainError.js";
// Bài thi chưa ở trạng thái Public
export class ExamNotPublishedError extends DomainError {
  constructor() {
    super(`Bài thi này chưa khả dụng`);
  }
}
