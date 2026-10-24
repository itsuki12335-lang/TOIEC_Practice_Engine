import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import { PartNumber, Section } from "../BaseEntity.js";

export class Part {
  readonly number: PartNumber;
  readonly section: Section;
  readonly name: string;
  readonly questionCount: number;
  readonly choiceCount: 3 | 4;
  readonly hasGroup: boolean;

  private constructor(
    number: PartNumber,
    section: Section,
    name: string,
    questionCount: number,
    choiceCount: 3 | 4,
    hasGroup: boolean,
  ) {
    if (!Number.isInteger(questionCount) || questionCount < 1) {
      throw new InvalidNumberError(questionCount);
    }
    if (name.trim() === "") {
      throw new InvalidStringError("name");
    }
    this.number = number;
    this.section = section;
    this.name = name;
    this.questionCount = questionCount;
    this.choiceCount = choiceCount;
    this.hasGroup = hasGroup;
  }
  static readonly FullPart: Record<PartNumber, Part> = {
    1: new Part(1, "Listening", "Photographs", 6, 4, false),
    2: new Part(2, "Listening", "Question - Response", 25, 3, false),
    3: new Part(3, "Listening", "Short Conversations", 39, 4, true),
    4: new Part(4, "Listening", "Short Talks", 30, 4, true),
    5: new Part(5, "Reading", "Incomplete Sentences", 30, 4, false),
    6: new Part(6, "Reading", "Text Completion", 16, 4, true),
    7: new Part(7, "Reading", "Reading Comprehension", 54, 4, true),
  };
}
