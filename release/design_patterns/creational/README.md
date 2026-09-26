# Creational Patterns (Nhóm mẫu khởi tạo)

> [!IMPORTANT]
> Toàn bộ nội dung và phân tích trong tài liệu về các mẫu thiết kế Creational được bản thân đúc kết trực tiếp từ cuốn sách kinh điển [*Design Patterns: Elements of Reusable Object-Oriented Software*](../../../library/books/design_patterns.epub).

**Creational Patterns (Mẫu thiết kế khởi tạo)** đóng vai trò trừu tượng hóa quá trình khởi tạo đối tượng, giúp một hệ thống phần mềm hoàn toàn độc lập với cách thức các đối tượng được tạo ra, thiết lập và biểu diễn. Khi các kiến trúc hệ thống dịch chuyển từ việc lạm dụng kế thừa lớp sang tăng cường **Object Composition**, các mẫu thiết kế khởi tạo ngày càng trở nên quan trọng nhờ khả năng chuyển đổi trọng tâm từ việc mã hóa cứng một tập hợp hành vi cố định sang việc định nghĩa một tập hợp nhỏ các hành vi cơ bản có thể ghép nối linh hoạt. Có hai chủ đề cốt lõi lặp đi lặp lại trong nhóm mẫu thiết kế này: chúng mã hóa và che giấu toàn bộ tri thức về các lớp cụ thể mà hệ thống sử dụng, đồng thời giấu kín cách thức các thực thể của các lớp này được tạo ra và liên kết với nhau. Về mặt phân loại theo phạm vi (**Scope**), các mẫu khởi tạo cấp độ lớp sử dụng cơ chế kế thừa để thay đổi lớp được khởi tạo, trong khi các mẫu cấp độ đối tượng ủy quyền nhiệm vụ khởi tạo cho một đối tượng khác. Kết quả là hệ thống chỉ cần tương tác thông qua giao diện trừu tượng (`interface`), cho phép người phát triển dễ dàng cấu hình hệ thống một cách tĩnh tại thời điểm biên dịch (**Compile-time**) hoặc động tại thời điểm chạy (**Runtime**) với các đối tượng sản phẩm đa dạng về cấu trúc và chức năng.

---

## Table of Contents

- [1. Abstract Factory](#1-abstract-factory)
- [2. Builder](#2-builder)
- [3. Factory Method](#3-factory-method)
- [4. Prototype](#4-prototype)
- [5. Singleton](#5-singleton)

---

## 1. Abstract Factory

Mẫu **Abstract Factory** (hay còn gọi là **Kit**) cung cấp một giao diện trừu tượng để khởi tạo các họ đối tượng liên quan hoặc phụ thuộc lẫn nhau mà không cần chỉ định rõ các lớp cụ thể tại nơi gọi. Thiết kế này giúp ứng dụng cô lập hoàn toàn các lớp cụ thể, dễ dàng hoán chuyển toàn bộ hệ sinh thái sản phẩm và đảm bảo tính nhất quán giữa các thành phần cộng tác. [Xem chi tiết Abstract Factory Pattern](./abstract_factory.md)

---

## 2. Builder

Mẫu **Builder** tách rời hoàn toàn quá trình kiến tạo một đối tượng phức tạp khỏi biểu diễn cụ thể của nó, cho phép cùng một quy trình xây dựng từng bước dưới sự điều phối của đối tượng **Director** có thể tạo ra nhiều dạng biểu diễn khác nhau. Giải pháp này giúp cải thiện tính mô-đun, mang lại quyền kiểm soát chi tiết trên từng giai đoạn lắp ráp và giúp mã nguồn nghiệp vụ độc lập với cấu trúc nội bộ của sản phẩm cuối cùng. [Xem chi tiết Builder Pattern](./builder.md)

---

## 3. Factory Method

Mẫu **Factory Method** (còn được biết đến với tên gọi **Virtual Constructor**) định nghĩa một giao diện tạo đối tượng ở lớp cha nhưng trao quyền quyết định khởi tạo lớp cụ thể nào cho các lớp con. Cách tiếp cận này loại bỏ sự phụ thuộc trực tiếp vào các lớp triển khai cụ thể, đồng thời cung cấp các điểm neo mở rộng linh hoạt cho phép các hệ thống phân cấp lớp song song liên kết chặt chẽ mà vẫn tuân thủ nguyên tắc mở rộng mã nguồn. [Xem chi tiết Factory Method Pattern](./factory_method.md)

---

## 4. Prototype

Mẫu **Prototype** chỉ định loại đối tượng cần tạo bằng cách sử dụng một thể hiện mẫu điển hình làm bản gốc và tạo ra các đối tượng mới thông qua cơ chế sao chép bản mẫu này. Kỹ thuật này giúp hệ thống tránh được việc bùng nổ các phân cấp lớp nhà máy song song, đồng thời cho phép bổ sung, loại bỏ hoặc nạp động các cấu hình đối tượng mới linh hoạt ngay tại **Runtime**. [Xem chi tiết Prototype Pattern](./prototype.md)

---

## 5. Singleton

Mẫu **Singleton** đảm bảo một lớp chỉ duy trì duy nhất một thể hiện trong toàn bộ vòng đời ứng dụng và cung cấp một điểm truy cập toàn cục nhất quán tới thể hiện đó. Việc đóng gói này giúp kiểm soát chặt chẽ tài nguyên dùng chung như bộ điều phối luồng hay kết nối dữ liệu, loại bỏ hoàn toàn việc lạm dụng biến toàn cục gây ô nhiễm không gian tên, trong khi vẫn duy trì khả năng mở rộng thông qua kế thừa khi có yêu cầu cấu hình mới. [Xem chi tiết Singleton Pattern](./singleton.md)

---

[← Back to README](../README.md)
