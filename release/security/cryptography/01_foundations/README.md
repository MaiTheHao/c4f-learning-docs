# Nền tảng mã hóa

Chương này đặt nền trước khi đi vào bất kỳ thuật toán cụ thể nào: mã hóa bảo vệ điều gì và không bảo vệ điều gì, hai họ thuật toán khác nhau ở đâu, cách chọn tham số khóa cho một hệ thống thực tế, và vì sao hệ thống luôn phải kết hợp cả hai họ. Nội dung giữ ở mức khái niệm, dùng làm điểm tựa để đọc các chương thuật toán và ứng dụng phía sau.

---

## Nội dung

Bài tổng quan giải thích thành phần của một quy trình mã hóa, phân biệt rõ mục tiêu nào do encryption đảm nhiệm và mục tiêu nào cần cơ chế khác, so sánh **Symmetric Encryption** với **Asymmetric Encryption** theo chi phí và khả năng, rồi chỉ ra vì sao hai họ không thay thế nhau. [Xem Tổng quan Encryption](./encryption_overview.md).

Bài về các con số trong mật mã dạy cách đọc `AES-256`, `RSA-2048` và `SHA-256`: `bit` nghĩa là gì, mỗi thuật toán có những con số nào, năm loại kích thước khác nhau ra sao, và vì sao các con số ấy chỉ so sánh được qua **security strength**. Từ đó bài gỡ hiểu lầm phổ biến rằng dữ liệu phải dài bằng khóa. [Xem Các con số trong mật mã](./cryptographic_sizes.md).

Bài về mã hóa lai đi vào khái niệm mô hình mà mọi giao thức thực tế đang dùng: tầng bất đối xứng thiết lập khóa, tầng đối xứng bảo vệ dữ liệu. Nội dung giải thích vì sao hai họ bổ sung cho nhau, hai nghĩa khác nhau của "lai" trong tài liệu, và nguyên tắc phần bất đối xứng chỉ chạm vào khóa. [Xem Mã hóa lai](./hybrid_encryption.md).

---

[← Back to README](../README.md)
