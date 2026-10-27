import { DomainError } from "../BaseError/DomainError.js";

export class InvalidDateError extends DomainError {
  constructor(inputDate: Date, minDate: Date) {
    super(
      `Mốc thời gian ${inputDate} không hợp lệ. Thời gian này không được nhỏ hơn mốc ${minDate}.`,
    );
  }
}
