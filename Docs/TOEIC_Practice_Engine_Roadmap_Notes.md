# TOEIC Practice Engine – Tổng hợp đề xuất để vẽ roadmap

Tài liệu tổng hợp chủ đề, thực thể và thành phần để Nam tự vẽ roadmap, sau đó nhờ kiểm tra tính khả thi.

## 1. Chủ đề và định hướng

**Chủ đề:** TOEIC Practice Engine, ứng dụng dòng lệnh (terminal) luyện thi TOEIC Listening & Reading, viết bằng TypeScript thuần.

**Vì sao chọn TOEIC:**

- Sát nhu cầu thật của sinh viên Việt Nam (chuẩn đầu ra, xin việc).
- Toàn bộ là trắc nghiệm đúng/sai, nên không cần giỏi ngôn ngữ. Độ khó nằm ở logic hệ thống, không nằm ở chuyên môn tiếng Anh.
- Cấu trúc đề cố định (7 Part, 200 câu, thang 990) nên mô hình dữ liệu rõ ràng, rất hợp để luyện thiết kế thực thể.
- Mở rộng được theo tầng, không sợ làm dở.

**Vì sao là ứng dụng dòng lệnh chứ chưa phải website:**

- Mục tiêu hiện tại là luyện vững TypeScript thuần trước khi học framework. Web cần HTTP, giao diện, đăng nhập, tức là phần framework để sau.
- Lõi nghiệp vụ (đề thi, câu hỏi, chấm điểm, thống kê) độc lập với web. Làm lõi trước, sau này gắn vào Express/React mà gần như không phải viết lại logic.
- Không có áp lực thời hạn, nên có thể làm chậm và chắc.

## 2. Mục tiêu học tập (TypeScript thuần)

- Interface, class, `implements` (Repository, các dịch vụ)
- Union type, enum, kiểu literal (loại Part, trạng thái Attempt)
- Generics ở mức vừa phải (một Repository chung)
- Class lỗi riêng cho lỗi nghiệp vụ
- Đọc/ghi file, async/await
- Kiểm thử bằng vitest

## 3. Danh sách thực thể

### Nội dung đề

- `Exam`: một đề thi (tiêu đề, thời lượng, trạng thái)
- `Part`: Part 1 đến 7, thuộc Listening hoặc Reading
- `QuestionGroup`: nhóm câu dùng chung một đoạn văn
- `Question`: nội dung, giải thích đáp án, mức độ khó
- `Choice`: các lựa chọn A, B, C, D, có cờ đúng/sai
- `Topic` (tag): ngữ pháp, từ vựng, chủ đề công sở...

### Người học

- `Learner`: tên, mục tiêu điểm. Chưa cần mật khẩu hay vai trò.

### Làm bài

- `Attempt`: một lần làm bài (bắt đầu, kết thúc, trạng thái đang làm/đã nộp)
- `AnswerRecord`: câu nào, chọn gì, đúng hay sai, thời gian làm

### Kết quả

- `Result`: điểm theo Part, điểm tổng, quy đổi theo thang điểm

### Ôn tập

- `WrongQuestionList`: sổ câu sai
- `Vocabulary` / `Flashcard`: tùy chọn

## 4. Danh sách thành phần

1. **Kho dữ liệu (Repository)** cho từng thực thể, lưu vào file JSON và đặt sau interface để sau này đổi sang database mà không sửa phần còn lại.
2. **Nạp đề từ file** (JSON hoặc CSV) để khỏi gõ tay hàng trăm câu.
3. **Dịch vụ làm bài**: bắt đầu, trả lời, nộp bài, chống nộp hai lần, xử lý hết giờ.
4. **Dịch vụ chấm điểm**: chấm theo Part, quy đổi thang điểm.
5. **Thống kê**: tỉ lệ đúng theo Part/Topic, lịch sử các lần làm, chỉ ra điểm yếu.
6. **Chế độ ôn tập**: luyện lại câu sai, luyện theo Part hoặc Topic.
7. **Giao diện dòng lệnh** mỏng ở ngoài cùng, chỉ gọi các dịch vụ ở trên.
8. **Test** cho phần chấm điểm và thống kê.

## 5. Cố ý để ra ngoài (chờ giai đoạn framework)

- Đăng nhập, mật khẩu, phân quyền
- HTTP, REST API
- Giao diện đồ họa
- Upload và phát file audio (Listening chỉ giữ metadata hoặc bỏ hẳn)
- Thông báo, nhắc lịch học
- Gợi ý cá nhân hóa

## 6. Phân tầng gợi ý (Nam tự quyết ranh giới)

- **Lõi bắt buộc:** Exam, Part, Question, Choice, Learner, Attempt, AnswerRecord, Result; nạp đề, làm bài, chấm điểm, xem kết quả.
- **Mở rộng vừa:** Topic/Tag, thống kê theo Part/Topic, sổ câu sai.
- **Tùy chọn:** Flashcard, luyện theo chủ đề, lặp lại ngắt quãng.

## 7. Lưu ý rút từ dự án Order System

- Đừng bật mọi "luật cứng" ngay từ phase đầu. `strict: true` và test cho phần chấm điểm là đủ; siết thêm khi đã thoải mái.
- Mỗi phase nên kết thúc bằng một thứ chạy được và nhìn thấy được.
- Tự viết trước, sai rồi mới hỏi, để hiểu thật thay vì làm theo hướng dẫn.
- Sau khi xong lõi, mới học framework theo thứ tự: HTTP/REST, Express, xác thực, React, rồi gắn lõi vào.

## 8. Câu hỏi tự kiểm khi vẽ roadmap

1. Thứ tự phụ thuộc giữa các thực thể là gì? (Không có Question thì không có AnswerRecord.)
2. Cuối mỗi phase, mình chạy được và nhìn thấy thứ gì? (Ví dụ: chọn một đề, làm 5 câu, thấy điểm trong terminal.)
3. Phần nào mình chưa biết cách làm và cần học trước?
4. Mỗi phase có đủ nhỏ để xong trong vài ngày đến một hai tuần không?

## 9. Cách gửi lại để kiểm tra

Khi vẽ xong roadmap, gửi kèm hai thứ:

- Các phase theo thứ tự.
- Thứ chạy được ở cuối mỗi phase.

Sau đó nhờ Claude kiểm tra thứ tự phụ thuộc, độ khả thi và chỗ nào bị thiếu hoặc quá nặng.
