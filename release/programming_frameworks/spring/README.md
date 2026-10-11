# Spring Framework

Spring Framework là nền tảng phát triển ứng dụng Java theo mô hình IoC container, cung cấp hạ tầng cho cấu hình bean, quản lý giao dịch và tích hợp nhiều thành phần qua một hệ sinh thái thống nhất. Chuyên mục này tập trung vào các cơ chế cốt lõi của Spring, bắt đầu từ cách framework tách rời logic nghiệp vụ khỏi các concern hạ tầng và cách nó đánh giá biểu thức động trong suốt vòng đời ứng dụng.

## AOP

Phần này xây dựng paradigm AOP và mô hình Spring AOP ở mức khái niệm: động cơ mô-đun hóa concern xuyên suốt, quan hệ với OOP, các khái niệm aspect và pointcut/advice, cùng Trade-off khi áp dụng. [Xem AOP và Spring AOP](./aop/README.md).

## SpEL

Spring Expression Language cung cấp một ngôn ngữ biểu thức chung để truy vấn và thao tác trên object tại Runtime, phục vụ cấu hình bean và nhiều tính năng trong hệ sinh thái Spring. [Xem Spring Expression Language](./spel/README.md).

## Spring Proxy

Phần này đi sâu vào cơ chế proxy đứng sau mô hình AOP: proxy là gì và các actor, call path và self-invocation, lựa chọn JDK proxy hay CGLIB và các giới hạn của proxy. [Xem Spring Proxy Guide](./spring_proxy_guide/README.md).

---

[← Back to README](../../README.md)
