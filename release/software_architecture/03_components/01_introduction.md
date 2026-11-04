# Component Trong Kiến Trúc Phần Mềm

## Table of Contents

- [Ba Góc nhìn về Component](#ba-góc-nhìn-về-component)
- [Định nghĩa Thống nhất](#định-nghĩa-thống-nhất)
- [Liên quan](#liên-quan)

---

## Ba Góc nhìn về Component

Trong thiết kế và xây dựng hệ thống phần mềm, **Component** là khối xây dựng cơ bản nhất của một hệ thống. Việc hiểu đúng component, ranh giới của nó và cách quản lý phụ thuộc giữa các component tạo ra khác biệt giữa một hệ thống bền vững, dễ tiến hóa và một hệ thống rơi vào hỗn loạn, đắt đỏ khi bảo trì.

Khái niệm này được định nghĩa dưới nhiều góc nhìn bổ trợ lẫn nhau, mỗi góc nhìn làm nổi bật một khía cạnh khác nhau của cùng một thực thể.

### Góc nhìn Đơn vị Triển khai

Robert C. Martin, trong *Clean Architecture*, định nghĩa component là **đơn vị triển khai** nhỏ nhất của một hệ thống. Trong các ngôn ngữ biên dịch, đó là tập hợp các tệp nhị phân được đóng gói thành một artifact (chẳng hạn `.jar` trong Java hay `.dll` trong .NET). Dù được liên kết tĩnh thành một tệp thực thi duy nhất hay đóng gói thành plugin phát hành động, component được thiết kế đúng luôn giữ được **independent deployability** và **independent developability**.

Góc nhìn này trả lời câu hỏi thực dụng nhất: *cái gì được build, phát hành và triển khai như một đơn vị?* Nếu hai phần mã nguồn buộc phải phát hành cùng nhau trong mọi trường hợp, chúng thuộc về cùng một component.

### Góc nhìn Cấu trúc

Theo mô hình C4 và *Fundamentals of Software Architecture*, component là tập hợp các chức năng liên quan được đóng gói ẩn sau một interface sạch, vận hành bên trong một môi trường thực thi như ứng dụng hoặc container. Ở góc nhìn này, trọng tâm không phải định dạng đóng gói mà là **ranh giới** và **hợp đồng giao tiếp** giữa các phần của hệ thống.

### Góc nhìn Continuous Delivery

Jez Humble và David Farley, trong *Continuous Delivery*, mô tả component như một cấu trúc mã nguồn quy mô hợp lý bên trong ứng dụng, sở hữu một API hoặc interface được định nghĩa rõ ràng, đóng gói các hành vi nhất quán và có khả năng thay thế bằng một triển khai khác. Góc nhìn này nhấn mạnh hai thuộc tính: **thay thế được** và **kiểm thử độc lập được**.

---

## Định nghĩa Thống nhất

Ba góc nhìn hội tụ về một định nghĩa chung: component là một đơn vị triển khai độc lập, đóng gói một tập chức năng liên quan sau một interface rõ ràng, có thể được phát triển, kiểm thử và thay thế mà không kéo theo phần còn lại của hệ thống.

| Góc nhìn | Nguồn tiêu biểu | Trọng tâm |
| :--- | :--- | :--- |
| **Đơn vị Triển khai** | *Clean Architecture* | Cái gì được build và phát hành như một đơn vị. |
| **Cấu trúc** | C4, *Fundamentals of Software Architecture* | Ranh giới và interface giữa các phần của hệ thống. |
| **Continuous Delivery** | *Continuous Delivery* | Khả năng thay thế và kiểm thử độc lập. |

Điểm chung của cả ba góc nhìn là **ranh giới có chủ đích**. Một thư mục chứa vài tệp liên quan chưa phải là component nếu nó không có interface rõ ràng và không thể tiến hóa độc lập với phần còn lại.

> [!IMPORTANT]
> Component không phải là đơn vị tổ chức mã nguồn tùy ý. Nó là một cam kết về ranh giới: bên trong được tự do thay đổi, bên ngoài chỉ được giao tiếp qua interface đã thỏa thuận.

---

## Liên quan

*   [Lối tư duy Component](02_component_based_thinking.md) — sau khi có định nghĩa, bước tiếp theo là các nguyên tắc xác định **ranh giới, hướng phụ thuộc và độ ổn định** của component.
*   [Bản chất Modularity & Khung Đo lường](../01_modularity/01_introduction.md) — cùng trục **ranh giới cấu trúc**: Modularity gom mã nguồn thành mô-đun logic, còn Component nâng ranh giới đó lên thành đơn vị triển khai được.

---
[← Back to README](README.md)
