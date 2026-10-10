# Lộ trình và bản đồ kiến thức

## Table of Contents
- [Những câu hỏi cần trả lời được](#những-câu-hỏi-cần-trả-lời-được)
- [Ma trận tài liệu](#ma-trận-tài-liệu)
- [Quy ước khi đọc sơ đồ](#quy-ước-khi-đọc-sơ-đồ)
- [Related](#related)

---

## Những câu hỏi cần trả lời được

Sau khi học xong, người đọc cần có thể giải thích bằng lời của mình:

1. Vì sao client giữ reference tới proxy thay vì gọi thẳng target?
2. Proxy, target, advice, pointcut và interceptor chain liên hệ với nhau thế nào trong một lời gọi?
3. Một lời gọi từ controller/service đi qua proxy như thế nào?
4. Vì sao `this.otherMethod()` không đi qua proxy?
5. Khi nào dùng JDK dynamic proxy, khi nào cần CGLIB?
6. `@EnableAspectJAutoProxy` kích hoạt cơ chế auto-proxy và khiến Spring tạo proxy cho bean như thế nào?
7. `ProxyFactory`, `AspectJProxyFactory` và `ProxyFactoryBean` khác nhau thế nào?
8. Cần kiểm tra gì khi `@Transactional`, `@Async`, `@Cacheable` hoặc advice tùy chỉnh không chạy như mong đợi?

Các câu hỏi về bản thân paradigm AOP (vì sao cần AOP, aspect/pointcut/advice/weaving là gì, quan hệ với OOP) thuộc [module AOP](../../aop/README.md).

---

## Ma trận tài liệu

| Tài liệu | Mức độ | Mục đích |
|---|---|---|
| [Mô hình nền tảng: proxy là gì và các actor](./proxy_model.md) | Nền tảng | Hiểu proxy là gì và các actor |
| [Luồng gọi và self-invocation](./call_flow_and_self_invocation.md) | Nền tảng + kỹ thuật | Theo dõi call path và self-invocation |
| [JDK dynamic proxy và CGLIB](../02_techniques/jdk_proxy_vs_cglib.md) | Kỹ thuật | Chọn cơ chế proxy |
| [Cơ chế auto-proxy](../03_implementation/auto_proxy.md) | Triển khai | Cơ chế auto-proxy khiến Spring tạo proxy cho bean |
| [ProxyFactory](../03_implementation/proxy_factory.md) | API tham chiếu | Tạo proxy bằng Java API tổng quát |
| [AspectJProxyFactory](../03_implementation/aspectj_proxy_factory.md) | API tham chiếu | Dùng aspect viết theo @AspectJ để tạo proxy cụ thể |
| [ProxyFactoryBean](../03_implementation/proxy_factory_bean.md) | API/XML tham chiếu | Tạo proxy được Spring IoC quản lý |
| [Giới hạn proxy và khi nào cần cơ chế khác](../02_techniques/constraints_and_alternatives.md) | Kỹ thuật | Hiểu ranh giới của proxy và khi nào cần weaving |

---

## Quy ước khi đọc sơ đồ

- **Client**: mã gọi bean, chẳng hạn controller hoặc một service khác.
- **Proxy**: đối tượng được đưa cho client; nhận method call trước target.
- **Target**: đối tượng nghiệp vụ thực hiện logic chính.
- **Advice/interceptor**: hành vi phụ được chạy quanh hoặc tại một thời điểm của lời gọi.
- Mũi tên đi qua proxy là trọng tâm. Không suy ra rằng mọi lời gọi trong object đều đi qua proxy.

---

## Related

*   [AOP và Spring AOP](../../aop/README.md) — paradigm AOP và mô hình aspect mà cơ chế proxy phục vụ.
*   [Giới hạn proxy và khi nào cần cơ chế khác](../02_techniques/constraints_and_alternatives.md) — các ràng buộc proxy được hệ thống hóa.

---

[← Back to README](README.md)
