import { InvalidScoreTOEICError } from "../../errors/InvalidError/InvalidScoreTOEICError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import { InvalidDateError } from "../../errors/InvalidError/InvalidDateError.js";
import { BaseEntity, invalidString, invalidTOEICScore } from "../BaseEntity.js";

export interface LearnerOption {
  id: string;
  name: string;
  targetScore?: number;
  currentLevel?: number;
  createdAt?: Date;
  examDate?: Date;
  updatedAt?: Date;
}

export class Learner implements BaseEntity {
  readonly id: string;
  name: string;
  targetScore?: number;
  currentLevel?: number;
  readonly createdAt: Date;
  examDate?: Date;
  updatedAt?: Date;

  constructor(options: LearnerOption) {
    if (invalidString(options.id)) throw new InvalidStringError("id");
    if (invalidString(options.name)) throw new InvalidStringError("name");
    if (
      options.targetScore !== undefined &&
      invalidTOEICScore(options.targetScore)
    )
      throw new InvalidScoreTOEICError(options.targetScore);
    if (
      options.currentLevel !== undefined &&
      invalidTOEICScore(options.currentLevel)
    )
      throw new InvalidScoreTOEICError(options.currentLevel);
    this.createdAt = options.createdAt ?? new Date();
    if (
      options.examDate !== undefined &&
      options.examDate.getTime() - this.createdAt.getTime() < 0
    )
      throw new InvalidDateError(options.examDate, this.createdAt);
    this.id = options.id;
    this.name = options.name;
    this.targetScore = options.targetScore;
    this.currentLevel = options.currentLevel;
    this.examDate = options.examDate;
    this.updatedAt = options.updatedAt;
  }
}
