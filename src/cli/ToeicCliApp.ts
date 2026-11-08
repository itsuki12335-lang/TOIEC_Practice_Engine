import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { ExamServices } from "../services/ExamServices.js";
import { AttemptServices } from "../services/AttemptServices.js";
import { ScoringServices } from "../services/ScoringServices.js";
import { JsonRepository } from "../repositories/JSONRepository.js";
import { Learner } from "../models/Entity/Learner.js";
import { Result } from "../models/Entity/Result.js";
import { Attempt } from "../models/Entity/Attempt.js";
import { Part } from "../models/Entity/Part.js";
import { AttemptMode, ChoiceLabel, PartNumber } from "../models/BaseEntity.js";
import { DomainError } from "../errors/BaseError/DomainError.js";

export class ToeicCliApp {
  private rl!: readline.Interface;
  private readonly examService = new ExamServices();
  private readonly attemptService = new AttemptServices();
  private readonly scoringService = new ScoringServices();

  private readonly learnerRepo = new JsonRepository<Learner>(
    "data/storage/learners.json",
    "Learner",
  );
  private readonly resultRepo = new JsonRepository<Result>(
    "data/storage/results.json",
    "Result",
  );

  private currentLearner: Learner | null = null;

  async start(): Promise<void> {
    this.rl = readline.createInterface({ input, output });

    try {
      // Tự động tải người học mặc định nếu có
      const learners = await this.learnerRepo.findAll();
      if (learners.length > 0) {
        this.currentLearner = learners[0] ?? null;
      }

      await this.mainLoop();
    } catch (error: any) {
      if (error?.code === "ERR_USE_AFTER_CLOSE") {
        // Stream kết thúc hoặc đã đóng readline bình thường
        return;
      }
      if (error instanceof DomainError) {
        console.error(`\n[Lỗi hệ thống]: ${error.message}`);
      } else {
        console.error(`\n[Lỗi ngoại lệ]:`, error);
      }
    } finally {
      this.rl.close();
    }
  }

  private async mainLoop(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n=======================================================");
      console.log("            TOEIC PRACTICE ENGINE - CLI");
      console.log("=======================================================");
      if (this.currentLearner) {
        console.log(
          `Người học: ${this.currentLearner.name} (ID: ${this.currentLearner.id}) | Mục tiêu: ${this.currentLearner.targetScore ?? "Chưa đặt"} điểm`,
        );
      } else {
        console.log("Người học: [Chưa chọn người học]");
      }
      console.log("-------------------------------------------------------");
      console.log("1. Danh sách đề thi (Exam Catalog)");
      console.log("2. Bắt đầu làm bài thi (Start Attempt)");
      console.log("3. Xem kết quả bài thi theo mã (View Result)");
      console.log("4. Lịch sử làm bài (Exam Results History)");
      console.log("5. Đổi / Thêm mới người học (Learner)");
      console.log("0. Thoát ứng dụng (Exit)");
      console.log("=======================================================");

      const choice = (await this.rl.question("Chọn chức năng (0-5): ")).trim();

      try {
        switch (choice) {
          case "1":
            await this.handleListExams();
            break;
          case "2":
            await this.handleStartAttempt();
            break;
          case "3":
            await this.handleViewResult();
            break;
          case "4":
            await this.handleHistoryResults();
            break;
          case "5":
            await this.handleSelectOrAddLearner();
            break;
          case "0":
            console.log("\nCảm ơn bạn đã luyện tập cùng TOEIC Practice Engine. Tạm biệt!");
            running = false;
            break;
          default:
            console.log("\nLựa chọn không hợp lệ, vui lòng nhập số từ 0 đến 5.");
            break;
        }
      } catch (err) {
        if (err instanceof DomainError) {
          console.log(`\n⚠️  [Lỗi nghiệp vụ]: ${err.message}`);
        } else {
          console.log(`\n❌ [Lỗi không xác định]:`, err);
        }
      }

      if (running && choice !== "") {
        await this.rl.question("\nNhấn phím Enter để tiếp tục...");
      }
    }
  }

  // 1. Danh sách đề thi
  private async handleListExams(): Promise<void> {
    console.log("\n--- DANH SÁCH ĐỀ THI ĐÃ CÔNG BỐ (PUBLISHED) ---");
    const exams = await this.examService.getPublisherExam();

    if (exams.length === 0) {
      console.log("Hiện chưa có đề thi nào được công bố.");
      return;
    }

    exams.forEach((exam, index) => {
      console.log(`\n[${index + 1}] Mã đề: ${exam.id}`);
      console.log(`    Tiêu đề: ${exam.title}`);
      console.log(`    Thời lượng: ${exam.durationMinutes} phút | Số câu: ${exam.totalQuestions}`);
      console.log(`    Nguồn: ${exam.source ?? "Không rõ"}`);
      console.log(`    Mô tả: ${exam.description ?? "Không có mô tả"}`);
    });
  }

  // 2. Bắt đầu làm bài thi
  private async handleStartAttempt(): Promise<void> {
    if (!this.currentLearner) {
      console.log("\nBạn cần chọn người học trước khi làm bài thi!");
      await this.handleSelectOrAddLearner();
      if (!this.currentLearner) return;
    }

    const exams = await this.examService.getPublisherExam();
    if (exams.length === 0) {
      console.log("\nKhông có đề thi nào khả dụng.");
      return;
    }

    console.log("\n--- CHỌN ĐỀ THI ---");
    exams.forEach((exam, index) => {
      console.log(`[${index + 1}] ${exam.title} (${exam.totalQuestions} câu, ${exam.durationMinutes} phút) - ID: ${exam.id}`);
    });

    const examIdxStr = (await this.rl.question(`Chọn đề (1-${exams.length}) hoặc nhập mã đề thi: `)).trim();
    let selectedExamId = examIdxStr;
    const examIndex = parseInt(examIdxStr, 10);
    if (!isNaN(examIndex) && examIndex >= 1 && examIndex <= exams.length) {
      const chosen = exams[examIndex - 1];
      if (chosen) selectedExamId = chosen.id;
    }

    console.log("\n--- CHỌN CHẾ ĐỘ THI (MODE) ---");
    console.log("1. Thi toàn bộ đề (FULL_EXAM)");
    console.log("2. Luyện tập theo Part (PART_PRACTICE)");
    const modeChoice = (await this.rl.question("Chọn chế độ (1 hoặc 2): ")).trim();

    let mode: AttemptMode = "FULL_EXAM";
    let partFilter: PartNumber[] | undefined = undefined;

    if (modeChoice === "2") {
      mode = "PART_PRACTICE";
      console.log("\nCác Part trong đề TOEIC: 1, 2, 3, 4, 5, 6, 7");
      const partsInput = (await this.rl.question("Nhập các Part cần luyện (cách nhau bởi dấu phẩy, vd: 1, 2 hoặc 5): ")).trim();
      const parts = partsInput
        .split(",")
        .map((p) => parseInt(p.trim(), 10))
        .filter((p) => [1, 2, 3, 4, 5, 6, 7].includes(p)) as PartNumber[];

      if (parts.length === 0) {
        console.log("Không có Part nào hợp lệ được chọn. Huỷ lượt làm bài.");
        return;
      }
      partFilter = parts;
    }

    console.log("\nĐang khởi tạo lượt thi...");
    const attempt = await this.attemptService.startAttempt(
      this.currentLearner.id,
      selectedExamId,
      mode,
      partFilter,
    );

    console.log(`\n Lượt thi bắt đầu thành công!`);
    console.log(`- Mã lượt thi (Attempt ID): ${attempt.id}`);
    console.log(`- Tổng số câu hỏi: ${attempt.questionIds.length}`);
    console.log(`(Gợi ý: Nhập A, B, C, D để chọn đáp án; nhấn Enter để bỏ qua; gõ 'submit' để nộp bài sớm)\n`);

    // Duyệt qua từng câu hỏi để trả lời
    for (let i = 0; i < attempt.questionIds.length; i++) {
      const qId = attempt.questionIds[i];
      if (!qId) continue;
      const question = await this.examService.getQuestionById(qId);

      console.log("-------------------------------------------------------");
      console.log(`Câu ${i + 1}/${attempt.questionIds.length} [Part ${question.part}]: ${question.content}`);

      question.choices.forEach((choice) => {
        console.log(`  [${choice.label}] ${choice.text}`);
      });

      let answered = false;
      while (!answered) {
        const inputAnswer = (
          await this.rl.question(`\nĐáp án của bạn (A/B/C/D / Enter / 'submit'): `)
        ).trim().toUpperCase();

        if (inputAnswer === "SUBMIT") {
          console.log("\nBạn đã yêu cầu nộp bài sớm.");
          answered = true;
          i = attempt.questionIds.length; // Thoát vòng lặp câu hỏi
          break;
        }

        if (inputAnswer === "") {
          await this.attemptService.labelAnswer(null, attempt.id, question.id);
          console.log("-> Đã bỏ qua câu này.");
          answered = true;
        } else if (["A", "B", "C", "D"].includes(inputAnswer)) {
          await this.attemptService.labelAnswer(inputAnswer as ChoiceLabel, attempt.id, question.id);
          console.log(`-> Đã ghi nhận đáp án: ${inputAnswer}`);
          answered = true;
        } else {
          console.log("Đáp án không hợp lệ! Vui lòng chỉ nhập A, B, C, D hoặc nhấn Enter để bỏ qua.");
        }
      }
    }

    console.log("\nĐang nộp bài thi và chấm điểm...");
    await this.attemptService.submitAttempt(attempt.id);
    const result = await this.scoringService.saveResult(attempt.id);

    console.log("\n🎉 Nộp bài thành công! Kết quả chi tiết của bạn:");
    await this.printResultSummary(result, attempt);
  }

  // 3. Xem kết quả bài thi theo mã
  private async handleViewResult(): Promise<void> {
    const code = (await this.rl.question("\nNhập Result ID hoặc Attempt ID: ")).trim();
    if (!code) return;

    let result: Result | null = null;
    try {
      result = await this.scoringService.getResult(code);
    } catch {
      // Thử tìm theo attemptId nếu người dùng nhập attemptId
      const allResults = await this.resultRepo.findAll();
      result = allResults.find((r) => r.attemptId === code || r.id === code) ?? null;
    }

    if (!result) {
      console.log(`\nKhông tìm thấy kết quả nào với mã: ${code}`);
      return;
    }

    console.log("\n--- THÔNG TIN KẾT QUẢ BÀI THI ---");
    await this.printResultSummary(result);
  }

  // 4. Lịch sử kết quả làm bài
  private async handleHistoryResults(): Promise<void> {
    console.log("\n--- LỊCH SỬ KẾT QUẢ BÀI THI ---");
    const allResults = await this.resultRepo.findAll();

    if (allResults.length === 0) {
      console.log("Chưa có kết quả làm bài nào được ghi nhận trong hệ thống.");
      return;
    }

    allResults.forEach((res, index) => {
      console.log(
        `\n[${index + 1}] Result ID: ${res.id} | Attempt ID: ${res.attemptId}`,
      );
      console.log(
        `    Điểm Listening: ${res.listeningScaled}/495 (Đúng ${res.listeningRaw}/100) | Reading: ${res.readingScaled}/495 (Đúng ${res.readingRaw}/100)`,
      );
      console.log(`    TỔNG ĐIỂM: ${res.totalScaled}/990`);
    });
  }

  // 5. Chọn hoặc thêm người học
  private async handleSelectOrAddLearner(): Promise<void> {
    console.log("\n--- QUẢN LÝ NGƯỜI HỌC (LEARNER) ---");
    const learners = await this.learnerRepo.findAll();

    if (learners.length > 0) {
      console.log("Danh sách người học hiện có:");
      learners.forEach((l, index) => {
        const isCurrent = this.currentLearner?.id === l.id ? " (Đang chọn)" : "";
        console.log(`[${index + 1}] ${l.name} (ID: ${l.id}) - Target: ${l.targetScore ?? "N/A"}${isCurrent}`);
      });
    } else {
      console.log("Chưa có người học nào trong hệ thống.");
    }

    console.log("\nLựa chọn:");
    console.log("  - Nhập số thứ tự (1-N) để chọn người học");
    console.log("  - Gõ 'new' để tạo người học mới");
    console.log("  - Nhấn Enter để quay lại");

    const inputChoice = (await this.rl.question("Lựa chọn: ")).trim();
    if (inputChoice === "") return;

    if (inputChoice.toLowerCase() === "new") {
      const name = (await this.rl.question("Nhập tên người học: ")).trim();
      if (!name) {
        console.log("Tên không được để trống!");
        return;
      }
      const targetScoreStr = (await this.rl.question("Nhập điểm mục tiêu (ví dụ 600, 750, bỏ trống nếu chưa có): ")).trim();
      let targetScore: number | undefined = undefined;
      if (targetScoreStr !== "") {
        const score = parseInt(targetScoreStr, 10);
        if (!isNaN(score)) targetScore = score;
      }

      const newLearner = new Learner({
        id: `learner-${Date.now()}`,
        name,
        targetScore,
      });
      await this.learnerRepo.add(newLearner);
      this.currentLearner = newLearner;
      console.log(`\nĐã tạo thành công người học: ${newLearner.name} (ID: ${newLearner.id})`);
    } else {
      const idx = parseInt(inputChoice, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= learners.length) {
        this.currentLearner = learners[idx - 1] ?? null;
        console.log(`\nĐã chuyển người học sang: ${this.currentLearner?.name}`);
      } else {
        console.log("Số thứ tự không hợp lệ.");
      }
    }
  }

  // Tiện ích in bảng điểm chi tiết
  private async printResultSummary(
    result: Result,
    attemptOpt?: Attempt,
  ): Promise<void> {
    let attempt: Attempt | null = attemptOpt ?? null;
    if (!attempt) {
      try {
        attempt = await this.attemptService.getAttemptId(result.attemptId);
      } catch {
        attempt = null;
      }
    }

    // Đếm số câu hỏi thực tế của mỗi Part trong lượt thi này
    const questionsCountByPart: Record<PartNumber, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    };

    if (attempt && attempt.questionIds.length > 0) {
      const questions = await Promise.all(
        attempt.questionIds.map((qId) => this.examService.getQuestionById(qId)),
      );
      for (const q of questions) {
        questionsCountByPart[q.part]++;
      }
    } else {
      // Fallback theo chuẩn Full TOEIC nếu không tìm thấy attempt
      for (let i = 1; i <= 7; i++) {
        const p = i as PartNumber;
        questionsCountByPart[p] = Part.FullPart[p].questionCount;
      }
    }

    const isPartPractice = attempt?.mode === "PART_PRACTICE";

    console.log("=======================================================");
    console.log(`  Mã kết quả (Result ID) : ${result.id}`);
    console.log(`  Mã lượt thi (Attempt ID): ${result.attemptId}`);
    if (attempt) {
      console.log(
        `  Chế độ thi              : ${
          isPartPractice
            ? "Luyện tập theo Part (PART_PRACTICE)"
            : "Thi trọn vẹn (FULL_EXAM)"
        }`,
      );
    }
    console.log("-------------------------------------------------------");

    if (isPartPractice && attempt) {
      const totalCorrect = Object.values(result.correctByPart).reduce(
        (a, b) => a + b,
        0,
      );
      const totalQ = attempt.questionIds.length;
      const pct = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
      console.log(
        `  Kết quả phần luyện tập  : Đúng ${totalCorrect} / ${totalQ} câu (${pct}%)`,
      );
      console.log(
        `  (Thang điểm 990 tham khảo: ${result.totalScaled} | L: ${result.listeningScaled}, R: ${result.readingScaled})`,
      );
    } else {
      console.log(
        `  Điểm Listening : ${result.listeningScaled} / 495  (Đúng ${result.listeningRaw} câu)`,
      );
      console.log(
        `  Điểm Reading   : ${result.readingScaled} / 495  (Đúng ${result.readingRaw} câu)`,
      );
      console.log(`  TỔNG ĐIỂM TOEIC: ${result.totalScaled} / 990`);
    }

    console.log("-------------------------------------------------------");
    console.log("  Độ chính xác theo từng Part:");

    // Nếu là PART_PRACTICE: chỉ hiển thị các Part thực sự tham gia thi
    const activeParts: PartNumber[] = (
      isPartPractice && attempt?.partFilter && attempt.partFilter.length > 0
        ? attempt.partFilter
        : ([1, 2, 3, 4, 5, 6, 7] as PartNumber[])
    ).filter((p) => questionsCountByPart[p] > 0);

    for (const part of activeParts) {
      const correct = result.correctByPart[part] ?? 0;
      const totalInPart = questionsCountByPart[part];
      const acc = result.accuracyByPart[part] ?? 0;
      console.log(
        `    - Part ${part}: ${acc}% (Đúng ${correct}/${totalInPart} câu)`,
      );
    }
    console.log("=======================================================");
  }
}
