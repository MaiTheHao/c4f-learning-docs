# Spring Framework

Spring Framework là nền tảng phát triển ứng dụng Java theo mô hình IoC container, cung cấp hạ tầng cho cấu hình bean, quản lý giao dịch và tích hợp nhiều thành phần qua một hệ sinh thái thống nhất. Chuyên mục này tập trung vào các cơ chế cốt lõi của Spring, bắt đầu từ cách framework tách rời logic nghiệp vụ khỏi các concern hạ tầng và cách nó đánh giá biểu thức động trong suốt vòng đời ứng dụng.

## AOP

Spring AOP dùng proxy tại Runtime để áp dụng các concern xuyên suốt quanh lời gọi phương thức của Spring bean. Bộ tài liệu đi từ động cơ mô-đun hóa, quan hệ với OOP, đến mô hình Aspect và các giới hạn của proxy. [Xem AOP và Spring AOP](./aop/README.md).

## SpEL

Spring Expression Language cung cấp một ngôn ngữ biểu thức chung để truy vấn và thao tác trên object tại Runtime, phục vụ cấu hình bean và nhiều tính năng trong hệ sinh thái Spring. [Xem Spring Expression Language](./spel/README.md).

## Spring Proxy

Bộ tài liệu chuyên sâu về Spring AOP dựa trên proxy: mô hình nền tảng, luồng gọi và self-invocation, lựa chọn JDK proxy hay CGLIB, cấu hình annotation, các API tạo proxy thủ công, giới hạn và chẩn đoán. [Xem Spring Proxy Guide](./spring_proxy_guide/README.md).

---

[← Back to README](../../README.md)
