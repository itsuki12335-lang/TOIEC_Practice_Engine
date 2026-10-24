import { DomainError } from "../BaseError/DomainError.js";
// Lỗi chuỗi rỗng
export class InvalidStringError extends DomainError {
  constructor(readonly str?: string) {
    super(
      str
        ? `Chuỗi hiện tại không hợp lệ.Hãy nhập vào chuỗi phù hợp.Chuỗi hiện tại :${str}`
        : `Chuỗi hiện tại không hợp lệ`,
    );
  }
}
