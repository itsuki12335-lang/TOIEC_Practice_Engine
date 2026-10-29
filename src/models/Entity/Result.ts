import { InvalidResultQuestionError } from "../../errors/GradingAndResult/InvalidResultQuestionError.js";
import { InvalidScaledError } from "../../errors/GradingAndResult/InvalidScaledError.js";
import { InvalidNonNegativeNumberError } from "../../errors/InvalidError/InvalidNonNegativeNumber.js";
import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  BaseEntity,
  invalidNonNegativeNumber,
  invalidSectionScore,
  invalidString,
  invalidTOEICScore,
  PartNumber,
} from "../BaseEntity.js";
import { Part } from "./Part.js";

export interface ResultOption {
  readonly id: string;
  readonly attemptId: string;
  readonly correctByPart: Record<PartNumber, number>;
  readonly listeningRaw: number;
  readonly readingRaw: number;
  readonly listeningScaled: number;
  readonly readingScaled: number;
  readonly totalScaled: number;
  readonly totalQuestion?: number;
  readonly unansweredCount?: number;
  readonly accuracyByPart: Record<PartNumber, number>;
  readonly totalTimeSecond?: number;
  readonly gradedAt?: Date;
}
export class Result implements BaseEntity {
  readonly id: string;
  readonly attemptId: string;
  readonly correctByPart: Record<PartNumber, number>;
  readonly listeningRaw: number;
  readonly readingRaw: number;
  readonly listeningScaled: number;
  readonly readingScaled: number;
  readonly totalScaled: number;
  readonly totalQuestion?: number;
  readonly unansweredCount?: number;
  readonly accuracyByPart: Record<PartNumber, number>;
  readonly totalTimeSecond?: number;
  readonly gradedAt: Date;

  constructor(options: ResultOption) {
    let totalLis: number = 0;
    let totalRead: number = 0;
    if (invalidString(options.id)) throw new InvalidStringError("id");
    if (invalidString(options.attemptId))
      throw new InvalidStringError("attemptId");
    //Object.values biến mọi thuộc tính có kiểu Key-Value thành 1 Object của Value tương ứng
    for (const partTemp of Object.values(Part.FullPart)) {
      const correctCount = options.correctByPart[partTemp.number];
      const accuracy = options.accuracyByPart[partTemp.number];
      if (
        invalidNonNegativeNumber(correctCount) ||
        correctCount > partTemp.questionCount
      ) {
        throw new InvalidResultQuestionError(
          correctCount,
          0,
          partTemp.questionCount,
        );
      }
      if (partTemp.section === "Listening") {
        totalLis += correctCount;
      } else {
        totalRead += correctCount;
      }
      if (accuracy > 100 || accuracy < 0) throw new InvalidNumberError();
    }
    if (totalLis !== options.listeningRaw)
      throw new InvalidResultQuestionError(totalLis, 0, 100);
    if (totalRead !== options.readingRaw)
      throw new InvalidResultQuestionError(totalRead, 0, 100);
    if (invalidSectionScore(options.listeningScaled))
      throw new InvalidScaledError(options.listeningScaled);
    if (invalidSectionScore(options.readingScaled))
      throw new InvalidScaledError(options.readingScaled);
    if (
      invalidTOEICScore(options.totalScaled) ||
      options.totalScaled !== options.listeningScaled + options.readingScaled
    )
      throw new InvalidScaledError(options.totalScaled);
    if (
      options.totalQuestion !== undefined &&
      (options.totalQuestion < totalLis + totalRead ||
        options.totalQuestion > 200)
    )
      throw new InvalidResultQuestionError(
        options.totalQuestion,
        totalLis + totalRead,
        200,
      );
    if (
      options.unansweredCount !== undefined &&
      invalidNonNegativeNumber(options.unansweredCount)
    ) {
      throw new InvalidNonNegativeNumberError(options.unansweredCount);
    }
    if (
      options.totalTimeSecond !== undefined &&
      invalidNonNegativeNumber(options.totalTimeSecond)
    )
      throw new InvalidNonNegativeNumberError(options.totalTimeSecond);

    this.id = options.id;
    this.attemptId = options.attemptId;
    this.correctByPart = options.correctByPart;
    this.listeningRaw = options.listeningRaw;
    this.readingRaw = options.readingRaw;
    this.listeningScaled = options.listeningScaled;
    this.readingScaled = options.readingScaled;
    this.totalScaled = options.totalScaled;
    this.totalQuestion = options.totalQuestion;
    this.unansweredCount = options.unansweredCount;
    this.accuracyByPart = options.accuracyByPart;
    this.totalTimeSecond = options.totalTimeSecond;
    this.gradedAt = options.gradedAt ?? new Date();
  }
}
