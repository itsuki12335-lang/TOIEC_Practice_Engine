import { readFile } from "fs/promises";
import { AttemptNotFoundError } from "../errors/AnswerRecord/AttemptNotFoundError.js";
import { PartNumber, Section } from "../models/BaseEntity.js";
import { AnswerRecord } from "../models/Entity/AnswerRecord.js";
import { Result } from "../models/Entity/Result.js";
import { JsonRepository } from "../repositories/JSONRepository.js";
import { AttemptServices } from "./AttemptServices.js";
import { ExamServices } from "./ExamServices.js";
import { ScoreTableConfigError } from "../errors/GradingAndResult/ScoreTableConfigError.js";
import { AttemptNotSubmittedError } from "../errors/GradingAndResult/AttemptNotSubmittedError.js";
import { Part } from "../models/Entity/Part.js";
import { Exam } from "../models/Entity/Exam.js";

export class ScoringServices {
  private exam = new ExamServices();
  private attempt = new AttemptServices();
  private answerRecordRepo = new JsonRepository<AnswerRecord>(
    "data/storage/answer-records.json",
    "AnsweRecord",
  );
  private resultRepo = new JsonRepository<Result>(
    "data/storage/results.json",
    "Result",
  );
  async getCorrectByPart(
    attemptId: string,
  ): Promise<Record<PartNumber, number>> {
    const targetAnswerRecordArray = await this.answerRecordRepo.filter(
      (temp) => temp.attemptId === attemptId,
    );
    if (targetAnswerRecordArray.length === 0) {
      throw new AttemptNotFoundError(attemptId);
    }
    const obj = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    for (const record of targetAnswerRecordArray) {
      if (record.isCorrect === true) {
        const part = (await this.exam.getQuestionById(record.questionId)).part;
        obj[part]++;
      }
    }

    return obj;
  }
  async calculateScore(
    correctByPart: Record<PartNumber, number>,
  ): Promise<Record<Section, number>> {
    const listeningRaw =
      correctByPart[1] + correctByPart[2] + correctByPart[3] + correctByPart[4];
    const readingRaw = correctByPart[5] + correctByPart[6] + correctByPart[7];
    const scoreTableRepo: {
      section: Section;
      rawScore: number;
      scaledScore: number;
    }[] = JSON.parse(
      await readFile("data/score-tables/score-table.json", "utf-8"),
    );

    const targetScoreListening = scoreTableRepo.find(
      (temp) => temp.rawScore === listeningRaw && temp.section === "Listening",
    );
    if (targetScoreListening === undefined) throw new ScoreTableConfigError();
    const targetScoreReading = scoreTableRepo.find(
      (temp) => temp.rawScore === readingRaw && temp.section === "Reading",
    );
    if (targetScoreReading === undefined) throw new ScoreTableConfigError();
    const obj = {
      Listening: targetScoreListening.scaledScore,
      Reading: targetScoreReading.scaledScore,
    };
    return obj;
  }

  async accuracy(
    attemptId: string,
    correctByPart: Record<PartNumber, number>,
  ): Promise<Record<PartNumber, number>> {
    const result: Record<PartNumber, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    };
    let totalQuestion = await this.exam.getQuestionByExamId(
      (await this.attempt.getAttemptId(attemptId)).examId,
      (await this.attempt.getAttemptId(attemptId)).partFilter,
    );
    for (let i = 1; i <= 7; i++) {
      const part = i as PartNumber;
      const totalQuestionPartByPart = totalQuestion.filter(
        (temp) => temp.part === i,
      );
      if (totalQuestionPartByPart.length > 0) {
        result[part] = Math.round(
          ((await this.getCorrectByPart(attemptId))[part] /
            totalQuestionPartByPart.length) *
            100,
        );
      }
    }
    return result;
  }

  async saveResult(attemptId: string): Promise<Result> {
    const targetAttempt = await this.attempt.getAttemptId(attemptId);
    if (
      targetAttempt.status === "IN_PROGRESS" ||
      targetAttempt.status === "EXPIRED"
    ) {
      throw new AttemptNotSubmittedError();
    }
    const correctByPart = await this.getCorrectByPart(attemptId);
    const lisRaw =
      correctByPart[1] + correctByPart[2] + correctByPart[3] + correctByPart[4];
    const readRaw = correctByPart[5] + correctByPart[6] + correctByPart[7];
    const readForScaled = await this.calculateScore(correctByPart);
    const lisScaled = readForScaled.Listening;
    const readScaled = readForScaled.Reading;
    const total = lisScaled + readScaled;
    const accuracy = await this.accuracy(attemptId, correctByPart);
    const newResult = new Result({
      id: crypto.randomUUID(),
      attemptId: attemptId,
      correctByPart: correctByPart,
      listeningRaw: lisRaw,
      readingRaw: readRaw,
      listeningScaled: lisScaled,
      readingScaled: readScaled,
      totalScaled: total,
      accuracyByPart: accuracy,
    });
    await this.resultRepo.add(newResult);
    return newResult;
  }
  async getResult(resultId: string): Promise<Result> {
    const target = await this.resultRepo.findById(resultId);
    if (target) {
      return target;
    } else throw new AttemptNotFoundError(resultId);
  }
}
