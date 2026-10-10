# Spring Proxy Guide

Bộ tài liệu này tập trung vào cơ chế proxy trong Spring: object trung gian mà framework dùng để chèn hành vi quanh lời gọi phương thức của bean. Nội dung đi từ mô hình proxy và call path, qua lựa chọn JDK dynamic proxy hay CGLIB và cấu hình auto-proxy, đến các API tạo proxy thủ công, giới hạn và ví dụ Java. Đây là phần cơ chế đứng sau mô hình AOP; phần paradigm AOP (định nghĩa aspect, pointcut, advice, quan hệ với OOP) thuộc [module AOP](../aop/README.md).

## Nền tảng

Nhóm này giải thích proxy là gì và các actor tham gia, đường đi thực tế của một lời gọi qua proxy, và hiện tượng self-invocation. [Xem Nền tảng](./01_foundations/README.md).

## Kỹ thuật

Nhóm này so sánh hai cơ chế tạo proxy (JDK dynamic proxy và CGLIB) và hệ thống hóa các giới hạn về cấu trúc của proxy cùng ranh giới khi nào cần cơ chế khác. [Xem Kỹ thuật](./02_techniques/README.md).

## Triển khai

Nhóm này đi vào cơ chế auto-proxy khiến Spring tự tạo proxy cho bean và ba API tạo proxy thủ công. Đây là tài liệu tham chiếu cho cấu hình và viết code. [Xem Triển khai](./03_implementation/README.md).

## Ví dụ

Ba ví dụ Java minh họa tạo proxy bằng ProxyFactory, áp dụng aspect @AspectJ bằng AspectJProxyFactory và call path bị bỏ qua proxy khi self-invocation. [Xem Ví dụ](./examples/README.md).

## References

### Từ điển proxy

- **Proxy:** object trung gian nhận lời gọi rồi áp dụng advice/ủy quyền tới target.
- **Target:** object nghiệp vụ thực tế phía sau proxy.
- **Proxy crossing:** lời gọi cụ thể có đi qua object trung gian hay không.
- **JDK dynamic proxy:** proxy dựa trên interface.
- **CGLIB proxy:** proxy dựa trên subclass được tạo ở runtime.
- **Self-invocation:** method của target gọi method khác trên cùng target qua `this`, nên không đi qua proxy.
- **Interceptor chain:** chuỗi xử lý invocation qua nhiều interceptor/advice trước/sau target.
- **Auto-proxy:** cơ chế để container tự phát hiện bean cần bọc và tạo proxy cho bean đó.
- **Weaving:** đan advice vào bytecode/class tại compile-time hoặc load-time; khác với proxy wrapping.
- **IoC container:** container quản lý bean và dependency, có thể phối hợp tạo/đăng ký proxy.

Thuật ngữ AOP như aspect, join point, pointcut, advice, advisor và quan hệ với OOP được định nghĩa tại [module AOP](../aop/01_fundamentals/aop_overview.md) và [Mô hình Aspect trong Spring AOP](../aop/02_spring_aop/aspect_model.md).

### Liên kết chính thức

Mô hình và proxy:

- [AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/introduction-proxies.html)
- [Proxying Mechanisms / Understanding AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Spring AOP Capabilities and Goals](https://docs.spring.io/spring-framework/reference/core/aop/introduction-spring-defn.html)

API tạo proxy:

- [Creating AOP Proxies Programmatically with `ProxyFactory`](https://docs.spring.io/spring-framework/reference/core/aop-api/prog.html)
- [Programmatic Creation of `@AspectJ` Proxies](https://docs.spring.io/spring-framework/reference/core/aop/aspectj-programmatic.html)
- [Using the `ProxyFactoryBean` to Create AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop-api/pfb.html)

AspectJ weaving và tích hợp:

- [Using AspectJ with Spring Applications](https://docs.spring.io/spring-framework/reference/core/aop/using-aspectj.html)

### Ghi chú nguồn và phiên bản

Nội dung nền tảng được viết độc lập với một bản release cụ thể. Những lựa chọn proxy mặc định, API mới, hoặc thuộc tính cấu hình có thể khác giữa các nhánh Spring Framework/Spring Boot; trang reference của nhánh ứng dụng đang dùng là căn cứ cuối cùng để chốt chi tiết triển khai.

---

[← Back to README](../README.md)
