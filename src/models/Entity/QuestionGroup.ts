import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  BaseEntity,
  invalidPositiveNumber,
  invalidString,
  PartNumber,
} from "../BaseEntity.js";

export interface QuestionGroupOption {
  id: string;
  examId: string;
  part: PartNumber;
  passage: string;
  order: number;
  passageType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class QuestionGroup implements BaseEntity {
  readonly id: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly examId: string;
  readonly part: PartNumber;
  readonly passage: string;
  readonly order: number;
  readonly passageType?: string;

  constructor(options: QuestionGroupOption) {
    if (invalidString(options.id)) throw new InvalidStringError("id");

    if (invalidString(options.examId)) throw new InvalidStringError("examId");

    if (invalidString(options.passage)) throw new InvalidStringError("passage");

    if (options.passageType !== undefined) {
      if (invalidString(options.passageType)) {
        throw new InvalidStringError("passageType");
      }
    }
    if (invalidPositiveNumber(options.order))
      throw new InvalidNumberError(options.order);

    this.id = options.id;
    this.examId = options.examId;
    this.part = options.part;
    this.passage = options.passage;
    this.order = options.order;
    this.passageType = options.passageType;
    this.createdAt = options.createdAt ?? new Date();
    this.updatedAt = options.updatedAt;
  }
}
