import { InvalidChoiceLabelError } from "../../errors/AnswerRecord/InvalidChoiceLabelError.js";
import { ExamNotFoundCorrectChoiceError } from "../../errors/ExamAndQuestionError/ExamNotFoundCorrectChoice.js";
import { InvalidChoiceCountError } from "../../errors/ExamAndQuestionError/InvalidChoiceCountError.js";
import { InvalidCorrectChoiceError } from "../../errors/ExamAndQuestionError/InvalidCorrectChoiceError.js";
import { InvalidNumberError } from "../../errors/InvalidError/InvalidNumberError.js";
import { InvalidPartError } from "../../errors/InvalidError/InvalidPartError.js";
import { InvalidStringError } from "../../errors/InvalidError/InvalidStringError.js";
import {
  BaseEntity,
  ChoiceLabel,
  invalidPositiveNumber,
  invalidString,
  PartNumber,
} from "../BaseEntity.js";
import { Choice } from "./Choice.js";
import { Part } from "./Part.js";

export interface QuestionOption {
  id: string;
  examId: string;
  part: PartNumber;
  order: number;
  content: string;
  choices: Choice[];
  createdAt?: Date;
  updatedAt?: Date;
  groupIds?: string | null;
  explanation?: string;
  topicIds?: string[];
  difficulty?: 1 | 2 | 3;
}
export class Question implements BaseEntity {
  readonly id: string;
  readonly examId: string;
  readonly part: PartNumber;
  readonly order: number;
  readonly content: string;
  readonly choices: readonly Choice[];
  readonly createdAt?: Date;
  updatedAt?: Date;
  readonly groupIds?: string | null;
  readonly explanation?: string;
  readonly topicIds?: string[];
  readonly difficulty?: 1 | 2 | 3;
  readonly correctChoice: Choice;
  /* Kiểm tra xem liệu phần đó có số lượng đáp án tương ứng đúng không : Nghĩa là ở các phần 1,3,4,5,6,7 có 4 đáp án A B C D 
còn ở phần 2 chỉ có A B C thôi.Đồng thời check xem số lượng đáp án đúng có chính xác không.Ở đây theo chuẩn TOEIC 1 câu chỉ được có duy nhất
1 đáp án đúng
 */
  private validateChoice(part: PartNumber, choices: Choice[]): void {
    const validLabel = new Set<ChoiceLabel>(); // Tạo 1 Set có kiểu ChoiceLable : Tức chỉ nhận 4 đáp án A B C D
    validLabel.add("A");
    validLabel.add("B");
    validLabel.add("C");
    if (part !== 2) validLabel.add("D"); // Nếu part khác 2 thì thêm đáp án D
    const expectChoiceNumber = Part.FullPart[part].choiceCount;
    if (expectChoiceNumber !== choices.length)
      // Kiểm tra xem độ dài của mảng Choices có đúng bằng Set ko.Nếu ko thì ném lỗi
      // vì chắc chắn nó đã ko đúng rồi.Bằng độ dài thì mới check tiếp
      throw new InvalidChoiceCountError({
        part: part,
        expectNum: expectChoiceNumber,
        numAns: choices.length,
      });
    let correctCount: number = 0;
    // Lấy Set ở trên làm logic kiểm tra . Nếu đã thấy phần tử trong mảng choices rồi thì xóa trong Set để lần sau gặp lại
    // thì chắc chắn trong Set ko có nên => trùng đáp án
    // Check xong trùng đáp án thì check tiếp số câu đúng . Vì 1 câu chỉ có duy nhất 1 đáp án đúng nên đặt biến đếm rồi so sánh với 1
    // Bằng 1 thì đúng , khác 1 thì ném lỗi
    for (const temp of choices) {
      if (validLabel.has(temp.label)) validLabel.delete(temp.label);
      else throw new InvalidChoiceLabelError(temp.label);
      if (temp.isCorrect === true) correctCount++;
    }
    if (correctCount !== 1) throw new InvalidCorrectChoiceError();
  }
  // Hàm này lấy đáp án đúng
  getCorrectChoice(): Choice {
    const choice = this.choices.find((temp) => temp.isCorrect === true);
    if (choice === undefined) throw new ExamNotFoundCorrectChoiceError();
    else return choice;
  }
  constructor(options: QuestionOption) {
    if (invalidString(options.id)) throw new InvalidStringError("id");
    if (invalidString(options.examId)) throw new InvalidStringError("examId");
    if (invalidString(options.content)) throw new InvalidStringError("content");
    if (invalidPositiveNumber(options.order))
      throw new InvalidNumberError(options.order);
    if (
      options.part < 1 ||
      options.part > 7 ||
      !Number.isInteger(options.part)
    ) {
      throw new InvalidPartError(options.part);
    }
    this.validateChoice(options.part, options.choices);
    if (
      typeof options.groupIds === "string" &&
      invalidString(options.groupIds)
    ) {
      throw new InvalidStringError("groupIds");
    }
    if (
      options.explanation !== undefined &&
      invalidString(options.explanation)
    ) {
      throw new InvalidStringError("explanation");
    }
    if (options.topicIds !== undefined) {
      for (const temp of options.topicIds) {
        if (invalidString(temp)) throw new InvalidStringError();
      }
    }

    this.id = options.id;
    this.examId = options.examId;
    this.part = options.part;
    this.order = options.order;
    this.content = options.content;
    this.choices = options.choices;
    this.createdAt = options.createdAt ?? new Date();
    this.updatedAt = options.updatedAt;
    this.groupIds = options.groupIds;
    this.explanation = options.explanation;
    this.topicIds = options.topicIds;
    this.difficulty = options.difficulty;
    this.correctChoice = this.getCorrectChoice();
  }
}
