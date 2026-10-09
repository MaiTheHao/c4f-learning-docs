# API/XML tham chiếu: `ProxyFactoryBean`

## Table of Contents
- [Vai trò của FactoryBean](#vai-trò-của-factorybean)
- [Ví dụ XML minh họa](#ví-dụ-xml-minh-họa)
- [Thuộc tính thường gặp](#thuộc-tính-thường-gặp)
- [Thứ tự interceptor](#thứ-tự-interceptor)
- [ProxyFactoryBean và auto-proxy khác nhau](#proxyfactorybean-và-auto-proxy-khác-nhau)
- [Nguồn chính thức](#nguồn-chính-thức)
- [Related](#related)

---

## Vai trò của `FactoryBean`

`ProxyFactoryBean` là một Spring `FactoryBean`: khi bean khác tham chiếu bean được đặt tên `myServiceProxy`, container thường cung cấp object do factory tạo ra (proxy) thay vì chính instance `ProxyFactoryBean`. Cách này cho phép target, advisor và cấu hình proxy cùng được quản lý trong IoC container.

Đây là lựa chọn hữu ích khi cần kiểm soát tường minh proxy/advisor trong XML hoặc khi làm việc với cấu hình cũ. Với ứng dụng mới, annotation-driven AOP thường đơn giản hơn nếu không cần mức kiểm soát cụ thể này.

---

## Ví dụ XML minh họa

```xml
<bean id="greetingTarget" class="com.example.GreetingServiceImpl" />

<bean id="serviceTimingInterceptor" class="com.example.ServiceTimingInterceptor" />

<bean id="greetingService" class="org.springframework.aop.framework.ProxyFactoryBean">
    <property name="target" ref="greetingTarget" />
    <property name="proxyInterfaces">
        <list>
            <value>com.example.GreetingService</value>
        </list>
    </property>
    <property name="interceptorNames">
        <list>
            <value>serviceTimingInterceptor</value>
        </list>
    </property>
</bean>
```

Đây là khung cấu hình; `ServiceTimingInterceptor` cần triển khai một interface advice/interceptor tương thích. Các bean sử dụng `greetingService` sẽ nhận proxy do factory tạo.

---

## Thuộc tính thường gặp

- `target`: object nghiệp vụ được bọc.
- `proxyInterfaces`: danh sách interface mà proxy cung cấp. Nếu không cấu hình interface, factory có thể tạo class-based proxy theo cấu hình/điều kiện tương ứng.
- `interceptorNames`: tên bean advice/interceptor/advisor; **thứ tự có ý nghĩa**.
- `proxyTargetClass`: yêu cầu class-based proxy.
- `exposeProxy`: cho phép truy cập proxy hiện hành qua `AopContext.currentProxy()`; chỉ bật khi có nhu cầu rõ ràng.
- `frozen`: khóa thay đổi cấu hình proxy sau khi tạo.
- `singleton`: kiểm soát việc factory trả cùng một proxy hay nhiều object theo semantics của `FactoryBean`.

Đây không phải danh sách đầy đủ của mọi thuộc tính. Hãy tra API/reference đúng phiên bản trước khi cấu hình production.

---

## Thứ tự interceptor

Nếu cấu hình `interceptorNames` là `audit`, rồi `transaction`, thứ tự trong chain có thể ảnh hưởng việc log nằm bên ngoài hay bên trong transaction boundary, cũng như cách exception đi qua các advice. Hãy làm rõ thứ tự mong muốn bằng test thay vì dựa vào cảm giác.

---

## `ProxyFactoryBean` và auto-proxy khác nhau

- `ProxyFactoryBean`: tạo proxy như một bean factory tường minh, thường gắn target/proxy/advice cụ thể.
- Auto-proxy: container tự xử lý các bean cần áp dụng advisors dựa trên cơ chế đăng ký AOP và quy tắc tương ứng.
- `ProxyFactory`: Java API tường minh, không bắt buộc tạo proxy thông qua Spring BeanFactory.

---

## Nguồn chính thức

- [Using the `ProxyFactoryBean` to Create AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop-api/pfb.html)
- [Creating AOP Proxies Programmatically with `ProxyFactory`](https://docs.spring.io/spring-framework/reference/core/aop-api/prog.html)

---

## Related

*   [API tham chiếu: ProxyFactory](./proxyfactory.md) — cùng tạo proxy nhưng để Spring IoC quản lý vòng đời và dependency.

---

[← Back to README](README.md)
