# Architecture Styles - Phong cách Kiến trúc Phần mềm

## Table of Contents

- [Abstract](#abstract)
- [Danh mục Tài liệu](#danh-mục-tài-liệu)

---

## Abstract

**Architecture Style** mô tả hình dáng tổng thể của hệ thống qua topology component, kiến trúc vật lý, mô hình triển khai, phương thức giao tiếp và topology dữ liệu. Mỗi style được định vị trên hai trục: **monolithic** (chi phí thấp, mở rộng vật lý hạn chế) hay **distributed** (mở rộng và chịu lỗi cao, vận hành phức tạp), và **Technical Partitioning** hay **Domain Partitioning**.

Chín style phổ biến gồm Layered, Modular Monolith, Pipeline, Microkernel, Service-Based, Event-Driven, Space-Based, Orchestration SOA và Microservices, mỗi style có điểm mạnh riêng và đánh đổi không thể tránh. Việc chọn style dựa trên phân tích trade-off theo miền nghiệp vụ, năng lực đội ngũ và ưu tiên chiến lược, không dựa trên mức độ hiện đại của công nghệ; mục tiêu cuối cùng là tìm ra kiến trúc ít tệ nhất.

---

## Danh mục Tài liệu

1. **[01. Architecture Styles Trong Kiến Trúc Phần Mềm](01_introduction.md)**: Định nghĩa style, thuật ngữ Architectural Quantum, hai trục phân loại và bản đồ tổng quan chín style.
2. **[02. Các Monolithic Architecture Styles](02_monolithic_styles.md)**: Layered, Modular Monolith, Pipeline và Microkernel cùng cấu trúc, điểm mạnh và giới hạn vật lý.
3. **[03. Các Distributed Architecture Styles](03_distributed_styles.md)**: Service-Based, Event-Driven, Space-Based, Orchestration SOA và Microservices cùng topology và thách thức phân tán.
4. **[04. Ma trận Đối chiếu Architecture Styles](04_comparison.md)**: Bảng so sánh theo phân chia, Architectural Quanta, điểm mạnh và thách thức, kèm cây quyết định lựa chọn.

---

[← Quay lại Software Architecture](../README.md)