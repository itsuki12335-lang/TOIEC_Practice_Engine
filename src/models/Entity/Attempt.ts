import { QuestionNotFoundError } from "../../errors/ExamAndQuestionError/QuestionNotFoundError.js";
import { InvalidDateError } from "../../errors/InvalidError/InvalidDateError.js";
import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  AttemptMode,
  AttemptStatus,
  BaseEntity,
  invalidPositiveNumber,
  invalidString,
  PartNumber,
} from "../BaseEntity.js";

export interface AttemptOption {
  id: string;
  learnerId: string;
  examId: string;
  status: AttemptStatus;
  createdAt?: Date;
  startedAt?: Date | null;
  mode: AttemptMode;
  submittedAt?: Date | null;
  partFilter?: PartNumber[];
  questionIds: string[];
  timeLimitSeconds?: number;
  currentQuestionIndex?: number;
}
export class Attempt implements BaseEntity {
  readonly id: string;
  readonly learnerId: string;
  readonly examId: string;
  status: AttemptStatus;
  readonly createdAt: Date;
  startedAt: Date | null;
  mode: AttemptMode;
  submittedAt: Date | null;
  partFilter?: PartNumber[];
  questionIds: string[];
  readonly timeLimitSeconds?: number;
  currentQuestionIndex?: number;

  constructor(options: AttemptOption) {
    if (invalidString(options.id)) throw new InvalidStringError("id");
    if (invalidString(options.learnerId))
      throw new InvalidStringError("learnerId");
    if (invalidString(options.examId)) throw new InvalidStringError("examId");
    if (options.questionIds.length === 0) throw new QuestionNotFoundError();
    for (const temp of options.questionIds) {
      if (invalidString(temp)) throw new InvalidStringError("questionId");
    }
    if (
      options.timeLimitSeconds !== undefined &&
      invalidPositiveNumber(options.timeLimitSeconds)
    )
      throw new InvalidNumberError(options.timeLimitSeconds);
    if (
      options.currentQuestionIndex !== undefined &&
      (options.currentQuestionIndex < 0 ||
        !Number.isInteger(options.currentQuestionIndex) ||
        options.currentQuestionIndex > options.questionIds.length)
    )
      throw new InvalidNumberError(options.currentQuestionIndex);
    this.createdAt = options.createdAt ?? new Date();
    if (options.status === "WAITING") {
      this.startedAt = null;
      this.submittedAt = null;
    } else {
      this.startedAt = options.startedAt ?? this.createdAt;
      if (this.startedAt.getTime() - this.createdAt.getTime() < 0)
        throw new InvalidDateError(this.startedAt, this.createdAt);
      if (options.status === "SUBMITTED") {
        this.submittedAt = options.submittedAt ?? new Date();
        if (this.submittedAt.getTime() - this.startedAt.getTime() < 0)
          throw new InvalidDateError(this.submittedAt, this.startedAt);
      } else this.submittedAt = null;
    }
    this.id = options.id;
    this.learnerId = options.learnerId;
    this.examId = options.examId;
    this.status = options.status;
    this.mode = options.mode;
    this.partFilter = options.partFilter;
    this.questionIds = options.questionIds;
    this.timeLimitSeconds = options.timeLimitSeconds;
    this.currentQuestionIndex = options.currentQuestionIndex;
  }
}
