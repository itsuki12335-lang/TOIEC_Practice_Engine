import { DomainError } from "../BaseError/DomainError.js";
// Lỗi chọn đáp án không hợp lệ
export class InvalidChoiceLabelError extends DomainError {
  constructor(public readonly ans: number | string) {
    super(`Đáp án ${ans} không hợp lệ . Chỉ được chọn A , B , C ,D`);
  }
}
