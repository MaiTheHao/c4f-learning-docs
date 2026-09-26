# Chuyên đề: Mã hóa (Encryption)

## Table of Contents

- [Giới thiệu Chuyên đề](#giới-thiệu-chuyên-đề)
- [Danh sách Bài học & Thuật toán](#danh-sách-bài-học--thuật-toán)
- [Mục tiêu của Chuyên đề](#mục-tiêu-của-chuyên-đề)

---

## Giới thiệu Chuyên đề

Chuyên đề này cung cấp cái nhìn toàn diện từ cơ bản đến nâng cao về **Mã hóa (Encryption)** — nền tảng an toàn thông tin cốt lõi trong viễn thông, hệ thống web, lưu trữ dữ liệu và các giao thức mạng bảo mật (HTTPS/TLS, SSH, VPN).

---

## Danh sách Bài học & Thuật toán

Dưới đây là sơ đồ lộ trình học tập và bảng tra cứu chi tiết các tài liệu trong chuyên đề:

| Bài học / Thuật toán | Loại thuật toán | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- | :--- |
| **Bài 1: Giới thiệu Encryption** | **Tổng quan** | Phân loại Mã hóa Đối xứng vs Bất đối xứng, cơ chế hoạt động, cơ sở toán học và mô hình Mã hóa Lai (Hybrid Encryption) trong HTTPS/TLS. | [Tổng quan Encryption →](introduce.md) |
| **Thuật toán RSA** | **Mã hóa Bất đối xứng** | Chi tiết thuật toán RSA: Sinh cặp khóa, hàm Euler Totient $\Phi(n)$, chọn $e, d$, Nghịch đảo Modulo, cùng quy trình Mã hóa ($C = M^e \bmod n$) và Giải mã ($M = C^d \bmod n$). | [Chi tiết thuật toán RSA →](algorithms/RSA.md) |
| **Thuật toán AES** | **Mã hóa Đối xứng** | Chuẩn mã hóa tiên tiến Rijndael (AES-128, AES-256), các chế độ vận hành (CBC, GCM) và tăng tốc phần cứng với tập lệnh `AES-NI`. | [Chi tiết thuật toán AES →](algorithms/AES.md) |

---

## Mục tiêu của Chuyên đề

1. **Nắm vững Lý thuyết & Cơ chế:** Hiểu rõ nguyên lý hoạt động của mã hóa đối xứng (Symmetric Encryption) và bất đối xứng (Asymmetric Encryption).
2. **Nền tảng Toán học & Hiệu năng:** Hiểu lý do các thuật toán số mũ như RSA/ECC tiêu tốn CPU hơn so với AES, và cách mô hình Hybrid Encryption kết hợp ưu điểm của cả hai để tối ưu hóa bảo mật mạng.
3. **Ứng dụng Thực tiễn:** Biết cách lựa chọn và triển khai thuật toán mã hóa phù hợp cho dữ liệu lưu trữ (**Data at Rest**) và dữ liệu truyền tải (**Data in Transit**).

---
[← Quay lại trang chủ](../../README.md)

