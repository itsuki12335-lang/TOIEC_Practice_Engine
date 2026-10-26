import { DomainError } from "../BaseError/DomainError.js";

export class InvalidDateError extends DomainError {
  constructor(examDate: Date, currentDate: Date) {
    super(
      `Ngày thi dự kiến ${examDate} không hợp lệ . Ngày thi dự kiến phải lớn hơn ${currentDate} `,
    );
  }
}
