import { DomainError } from "../BaseError/DomainError.js";

export class InvalidScoreTOEICError extends DomainError {
  constructor(inputNum?: number) {
    super(
      inputNum !== undefined
        ? `Yêu cầu nhập vào 1 số nguyên từ 10 đến 990 và phải chia hết cho 5 , số hiện tại :${inputNum}`
        : `Yêu cầu nhập vào 1 số nguyên từ 10 đến 990 và phải chia hết cho 5`,
    );
  }
}
