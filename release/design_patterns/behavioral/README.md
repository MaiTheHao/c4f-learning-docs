# Behavioral Patterns (Nhóm mẫu hành vi)

> [!IMPORTANT]
> Toàn bộ nội dung và phân tích trong tài liệu về các mẫu thiết kế Behavioral được bản thân đúc kết trực tiếp từ cuốn sách kinh điển [*Design Patterns: Elements of Reusable Object-Oriented Software*](../../../library/books/design_patterns.epub).

**Behavioral Patterns (Mẫu thiết kế hành vi)** tập trung giải quyết các bài toán liên quan đến thuật toán và sự phân bổ trách nhiệm giữa các đối tượng trong hệ thống. Không dừng lại ở việc mô tả cấu trúc của các lớp hay đối tượng, nhóm mẫu thiết kế này đặc trưng hóa các mô hình truyền thông và dòng điều khiển phức tạp vốn rất khó theo dõi tại thời điểm thực thi (**Runtime**). Nhờ đó, chúng chuyển dịch sự chú ý của nhà thiết kế từ luồng điều khiển tuyến tính sang cách thức các đối tượng được kết nối và tương tác với nhau. Về mặt phân loại phạm vi (**Scope**), các mẫu hành vi cấp độ lớp sử dụng cơ chế kế thừa để phân bổ hành vi giữa các lớp, trong khi các mẫu hành vi cấp độ đối tượng tận dụng **Object Composition** thay vì kế thừa để cho phép một nhóm các đối tượng đồng cấp hợp tác thực hiện tác vụ. Chủ đề xuyên suốt của nhóm mẫu thiết kế này là đóng gói sự biến đổi (**Encapsulating Variation**) bằng cách định nghĩa một đối tượng riêng biệt để bao bọc phần logic hay thay đổi, cho phép các thành phần khác cộng tác mà không bị ảnh hưởng bởi sự thay đổi đó. Thêm vào đó, chúng cung cấp các cơ chế truyền thông lỏng lẻo thông qua việc chuyển đổi các yêu cầu hoặc trạng thái thành các đối tượng tham số (tokens) có tính đa hình cao, đồng thời bổ trợ lẫn nhau để tạo nên một hệ thống phối hợp chặt chẽ, tối ưu hóa tính tái sử dụng và khả năng bảo trì.

---

## Table of Contents

- [1. Observer](#1-observer)
- [2. Strategy](#2-strategy)

---

## 1. Observer

Mẫu **Observer** (thường được gọi là mô hình **Publish-Subscribe**) định nghĩa mối quan hệ phụ thuộc một-nhiều giữa các đối tượng, đảm bảo khi đối tượng chủ thể (**Subject**) thay đổi trạng thái, toàn bộ các đối tượng quan sát phụ thuộc (**Observer**) sẽ tự động nhận được thông báo và đồng bộ trạng thái tương ứng. Mẫu này được ứng dụng rộng rãi trong các hệ thống hướng sự kiện, ràng buộc dữ liệu giao diện và hàng đợi tin nhắn, mang lại lợi ích giảm thiểu **Tight Coupling** giữa chủ thể và người nhận thông tin đồng thời tuân thủ chặt chẽ nguyên tắc **Open/Closed Principle (OCP)**. [Xem chi tiết Observer Pattern](./observer.md)

---

## 2. Strategy

Mẫu **Strategy** đóng gói từng thuật toán trong một họ giải thuật thành các lớp độc lập có cùng giao diện trừu tượng, cho phép linh hoạt hoán đổi hành vi xử lý của đối tượng ngữ cảnh (**Context**) ngay tại **Runtime**. Bằng cách tách biệt thuật toán khỏi mã nguồn điều phối, mẫu thiết kế này loại bỏ hoàn toàn các cấu trúc rẽ nhánh điều kiện phức tạp, gia tăng tính mở rộng khi cần bổ sung chiến lược tính toán, phương thức thanh toán hoặc định dạng dữ liệu mới mà không làm ảnh hưởng đến mã nguồn hiện hữu. [Xem chi tiết Strategy Pattern](./strategy.md)

---

[← Back to README](../README.md)
