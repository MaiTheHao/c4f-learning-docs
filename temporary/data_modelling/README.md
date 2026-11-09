# Data Modelling

Bộ tài liệu này trình bày **Data Modelling** như một hoạt động phân tích và thiết kế dữ liệu ở cấp độ domain và application: bắt đầu từ mục tiêu nghiệp vụ, xác định workload, mô tả quan hệ và vòng đời dữ liệu, sau đó chọn các design patterns để giải quyết vấn đề truy cập, thay đổi và tính nhất quán. Nội dung ưu tiên kiến thức nền tảng có thể áp dụng với nhiều kiểu hệ thống và công nghệ lưu trữ; các khái niệm như document, embedding hay reference chỉ xuất hiện như một cách biểu diễn, không phải trọng tâm của bộ tài liệu.

## 01. Foundations

Phần nền tảng trả lời dữ liệu đại diện cho điều gì, business rules nào chi phối dữ liệu, và cách phân biệt conceptual, logical, physical model. Đây là điểm xuất phát để tránh thiết kế theo cấu trúc lưu trữ trước khi hiểu domain. [See Foundations](./01_foundations.md).

## 02. Workload Analysis

Phân tích workload trước khi định hình data model: ai sử dụng dữ liệu, thao tác nào xảy ra, tần suất và mức độ quan trọng ra sao, dữ liệu tăng trưởng thế nào, và các ràng buộc nào chi phối quyết định. [See Workload Analysis](./02_workload_analysis.md).

## 03. Relationships and Cardinality

Mô tả quan hệ giữa các domain concepts bằng cardinality, optionality, ownership và lifecycle. Từ đó xác định quan hệ nào cần được biểu diễn trực tiếp, quan hệ nào cần một association entity, và quan hệ nào có nguy cơ tăng trưởng không giới hạn. [See Relationships and Cardinality](./03_relationships_and_cardinality.md).

## 04. Data Placement and Consistency

Tìm hiểu nơi đặt dữ liệu liên quan, khi nào nên co-locate, reference, normalize hoặc denormalize, và cách kiểm soát duplication, staleness, integrity cùng semantics của lịch sử dữ liệu. [See Data Placement and Consistency](./04_data_placement_and_consistency.md).

## 05. Design Patterns Overview

Xem design pattern như một đơn vị tri thức tái sử dụng: một vấn đề lặp lại, bối cảnh áp dụng, giải pháp, hệ quả và điều kiện không nên dùng. Phần này cung cấp bản đồ lựa chọn pattern theo vấn đề. [See Design Patterns Overview](./05_design_patterns_overview.md).

## 06. Read Optimization Patterns

Các pattern xử lý dữ liệu thường xuyên được đọc: Attribute, Extended Reference, Subset và Computed. Trọng tâm là ý tưởng, động cơ, dữ liệu phải đồng bộ và trade-off, không đi vào API hay cấu hình của DBMS. [See Read Optimization Patterns](./06_read_optimization_patterns.md).

## 07. Time, Hierarchy and Evolution Patterns

Các pattern cho dữ liệu sự kiện theo thời gian, cấu trúc cây, nhiều biến thể entity và schema thay đổi theo thời gian: Bucket, Tree, Polymorphic, Schema Versioning, Approximation và Outlier. [See Time, Hierarchy and Evolution Patterns](./07_time_hierarchy_and_evolution_patterns.md).

## 08. End-to-End Modelling Workflow

Tổng hợp phương pháp từ discovery đến validation và evolution: domain → workload → relationships → patterns → kiểm chứng bằng tình huống thực tế. [See End-to-End Workflow](./08_end_to_end_modelling.md).

## 09. Coffee Franchise Case Study

Một case study xuyên suốt từ bộ slide: hệ thống chuỗi cửa hàng cà phê có smart shelf, coffee machine, logistics, analysts và support. Dữ liệu được dùng để luyện cách suy luận từ workload chứ không làm bài toán sizing DB. [See Coffee Franchise Case Study](./09_case_study_coffee_franchise.md).

## 10. Glossary and Scope

Từ điển thuật ngữ và ranh giới nội dung: những gì thuộc Data Modelling, những gì thuộc physical database design hoặc database administration, cùng nguồn tài liệu đã được tổng hợp. [See Glossary and Scope](./10_glossary_and_scope.md).
