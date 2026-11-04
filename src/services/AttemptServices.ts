import { AttemptAlreadySubmittedError } from "../errors/AnswerRecord/AttemptAlreadySubmitedError.js";
import { AttemptExpiredError } from "../errors/AnswerRecord/AttemptExpiredError.js";
import { AttemptNotFoundError } from "../errors/AnswerRecord/AttemptNotFoundError.js";
import { InvalidChoiceLabelError } from "../errors/AnswerRecord/InvalidChoiceLabelError.js";
import { LearnerNotFoundError } from "../errors/AnswerRecord/LearnerNotFoundError.js";
import { QuestionNotFoundError } from "../errors/ExamAndQuestionError/QuestionNotFoundError.js";
import { QuestionNotInExamError } from "../errors/ExamAndQuestionError/QuestionNotInExamError.js";
import { AttemptWaitingError } from "../errors/GradingAndResult/AttemptWaitingError.js";
import { CannotChooseLabelError } from "../errors/InvalidError/CannotChooseLabelError.js";
import { InvalidPartError } from "../errors/InvalidError/InvalidPartError.js";
import { AttemptMode, ChoiceLabel, PartNumber } from "../models/BaseEntity.js";
import { AnswerRecord } from "../models/Entity/AnswerRecord.js";
import { Attempt } from "../models/Entity/Attempt.js";
import { Learner } from "../models/Entity/Learner.js";
import { JsonRepository } from "../repositories/JSONRepository.js";
import { ExamServices } from "./ExamServices.js";

export class AttemptServices {
  private exam = new ExamServices();
  private tempAnsRepo: Record<string, Record<string, ChoiceLabel | null>> = {};
  private learnerRepo = new JsonRepository<Learner>(
    "data/storage/learners.json",
    "Learner",
  );
  private attemptRepo = new JsonRepository<Attempt>(
    "data/storage/attempts.json",
    "Attempt",
  );
  private answerRepo = new JsonRepository<AnswerRecord>(
    "data/storage/answer-records.json",
    "AnswerRecord",
  );
  async startAttempt(
    learnerId: string,
    examId: string,
    mode: AttemptMode,
    part?: PartNumber[],
  ): Promise<Attempt> {
    if (mode === "FULL_EXAM" && part !== undefined)
      throw new InvalidPartError();
    if (mode !== "FULL_EXAM" && part === undefined)
      throw new InvalidPartError();
    if ((await this.learnerRepo.findById(learnerId)) === null)
      throw new LearnerNotFoundError(learnerId);
    const examNow = await this.exam.getExamById(examId);
    const timeLimitSeconds = examNow.durationMinutes * 60;
    const attempt = new Attempt({
      id: crypto.randomUUID(),
      learnerId: learnerId,
      examId: examId,
      status: "IN_PROGRESS",
      mode: mode,
      partFilter: part,
      questionIds: (await this.exam.getQuestionByExamId(examId, part)).map(
        (temp) => temp.id,
      ),
      timeLimitSeconds: timeLimitSeconds,
    });
    await this.attemptRepo.add(attempt);
    return attempt;
  }
  async getAttemptId(attemptId: string): Promise<Attempt> {
    const targetAttempt = await this.attemptRepo.findById(attemptId);
    if (targetAttempt === null) {
      throw new AttemptNotFoundError(attemptId);
    }
    return targetAttempt;
  }

  async submitAttempt(attemptId: string): Promise<void> {
    const target = await this.getAttemptId(attemptId);
    if (target.status === "EXPIRED") {
      throw new AttemptExpiredError();
    } else if (target.status === "WAITING") {
      throw new AttemptWaitingError();
    } else if (target.status === "SUBMITTED") {
      throw new AttemptAlreadySubmittedError();
    } else {
      target.status = "SUBMITTED";
      target.submittedAt = new Date();
    }
    await this.attemptRepo.update(target);
  }

  async labelAnswer(
    answer: ChoiceLabel | null,
    attemptId: string,
    questionId: string,
  ): Promise<Record<string, Record<string, ChoiceLabel | null>>> {
    const attemptTarget = await this.getAttemptId(attemptId);
    if (attemptTarget.status !== "IN_PROGRESS") {
      throw new CannotChooseLabelError();
    }
    if (!attemptTarget.questionIds.includes(questionId)) {
      throw new QuestionNotInExamError();
    }
    const questionArray = await this.exam.getQuestionByExamId(
      attemptTarget.examId,
    );
    const questionTarget = questionArray.find((temp) => temp.id === questionId);
    if (questionTarget === undefined) {
      throw new QuestionNotInExamError();
    }
    if (answer !== null) {
      if (!questionTarget.choices.some((choice) => choice.label === answer)) {
        throw new InvalidChoiceLabelError(answer);
      }
    }
    if (!this.tempAnsRepo[attemptId]) {
      this.tempAnsRepo[attemptId] = {};
    }
    this.tempAnsRepo[attemptId][questionId] = answer;
    return { [attemptId]: { [questionId]: answer } };
  }
  async compareFunction(
    attemptId: string,
    questionIds: string,
  ): Promise<boolean> {
    if ((await this.getAttemptId(attemptId)) === undefined) {
      throw new AttemptNotFoundError(attemptId);
    }
    const question = this.tempAnsRepo[attemptId];
    if ((await this.exam.getQuestionById(questionIds)) === null) {
      throw new QuestionNotFoundError();
    }
    if (question === undefined) {
      return false;
    }
    const questionTarget = question[questionIds];
    const questionCorrect = (await this.exam.getQuestionById(questionIds))
      .correctChoice;
    if (questionCorrect.label === questionTarget) {
      return true;
    }
    return false;
  }
  async saveAnswerRecord(questionId: string, attemptId: string): Promise<void> {
    const newRecord = new AnswerRecord({
      id: crypto.randomUUID(),
      questionId,
      attemptId,
      selectedLabel: this.tempAnsRepo[attemptId]?.[questionId] ?? null,
      isCorrect: await this.compareFunction(attemptId, questionId),
    });
    await this.answerRepo.add(newRecord);
  }
}
