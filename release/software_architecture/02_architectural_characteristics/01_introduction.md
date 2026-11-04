# Giới thiệu Architectural Characteristics

## Table of Contents

- [Định nghĩa và Bản chất](#định-nghĩa-và-bản-chất)
- [Vì sao Đặc tính Kiến trúc Quan trọng](#vì-sao-đặc-tính-kiến-trúc-quan-trọng)
- [Liên quan](#liên-quan)

---

## Định nghĩa và Bản chất

**Bài toán**: chức năng đúng chưa đủ để một sản phẩm sống lâu. Hai hệ thống cùng đáp ứng một danh sách tính năng vẫn có thể khác hẳn về tốc độ phản hồi, khả năng chịu tải, chi phí vận hành và mức độ dễ thay đổi. Những khía cạnh nằm ngoài miền nghiệp vụ đó là **Architectural Characteristics**.

Theo Mark Richards và Neal Ford trong *Fundamentals of Software Architecture*, đặc tính kiến trúc là một trong **bốn chiều cốt lõi** của kiến trúc phần mềm:

| Chiều | Câu hỏi mà nó trả lời |
| :--- | :--- |
| **Architectural Style** | Hệ thống được tổ chức theo mô hình nào (layered, event-driven, microservices...)? |
| **Logical Components** | Hệ thống gồm những khối chức năng nào và chúng liên kết ra sao? |
| **Architectural Decisions** | Quy tắc nào là bất biến và mọi thành viên phải tuân theo? |
| **Architectural Characteristics** | Ngoài chức năng nghiệp vụ, hệ thống phải đạt những phẩm chất nào? |

Một tiêu chí chỉ là đặc tính kiến trúc khi thỏa mãn đồng thời ba điều kiện:

1. Chỉ định một cân nhắc thiết kế nằm **ngoài miền nghiệp vụ**.
2. **Ảnh hưởng đến cấu trúc** hệ thống, không chỉ là một tham số cấu hình.
3. Mang tính **quyết định** đối với thành công của ứng dụng.

### Vì sao không dùng NFR hay Quality Attributes

**Non-Functional Requirements** dễ bị đọc thành "không hoạt động", vô tình đặt chức năng ở trung tâm và biến phần còn lại thành phụ. **Quality Attributes** gợi hoạt động đánh giá chất lượng sau khi sản phẩm xong, trong khi đặc tính kiến trúc phải được thiết kế từ đầu. **Architectural Characteristics** nhấn mạnh đây là thuộc tính cấu trúc, không phải danh mục kiểm tra cuối dự án.

---

## Vì sao Đặc tính Kiến trúc Quan trọng

Robert C. Martin, trong *Clean Architecture*, phân biệt hai giá trị của phần mềm. **Behavior** giúp hệ thống chạy đúng hôm nay; **Structure** quyết định hệ thống còn thay đổi được trong nhiều năm tới. Structure có giá trị cao hơn vì giữ phần mềm "mềm": dễ thay đổi, mở rộng, bảo trì. Mục tiêu hàng đầu của kiến trúc là tối thiểu hóa nhân lực cần để xây dựng và duy trì hệ thống suốt vòng đời.

Jez Humble và David Farley, trong *Continuous Delivery*, nhìn từ góc độ rủi ro. Hiệu năng, khả năng mở rộng, an ninh và độ tin cậy là những **delivery risk** lớn nhất. Nếu bị coi là thứ yếu, chúng chỉ được kiểm chứng ở cuối, và một lỗ hổng nghiêm trọng phát hiện muộn có thể làm dự án trễ hạn hoặc bị hủy. Vì vậy chúng cần được phân tích và gán giá trị kinh doanh ngang với các câu chuyện chức năng ngay từ đầu.

> [!IMPORTANT]
> Đặc tính kiến trúc không phải phần trang trí thêm sau khi tính năng hoàn thành. Chúng là ràng buộc định hình cấu trúc, và cái giá của việc phát hiện sai quá muộn thường là viết lại kiến trúc.

---

## Liên quan

*   [Phân loại Đặc tính Kiến trúc](02_classification.md) — bước tiếp theo sau định nghĩa: chia đặc tính thành **Operational**, **Structural** và **Cross-Cutting** để biết mỗi loại chi phối phần nào của hệ thống.
*   [Quy luật Kiến trúc & Kỳ vọng Năng lực](../00_introduction/02_laws_and_expectations.md) — First Law về **Trade-off** là nền tảng để hiểu vì sao các đặc tính không thể đồng thời đạt cực đại và luôn phải ưu tiên theo bối cảnh.
*   [Bản chất Modularity & Khung Đo lường](../01_modularity/01_introduction.md) — **Modularity** là một **Structural Characteristic**, nên hai bài chia sẻ trục **ranh giới cấu trúc và khả năng tiến hóa của hệ thống**.

---
[← Back to README](README.md)