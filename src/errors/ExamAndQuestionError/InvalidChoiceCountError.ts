import { PartNumber } from "../../models/BaseEntity.js";
import { DomainError } from "../BaseError/DomainError.js";
// Số lượng đáp án không đúng với chuẩn TOEIC
// 3 đáp án ở Part 2 , 4 ở các Part còn lại
export interface InvalidChoiceCountErrorContext {
  readonly part: PartNumber;
  readonly numAns: number;
  readonly expectNum: 3 | 4;
}

export class InvalidChoiceCountError extends DomainError {
  constructor(public readonly context?: InvalidChoiceCountErrorContext) {
    super(
      !context
        ? `Số lượng đáp án không hợp lệ`
        : `Ở Part ${context.part} cần ${context.expectNum} đáp án , bạn đã nhập ${context.numAns} đáp án`,
    );
  }
}
