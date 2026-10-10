# Triển khai

Nhóm tài liệu này trình bày cách Spring tạo proxy: cơ chế auto-proxy tự bọc bean và ba API tạo proxy trong Spring.

## Cơ chế auto-proxy

Cách Spring tự phát hiện bean cần bọc và tạo proxy cho bean khi dùng cấu hình annotation, kèm ví dụ tối thiểu và checklist cấu hình. [Xem Cơ chế auto-proxy](./auto_proxy.md).

## ProxyFactory

API tổng quát để tạo proxy từ target và gắn advice/advisor bằng code, phù hợp cho test, adapter hoặc trường hợp cần điều khiển tường minh. [Xem ProxyFactory](./proxy_factory.md).

## AspectJProxyFactory

Biến thể nhận aspect khai báo theo phong cách `@AspectJ` để tạo proxy cho một target cụ thể, không thực hiện bytecode weaving. [Xem AspectJProxyFactory](./aspectj_proxy_factory.md).

## ProxyFactoryBean

FactoryBean cho phép cấu hình target, interface và interceptor trong IoC/XML để container quản lý proxy. [Xem ProxyFactoryBean](./proxy_factory_bean.md).

---

[← Back to README](../README.md)
