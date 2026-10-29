import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  BaseEntity,
  ChoiceLabel,
  invalidNonNegativeNumber,
  invalidString,
} from "../BaseEntity.js";

export interface AnswerRecordOption {
  id: string;
  attemptId: string;
  questionId: string;
  selectedLabel: ChoiceLabel | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
  answeredAt?: Date | null;
  isFlagged?: boolean;
  changeCount?: number;
}

export class AnswerRecord implements BaseEntity {
  readonly id: string;
  readonly attemptId: string;
  readonly questionId: string;
  readonly selectedLabel: ChoiceLabel | null;
  readonly isCorrect: boolean;
  readonly timeSpentSeconds?: number;
  readonly answeredAt?: Date | null;
  readonly isFlagged: boolean;
  readonly changeCount?: number;

  constructor(options: AnswerRecordOption) {
    if (invalidString(options.id)) throw new InvalidStringError("id");
    if (invalidString(options.attemptId))
      throw new InvalidStringError("attemptId");
    if (invalidString(options.questionId))
      throw new InvalidStringError("questionId");
    if (options.selectedLabel === null) {
      this.isCorrect = false;
      this.answeredAt = null;
    } else {
      this.isCorrect = options.isCorrect;
      this.answeredAt = options.answeredAt ?? new Date();
    }
    if (
      options.timeSpentSeconds !== undefined &&
      invalidNonNegativeNumber(options.timeSpentSeconds)
    )
      throw new InvalidNumberError(options.timeSpentSeconds);
    if (
      options.changeCount !== undefined &&
      invalidNonNegativeNumber(options.changeCount)
    )
      throw new InvalidNumberError(options.changeCount);

    this.id = options.id;
    this.attemptId = options.attemptId;
    this.questionId = options.questionId;
    this.selectedLabel = options.selectedLabel;
    this.timeSpentSeconds = options.timeSpentSeconds;
    this.isFlagged = options.isFlagged ?? false;
    this.changeCount = options.changeCount;
  }
}
