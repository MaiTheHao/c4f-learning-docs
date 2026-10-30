# Nền tảng mã hóa

Chương này trả lời hai câu hỏi trước khi đi vào bất kỳ thuật toán cụ thể nào: mã hóa bảo vệ điều gì và các họ thuật toán khác nhau ở đâu, cùng với cách chọn tham số khóa cho một hệ thống thực tế. Nội dung giữ ở mức khái niệm và nguyên lý, dùng làm điểm tựa để đọc các chương thuật toán và ứng dụng phía sau.

---

## Nội dung

Bài tổng quan giải thích thành phần của một quy trình mã hóa, năm trụ cột bảo mật, sự khác biệt về cơ chế và chi phí tính toán giữa **Symmetric Encryption** và **Asymmetric Encryption**, rồi khép lại bằng mô hình **Hybrid Encryption** trong HTTPS/TLS. [Xem Tổng quan Encryption](./encryption_overview.md).

Bài về tham số mật mã gỡ hiểu lầm phổ biến rằng dữ liệu và khóa phải dài bằng nhau, giải thích quan hệ giữa khối `128 bit` và khóa `128`/`192`/`256 bit` của **AES**, điều kiện khóa dài bằng bản rõ của **OTP**, và căn cứ để chọn độ dài khóa. [Xem Độ dài dữ liệu và độ dài khóa](./key_length_vs_data_length.md).

---

[← Back to README](../README.md)
