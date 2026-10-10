# API tham chiếu: `AspectJProxyFactory`

## Table of Contents
- [Khi nào dùng?](#khi-nào-dùng)
- [Ví dụ](#ví-dụ)
- [Quy trình vận hành](#quy-trình-vận-hành)
- [Điều API này không làm](#điều-api-này-không-làm)
- [So với ProxyFactory](#so-với-proxy_factory)
- [Nguồn chính thức](#nguồn-chính-thức)
- [Related](#related)

---

## Khi nào dùng?

Dùng `org.springframework.aop.aspectj.annotation.AspectJProxyFactory` khi đã có target cụ thể và muốn áp dụng một hay nhiều aspect khai báo theo phong cách `@AspectJ` để tạo proxy bằng code. Khác biệt chính so với `ProxyFactory` là factory này nhận các aspect kiểu `@AspectJ`, thay vì yêu cầu developer tự gắn từng advice/advisor theo API tổng quát.

---

## Ví dụ

```java
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;

GreetingService target = new GreetingServiceImpl();
AspectJProxyFactory factory = new AspectJProxyFactory(target);
factory.addAspect(ServiceTimingAspect.class);
// Hoặc factory.addAspect(aspectInstance) với instance là một @Aspect hợp lệ.
GreetingService proxy = factory.getProxy();

proxy.greet("Spring");
```

Aspect có thể trông như sau:

```java
@Aspect
public class ServiceTimingAspect {
    @Around("execution(* com.example..*(..))")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        long started = System.nanoTime();
        try {
            return pjp.proceed();
        } finally {
            long elapsed = System.nanoTime() - started;
            // Gửi elapsed tới logger/metrics trong code thực tế.
        }
    }
}
```

---

## Quy trình vận hành

1. Tạo target instance.
2. Khởi tạo `AspectJProxyFactory` với target.
3. Thêm lớp aspect hoặc instance aspect.
4. Lấy proxy và dùng proxy làm reference để gọi method.
5. Advice chạy khi invocation đi qua proxy và pointcut khớp.

---

## Điều API này không làm

Dù tên có chữ `AspectJ`, factory này **không tự thực hiện compile-time/load-time weaving**. Nó tạo proxy Spring AOP áp dụng các aspect được khai báo kiểu `@AspectJ`. Những giới hạn call path như self-invocation vẫn cần được tính đến.

---

## So với `ProxyFactory`

| | `ProxyFactory` | `AspectJProxyFactory` |
|---|---|---|
| Đầu vào hành vi | Thêm `Advice`/`Advisor` tường minh | Thêm aspect `@AspectJ` |
| Phù hợp | API AOP tổng quát, interceptor tùy chỉnh | Đã có aspect annotation và muốn proxy một target cụ thể |
| Vẫn là proxy-based AOP? | Có | Có |
| Tự thực hiện bytecode weaving? | Không | Không |

---

## Nguồn chính thức

- [Programmatic Creation of `@AspectJ` Proxies](https://docs.spring.io/spring-framework/reference/core/aop/aspectj-programmatic.html)
- [Creating AOP Proxies Programmatically with `ProxyFactory`](https://docs.spring.io/spring-framework/reference/core/aop-api/prog.html)

---

## Related

*   [API tham chiếu: ProxyFactory](./proxy_factory.md) — API nền tảng dùng advice/advisor tường minh mà factory này bao bọc.

---

[← Back to README](README.md)
