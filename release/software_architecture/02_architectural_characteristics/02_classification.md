# Phân loại Đặc tính Kiến trúc

## Table of Contents

- [Ba nhóm Đặc tính Kiến trúc](#ba-nhóm-đặc-tính-kiến-trúc)
- [Phân biệt các Đặc tính Dễ Nhầm](#phân-biệt-các-đặc-tính-dễ-nhầm)
- [Bổ sung cho Ứng dụng Cloud-Native](#bổ-sung-cho-ứng-dụng-cloud-native)
- [Liên quan](#liên-quan)

---

## Ba nhóm Đặc tính Kiến trúc

Danh sách đặc tính rất dài, nên cần một khung để biết mỗi đặc tính chi phối phần nào của hệ thống. *Fundamentals of Software Architecture* chia chúng thành ba nhóm theo phạm vi ảnh hưởng:

| Nhóm | Phạm vi chi phối | Đặc tính tiêu biểu |
| :--- | :--- | :--- |
| **Operational** | Hoạt động của hệ thống tại runtime và hạ tầng | Performance, Scalability, Elasticity, Availability, Reliability, Fault Tolerance |
| **Structural** | Chất lượng cấu trúc mã nguồn và khả năng tiến hóa | Modularity, Maintainability, Testability, Deployability, Extensibility, Configurability |
| **Cross-Cutting** | Quản trị và an ninh bao phủ toàn hệ thống | Security, Auditability, Legal & Compliance |

**Operational** quyết định hệ thống cảm nhận ra sao từ phía người dùng và hạ tầng. **Structural** là nhóm gần nhất với công việc hằng ngày của đội phát triển: hệ thống có Modularity tốt, Maintainability cao và Testability thuận lợi sẽ hấp thụ thay đổi nhanh hơn nhiều so với khối mã rối rắm nhưng tình cờ vẫn chạy đúng. **Cross-Cutting** không thuộc một thành phần riêng lẻ mà áp lên toàn hệ thống: **Security** gồm xác thực, phân quyền, bảo mật và toàn vẹn dữ liệu; **Auditability** yêu cầu lưu vết đủ để truy vết giao dịch quan trọng; **Legal & Compliance** ràng buộc hệ thống theo quy định về bảo vệ dữ liệu cá nhân hay dữ liệu tài chính.

---

## Phân biệt các Đặc tính Dễ Nhầm

Hai bộ ba trong nhóm Operational thường bị gộp chung:

| Đặc tính | Trả lời câu hỏi | Ý nghĩa |
| :--- | :--- | :--- |
| **Performance** | Hệ thống nhanh đến đâu? | Thời gian phản hồi và tốc độ xử lý. |
| **Scalability** | Tải tăng thì hệ thống còn hiệu quả không? | Giữ hiệu quả khi lượng người dùng hoặc yêu cầu tăng. |
| **Elasticity** | Tài nguyên có tự co giãn theo tải không? | Tự động tăng giảm tài nguyên theo lưu lượng. |
| **Availability** | Hệ thống có luôn sẵn sàng không? | Mức độ sẵn sàng phục vụ. |
| **Reliability** | Hệ thống có chạy đúng không? | Xác suất chạy đúng trong một khoảng thời gian. |
| **Fault Tolerance** | Có sự cố thì hệ thống có sống tiếp không? | Tiếp tục hoạt động khi phần cứng hoặc phần mềm lỗi. |

---

## Bổ sung cho Ứng dụng Cloud-Native

Môi trường đám mây biến thêm ba đặc tính thành bắt buộc:

- **Portability**: cô lập phụ thuộc để cùng một artifact chạy được ở nhiều môi trường.
- **Scalability** (theo cách cloud-native): tiến trình không trạng thái, nên nhân bản là thao tác vận hành thay vì thay đổi kiến trúc.
- **Disposability**: khởi động nhanh và tắt êm, để thay thế phiên bản diễn ra liên tục mà không gián đoạn.

> [!NOTE]
> Bộ nguyên tắc **12-Factor App** hệ thống hóa những yêu cầu này thành tiêu chuẩn thiết kế, biến chúng từ lựa chọn riêng của từng đội thành điều kiện mặc định của nền tảng đám mây.

---

## Liên quan

*   [Giới thiệu Architectural Characteristics](01_introduction.md) — khung phân loại này chỉ có nghĩa sau khi đã xác định **định nghĩa và tiêu chí** của một đặc tính kiến trúc.
*   [Explicit, Implicit và Composite](03_explicit_implicit_composite.md) — sau khi biết một đặc tính thuộc nhóm nào, câu hỏi tiếp theo là nó xuất hiện **rõ ràng hay ngầm định** trong yêu cầu kinh doanh.
*   [Architecture Styles Trong Kiến Trúc Phần Mềm](../04_architecture_styles/01_introduction.md) — cùng trục **từ đặc tính đến cấu trúc**: khung phân loại đặc tính là tiêu chí để chọn style, còn style là cách hiện thực hóa chúng.

---
[← Back to README](README.md)