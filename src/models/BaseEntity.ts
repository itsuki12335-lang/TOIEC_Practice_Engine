export type Section = "Listening" | "Reading"; // 2 loại thi của TOEIC
export type PartNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7; // Số hiệu của các phần thi TOEIC
export type ChoiceLabel = "A" | "B" | "C" | "D"; // Các phương án trắc nghiệm
export type ExamStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
/* Trạng thái bài kiếm trả
   DRAFT :bản nháp chưa được kiểm tra 
   PUBLISHED : đã công khai
   ARCHIVED : Đã hết hạn
  */
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
/* Trạng thái bài thi 
    IN_PROGRESS : Đang làm
    SUMITTED : Đã nộp 
    EXPIRED : Hết giờ nhưng chưa kịp nộp
*/
export type AttemptMode = // Chế độ ôn thi
  | "FULL_EXAM" // Thi thử như thật
  | "PART_PRACTICE" // Luyện riêng từng phần
  | "TOPIC_PRACTICE" // Luyện theo chủ đề
  | "WRONG_REVIEW"; // Làm lại các câu đã làm sai
export type Difficulty = 1 | 2 | 3; // Độ khó Easy | Medium | Hard

export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt?: Date;
}
