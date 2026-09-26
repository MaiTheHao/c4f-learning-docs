# Design Pattern & Nguyên tắc SOLID

**Design Pattern** là các _giải pháp tổng thể_ đã _được kiểm chứng_ và có thể _tái sử dụng_ trong phát triển phần mềm để giải quyết các _vấn đề phổ biến_ trong _Bối cảnh nhất định_.

**Design Pattern** dựa trên các nguyên tắc **OOP** và tuân theo các nguyên lý thiết kế như **SOLID**.

Áp dụng **Design Pattern** giúp source trở nên sạch sẽ, dễ sửa đổi.

---

## Cách học tốt

Bạn không cần phải học thuộc tất cả các Design Pattern (DP). Hãy tập trung vào:

-   Hiểu rõ các nguyên lý **SOLID** dưới đây.
-   Học những DP phổ biến trước.
-   Học theo nhu cầu dự án.
-   Thực hành áp dụng vào thực tế.

Nên học theo thứ tự: **Creational → Structural → Behavioral**.

---

## 5 Nguyên lý SOLID thiết kế hướng đối tượng

Dưới đây là chi tiết từng nguyên lý thuộc SOLID:

-   [**S** - Single Responsibility Principle (SRP)](./single_responsibility_principle.md): Một lớp chỉ nên có một lý do để thay đổi.
-   [**O** - Open Closed Principle (OCP)](./open_closed_principle.md): Mở để mở rộng, đóng để sửa đổi.
-   [**L** - Liskov Substitution Principle (LSP)](./liskov_substitution_principle.md): Lớp con thay thế hoàn hảo cho lớp cha mà không phá vỡ tính đúng đắn.
-   [**I** - Interface Segregation Principle (ISP)](./interface_segregation_principle.md): Client không nên phụ thuộc vào interface chứa các method không sử dụng.
-   [**D** - Dependency Inversion Principle (DIP)](./dependency_inversion_principle.md): Phụ thuộc vào Abstraction, không phụ thuộc vào chi tiết.

---

> [!TIP]
> Để tìm hiểu sâu về mối quan hệ giữa **DIP**, **Dependency Injection (DI)** và các kiến trúc **IoC Container**, hãy đọc thêm: [IoC, DI và DIP: Từ triết lý Inversion of Control đến IoC Container hiện đại](../ioc.md).

---
[← Quay lại mục lục Design Patterns](../README.md)
