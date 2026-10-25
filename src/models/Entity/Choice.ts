import { InvalidChoiceLabelError } from "../../errors/AnswerRecord/InvalidChoiceLabelError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import { ChoiceLabel, invalidString } from "../BaseEntity.js";

export class Choice {
  readonly label: ChoiceLabel;
  readonly text: string;
  readonly isCorrect: boolean;
  readonly explanation?: string;

  constructor(
    label: ChoiceLabel,
    text: string,
    isCorrect: boolean,
    explanation?: string,
  ) {
    const valid: ChoiceLabel[] = ["A", "B", "C", "D"];
    if (!valid.includes(label)) throw new InvalidChoiceLabelError(label);
    if (invalidString(text)) throw new InvalidStringError("text");
    if (explanation !== undefined) {
      if (invalidString(explanation)) {
        throw new InvalidStringError("explanation");
      }
    }
    this.label = label;
    this.text = text;
    this.isCorrect = isCorrect;
    this.explanation = explanation;
  }
}
