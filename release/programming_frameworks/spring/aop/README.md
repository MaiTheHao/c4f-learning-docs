# AOP và Spring AOP

Bộ tài liệu này xây dựng kiến thức theo lộ trình từ động cơ mô-đun hóa các concern xuyên suốt, qua quan hệ giữa AOP và OOP, đến mô hình Aspect và các giới hạn Runtime của Spring AOP. Mỗi tài liệu tập trung vào một phạm vi riêng để người đọc có thể học theo thứ tự hoặc tra cứu từng chủ đề.

## 01. Fundamentals

Phần nền tảng giải thích vấn đề mà AOP giải quyết, các mốc phát triển chính và cách AOP bổ sung cho OOP trong thiết kế phần mềm. [Xem tổng quan AOP](./01_fundamentals/aop_overview.md).

Phần thiết kế phân tích mục tiêu mô-đun hóa, lợi ích và Trade-off khi dùng AOP, giúp xác định khi nào nên dùng aspect thay vì code tường minh. [Xem ý đồ thiết kế và quan hệ với OOP](./01_fundamentals/aop_design_and_oop.md).

## 02. Spring AOP

Tài liệu mô hình Spring AOP trình bày Aspect, Pointcut, Advice, Join Point, Target Object, Proxy và các loại Advice mà Spring hỗ trợ. [Xem mô hình Aspect trong Spring AOP](./02_spring_aop/aspect_model.md).

Tài liệu về proxy tập trung vào phạm vi join point, điều kiện kích hoạt aspect, khác biệt giữa JDK dynamic proxy và CGLIB, self-invocation và tiêu chí cân nhắc AspectJ. [Xem proxy và các giới hạn](./02_spring_aop/proxy_constraints.md).

---

[← Back to README](../README.md)
