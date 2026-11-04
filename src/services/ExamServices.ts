import { ExamNotFoundError } from "../errors/ExamAndQuestionError/ExamNotFoundError.js";
import { ExamNotPublishedError } from "../errors/ExamAndQuestionError/ExamNotPublishedError.js";
import { QuestionNotFoundError } from "../errors/ExamAndQuestionError/QuestionNotFoundError.js";
import { PartNumber } from "../models/BaseEntity.js";
import { Exam } from "../models/Entity/Exam.js";
import { Question } from "../models/Entity/Question.js";
import { QuestionGroup } from "../models/Entity/QuestionGroup.js";
import { JsonRepository } from "../repositories/JSONRepository.js";

export class ExamServices {
  private readonly examRepo = new JsonRepository<Exam>(
    "data/exams/exams.json",
    "Exam",
  );
  private readonly questionRepo = new JsonRepository<Question>(
    "data/exams/questions.json",
    "Question",
  );
  private readonly questionGroupRepo = new JsonRepository<QuestionGroup>(
    "data/exams/question-groups.json",
    "QuestionGroup",
  );
  async getPublisherExam(): Promise<Exam[]> {
    const exam = await this.examRepo.filter(
      (temp) => temp.status === "PUBLISHED",
    );
    return exam;
  }
  async getExamById(examId: string): Promise<Exam> {
    const exam = await this.examRepo.findById(examId);
    if (exam !== null && exam.status !== "PUBLISHED")
      throw new ExamNotPublishedError();
    else if (exam === null) throw new ExamNotFoundError();
    else return exam;
  }
  async getQuestionByExamId(
    examId: string,
    part?: PartNumber[],
  ): Promise<Question[]> {
    let targetQuestions;
    if (part === undefined) {
      targetQuestions = await this.questionRepo.filter(
        (temp) => temp.examId === examId,
      );
    } else {
      targetQuestions = await this.questionRepo.filter(
        (temp) => temp.examId === examId && part.includes(temp.part),
      );
    }
    if (targetQuestions.length === 0) throw new QuestionNotFoundError();
    else return targetQuestions;
  }
  async getQuestionGroupByExamId(examId: string): Promise<QuestionGroup[]> {
    const questionGroupTarget = await this.questionGroupRepo.filter(
      (temp) => temp.examId === examId,
    );
    return questionGroupTarget;
  }
  async getQuestionById(questionId: string): Promise<Question> {
    const questionTarget = await this.questionRepo.findById(questionId);
    if (questionTarget === null) {
      throw new QuestionNotFoundError();
    } else {
      return questionTarget;
    }
  }
}
