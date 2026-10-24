import { Section } from "../../models/BaseEntity.js";
import { DomainError } from "../BaseError/DomainError.js";
export interface ScoreTableConfigErrorContext {
  readonly section: Section;
  readonly rawScore: number;
}
// Lỗi thiếu cấu hình file nộp bài
export class ScoreTableConfigError extends DomainError {
  constructor(context?: ScoreTableConfigErrorContext) {
    super(
      !context
        ? `Bảng cấu hình quy đổi điểm TOEIC không hợp lệ hoặc chưa được nạp vào hệ thống`
        : `Không tìm thấy điểm quy đổi cho ${context.rawScore} câu đúng của phần thi ${context.section} trong bảng cấu hình điểm TOEIC.`,
    );
  }
}
