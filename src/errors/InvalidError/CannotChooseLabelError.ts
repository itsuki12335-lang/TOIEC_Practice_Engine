import { DomainError } from "../BaseError/DomainError.js";

export class CannotChooseLabelError extends DomainError {
  constructor() {
    super(`Không thể chọn đáp án vì đang không trong kì kiểm tra`);
  }
}
