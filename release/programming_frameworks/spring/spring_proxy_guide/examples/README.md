# Ví dụ Java

Các đoạn mã trong thư mục này minh họa hai đường tạo proxy và một call path bị bỏ qua proxy. Chúng được giữ riêng để có thể sao chép vào project đã thiết lập dependency Spring AOP phù hợp.

## ProxyFactory

Thêm interceptor bằng Spring AOP API tổng quát và lấy proxy từ một target cụ thể. [Xem ProxyFactoryExample.java](./ProxyFactoryExample.java).

## AspectJProxyFactory

Áp dụng một aspect `@AspectJ` cho target cụ thể rồi gọi qua proxy. [Xem AspectJProxyFactoryExample.java](./AspectJProxyFactoryExample.java).

## Self-invocation

Minh họa lời gọi nội bộ `this.inner()` không quay lại proxy, dùng để so sánh với lời gọi `inner()` trực tiếp qua proxy. [Xem SelfInvocationExample.java](./SelfInvocationExample.java).

---

[← Back to README](../README.md)
