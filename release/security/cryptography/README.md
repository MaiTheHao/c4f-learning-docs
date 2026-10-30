# Chuyên đề Cryptography

Chuyên đề này đi từ nền tảng mật mã tới quyết định triển khai: vì sao dữ liệu cần **Encryption**, **Symmetric Encryption** và **Asymmetric Encryption** khác nhau ở đâu về cơ chế lẫn chi phí tính toán, và mô hình **Hybrid Encryption** trong HTTPS/TLS kết hợp hai hướng đó ra sao. Trên nền tảng ấy, chuyên đề đi sâu vào **RSA** ở mức thuật toán (sinh khóa, hàm Euler Totient, nghịch đảo modulo), rồi mở rộng sang câu hỏi thực dụng hơn: chọn độ dài khóa và độ dài dữ liệu dựa trên điều gì, và làm sao database vẫn chạy được truy vấn SQL trên dữ liệu đã mã hóa với các cipher level **RND**, **DET**, **OPE**, **HOM** trong mô hình **Onion Encryption** của CryptDB. Mục tiêu là biến trực giác "mã hóa là an toàn" thành các quyết định có căn cứ về thuật toán, tham số và **Trade-off** rò rỉ thông tin khi hệ thống buộc phải xử lý trên ciphertext.

---

## Nền tảng mã hóa

Chương này đặt nền cho toàn bộ chuyên đề bằng cách phân loại mã hóa đối xứng và bất đối xứng, giải thích cơ sở toán học khiến thuật toán số mũ như RSA/ECC tốn CPU hơn AES, và mô tả mô hình **Hybrid Encryption** trong HTTPS/TLS. Đi kèm là bài về tham số mật mã, trả lời vì sao khối AES cố định `128 bit` nhưng khóa có thể dài `128`, `192` hoặc `256 bit`, khi nào **OTP** mới cần khóa dài bằng bản rõ, và độ dài khóa được chọn dựa trên điều gì. [Xem Nền tảng mã hóa](./00_foundations/README.md).

---

## Thuật toán

Chương này mổ xẻ từng thuật toán ở mức cơ chế, bắt đầu với **RSA**: sinh cặp khóa, hàm Euler Totient, lựa chọn số mũ mã hóa và giải mã, nghịch đảo modulo, cùng quy trình mã hóa và giải mã trên số học modulo. Phần này đọc tốt nhất sau khi đã nắm khác biệt giữa mã hóa đối xứng và bất đối xứng ở chương nền tảng. [Xem Thuật toán](./01_algorithms/README.md).

---

## Truy vấn trên dữ liệu mã hóa

Chương này chuyển sang bài toán hệ thống: database vẫn phải chạy SQL trên dữ liệu đã mã hóa, nên CryptDB dùng các cipher level **RND**, **DET**, **OPE**, **HOM**, **SEARCH**, **JOIN** và bóc lớp **Onion Encryption** theo từng truy vấn. Trọng tâm là luồng dữ liệu, kết quả database quan sát được và **Trade-off** giữa khả năng truy vấn với mức độ rò rỉ thông tin. [Xem Truy vấn trên dữ liệu mã hóa](./02_encrypted_query/README.md).

---

[← Quay lại trang chủ](../../README.md)
