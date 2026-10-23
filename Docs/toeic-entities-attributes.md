# TOEIC Practice Engine – Thuộc tính các thực thể

Tài liệu liệt kê các thuộc tính mà từng thực thể **có thể** có. Nam tự quyết định giữ hay bỏ theo ranh giới "lõi / mở rộng / tùy chọn".

**Chú thích cột "Mức":**
- **Lõi**: cần có để chạy được luồng làm bài, chấm điểm
- **Mở rộng**: thêm khi làm thống kê, ôn tập
- **Tùy chọn**: có thì tốt, bỏ cũng không ảnh hưởng

**Quy ước chung:** mọi thực thể lưu trong file JSON nên có `id: string`. Quan hệ giữa các thực thể dùng `id` (ví dụ `examId`), không nhúng nguyên object.

---

## Kiểu dùng chung

```ts
type Section = "LISTENING" | "READING";
type PartNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ChoiceLabel = "A" | "B" | "C" | "D";
type ExamStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
type AttemptMode = "FULL_EXAM" | "PART_PRACTICE" | "TOPIC_PRACTICE" | "WRONG_REVIEW";
type Difficulty = 1 | 2 | 3;
```

---

## 1. Nội dung đề

### 1.1 Exam – một đề thi

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh duy nhất |
| `title` | string | Lõi | Tên đề, ví dụ "ETS 2024 – Test 1" |
| `durationMinutes` | number | Lõi | Thời lượng làm bài (thường 120) |
| `status` | ExamStatus | Lõi | Nháp, đã phát hành hoặc lưu trữ; chỉ đề PUBLISHED mới được làm |
| `totalQuestions` | number | Mở rộng | Tổng số câu (thường 200); dùng để kiểm tra đề nạp đủ chưa |
| `source` | string | Tùy chọn | Nguồn đề (sách, năm xuất bản) |
| `description` | string | Tùy chọn | Ghi chú về đề |
| `createdAt` | Date | Tùy chọn | Thời điểm nạp đề |

### 1.2 Part – dạng bài (1 đến 7)

Chỉ có 7 giá trị cố định, nên làm hằng số hoặc enum thay vì repository riêng.

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `number` | PartNumber | Lõi | 1 đến 7 |
| `section` | Section | Lõi | Part 1-4 là LISTENING, Part 5-7 là READING |
| `name` | string | Lõi | "Photographs", "Incomplete Sentences"... |
| `questionCount` | number | Lõi | Số câu chuẩn: 6, 25, 39, 30, 30, 16, 54 |
| `choiceCount` | 3 \| 4 | Mở rộng | Part 2 chỉ có 3 lựa chọn, còn lại 4 |
| `hasGroups` | boolean | Mở rộng | Part 3, 4, 6, 7 có đoạn dùng chung |
| `requiresAudio` | boolean | Tùy chọn | Part 1-4 cần audio |

### 1.3 QuestionGroup – nhóm câu dùng chung một đoạn

Chỉ cần cho Part 3, 4, 6, 7.

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh |
| `examId` | string | Lõi | Thuộc đề nào |
| `part` | PartNumber | Lõi | Thuộc Part nào |
| `passage` | string | Lõi | Đoạn văn hoặc lời thoại (dạng text) |
| `order` | number | Mở rộng | Thứ tự nhóm trong Part |
| `passageType` | string | Tùy chọn | "email", "advertisement", "chat", "table"... |
| `secondaryPassages` | string[] | Tùy chọn | Đoạn thứ hai, thứ ba (Part 7 dạng đoạn đôi/ba) |
| `audioUrl` | string | Tùy chọn | Đường dẫn audio nếu có |
| `imageUrl` | string | Tùy chọn | Hình kèm theo (biểu đồ, bảng) |

### 1.4 Question – một câu hỏi

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh |
| `examId` | string | Lõi | Thuộc đề nào |
| `part` | PartNumber | Lõi | Thuộc Part nào |
| `order` | number | Lõi | Số thứ tự trong đề (1 đến 200) |
| `content` | string | Lõi | Nội dung câu hỏi (Part 1, 2 có thể để trống nếu chỉ có audio) |
| `choices` | Choice[] | Lõi | Danh sách lựa chọn (nhúng trực tiếp) |
| `groupId` | string \| null | Mở rộng | Nhóm dùng chung đoạn văn, nếu có |
| `explanation` | string | Mở rộng | Giải thích đáp án |
| `topicIds` | string[] | Mở rộng | Các chủ đề gắn vào câu |
| `difficulty` | Difficulty | Tùy chọn | Mức khó 1 đến 3 |
| `audioUrl` | string | Tùy chọn | Audio riêng của câu (Part 1, 2) |
| `imageUrl` | string | Tùy chọn | Hình của câu (Part 1) |
| `transcript` | string | Tùy chọn | Lời thoại của phần nghe |

> Gợi ý: có thể thêm hàm `getCorrectChoice()` trong class thay vì lưu thêm `correctLabel`, để tránh hai nơi lệch nhau.

### 1.5 Choice – một lựa chọn

Thường nhúng trong Question, không cần file riêng.

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `label` | ChoiceLabel | Lõi | A, B, C hoặc D |
| `text` | string | Lõi | Nội dung lựa chọn |
| `isCorrect` | boolean | Lõi | Có phải đáp án đúng không (mỗi câu đúng một lựa chọn) |
| `explanation` | string | Tùy chọn | Vì sao lựa chọn này sai hoặc đúng |

### 1.6 Topic – chủ đề / tag

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Mở rộng | Định danh |
| `name` | string | Mở rộng | "Ngữ pháp – thì", "Từ vựng – công sở"... |
| `category` | "GRAMMAR" \| "VOCABULARY" \| "SCENARIO" | Tùy chọn | Nhóm lớn của chủ đề |
| `description` | string | Tùy chọn | Mô tả ngắn |

---

## 2. Người học

### 2.1 Learner

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh |
| `name` | string | Lõi | Tên người học |
| `targetScore` | number | Mở rộng | Điểm mục tiêu (10 đến 990) |
| `currentLevel` | number | Tùy chọn | Điểm ước lượng hiện tại |
| `examDate` | Date | Tùy chọn | Ngày dự thi thật |
| `createdAt` | Date | Tùy chọn | Ngày tạo hồ sơ |

> Cố ý chưa có: mật khẩu, email, vai trò (để dành cho giai đoạn framework).

---

## 3. Làm bài

### 3.1 Attempt – một lần làm bài

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh |
| `learnerId` | string | Lõi | Ai làm |
| `examId` | string | Lõi | Làm đề nào |
| `status` | AttemptStatus | Lõi | Đang làm, đã nộp, hết giờ; dùng để chặn nộp hai lần |
| `startedAt` | Date | Lõi | Thời điểm bắt đầu; dùng để tính hết giờ |
| `submittedAt` | Date | Lõi | Thời điểm nộp (trống khi đang làm) |
| `mode` | AttemptMode | Mở rộng | Làm trọn đề hay chỉ luyện một Part/Topic |
| `partFilter` | PartNumber[] | Mở rộng | Các Part được chọn khi luyện riêng |
| `questionIds` | string[] | Mở rộng | Danh sách câu thực tế được làm (khi chế độ luyện chọn lọc) |
| `timeLimitSeconds` | number | Tùy chọn | Giới hạn thời gian riêng cho lần làm này |
| `currentQuestionIndex` | number | Tùy chọn | Vị trí đang làm, để tiếp tục sau khi thoát |

### 3.2 AnswerRecord – câu trả lời cho từng câu

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Lõi | Định danh |
| `attemptId` | string | Lõi | Thuộc lần làm nào |
| `questionId` | string | Lõi | Trả lời câu nào |
| `selectedLabel` | ChoiceLabel \| null | Lõi | Lựa chọn đã chọn (null là bỏ trống) |
| `isCorrect` | boolean | Lõi | Đúng hay sai, chốt tại lúc chấm |
| `timeSpentSeconds` | number | Mở rộng | Thời gian làm câu này |
| `answeredAt` | Date | Tùy chọn | Thời điểm trả lời |
| `isFlagged` | boolean | Tùy chọn | Đánh dấu để xem lại |
| `changeCount` | number | Tùy chọn | Số lần đổi đáp án |

---

## 4. Kết quả

### 4.1 Result – kết quả một lần làm

Có thể lưu hoặc tính lại từ AnswerRecord mỗi lần xem.

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `attemptId` | string | Lõi | Kết quả của lần làm nào |
| `correctByPart` | Record<PartNumber, number> | Lõi | Số câu đúng theo từng Part |
| `listeningRaw` | number | Lõi | Số câu Listening đúng (0 đến 100) |
| `readingRaw` | number | Lõi | Số câu Reading đúng (0 đến 100) |
| `listeningScaled` | number | Lõi | Điểm Listening quy đổi (5 đến 495) |
| `readingScaled` | number | Lõi | Điểm Reading quy đổi (5 đến 495) |
| `totalScaled` | number | Lõi | Tổng điểm (10 đến 990) |
| `totalQuestions` | number | Mở rộng | Số câu đã làm |
| `unansweredCount` | number | Mở rộng | Số câu bỏ trống |
| `accuracyByPart` | Record<PartNumber, number> | Mở rộng | Tỉ lệ đúng theo Part |
| `totalTimeSeconds` | number | Tùy chọn | Tổng thời gian làm |
| `gradedAt` | Date | Tùy chọn | Thời điểm chấm |

---

## 5. Ôn tập

### 5.1 WrongQuestionList – sổ câu sai

Mỗi dòng là một câu mà một người học từng làm sai.

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Mở rộng | Định danh |
| `learnerId` | string | Mở rộng | Của ai |
| `questionId` | string | Mở rộng | Câu nào |
| `wrongCount` | number | Mở rộng | Số lần làm sai |
| `lastWrongAt` | Date | Mở rộng | Lần sai gần nhất |
| `lastAttemptId` | string | Tùy chọn | Lần làm gần nhất gây ra lỗi |
| `isMastered` | boolean | Tùy chọn | Đã làm đúng lại liên tục, có thể gỡ khỏi sổ |
| `note` | string | Tùy chọn | Ghi chú cá nhân |

### 5.2 Vocabulary – từ vựng (tùy chọn)

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Tùy chọn | Định danh |
| `word` | string | Tùy chọn | Từ tiếng Anh |
| `partOfSpeech` | string | Tùy chọn | Loại từ (noun, verb...) |
| `meaning` | string | Tùy chọn | Nghĩa tiếng Việt |
| `exampleSentence` | string | Tùy chọn | Câu ví dụ |
| `sourceQuestionId` | string | Tùy chọn | Gặp ở câu nào trong đề |
| `topicIds` | string[] | Tùy chọn | Chủ đề liên quan |

### 5.3 Flashcard – thẻ ôn từ (tùy chọn)

| Thuộc tính | Kiểu | Mức | Mô tả |
|---|---|---|---|
| `id` | string | Tùy chọn | Định danh |
| `learnerId` | string | Tùy chọn | Của ai |
| `vocabularyId` | string | Tùy chọn | Thẻ của từ nào |
| `box` | number | Tùy chọn | Hộp ôn (cho lặp lại ngắt quãng kiểu Leitner) |
| `nextReviewAt` | Date | Tùy chọn | Lần ôn kế tiếp |
| `reviewCount` | number | Tùy chọn | Số lần đã ôn |
| `lastResult` | "KNOWN" \| "UNKNOWN" | Tùy chọn | Kết quả lần ôn gần nhất |

---

## 6. Bảng cấu hình (không phải thực thể, nhưng cần có)

### ScoreConversionTable – bảng quy đổi điểm

TOEIC quy đổi từ số câu đúng sang điểm theo bảng, không tuyến tính. Nên để thành file cấu hình riêng, không hard-code trong logic chấm.

| Thuộc tính | Kiểu | Mô tả |
|---|---|---|
| `section` | Section | Listening hoặc Reading |
| `rawScore` | number | Số câu đúng (0 đến 100) |
| `scaledScore` | number | Điểm quy đổi tương ứng (5 đến 495) |

---

## 7. Tóm tắt "lõi tối thiểu" để chạy được

Nếu muốn bắt đầu nhỏ nhất, mỗi thực thể chỉ cần các thuộc tính "Lõi":

- **Exam**: `id`, `title`, `durationMinutes`, `status`
- **Question**: `id`, `examId`, `part`, `order`, `content`, `choices`
- **Choice**: `label`, `text`, `isCorrect`
- **Learner**: `id`, `name`
- **Attempt**: `id`, `learnerId`, `examId`, `status`, `startedAt`, `submittedAt`
- **AnswerRecord**: `id`, `attemptId`, `questionId`, `selectedLabel`, `isCorrect`
- **Result**: `attemptId`, `correctByPart`, `listeningRaw`, `readingRaw`, `listeningScaled`, `readingScaled`, `totalScaled`

Các thuộc tính còn lại thêm dần khi sang tầng mở rộng, mà không phá cấu trúc cũ.
