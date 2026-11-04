# Software Architecture - Kiến Trúc Phần Mềm

## Table of Contents

- [Abstract](#abstract)
- [Danh mục Chương](#danh-mục-chương)
- [Tài liệu Tham khảo](#tài-liệu-tham-khảo)

---

## Abstract

Kiến trúc phần mềm là bộ môn định hình cấu trúc, hành vi và các quy tắc quản trị của toàn bộ hệ thống. Không đơn thuần là việc vẽ các sơ đồ tĩnh, kiến trúc là sự kết hợp có chủ đích giữa các yêu cầu phi chức năng, phân rã ranh giới thành phần và các quyết định kỹ thuật mang tính chiến lược.

Trọng tâm của kỹ nghệ kiến trúc nằm ở năng lực phân tích bối cảnh và làm chủ **Trade-off**. Một giải pháp kiến trúc chỉ có giá trị thực tiễn khi những ưu điểm nó đem lại vượt trội hơn chi phí vận hành và độ phức tạp phát sinh trong môi trường thực tế.

Phân nhánh tài liệu này tổng hợp các nguyên lý nền tảng, quy luật thiết kế bất biến và phương pháp rèn luyện tư duy chiến lược cho kiến trúc sư phần mềm.

---

## Danh mục Chương

1. **[00. Introduction](00_introduction/README.md)** - Bối cảnh kinh tế kỹ thuật, 3 quy luật Trade-off bất biến và 8 kỳ vọng năng lực đối với kiến trúc sư.
2. **[01. Modularity](01_modularity/README.md)** - Bản chất mô-đun hóa, ranh giới độ mịn (Granularity) và ba trụ cột định lượng: Cohesion, Coupling, Connascence.
3. **[02. Architectural Characteristics](02_architectural_characteristics/README.md)** - Đặc tính kiến trúc, phân loại Operational/Structural/Cross-Cutting, phạm vi Architectural Quantum và quản trị bằng Trade-off cùng Fitness Functions.
4. **[03. Components](03_components/README.md)** - Định nghĩa component, tư duy ranh giới theo trục thay đổi, các nguyên tắc SDP/SAP/ADP, lợi ích cô lập thay đổi và những thách thức về độ mịn, phụ thuộc vòng, pipeline.
5. **[04. Architecture Styles](04_architecture_styles/README.md)** - Chín phong cách kiến trúc từ Layered, Modular Monolith đến Microservices, phân loại theo Monolithic/Distributed và Technical/Domain, kèm ma trận đối chiếu và nguyên tắc lựa chọn.

---

## Tài liệu Tham khảo

Toàn bộ nội dung trong phân nhánh này được tổng hợp, đối chiếu và chuẩn hóa từ các tài liệu sách kỹ thuật chuẩn mực:

| Sách Tham khảo                                                               | Tác giả                      |
| :--------------------------------------------------------------------------- | :--------------------------- |
| **Fundamentals of Software Architecture (2nd Edition)**                      | Mark Richards & Neal Ford    |
| **Clean Architecture: A Craftsman's Guide to Software Structure and Design** | Robert C. Martin (Uncle Bob) |

---

[← Quay lại Release Docs](../README.md)
