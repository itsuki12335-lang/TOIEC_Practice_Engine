import { DomainError } from "../BaseError/DomainError.js";

export class ResultNotFoundError extends DomainError {
  constructor(public readonly attemptId?: string) {
    super(
      !attemptId
        ? `Không tìm thấy kết quả của bài thi yêu cầu`
        : `Không tìm thấy kết quả thi cho lượt làm bài: ${attemptId}`,
    );
  }
}
