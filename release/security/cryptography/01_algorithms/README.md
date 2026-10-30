# Thuật toán

Chương này đi vào cơ chế bên trong của từng thuật toán, nơi lý thuyết số và các phép toán modulo quyết định cách khóa được sinh ra và cách bản rõ được biến đổi. Mục tiêu không phải ghi nhớ công thức mà là hiểu vì sao một thuật toán bất đối xứng lại đắt đỏ về tính toán, và những bước nào trong quy trình là điểm cần kiểm soát khi triển khai.

---

## Nội dung

Bài về **RSA** trình bày quy trình sinh cặp khóa, hàm Euler Totient, lựa chọn số mũ mã hóa và giải mã, nghịch đảo modulo, cùng hai phép mã hóa `C = M^e mod n` và giải mã `M = C^d mod n`. Tài liệu **AES** dự kiến bổ sung sau nên chưa xuất hiện trong danh mục, phần khái niệm về AES hiện nằm trong bài tổng quan ở chương nền tảng. [Xem Chi tiết thuật toán RSA](./rsa.md).

---

[← Back to README](../README.md)
