# Từ điển nhanh và nguồn tham khảo

## Table of Contents
- [Từ điển](#từ-điển)
- [Liên kết chính thức](#liên-kết-chính-thức)
- [Ghi chú nguồn và phiên bản](#ghi-chú-nguồn-và-phiên-bản)
- [Related](#related)

---

## Từ điển

- **AOP:** lập trình hướng khía cạnh, tổ chức các concern xuyên cắt khỏi logic nghiệp vụ.
- **Spring AOP:** cơ chế AOP của Spring; cách phổ biến sử dụng proxy để bao quanh method execution.
- **Proxy:** object trung gian nhận lời gọi rồi áp dụng advice/ủy quyền tới target.
- **Target:** object nghiệp vụ thực tế phía sau proxy.
- **Advice:** hành vi bổ sung chạy trước/sau/quanh method hoặc khi method hoàn thành theo trạng thái nhất định.
- **Pointcut:** quy tắc chọn các join point cần áp dụng advice.
- **Advisor:** cấu trúc kết hợp pointcut và advice trong Spring AOP API.
- **Aspect:** mô-đun gom pointcut, advice và các khai báo AOP liên quan.
- **Join point:** điểm trong quá trình thực thi có thể được AOP xét; với Spring AOP proxy, trọng tâm là method execution.
- **Interceptor chain:** chuỗi xử lý invocation qua nhiều interceptor/advice trước/sau target.
- **JDK dynamic proxy:** proxy dựa trên interface.
- **CGLIB proxy:** proxy dựa trên subclass được tạo ở runtime.
- **Self-invocation:** method của target gọi method khác trên cùng target qua `this`, nên không đi qua proxy.
- **Weaving:** đan advice vào bytecode/class tại compile-time hoặc load-time; khác với proxy wrapping.
- **IoC container:** container quản lý bean và dependency, có thể phối hợp tạo/đăng ký proxy.

---

## Liên kết chính thức

### Mô hình và proxy

- [AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/introduction-proxies.html)
- [Proxying Mechanisms / Understanding AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Spring AOP Capabilities and Goals](https://docs.spring.io/spring-framework/reference/core/aop/introduction-spring-defn.html)

### Annotation, pointcut và advice

- [Declaring an Aspect](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/at-aspectj.html)
- [Enabling @AspectJ Support](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj.html)
- [Declaring Pointcuts](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/pointcuts.html)
- [Declaring Advice](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/advice.html)

### API tạo proxy

- [Creating AOP Proxies Programmatically with `ProxyFactory`](https://docs.spring.io/spring-framework/reference/core/aop-api/prog.html)
- [Programmatic Creation of `@AspectJ` Proxies](https://docs.spring.io/spring-framework/reference/core/aop/aspectj-programmatic.html)
- [Using the `ProxyFactoryBean` to Create AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop-api/pfb.html)

### AspectJ weaving và tích hợp

- [Using AspectJ with Spring Applications](https://docs.spring.io/spring-framework/reference/core/aop/using-aspectj.html)

---

## Ghi chú nguồn và phiên bản

Nội dung nền tảng được viết độc lập với một bản release cụ thể. Những lựa chọn proxy mặc định, API mới, hoặc thuộc tính cấu hình có thể khác giữa các nhánh Spring Framework/Spring Boot; trang reference của nhánh ứng dụng đang dùng là căn cứ cuối cùng để chốt chi tiết triển khai.

---

## Related

*   [Thuật ngữ AOP](../01_nen_tang/thuat_ngu_aop.md) — bản giải thích đầy đủ hơn cho từ điển rút gọn tại đây.

---

[← Back to README](README.md)
