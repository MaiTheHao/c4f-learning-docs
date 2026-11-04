# Components - Thành phần Trong Kiến Trúc Phần Mềm

## Table of Contents

- [Abstract](#abstract)
- [Danh mục Tài liệu](#danh-mục-tài-liệu)

---

## Abstract

**Component** là đơn vị triển khai độc lập, đóng gói một tập chức năng liên quan sau interface rõ ràng, và là khối xây dựng cơ bản nhất của một hệ thống phần mềm. Ranh giới component được quyết định bởi trục thay đổi, hướng phụ thuộc và độ ổn định chứ không bởi cấu trúc thư mục. Khi được thiết kế đúng, component hóa cách ly những phần biến động, loại bỏ tranh chấp mã nguồn giữa các nhóm, giới hạn ripple effect và cho phép pipeline chạy độc lập để có fast feedback. Tuy nhiên, chính những lợi ích đó lại đi kèm căng thẳng giữa REP, CCP và CRP, nguy cơ chia quá mịn hoặc quá thô, phụ thuộc vòng và chi phí vận hành pipeline, nên quyết định về component luôn là một bài toán trade-off theo bối cảnh.

---

## Danh mục Tài liệu

1. **[01. Component Trong Kiến Trúc Phần Mềm](01_introduction.md)**: Ba góc nhìn về component (đơn vị triển khai, cấu trúc, Continuous Delivery) và định nghĩa thống nhất xoay quanh ranh giới cùng interface.
2. **[02. Lối tư duy Component](02_component_based_thinking.md)**: Ranh giới theo trục thay đổi, bản đồ đóng gói và bảo trì, các nguyên tắc SDP/SAP/ADP, Architectural Quantum và cân bằng động giữa develop-ability với reusability.
3. **[03. Component Giải quyết Vấn đề gì](03_benefits.md)**: Cách ly biến động, loại bỏ Morning After Syndrome, giảm ripple effect và tối ưu pipeline với fast feedback.
4. **[04. Vấn đề và Thách thức khi làm việc với Component](04_challenges.md)**: Tam giác căng thẳng REP/CCP/CRP, bài toán độ mịn, phụ thuộc vòng, nhầm lẫn giữa layering và componentization cùng chi phí vận hành pipeline.

---

[← Quay lại Software Architecture](../README.md)
