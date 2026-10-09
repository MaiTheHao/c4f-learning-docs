# Java

> [!IMPORTANT]
> Nội dung trong chuyên mục này được tổng hợp và đúc kết từ tài liệu chính thức của Java tại [dev.java/learn/language](https://dev.java/learn/language) cùng các nguồn tham khảo mở khác.

**Java** là một trong những ngôn ngữ lập trình hướng đối tượng phổ biến nhất, vận hành trên nền tảng **JVM** với hệ thống **static typing** chặt chẽ và tốc độ tiến hóa ngôn ngữ nhanh qua từng phiên bản. Chuyên mục này tập trung vào bản chất ngôn ngữ Java (cách tổ chức mã nguồn, hệ thống kiểu, cơ chế biên dịch và các tính năng cốt lõi) thay vì liệt kê API. Mục tiêu không phải ghi nhớ cú pháp, mà là hiểu *vì sao* một tính năng hoạt động theo cách nó hoạt động, bao gồm cả những đánh đổi ở tầng biên dịch và runtime quyết định giới hạn của nó trong thực tế.

---

## Table of Contents

- [1. Generics](#1-generics)

---

## 1. Generics

**Generics** cho phép tham số hóa kiểu dữ liệu, nhờ đó một class, interface hay method có thể dùng chung cho nhiều kiểu mà vẫn bảo toàn type safety. Thay vì để collection lưu trữ `Object` rồi cast thủ công (vốn chỉ phát hiện lỗi tại runtime), generics đưa việc kiểm tra kiểu về compile-time. Tài liệu đi sâu vào type parameter và type argument, diamond operator, generic method, bounded type parameter, hệ thống wildcard cùng nguyên tắc PECS, raw type, cho tới cơ chế type erasure (ranh giới quyết định giới hạn của generics tại runtime). [Xem chi tiết Java Generics](./generic_type.md)

---

[← Back to README](../../README.md)
