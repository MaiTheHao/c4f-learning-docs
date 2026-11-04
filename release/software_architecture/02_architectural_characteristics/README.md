# Architectural Characteristics - Đặc tính Kiến trúc

## Table of Contents

- [Abstract](#abstract)
- [Danh mục Tài liệu](#danh-mục-tài-liệu)

---

## Abstract

**Architectural Characteristics** là những phẩm chất nằm ngoài chức năng nghiệp vụ nhưng quyết định khả năng vận hành và tuổi thọ của hệ thống, từ hiệu năng, khả năng mở rộng, độ tin cậy đến bảo trì, kiểm thử và an ninh. Chúng là một trong bốn chiều cốt lõi của kiến trúc phần mềm, đồng thời là nguồn delivery risk lớn nhất nếu bị xem nhẹ.

Kiến trúc sư phân loại đặc tính thành **Operational**, **Structural**, **Cross-Cutting**, nhận diện đặc tính **Explicit**, **Implicit** và mục tiêu phức hợp như **Agility**, rồi giới hạn phạm vi áp dụng theo **Architectural Quantum** để đặt mục tiêu chất lượng đúng chỗ. Vì mọi đặc tính đều đánh đổi lẫn nhau, quản trị kiến trúc dựa trên **Trade-off** và được bảo vệ tự động bằng **Fitness Functions** trong pipeline CI/CD.

---

## Danh mục Tài liệu

1. **[01. Giới thiệu Architectural Characteristics](01_introduction.md)**: Định nghĩa, bốn chiều cấu thành kiến trúc phần mềm, ba điều kiện tiên quyết và vì sao giá trị cấu trúc quyết định tuổi thọ hệ thống.
2. **[02. Phân loại Đặc tính Kiến trúc](02_classification.md)**: Ba nhóm **Operational**, **Structural**, **Cross-Cutting**, cách phân biệt các đặc tính dễ nhầm và đặc tính bổ sung của cloud-native.
3. **[03. Explicit, Implicit và Composite](03_explicit_implicit_composite.md)**: Cách đặc tính xuất hiện trong yêu cầu, rủi ro của đặc tính ngầm định và cách phân rã mục tiêu phức hợp như **Agility**.
4. **[04. Phạm vi Áp dụng và Architectural Quantum](04_scope_and_quantum.md)**: Giới hạn của giả định monolithic, định nghĩa **Architectural Quantum** và hệ quả khi mỗi vùng có bộ đặc tính riêng.
5. **[05. Trade-off và Quản trị Kiến trúc](05_tradeoffs_and_governance.md)**: **Least Worst Architecture**, các cặp đặc tính xung đột và quản trị bằng **Fitness Functions** trong pipeline CI/CD.

---

[← Quay lại Software Architecture](../README.md)