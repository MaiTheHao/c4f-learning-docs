# Truy vấn trên dữ liệu mã hóa

Chương này đặt câu hỏi ở tầng hệ thống: khi dữ liệu đã nằm trong database dưới dạng ciphertext, làm sao vẫn chạy được truy vấn mà không giải mã toàn bộ về phía ứng dụng. Nội dung xoay quanh cách một hệ mã hóa chấp nhận đánh đổi khả năng quan sát của database để đổi lấy năng lực truy vấn.

---

## Nội dung

Bài về CryptDB giải thích vì sao database có thể chạy SQL trên dữ liệu đã mã hóa, phân biệt các cipher level **RND**, **DET**, **OPE**, **HOM** cùng các cơ chế chuyên biệt **SEARCH**, **JOIN**, và mô tả luồng bóc lớp **Onion Encryption** theo từng truy vấn cùng **Trade-off** rò rỉ thông tin đi kèm. [Xem Cipher Levels và Onion Encryption](./cryptdb_cipher_levels_onion_encryption.md).

---

[← Back to README](../README.md)
