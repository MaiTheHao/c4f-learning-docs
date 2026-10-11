# Mô hình Aspect trong Spring AOP

## Table of Contents
- [Spring AOP là gì?](#spring-aop-là-gì)
- [Aspect và các thành phần cấu thành](#aspect-và-các-thành-phần-cấu-thành)
- [Luồng xử lý qua proxy](#luồng-xử-lý-qua-proxy)
- [Các loại Advice](#các-loại-advice)
- [Đọc và đặt tên pointcut](#đọc-và-đặt-tên-pointcut)
- [Ý đồ thiết kế của Spring AOP](#ý-đồ-thiết-kế-của-spring-aop)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)
- [Related](#related)

---

## Spring AOP là gì?

Spring AOP là cơ chế AOP tích hợp với Spring Framework và Spring IoC container. Cơ chế này dùng proxy tại Runtime để áp dụng hành vi bổ sung quanh các lời gọi phương thức phù hợp trên Spring bean.

Spring AOP được viết bằng Java thuần và tập trung vào **method execution join point**: nó chỉ hỗ trợ join point tại việc thực thi phương thức trên Spring bean, không trực tiếp hỗ trợ các join point như đọc hoặc ghi field. Vì vậy Spring AOP phù hợp với các concern quanh lời gọi phương thức, chẳng hạn quản lý giao dịch, logging và kiểm tra quyền.

Mô hình này không đại diện cho toàn bộ khả năng của AOP: AspectJ hỗ trợ nhiều loại join point hơn, nên có thể phù hợp khi cần tác động đến các điểm thực thi mà mô hình proxy của Spring không bao phủ. Tiêu chí chọn giữa Spring AOP và AspectJ được trình bày ở [module proxy](../../spring_proxy_guide/02_techniques/constraints_and_alternatives.md).

---

## Aspect và các thành phần cấu thành

Theo tài liệu Spring, **aspect** là cách mô-đun hóa một concern xuyên suốt. Aspect có thể được khai báo bằng cấu hình XML theo schema hoặc bằng lớp Java thông thường sử dụng phong cách annotation `@AspectJ`.

| Thành phần | Câu hỏi cần trả lời | Vai trò |
| :--- | :--- | :--- |
| **Aspect** | Concern được tổ chức ở đâu? | Gom các định nghĩa liên quan đến hành vi xuyên suốt. |
| **Pointcut** | Áp dụng tại đâu? | Chọn các join point khớp điều kiện. |
| **Advice** | Thực hiện hành vi gì và khi nào? | Định nghĩa hành vi bổ sung. |
| **Join point** | Điểm thực thi nào được xét? | Trong Spring AOP, đó là việc thực thi phương thức. |
| **Target object** | Logic nghiệp vụ nằm ở đâu? | Đối tượng đích mà lời gọi được chuyển tiếp đến. |
| **AOP proxy** | Hành vi được điều phối bằng cách nào? | Trung gian hóa lời gọi và chạy advice phù hợp. |
| **Introduction** | Có thể bổ sung gì ngoài advice? | Bổ sung interface và phần triển khai tương ứng cho đối tượng được áp dụng AOP. |
| **Weaving** | Các thành phần được kết hợp như thế nào? | Liên kết aspect với chương trình hoặc đối tượng để áp dụng hành vi. |

Aspect không đồng nghĩa với pointcut, advice hay proxy. Aspect là đơn vị mô-đun hóa ở mức cao hơn; các thành phần còn lại có trách nhiệm riêng trong quá trình chọn điểm thực thi và điều phối hành vi.

Một lớp có `@Aspect` cũng không tự động trở thành Spring bean chỉ vì có annotation này. Lớp aspect phải được đăng ký hoặc được Spring phát hiện bằng cơ chế cấu hình bean phù hợp, đồng thời hỗ trợ AOP phải được kích hoạt.

---

## Luồng xử lý qua proxy

Ở mức khái niệm, lời gọi từ client đi tới **AOP proxy**. Proxy xác định advice phù hợp theo cấu hình pointcut, chạy hành vi tương ứng, rồi chuyển tiếp lời gọi tới **target object**; kết quả hoặc exception được trả về theo đường đi tương ứng.

Đây là mô tả chung, không phải thứ tự tuyệt đối cho mọi tổ hợp advice: thứ tự thực tế phụ thuộc loại advice và thứ tự interceptor. Chi tiết cơ chế của đường đi này (proxy là object trung gian, lời gọi có đi qua proxy hay không, self-invocation, chuỗi interceptor) thuộc phạm vi cơ chế proxy, xem [Luồng gọi và self-invocation](../../spring_proxy_guide/01_foundations/call_flow_and_self_invocation.md).

---

## Các loại Advice

Spring AOP cung cấp năm loại advice chính. Mỗi loại có ngữ nghĩa thực thi riêng.

| Loại | Khi nào chạy? | Lưu ý |
| :--- | :--- | :--- |
| **Before** | Trước join point | Không tự ngăn phương thức tiếp tục, trừ khi advice ném exception. |
| **After returning** | Khi phương thức kết thúc bình thường | Không chạy theo ngữ nghĩa này nếu phương thức kết thúc bằng exception. |
| **After throwing** | Khi phương thức kết thúc bằng exception | Dùng cho hành vi gắn với đường kết thúc lỗi. |
| **After (finally)** | Khi join point kết thúc, bất kể thành công hay lỗi | Phù hợp với hành vi cần chạy ở cả hai trường hợp. |
| **Around** | Bao quanh lời gọi phương thức | Có thể quyết định có tiếp tục gọi phương thức hay không, đồng thời kiểm soát kết quả hoặc exception. |

Nên chọn loại advice có phạm vi năng lực hẹp nhất nhưng vẫn đáp ứng yêu cầu. Ví dụ, nếu chỉ cần xử lý kết quả sau khi phương thức hoàn tất bình thường, `After returning` thường rõ ràng hơn `Around`.

Với `Around`, advice điều khiển lời gọi tại điểm gọi `proceed()`: nếu không gọi `proceed()` thì target có thể không chạy; nếu gọi nhiều lần thì target có thể chạy nhiều lần. Chỉ dùng retry hoặc nhiều lần gọi khi ngữ nghĩa nghiệp vụ và tính idempotent cho phép.

---

## Đọc và đặt tên pointcut

Pointcut expression mô tả tập join point cần chọn. Ví dụ:

```java
@Pointcut("execution(public * com.example.service..*(..))")
void servicePublicMethods() {}
```

Đọc từ ngoài vào: chọn method execution; `public` là modifier; `*` là kiểu trả về bất kỳ; package `com.example.service..` và các package con; `*` là tên method bất kỳ; `(..)` là số lượng/kiểu tham số bất kỳ.

Các designator thường gặp trong Spring AOP gồm `execution`, `within`, `this`, `target`, `args`, `@target`, `@args`, `@within`, `@annotation` và phần mở rộng Spring `bean`. Hỗ trợ cụ thể phải theo tài liệu Spring AOP; không phải mọi pointcut designator của AspectJ weaving đều hợp lệ trong Spring AOP.

Các pointcut có tên giúp ý định rõ, tránh lặp biểu thức dài và cho phép kết hợp điều kiện:

```java
@Pointcut("within(com.example.web..*)")
void inWebLayer() {}

@Pointcut("execution(public * *(..))")
void publicMethod() {}

@Pointcut("inWebLayer() && publicMethod()")
void publicWebMethod() {}
```

Pointcut là một quyết định thiết kế: biểu thức quá hẹp có thể khiến advice không chạy, biểu thức quá rộng có thể áp dụng hành vi ngoài dự kiến. Phạm vi cần thể hiện rõ các thành phần chịu tác động và nên được kiểm thử.

---

## Ý đồ thiết kế của Spring AOP

Spring không đặt mục tiêu hiện thực hóa mọi khả năng AOP. Framework ưu tiên tích hợp chặt chẽ với IoC container và giải quyết những nhu cầu phổ biến của ứng dụng doanh nghiệp.

Các lựa chọn thiết kế chính gồm:

- **Tích hợp với IoC:** aspect và các thành phần liên quan có thể được quản lý theo cơ chế bean.
- **Proxy tại Runtime:** bổ sung hành vi mà không bắt buộc quy trình biên dịch đặc biệt.
- **Non-invasiveness:** tránh buộc domain model phụ thuộc vào các lớp hoặc interface riêng của AOP.
- **Phối hợp với AspectJ:** có thể chọn AspectJ khi cần phạm vi join point phong phú hơn.

---

## Tài liệu tham khảo

- [Spring Framework: AOP Concepts](https://docs.spring.io/spring-framework/reference/core/aop/introduction-defn.html)
- [Spring Framework: Spring AOP Capabilities and Goals](https://docs.spring.io/spring-framework/reference/core/aop/introduction-spring-defn.html)
- [Spring Framework: AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/introduction-proxies.html)
- [Spring Framework: Declaring Pointcuts](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/pointcuts.html)
- [Spring Framework: Declaring Advice](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/advice.html)

---

## Related

*   [Tổng quan AOP](../01_fundamentals/aop_overview.md) — động cơ, khái niệm và Trade-off mà mô hình Spring này hiện thực hóa.
*   [Spring Proxy Guide](../../spring_proxy_guide/README.md) — cơ chế proxy đứng sau mô hình: call path, JDK proxy và CGLIB, self-invocation.

---

[← Back to README](README.md)
