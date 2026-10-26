# MVCC - Multi-Version Concurrency Control

**MVCC** là cơ chế kiểm soát tương tranh cho phép nhiều phiên bản logic của một dòng dữ liệu tồn tại song song, nhờ đó transaction đọc không phải chờ transaction ghi và ngược lại. Module này đi từ bài toán tranh chấp của mô hình single-version, qua hai cách hiện thực hoá khác nhau của **PostgreSQL** và **InnoDB**, tới bốn **isolation level** và các hiện tượng tương tranh mà mỗi mức cho phép hoặc ngăn chặn. Trọng tâm không phải học thuộc tên gọi mà là hiểu mỗi engine giữ phiên bản cũ ở đâu, dọn chúng khi nào, và snapshot của một transaction được xác định ra sao. Chính ba câu hỏi đó quyết định hành vi mà người dùng quan sát được.

---

## Nền tảng khái niệm

Nhóm bài đầu xây dựng mô hình tư duy: vì sao một dòng dữ liệu cần nhiều phiên bản, phiên bản cũ được lưu ở đâu, và **Isolation** trong ACID thực chất được bảo đảm bởi cơ chế nào. Bài mở đầu phân tích vì sao mô hình single-version buộc reader và writer loại trừ nhau, định nghĩa **Version**, **Snapshot** và công việc dọn dẹp phiên bản cũ, kèm một mốc lịch sử ngắn để thấy multi-versioning không phải ý tưởng mới. Hai hướng hiện thực hoá được so sánh ở bài thứ hai: **PostgreSQL** giữ tuple version ngay trong heap và dọn bằng **VACUUM**, còn **InnoDB** giữ dòng hiện hành trong clustered index và tái tạo phiên bản cũ từ **undo log**. Sang bài thứ ba, MVCC được đặt vào đúng vị trí trong ACID, kèm việc tách hai nghĩa của từ "nhất quán" thường bị dùng lẫn. [Xem chi tiết Vì sao database cần MVCC](./01_vi_sao_can_mvcc.md). [Xem chi tiết Hai mô hình lưu trữ phiên bản](./02_hai_mo_hinh_luu_truyen_phien_ban.md). [Xem chi tiết Isolation nằm ở đâu trong ACID](./03_isolation_trong_acid.md).

---

## Góc nhìn giao dịch

Phần thứ hai chuyển từ cơ chế lưu trữ sang góc nhìn của người lập trình ứng dụng: một transaction được phép nhìn thấy gì và phải trả giá nào cho góc nhìn đó. Bài về các hiện tượng tương tranh định nghĩa **dirty read**, **non-repeatable read**, **phantom read**, **serialization anomaly** và phân tích ví dụ **write skew**, vì isolation level chỉ có ý nghĩa khi gắn với những hiện tượng cụ thể này. Bài về bốn **isolation level** đối chiếu mức bảo đảm tối thiểu mà chuẩn SQL quy định với cách **PostgreSQL** và **InnoDB** triển khai thực tế, đồng thời tách rõ **consistent read** khỏi **locking read**. [Xem chi tiết Các hiện tượng tương tranh](./04_cac_hien_tuong_tuong_tranh.md). [Xem chi tiết Bốn isolation level](./05_bon_isolation_levels.md).

---

## Đối chiếu và tổng kết

Phần cuối ghép hai engine trên cùng một bảng câu hỏi và chạy một ví dụ hai lần đọc trong cùng transaction để thấy khác biệt về snapshot. Module khép lại bằng phần **Trade-off** và danh sách điểm cần nhớ. Đây là phần nên đọc lại sau khi đã nắm cơ chế, vì nó trả lời trực tiếp câu hỏi: cùng một tên isolation level, khi nào hai engine cho kết quả khác nhau. [Xem chi tiết Đối chiếu PostgreSQL và InnoDB](./06_doi_chieu_engine_va_vi_du.md). [Xem chi tiết Trade-off và tổng kết](./07_tradeoff_va_tong_ket.md).

---

[← Back to README](../README.md)
