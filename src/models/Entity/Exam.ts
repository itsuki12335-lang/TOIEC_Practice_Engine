import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  BaseEntity,
  ExamStatus,
  invalidPositiveNumber,
  invalidString,
} from "../BaseEntity.js";

export interface ExamOption {
  id: string;
  title: string;
  durationMinutes: number;
  status: ExamStatus;
  totalQuestions?: number;
  source?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Exam implements BaseEntity {
  readonly id: string;
  readonly title: string;
  readonly durationMinutes: number;
  readonly status: ExamStatus;
  readonly totalQuestions?: number;
  readonly source?: string;
  readonly description?: string;
  readonly createdAt: Date;
  updatedAt?: Date;

  constructor(options: ExamOption) {
    if (invalidString(options.id)) {
      throw new InvalidStringError("id");
    }
    if (invalidString(options.title)) {
      throw new InvalidStringError("title");
    }
    if (invalidPositiveNumber(options.durationMinutes)) {
      throw new InvalidNumberError(options.durationMinutes);
    }
    if (options.totalQuestions !== undefined) {
      if (invalidPositiveNumber(options.totalQuestions)) {
        throw new InvalidNumberError(options.totalQuestions);
      }
    }
    this.id = options.id;
    this.title = options.title;
    this.durationMinutes = options.durationMinutes;
    this.status = options.status;
    this.totalQuestions = options.totalQuestions;
    this.source = options.source;
    this.description = options.description;
    this.createdAt = options.createdAt ?? new Date();
    this.updatedAt = options.updatedAt;
  }
}
