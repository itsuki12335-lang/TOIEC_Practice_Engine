import { DomainError } from "../BaseError/DomainError.js";
// Lỗi chuỗi rỗng
export class InvalidStringError extends DomainError {
  constructor(readonly str?: string) {
    super(str ? `${str} không được để trống` : `Chuỗi hiện tại không hợp lệ`);
  }
}
