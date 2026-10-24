import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import { BaseEntity, ExamStatus } from "../BaseEntity.js";

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
    if (options.id.trim() === "") {
      throw new InvalidStringError("id");
    }
    if (options.title.trim() === "") {
      throw new InvalidStringError("title");
    }
    if (
      !Number.isInteger(options.durationMinutes) ||
      options.durationMinutes <= 0
    ) {
      throw new InvalidNumberError(options.durationMinutes);
    }
    if (options.totalQuestions !== undefined) {
      if (
        !Number.isInteger(options.totalQuestions) ||
        options.totalQuestions <= 0
      ) {
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
