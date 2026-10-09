# Chẩn đoán: vì sao advice không chạy?

## Table of Contents
- [Ma trận triệu chứng](#ma-trận-triệu-chứng)
- [Các phép kiểm tra hữu ích](#các-phép-kiểm-tra-hữu-ích)
- [Trình tự khoanh vùng](#trình-tự-khoanh-vùng)
- [Quy tắc riêng cho @Around](#quy-tắc-riêng-cho-around)
- [Ghi chú về transaction](#ghi-chú-về-transaction)
- [Nguồn chính thức](#nguồn-chính-thức)
- [Related](#related)

Dùng checklist từ ngoài vào trong. Tránh bắt đầu bằng việc đổi JDK proxy sang CGLIB trước khi xác minh call path và pointcut.

---

## Ma trận triệu chứng

| Triệu chứng | Nguyên nhân cần kiểm tra | Cách xác minh |
|---|---|---|
| `@Transactional`/advice không chạy | Lời gọi self-invocation | Xem có `this.method()` trong target không |
| Advice không chạy dù có `@Aspect` | Aspect chưa phải bean hoặc auto-proxy chưa bật | Kiểm tra component scan, `@Bean`, cấu hình AOP |
| Chỉ một số method bị bỏ qua | Pointcut không khớp, visibility/`final`, interface proxy | Kiểm tra signature và loại proxy |
| Bean không bị proxy | Bean không qua container hoặc không có advisor phù hợp | Kiểm tra nơi khởi tạo bean và reference được inject |
| `ClassCastException` khi ép kiểu implementation | Proxy không phải concrete implementation class | Sử dụng interface contract; kiểm tra proxy type |
| Thứ tự logging/transaction lạ | Advisor ordering khác dự kiến | In/log thứ tự và viết integration test |
| Tạo proxy thủ công nhưng không có hiệu lực trong app | Client vẫn đang dùng target gốc | Đảm bảo mọi caller dùng proxy trả về từ factory |
| Advice chạy hai lần | Proxy lồng nhau, advisor lặp, hoặc target được proxy ở nhiều tầng | Kiểm tra chain và bean post-processors |

---

## Các phép kiểm tra hữu ích

```java
import org.springframework.aop.support.AopUtils;

Object bean = applicationContext.getBean("myService");
System.out.println("is proxy: " + AopUtils.isAopProxy(bean));
System.out.println("JDK proxy: " + AopUtils.isJdkDynamicProxy(bean));
System.out.println("CGLIB proxy: " + AopUtils.isCglibProxy(bean));
System.out.println("target class: " + AopUtils.getTargetClass(bean));
```

Chỉ dùng để quan sát/debug. Không nên rẽ nhánh logic nghiệp vụ theo `isCglibProxy()` hay `isJdkDynamicProxy()` trừ khi đó thật sự là yêu cầu hạ tầng.

---

## Trình tự khoanh vùng

1. **Xác nhận bean:** đúng bean instance mà caller đang sử dụng không? Bean đó được container quản lý không?
2. **Xác nhận proxy:** `AopUtils.isAopProxy(bean)` trả về gì? Nếu không phải proxy, vì sao không có advisor áp dụng?
3. **Xác nhận pointcut:** package, tên method, parameter, annotation, return type và loại bean có khớp biểu thức không?
4. **Xác nhận call path:** client gọi qua proxy hay target tự gọi method bằng `this`?
5. **Xác nhận join point khả thi:** method có thể được proxy theo cơ chế đang dùng không?
6. **Xác nhận chain:** có advice khác, thứ tự advisor, exception, hoặc điều kiện around khiến target không được gọi không?
7. **Viết test nhỏ:** chứng minh một lời gọi từ một bean khác có chạy advice. Sau đó thêm dần điều kiện.

---

## Quy tắc riêng cho `@Around`

- Có gọi `proceed()` không?
- Có truyền đúng tham số khi dùng biến thể `proceed(args)` không?
- Có vô tình gọi `proceed()` nhiều lần không?
- Có nuốt exception hoặc trả về kiểu không tương thích không?
- `finally` đã được dùng nếu cần dọn dẹp bất kể thành công/thất bại chưa?

---

## Ghi chú về transaction

Khi debug transaction, kiểm tra call path, transaction manager, propagation và thời điểm bắt đầu transaction theo đúng tính năng đang dùng. Self-invocation có thể khiến annotation ở method được gọi nội bộ không được áp dụng như kỳ vọng, nhưng không nên kết luận mọi vấn đề transaction đều do proxy; hãy kiểm tra cấu hình và exception/rollback semantics riêng.

---

## Nguồn chính thức

- [Understanding AOP Proxies](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Declaring Advice](https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/advice.html)
- [ProxyFactory API](https://docs.spring.io/spring-framework/reference/core/aop-api/prog.html)

---

## Related

*   [Giới hạn proxy và khi nào cần cơ chế khác](../02_ky_thuat/gioi_han_va_ngoai_le.md) — danh sách giới hạn làm nền cho các nguyên nhân cần kiểm tra.
*   [Lab: kiểm chứng proxy](./lab.md) — bài thực hành chứng minh call path và thứ tự interceptor bằng test.

---

[← Back to README](README.md)
