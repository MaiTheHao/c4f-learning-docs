# Trade-off và Quản trị Kiến trúc

## Table of Contents

- [Nguyên lý Trade-off](#nguyên-lý-trade-off)
- [Quản trị bằng Fitness Functions](#quản-trị-bằng-fitness-functions)
- [Liên quan](#liên-quan)

---

## Nguyên lý Trade-off

Quy luật thứ nhất của kiến trúc phần mềm: mọi thứ đều là **Trade-off**. Hỗ trợ quá nhiều đặc tính cùng lúc đẩy hệ thống vào vòng xoáy phức tạp và chi phí, trong khi lợi ích biên của mỗi đặc tính bổ sung ngày càng giảm. Mục tiêu không phải là kiến trúc hoàn hảo mà là **Least Worst Architecture**: phương án ít tệ nhất trong bối cảnh cụ thể.

Các đặc tính thường xung đột trực tiếp. *Continuous Delivery* nhấn mạnh rằng kiến trúc sư phải phân tích chi phí và lợi ích theo giá trị kinh doanh thực sự, thay vì tối ưu cục bộ một chỉ số:

| Cặp Đặc tính | Xung đột điển hình |
| :--- | :--- |
| **Security** và **Performance** | Mã hóa, xác thực nhiều lớp và kiểm tra quyền làm tăng độ trễ mỗi request. |
| **Availability** và **Consistency** | Ưu tiên phục vụ liên tục thường buộc phải chấp nhận dữ liệu tạm thời không đồng nhất. |
| **Extensibility** và **Simplicity** | Càng nhiều điểm mở rộng, chi phí hiểu và bảo trì càng cao. |

> [!IMPORTANT]
> Không có bộ đặc tính nào tối ưu cho mọi bối cảnh. Một quyết định chỉ đúng khi nêu rõ đặc tính nào được ưu tiên, đặc tính nào bị hy sinh và cái giá phải trả.

---

## Quản trị bằng Fitness Functions

**Bài toán**: đặc tính kiến trúc suy thoái dần (**structural decay**) khi đội liên tục thêm tính năng. **Architectural Fitness Functions** giải quyết bằng cơ chế tự động kiểm tra và bảo vệ những đặc tính đã cam kết, gồm hai dạng:

| Dạng | Kiểm tra gì | Ví dụ |
| :--- | :--- | :--- |
| **Cấu trúc** | Hình dạng mã nguồn | Phát hiện vòng phụ thuộc giữa các package. |
| **Hành vi** | Hiệu năng khi chạy | Đo latency, throughput, tỷ lệ lỗi dưới tải mô phỏng. |

*Continuous Delivery* bổ sung yêu cầu thực thi: kiểm thử phi chức năng phải được tự động hóa và tích hợp vào deployment pipeline, để vi phạm về tải, hiệu năng và an ninh bị phát hiện ngay sau mỗi lần check-in thay vì vài tuần sau.

> [!WARNING]
> Một fitness function chỉ có giá trị khi chạy tự động và có quyền chặn pipeline. Nếu chỉ tồn tại dưới dạng tài liệu hoặc kiểm thử thủ công, đặc tính kiến trúc vẫn suy thoái như khi không có nó.

---

## Liên quan

*   [Phạm vi Áp dụng và Architectural Quantum](04_scope_and_quantum.md) — cùng trục **quản trị theo phạm vi**: mỗi quantum cần bộ **Fitness Functions** riêng thay vì một bộ kiểm tra chung.
*   [Quy luật Kiến trúc & Kỳ vọng Năng lực](../00_introduction/02_laws_and_expectations.md) — First Law về **Trade-off** là nền tảng lý thuyết cho nguyên lý **Least Worst Architecture** trong bài này.
*   [Vấn đề và Thách thức khi làm việc với Component](../03_components/04_challenges.md) — tension diagram và bài toán độ mịn là biểu hiện cụ thể của **Trade-off** ở phạm vi component.

---
[← Back to README](README.md)