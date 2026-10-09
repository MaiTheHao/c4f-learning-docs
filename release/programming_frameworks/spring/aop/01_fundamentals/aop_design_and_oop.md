# Ý đồ thiết kế của AOP và quan hệ với OOP

## Table of Contents
- [Vì sao OOP chưa đủ trong mọi trường hợp?](#vì-sao-oop-chưa-đủ-trong-mọi-trường-hợp)
- [AOP bổ sung cho OOP như thế nào?](#aop-bổ-sung-cho-oop-như-thế-nào)
- [Mục tiêu thiết kế](#mục-tiêu-thiết-kế)
- [Trade-off khi sử dụng AOP](#trade-off-khi-sử-dụng-aop)
- [Kết luận](#kết-luận)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)
- [Related](#related)

---

## Vì sao OOP chưa đủ trong mọi trường hợp?

OOP tổ chức phần mềm theo các thực thể và trách nhiệm nghiệp vụ. Trong hệ thống thương mại điện tử, chẳng hạn, đơn hàng, khách hàng và thanh toán có thể được biểu diễn bằng các thành phần riêng biệt. Cách phân rã này giúp kiểm soát trạng thái, hành vi và quan hệ giữa các đối tượng.

Tuy nhiên, logging, kiểm tra quyền và quản lý giao dịch có thể ảnh hưởng đến nhiều service cùng lúc. Những concern này không nhất thiết thuộc riêng về một thực thể nghiệp vụ. Khi được triển khai lặp lại trong nhiều class, chúng có thể làm tăng duplication và khiến thay đổi chính sách trở nên tốn kém.

---

## AOP bổ sung cho OOP như thế nào?

AOP tạo thêm một trục mô-đun hóa: thay vì chỉ nhóm code theo đối tượng, nó nhóm hành vi theo concern xuyên suốt. **Pointcut** xác định nơi áp dụng; **advice** mô tả hành vi; **aspect** tổ chức các định nghĩa liên quan.

| Tiêu chí | OOP | AOP |
| :--- | :--- | :--- |
| Đơn vị mô-đun hóa | Class và object | Aspect |
| Cách phân rã | Theo đối tượng và trách nhiệm | Theo concern xuyên suốt |
| Ví dụ | Xử lý đơn hàng, thanh toán, người dùng | Logging, quản lý giao dịch, kiểm tra quyền |
| Rủi ro khi dùng không phù hợp | Concern chung có thể phân tán qua nhiều class | Luồng thực thi có thể khó theo dõi nếu aspect quá rộng |

AOP và OOP giải quyết những chiều khác nhau của bài toán thiết kế. Một ứng dụng vẫn cần mô hình đối tượng tốt; AOP chỉ nên bổ sung ở nơi concern xuyên suốt thực sự có lợi khi được mô-đun hóa riêng.

---

## Mục tiêu thiết kế

AOP hướng đến ba mục tiêu chính:

1. **Giảm sự phân tán của concern xuyên suốt.** Chính sách dùng chung được định nghĩa tại một nơi thay vì lặp lại trong nhiều thành phần.
2. **Tách nghiệp vụ khỏi chính sách hạ tầng.** Phương thức nghiệp vụ có thể tập trung vào nhiệm vụ chính, trong khi các hành vi bổ sung được cấu hình độc lập.
3. **Xác định rõ phạm vi áp dụng.** Pointcut giúp diễn đạt những điểm thực thi chịu tác động, thay vì phải gọi thủ công một tiện ích tại từng nơi.

Trong Spring, quản lý giao dịch khai báo là ví dụ tiêu biểu: người phát triển mô tả chính sách giao dịch, còn framework điều phối hành vi quanh lời gọi phương thức.

---

## Trade-off khi sử dụng AOP

AOP không tự động làm hệ thống đơn giản hơn. Nếu pointcut quá rộng, hành vi có thể áp dụng ngoài dự kiến. Nếu advice tạo ra side effect khó quan sát, người đọc có thể khó lần theo luồng thực thi từ code nghiệp vụ. Việc debug cũng đòi hỏi hiểu cơ chế kết hợp hành vi.

Nên dùng AOP khi concern có phạm vi xuyên suốt rõ ràng và quy tắc áp dụng có thể diễn đạt, kiểm thử được. Với logic nghiệp vụ cốt lõi hoặc hành vi chỉ dùng tại một điểm, code tường minh thường dễ hiểu hơn.

---

## Kết luận

OOP giúp tổ chức các thành phần của hệ thống; AOP giúp tổ chức những hành vi cần tác động đến nhiều thành phần đó. Hai cách tiếp cận bổ sung cho nhau. Giá trị của AOP nằm ở khả năng mô-đun hóa concern xuyên suốt, không phải ở việc thay thế mọi lời gọi hàm hoặc rút ngắn mã nguồn bằng mọi giá.

---

## Tài liệu tham khảo

- [Spring Framework: AOP Concepts](https://docs.spring.io/spring-framework/reference/core/aop/introduction-defn.html)
- [Kiczales và cộng sự, Aspect-Oriented Programming (ECOOP 1997)](https://doi.org/10.1007/BFb0053381)

---

## Related

*   [Tổng quan về Aspect-Oriented Programming (AOP)](./aop_overview.md) — phần nền tảng định nghĩa các khái niệm mà tài liệu thiết kế này triển khai tiếp.
*   [Spring Expression Language (SpEL)](../../spel/spel.md) — cùng hướng tới việc tách logic cấu hình và điều kiện khỏi mã nghiệp vụ tường minh.

---
[← Back to README](README.md)
