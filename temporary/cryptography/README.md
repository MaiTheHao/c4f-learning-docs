# Chuyên đề Cryptography

Chuyên đề này bao quát **Cryptography** từ nền tảng đối xứng và bất đối xứng tới truy vấn trên dữ liệu mã hóa và quan hệ giữa độ dài khóa với độ dài dữ liệu, làm cầu nối giữa lý thuyết mật mã và quyết định triển khai trong hệ thống lưu trữ và truyền tải.

---

## Table of Contents

- [Giới thiệu Chuyên đề](#giới-thiệu-chuyên-đề)
- [Danh sách Bài học & Thuật toán](#danh-sách-bài-học--thuật-toán)
- [Mục tiêu của Chuyên đề](#mục-tiêu-của-chuyên-đề)

---

## Giới thiệu Chuyên đề

Chuyên đề này cung cấp cái nhìn toàn diện từ cơ bản đến nâng cao về **Cryptography**, từ mã hóa đối xứng và bất đối xứng tới truy vấn trên dữ liệu mã hóa (nền tảng an toàn thông tin cốt lõi trong viễn thông, hệ thống web, lưu trữ dữ liệu và các giao thức mạng bảo mật như HTTPS, TLS, SSH, VPN).

---

## Danh sách Bài học & Thuật toán

Dưới đây là sơ đồ lộ trình học tập và bảng tra cứu chi tiết các tài liệu trong chuyên đề:

| Bài học / Thuật toán | Loại thuật toán | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- | :--- |
| **Bài 1: Giới thiệu Encryption** | **Tổng quan** | Phân loại mã hóa đối xứng và bất đối xứng, cơ chế hoạt động, cơ sở toán học và mô hình **Hybrid Encryption** trong HTTPS/TLS. | [Tổng quan Encryption →](introduce.md) |
| **Thuật toán RSA** | **Mã hóa Bất đối xứng** | Chi tiết thuật toán RSA: Sinh cặp khóa, hàm Euler Totient $\Phi(n)$, chọn $e, d$, Nghịch đảo Modulo, cùng quy trình Mã hóa ($C = M^e \bmod n$) và Giải mã ($M = C^d \bmod n$). | [Chi tiết thuật toán RSA →](algorithms/RSA.md) |
| **Thuật toán AES** | **Mã hóa Đối xứng** | Chuẩn mã hóa tiên tiến Rijndael (AES-128, AES-256), các chế độ vận hành (CBC, GCM) và tăng tốc phần cứng với tập lệnh `AES-NI`. | [Chi tiết thuật toán AES →](algorithms/AES.md) |
| **Bài 2: Cipher Levels và Onion trong CryptDB** | **Truy vấn trên dữ liệu mã hóa** | Phân biệt **RND**, **DET**, **OPE**, **HOM**, **SEARCH**, **JOIN** và luồng bóc lớp **Onion Encryption** theo truy vấn SQL cùng **Trade-off** rò rỉ thông tin. | [Cipher Levels và Onion Encryption →](cryptdb_cipher_levels_onion_encryption.md) |
| **Bài 3: Độ dài dữ liệu và độ dài khóa** | **Tham số mật mã** | Vì sao **AES** có khối cố định `128 bit` mà khóa vẫn có thể là `128`, `192` hoặc `256 bit`, khi nào **OTP** mới cần khóa dài bằng bản rõ, và độ dài khóa được chọn dựa trên điều gì. | [Độ dài dữ liệu và độ dài khóa →](key_length_vs_data_length.md) |

---

## Mục tiêu của Chuyên đề

1. **Nắm vững Lý thuyết và Cơ chế:** Hiểu rõ nguyên lý hoạt động của **symmetric encryption** và **asymmetric encryption**. [Tổng quan Encryption](introduce.md).
2. **Nền tảng Toán học và Hiệu năng:** Hiểu lý do các thuật toán số mũ như RSA/ECC tiêu tốn CPU hơn so với AES, và cách mô hình **Hybrid Encryption** kết hợp ưu điểm của cả hai để tối ưu hóa bảo mật mạng. [Chi tiết thuật toán RSA](algorithms/RSA.md). [Tổng quan Encryption](introduce.md).
3. **Ứng dụng Thực tiễn:** Biết cách lựa chọn và triển khai thuật toán mã hóa phù hợp cho **Data at Rest** và **Data in Transit**, cùng quan hệ giữa độ dài khóa và độ dài dữ liệu và **Trade-off** khi truy vấn trên dữ liệu mã hóa. [Độ dài dữ liệu và độ dài khóa](key_length_vs_data_length.md). [Cipher Levels và Onion Encryption](cryptdb_cipher_levels_onion_encryption.md).

---
[← Quay lại trang chủ](../../README.md)

