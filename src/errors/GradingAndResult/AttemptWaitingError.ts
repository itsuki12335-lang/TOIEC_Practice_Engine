import { DomainError } from "../BaseError/DomainError.js";

export class AttemptWaitingError extends DomainError {
  constructor() {
    super(`Chưa tới giờ.Thử lại sau`);
  }
}
