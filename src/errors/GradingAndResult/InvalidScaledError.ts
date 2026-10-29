import { DomainError } from "../BaseError/DomainError.js";

export class InvalidScaledError extends DomainError {
  constructor(inputScore: number) {
    super(`Lỗi điểm không phù hợp : ${inputScore}`);
  }
}
