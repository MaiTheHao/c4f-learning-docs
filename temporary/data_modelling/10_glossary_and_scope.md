# Glossary and Scope

## Table of Contents

- [1. Glossary](#1-glossary)
- [2. Phân biệt các khái niệm dễ nhầm](#2-phân-biệt-các-khái-niệm-dễ-nhầm)
- [3. Phạm vi của bộ tài liệu](#3-phạm-vi-của-bộ-tài-liệu)
- [4. Nội dung được lược bỏ có chủ đích](#4-nội-dung-được-lược-bỏ-có-chủ-đích)
- [5. Nguồn tài liệu](#5-nguồn-tài-liệu)
- [6. Thứ tự học đề xuất](#6-thứ-tự-học-đề-xuất)

---

## 1. Glossary

| Term | Ý nghĩa trong bộ tài liệu |
| :--- | :--- |
| **Data Modelling** | Quá trình khám phá và tổ chức domain information thành model có quy tắc |
| **Data Model** | Bản mô tả entity, attribute, relationship, constraints và semantics |
| **Conceptual Model** | Mô hình khái niệm nghiệp vụ ở mức WHAT |
| **Logical Model** | Mô hình logic của entity, attribute, relationship và rules, chưa phụ thuộc DBMS |
| **Physical Model** | Cách hiện thực logical model trong môi trường cụ thể |
| **Domain** | Phạm vi nghiệp vụ và vocabulary mà hệ thống đang mô tả |
| **Entity** | Đối tượng hoặc sự kiện cần identity và được quản lý |
| **Attribute** | Thuộc tính mô tả một entity |
| **Identifier** | Giá trị hoặc tổ hợp giá trị xác định identity |
| **Business Rule** | Điều kiện quy định nghiệp vụ cho phép hoặc cấm điều gì |
| **Invariant** | Điều kiện phải luôn đúng trong một consistency boundary |
| **Lifecycle** | Các trạng thái và chuyển đổi của một entity theo thời gian |
| **Workload** | Tập hợp operation, access pattern và đặc tính sử dụng dữ liệu |
| **Access Pattern** | Cách ứng dụng thường đọc, ghi, tìm hoặc tổng hợp dữ liệu |
| **Frequency** | Tần suất một operation xảy ra |
| **Peak** | Mức tải cao nhất trong một khoảng thời gian xác định |
| **Cardinality** | Số lượng entity có thể liên kết qua một relationship |
| **Optionality** | Relationship có bắt buộc tồn tại hay không |
| **Ownership** | Trách nhiệm về correctness và lifecycle của dữ liệu |
| **Association Entity** | Entity biểu diễn một relationship có attribute hoặc lifecycle riêng |
| **Co-location** | Tổ chức dữ liệu liên quan gần nhau để phục vụ truy cập/cập nhật cùng nhau |
| **Normalization** | Giảm duplication và làm rõ nguồn dữ liệu có thẩm quyền |
| **Denormalization** | Tái tổ chức hoặc lặp dữ liệu để phục vụ workload cụ thể |
| **Snapshot** | Bản ghi giữ giá trị đúng tại một thời điểm nghiệp vụ |
| **Projection** | Representation chuẩn bị cho một query hoặc consumer cụ thể |
| **Derived Data** | Dữ liệu được tính hoặc suy ra từ dữ liệu khác |
| **Staleness** | Khoảng thời gian dữ liệu dẫn xuất chưa phản ánh thay đổi mới nhất |
| **Freshness** | Mức độ mới của dữ liệu so với source hoặc thời điểm nghiệp vụ |
| **Referential Integrity** | Đảm bảo relationship tham chiếu đến entity hợp lệ theo rule |
| **Retention** | Thời gian hoặc chính sách lưu giữ dữ liệu |
| **Design Pattern** | Giải pháp có thể tái sử dụng cho một vấn đề và context lặp lại |
| **Trade-off** | Lợi ích đạt được và chi phí/rủi ro phải chấp nhận |
| **Fan-out on Read** | Kết hợp hoặc tính toán ở thời điểm consumer đọc |
| **Fan-out on Write** | Cập nhật trước nhiều representation khi dữ liệu nguồn thay đổi |
| **Reconciliation** | Đối chiếu và sửa sai lệch giữa source và derived representations |
| **Idempotency** | Xử lý lặp một operation mà không tạo thêm hiệu ứng ngoài ý muốn |
| **Schema Evolution** | Quá trình thay đổi representation theo sự phát triển của domain/app |

---

## 2. Phân biệt các khái niệm dễ nhầm

| Khái niệm A | Khái niệm B | Khác biệt |
| :--- | :--- | :--- |
| Entity | Record/Document | Entity là khái niệm domain; record/document là một representation |
| Relationship | Reference | Relationship là quy tắc nghiệp vụ; reference là một cách biểu diễn liên kết |
| Cardinality | Frequency | Cardinality là số lượng liên kết; frequency là tần suất operation |
| Volume | Priority | Volume là số lượng; priority là hậu quả nghiệp vụ khi thao tác chậm/sai |
| Current State | Event History | State mô tả hiện trạng; history mô tả diễn biến |
| Snapshot | Projection | Snapshot giữ sự thật tại thời điểm; projection phục vụ một cách đọc |
| Canonical Data | Derived Data | Canonical là nguồn chuẩn; derived được tính từ nguồn khác |
| Consistency | Freshness | Consistency nói về tính đúng theo rules; freshness nói dữ liệu mới đến đâu |
| Normalization | Correctness | Normalization là kỹ thuật tổ chức; correctness là tiêu chí cần đạt |
| Pattern | Architecture | Pattern giải quyết một vấn đề cục bộ; architecture tổ chức tổng thể hệ thống |

---

## 3. Phạm vi của bộ tài liệu

**In scope:**

- Domain discovery và data model levels.
- Entities, attributes, identifiers, relationships, business rules.
- Workload analysis, operation frequency, growth, cardinality và retention.
- Cardinality, ownership, lifecycle và query direction.
- Co-location, independent representation, normalization, denormalization.
- Duplication, consistency, staleness, snapshot và projection.
- Design patterns và trade-offs.
- Validation, schema evolution và review.

---

## 4. Nội dung được lược bỏ có chủ đích

Các nội dung dưới đây thuộc physical database design, database internals hoặc database administration. Chúng không phải trọng tâm của bộ Data Modelling này:

- So sánh RDBMS, document DB, key-value, wide-column, graph DB và chọn DBMS.
- Cấu trúc lưu trữ vật lý, page/block layout, document size limit hoặc row format.
- RAM, cache, working set và storage engine internals.
- Index type, index tuning và execution plan.
- Sharding, partition key, replica topology và cluster sizing.
- Cấu hình durability hoặc consistency cụ thể theo một database.
- Cú pháp query, aggregation API, driver và framework.
- Benchmark và capacity planning theo phần cứng.

Các chủ đề này có thể cần trong giai đoạn Physical Design hoặc Performance Engineering, nhưng không nên chen vào phần nền tảng khi mục tiêu là học cách suy luận một data model.

---

## 5. Nguồn tài liệu

Bộ tài liệu được tổng hợp từ các file người dùng cung cấp:

1. `01_Chapter_Overview_Subject.pdf`: CLO, course contents và learning objectives của môn học.
2. `02_Chapter_Introduction to MongoDB Data Modeling.pdf`: định nghĩa data modelling, model levels, entity/attribute/relationship và Library case.
3. `02_Chapter_Describe the Workloads.pdf`: workload definition, classification, process, workload table, quantification và binding conditions.
4. `02_Chapter_Case_Study(1).pdf`: Coffee Shop Franchise case, actors, actions, frequency và priority.
5. `03_Chapter_Relationships_DataModeling_Mongodb.pdf` và `03_Chaper_Relationships.pdf`: cardinality, embedding/referencing, relationship choices và anti-patterns.
6. `04_Chapter_Pattern_In_MongoDB1(1).pdf`: pattern fundamentals, duplication, staleness, integrity và Attribute Pattern.
7. `04_Chapter_Pattern_In_MongoDB2(1).pdf`: Extended Reference, Subset và Computed patterns.
8. `04_Chapter_Pattern_In_MongoDB3(1).pdf`: Bucket, Schema Versioning, Tree, Polymorphic, Approximation và Outlier patterns.

### Cách chuyển đổi nội dung

- Giữ lại vocabulary và thứ tự học cốt lõi từ nguồn: **Workload → Relationships → Patterns**.
- Generalize thuật ngữ gắn với MongoDB thành nguyên lý độc lập như co-location, independent representation, reference, controlled duplication và projection.
- Giữ lại các case, quy tắc cardinality và pattern đã có trong slide khi chúng minh họa tốt cho nguyên tắc tổng quát.
- Loại bỏ các con số, giới hạn, cú pháp và cấu hình riêng của MongoDB khi chúng không giúp hiểu Data Modelling.
- Bổ sung một số nền tảng cần thiết để nối các phần lại với nhau: identity, lifecycle, ownership, snapshot, freshness contract, deletion semantics, validation và schema evolution workflow. Đây là phần diễn giải mở rộng ở mức conceptual, không được xem là nội dung trích nguyên văn từ slide.

---

## 6. Thứ tự học đề xuất

1. Đọc `01_foundations.md` để hiểu domain, entity, business rules và các mức model.
2. Học `02_workload_analysis.md`; tự tạo Workload Table cho một ứng dụng quen thuộc.
3. Học `03_relationships_and_cardinality.md`; tập định lượng min/typical/max và ownership.
4. Đọc `04_data_placement_and_consistency.md` trước khi học pattern, vì duplication và staleness là nền tảng của nhiều quyết định.
5. Đọc `05_design_patterns_overview.md`, sau đó học chi tiết `06` và `07`.
6. Theo `08_end_to_end_modelling.md` để thực hiện một quy trình hoàn chỉnh.
7. Làm `09_case_study_coffee_franchise.md`; dùng glossary để tra cứu thuật ngữ và phân định phạm vi khi cần.

---
[← Back to README](README.md)
