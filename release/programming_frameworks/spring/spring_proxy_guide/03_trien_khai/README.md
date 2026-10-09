# Triển khai

Nhóm tài liệu này trình bày cách hiện thực hóa mô hình: khai báo aspect bằng annotation và ba API tạo proxy trong Spring.

## @Aspect và cơ chế tự động tạo proxy

Vai trò của `@Aspect`, `@Component`, `@EnableAspectJAutoProxy` và auto-proxy infrastructure, kèm ví dụ tối thiểu và checklist cấu hình. [Xem @Aspect và cơ chế tự động tạo proxy](./annotation_va_auto_proxy.md).

## ProxyFactory

API tổng quát để tạo proxy từ target và gắn advice/advisor bằng code, phù hợp cho test, adapter hoặc trường hợp cần điều khiển tường minh. [Xem ProxyFactory](./proxyfactory.md).

## AspectJProxyFactory

Biến thể nhận aspect khai báo theo phong cách `@AspectJ` để tạo proxy cho một target cụ thể, không thực hiện bytecode weaving. [Xem AspectJProxyFactory](./aspectj_proxyfactory.md).

## ProxyFactoryBean

FactoryBean cho phép cấu hình target, interface và interceptor trong IoC/XML để container quản lý proxy. [Xem ProxyFactoryBean](./proxyfactorybean.md).

---

[← Back to README](../README.md)
