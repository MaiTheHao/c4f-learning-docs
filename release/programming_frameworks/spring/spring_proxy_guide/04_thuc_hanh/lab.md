# Lab: kiểm chứng proxy bằng các bài tập nhỏ

## Table of Contents
- [Lab A: lời gọi qua proxy](#lab-a-lời-gọi-qua-proxy)
- [Lab B: self-invocation](#lab-b-self-invocation)
- [Lab C: refactor để lời gọi qua bean proxy](#lab-c-refactor-để-lời-gọi-qua-bean-proxy)
- [Lab D: JDK và CGLIB](#lab-d-jdk-và-cglib)
- [Lab E: thứ tự advice](#lab-e-thứ-tự-advice)
- [Rubric tự đánh giá](#rubric-tự-đánh-giá)
- [Related](#related)

Các bài tập này nhằm xác minh mô hình, không phụ thuộc framework version cụ thể. Chạy trong một project đã có dependency Spring AOP và AOP Alliance tương thích; với ví dụ annotation, bổ sung các dependency AspectJ cần thiết theo hướng dẫn Spring tương ứng.

---

## Lab A: lời gọi qua proxy

1. Tạo `GreetingService` interface và `GreetingServiceImpl`.
2. Dùng `ProxyFactory(target)` và gắn `MethodInterceptor` ghi `before`, gọi `proceed()`, ghi `after`.
3. Gọi method thông qua proxy.
4. Ghi lại thứ tự log.

**Kỳ vọng:** interceptor chạy trước và sau target; caller nhận kết quả target.

---

## Lab B: self-invocation

1. Tạo class có method `outer()` gọi `this.inner()`.
2. Gắn advice chỉ cho `inner()`.
3. Gọi `outer()` thông qua proxy.
4. So sánh với gọi `inner()` trực tiếp qua proxy.

**Kỳ vọng:** lần `inner()` được gọi trực tiếp từ client có thể đi qua advice; lần gọi bằng `this.inner()` bên trong target bỏ qua proxy.

---

## Lab C: refactor để lời gọi qua bean proxy

1. Chuyển phần `inner()` sang `InnerService` bean riêng.
2. Inject `InnerService` vào outer service.
3. Gọi `innerService.inner()` từ `outer()`.
4. Đảm bảo call đi tới reference mà Spring cung cấp.

**Kỳ vọng:** lời gọi qua bean riêng có thể chạy advice, nếu bean đích được proxy và pointcut khớp.

---

## Lab D: JDK và CGLIB

1. Tạo target implement interface.
2. Quan sát proxy type với cấu hình hiện tại.
3. Ép class-based proxy trong một cấu hình thử nghiệm.
4. So sánh kiểu object, type cast và hành vi của method `final`.

**Kỳ vọng:** hiểu rằng proxy type phụ thuộc cấu hình và đặc tính target; `final`/`private` vẫn là giới hạn của subclass proxy.

---

## Lab E: thứ tự advice

1. Thêm hai interceptor đặt tên A và B.
2. Mỗi interceptor log `before` và `after` quanh `proceed()`.
3. Đổi thứ tự đăng ký.
4. Ghi lại thứ tự log.

**Kỳ vọng:** interceptor chain có semantics lồng nhau; thứ tự không chỉ ảnh hưởng log mà còn có thể ảnh hưởng transaction, exception và cleanup.

---

## Rubric tự đánh giá

- [ ] Giải thích được vì sao proxy là entry point.
- [ ] Vẽ đúng thứ tự proxy → advice/interceptor → target → unwind.
- [ ] Dự đoán được self-invocation có chạy advice hay không.
- [ ] Phân biệt interface proxy với subclass proxy.
- [ ] Chọn được API phù hợp giữa `ProxyFactory`, `AspectJProxyFactory` và `ProxyFactoryBean`.
- [ ] Khi advice không chạy, kiểm tra registration, matching, call path và proxy limitations trước khi đổi cấu hình.

---

## Related

*   [Chẩn đoán: vì sao advice không chạy?](./chan_doan_loi.md) — quy trình chẩn đoán mà các bài lab này kiểm chứng.

---

[← Back to README](README.md)
