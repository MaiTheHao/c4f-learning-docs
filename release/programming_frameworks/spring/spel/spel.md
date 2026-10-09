# Spring Expression Language (SpEL)

## Table of Contents

* [1. Bối cảnh và vấn đề SpEL giải quyết](#1-bối-cảnh-và-vấn-đề-spel-giải-quyết)
* [2. SpEL là gì?](#2-spel-là-gì)
* [3. Cách SpEL hoạt động](#3-cách-spel-hoạt-động)
* [4. Các khả năng chính](#4-các-khả-năng-chính)
* [5. SpEL được sử dụng ở đâu?](#5-spel-được-sử-dụng-ở-đâu)
* [6. Vì sao Spring phát triển SpEL?](#6-vì-sao-spring-phát-triển-spel)
* [7. Giới hạn và lưu ý](#7-giới-hạn-và-lưu-ý)
* [8. Tổng kết](#8-tổng-kết)
* [Related](#related)

---

## 1. Bối cảnh và vấn đề SpEL giải quyết

Trong ứng dụng Spring, giá trị cấu hình đôi khi không thể xác định hoàn toàn trước khi chương trình chạy. Một bean có thể cần lấy dữ liệu từ bean khác, đọc thuộc tính của object, tính toán giá trị hoặc đánh giá điều kiện dựa trên dữ liệu hiện có.

Nếu chỉ sử dụng cấu hình tĩnh, những nhu cầu này có thể yêu cầu thêm mã Java để truy xuất dữ liệu, thực hiện phép tính hoặc lựa chọn giá trị. Khi nhiều thành phần trong framework cùng cần những khả năng đó, việc xây dựng cơ chế xử lý riêng cho từng thành phần cũng làm tăng sự trùng lặp.

**SpEL (Spring Expression Language)** cung cấp một ngôn ngữ biểu thức chung để giải quyết nhu cầu này. Thay vì viết toàn bộ thao tác bằng Java, ứng dụng có thể mô tả một phép tính, một đường dẫn truy cập object hoặc một điều kiện dưới dạng biểu thức để framework đánh giá.

Vấn đề cốt lõi không phải là Java thiếu khả năng thực hiện những thao tác đó. Vấn đề là cần một cơ chế biểu diễn và đánh giá biểu thức có thể tích hợp nhất quán vào cấu hình và các tính năng của hệ sinh thái Spring.

---

## 2. SpEL là gì?

SpEL là ngôn ngữ biểu thức của Spring Framework, cho phép truy vấn và thao tác trên object trong quá trình chạy chương trình (**Runtime**).

Một biểu thức có thể đại diện cho phép tính số học, thao tác truy cập thuộc tính, lời gọi method, điều kiện hoặc truy vấn collection. Spring cung cấp cơ chế phân tích và đánh giá những biểu thức này trong một evaluation context phù hợp.

Ví dụ, biểu thức sau mô tả một phép tính đơn giản:

```java
@Value("#{2 + 3}")
private int result;
```

Spring đánh giá biểu thức và gán giá trị kết quả cho thuộc tính `result`.

SpEL thường xuất hiện dưới dạng `#{...}` khi được nhúng trong cấu hình Spring. Tuy nhiên, bản thân ngôn ngữ biểu thức không bắt buộc phải luôn có phần bao này. Khi sử dụng API phân tích trực tiếp, có thể truyền nội dung biểu thức mà không cần `#{...}`.

```java
ExpressionParser parser = new SpelExpressionParser();
Expression expression = parser.parseExpression("2 + 3");

Integer result = expression.getValue(Integer.class);
```

Trong ví dụ này, `ExpressionParser` phân tích chuỗi đầu vào, còn `Expression` đại diện cho biểu thức đã được phân tích và có thể được đánh giá để lấy kết quả.

---

## 3. Cách SpEL hoạt động

Một biểu thức SpEL thường trải qua hai bước chính: phân tích cú pháp và đánh giá.

**Bước 1: Parse expression**

Ứng dụng cung cấp biểu thức dưới dạng chuỗi. Parser kiểm tra cú pháp và chuyển chuỗi đó thành một biểu diễn mà hệ thống có thể xử lý.

**Bước 2: Evaluate expression**

Spring đánh giá biểu thức trong ngữ cảnh phù hợp để xác định giá trị kết quả. Tùy theo biểu thức và context, quá trình này có thể liên quan đến object đích, biến, bean hoặc các thành phần khác mà context cho phép truy cập.

Ví dụ, với biểu thức `user.name`, parser xác định cấu trúc truy cập thuộc tính. Khi đánh giá, SpEL cần một object `user` phù hợp để lấy giá trị `name`.

Điểm quan trọng là **parser không tự cung cấp dữ liệu nghiệp vụ**. Dữ liệu và quyền truy cập phụ thuộc vào evaluation context cùng cách ứng dụng tích hợp SpEL.

Khi được sử dụng trong cấu hình Spring, framework đảm nhiệm phần tích hợp và đánh giá theo cơ chế tương ứng. Khi sử dụng API trực tiếp, lập trình viên chủ động cung cấp các thành phần cần thiết.

---

## 4. Các khả năng chính

SpEL hỗ trợ nhiều loại thao tác trên object và dữ liệu.

| Khả năng                   | Vai trò                                         | Ví dụ                                             |
| :------------------------- | :---------------------------------------------- | :------------------------------------------------ |
| Truy cập thuộc tính        | Đọc dữ liệu từ object                           | `user.name`                                       |
| Gọi method                 | Thực hiện thao tác trên object                  | `user.getName()`                                  |
| Toán tử                    | Tính toán và so sánh giá trị                    | `price * quantity`                                |
| Logic điều kiện            | Chọn kết quả dựa trên điều kiện                 | `age >= 18 ? 'Adult' : 'Minor'`                   |
| Truy cập collection        | Lọc hoặc lựa chọn phần tử                       | `users.?[active]`                                 |
| Tham chiếu bean            | Truy cập bean được cung cấp trong context       | `@userService`                                    |
| Truy cập biến              | Sử dụng dữ liệu được đưa vào evaluation context | `#user`                                           |
| Tạo object hoặc collection | Khởi tạo dữ liệu ngay trong biểu thức           | `new String('hello')` hoặc `{1, 2, 3}`            |
| Biểu thức mẫu              | Kết hợp văn bản thông thường với biểu thức      | `"Xin chào #{user.name}"`                         |

Các ví dụ trên minh họa những nhóm cú pháp tiêu biểu. Khả năng đánh giá thực tế phụ thuộc vào object, evaluation context và vị trí tích hợp SpEL.

Không cần ghi nhớ toàn bộ cú pháp ngay từ đầu. Khi học SpEL, nên bắt đầu từ truy cập thuộc tính và phép tính, sau đó mở rộng sang điều kiện, collection và tham chiếu bean.

---

## 5. SpEL được sử dụng ở đâu?

SpEL có thể phục vụ nhiều nhu cầu khác nhau trong hệ sinh thái Spring.

**Spring Framework**

Trong cấu hình bean và annotation như `@Value`, SpEL giúp biểu diễn giá trị phụ thuộc vào object, bean hoặc môi trường thay vì chỉ sử dụng giá trị cố định.

**Spring Security**

Các tính năng hỗ trợ SpEL có thể dùng biểu thức để mô tả điều kiện phân quyền hoặc kiểm soát truy cập. Biểu thức được đánh giá trong context do cơ chế bảo mật cung cấp.

**Spring Data**

Một số tính năng hỗ trợ SpEL cho phép sử dụng thông tin từ context trong các biểu thức liên quan đến truy vấn hoặc thao tác dữ liệu.

**Spring Integration**

SpEL có thể được sử dụng để đánh giá điều kiện, truy cập dữ liệu message hoặc hỗ trợ lựa chọn hành vi trong các luồng tích hợp.

Điểm chung là những thành phần này cần đánh giá logic dựa trên dữ liệu tại Runtime. SpEL cung cấp một cơ chế biểu thức có thể tái sử dụng thay vì buộc mỗi thành phần phải tự định nghĩa một ngôn ngữ biểu thức riêng.

Việc một tính năng cụ thể có hỗ trợ SpEL hay không vẫn phụ thuộc vào API và cơ chế tích hợp của thành phần đó.

---

## 6. Vì sao Spring phát triển SpEL?

Cần phân biệt mục tiêu được công bố trong tài liệu Spring với những lợi ích kỹ thuật có thể suy ra từ cách SpEL được sử dụng.

### Mục tiêu ở cấp ứng dụng

SpEL cho phép biểu diễn những thao tác như truy cập thuộc tính, tính toán giá trị và đánh giá điều kiện bằng biểu thức. Điều này hữu ích khi logic cần biểu diễn đủ đơn giản để không phải viết một đoạn Java riêng cho từng trường hợp.

### Mục tiêu ở cấp framework

Spring cần một cơ chế phân tích và đánh giá biểu thức có thể tích hợp vào cấu hình bean và các tính năng của framework. SpEL cung cấp parser cùng API đánh giá để đáp ứng nhu cầu đó.

### Mục tiêu ở cấp hệ sinh thái

Tài liệu Spring Framework 3.2 nêu mục tiêu cung cấp một ngôn ngữ biểu thức được hỗ trợ thống nhất trên các sản phẩm Spring. Đây là điểm quan trọng để hiểu vai trò kiến trúc của SpEL: nhiều thành phần có thể sử dụng chung một cơ chế biểu thức thay vì phát triển những cơ chế riêng biệt.

Tài liệu cũng đề cập đến các nhu cầu từ hệ sinh thái, bao gồm khả năng hỗ trợ công cụ phát triển như tự động hoàn thành biểu thức.

### Các mốc lịch sử tiêu biểu

| Thời điểm | Sự kiện                                                                                          | Ý nghĩa                                                              |
| :-------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| 2008      | Spring Framework 3.0 M1 công bố parser SpEL, hỗ trợ biểu thức trong bean definitions và `@Value` | Cho thấy định hướng tích hợp SpEL vào cấu hình Spring                |
| 2009      | Spring Framework 3.0 tiến tới bản phát hành chính thức                                           | Củng cố vai trò của SpEL trong tham chiếu bean và dữ liệu môi trường |
| 2012      | Tài liệu Spring Framework 3.2 trình bày mục tiêu về ngôn ngữ biểu thức dùng chung                | Làm rõ định hướng ở cấp hệ sinh thái                                 |
| 2021      | Josh Long hồi cứu về lịch sử phát triển và các trường hợp sử dụng SpEL                           | Bổ sung góc nhìn về quá trình phát triển và mức độ ứng dụng          |

Các mốc này cho thấy sự phát triển từ tích hợp biểu thức vào cấu hình Spring đến việc sử dụng một cơ chế biểu thức chung trong nhiều thành phần.

Tuy nhiên, cần thận trọng khi kết luận về động cơ cá nhân của người thiết kế. Tài liệu phát hành và tài liệu chính thức chứng minh những tính năng cùng mục tiêu được công bố, nhưng không nhất thiết giải thích đầy đủ mọi lý do lịch sử dẫn đến quyết định thiết kế ban đầu.

---

## 7. Giới hạn và lưu ý

**SpEL không thay thế Java.**

Java vẫn phù hợp hơn với nghiệp vụ phức tạp, quy trình nhiều bước và logic cần được kiểm thử, tổ chức hoặc tái sử dụng như các thành phần chương trình thông thường. SpEL bổ sung khả năng biểu diễn và đánh giá biểu thức trong những ngữ cảnh thích hợp.

**Biểu thức phụ thuộc vào context.**

Một biểu thức có thể hợp lệ về cú pháp nhưng không đánh giá được nếu thiếu object, biến hoặc bean cần thiết. Khi phân tích lỗi, cần phân biệt lỗi cú pháp với lỗi phát sinh trong quá trình đánh giá.

**Cần kiểm soát biểu thức không đáng tin cậy.**

SpEL có thể truy cập thuộc tính và gọi method tùy theo evaluation context. Vì vậy, không nên mặc định rằng biểu thức do người dùng cung cấp là an toàn. Ứng dụng cần giới hạn khả năng truy cập và lựa chọn context phù hợp với mức độ tin cậy của nguồn đầu vào.

**Hiệu năng phụ thuộc vào cách sử dụng.**

SpEL có thể được diễn giải hoặc sử dụng cơ chế biên dịch trong những trường hợp được hỗ trợ. Không nên mặc định rằng mọi biểu thức đều cần tối ưu hóa; trước hết cần xác định biểu thức có nằm trên đường thực thi thường xuyên hay không và đo lường khi cần thiết.

---

## 8. Tổng kết

SpEL là ngôn ngữ biểu thức của Spring, được dùng để truy vấn và thao tác trên object trong Runtime. Nó hỗ trợ các thao tác như truy cập thuộc tính, gọi method, tính toán, xử lý điều kiện, truy vấn collection và tham chiếu bean.

Giá trị của SpEL không chỉ nằm ở cú pháp ngắn gọn. Ở cấp kiến trúc, SpEL cung cấp một cơ chế đánh giá biểu thức chung để Spring Framework và các thành phần trong hệ sinh thái có thể tích hợp logic động theo cách nhất quán.

Có thể ghi nhớ ba ý chính:

1. **Vấn đề:** Cấu hình và các tính năng framework đôi khi cần giá trị hoặc logic phụ thuộc vào dữ liệu tại Runtime.
2. **Giải pháp:** SpEL cung cấp ngôn ngữ biểu thức cùng cơ chế phân tích và đánh giá trong một context xác định.
3. **Giới hạn:** SpEL bổ sung cho Java, không thay thế Java; khả năng truy cập và mức độ an toàn phụ thuộc vào context và cách ứng dụng sử dụng biểu thức.

---

## Related

*   [Ý đồ thiết kế của AOP và quan hệ với OOP](../aop/01_fundamentals/aop_design_and_oop.md) — cùng bàn về việc tách logic khỏi mã nghiệp vụ và mô-đun hóa theo concern.

---
[← Back to README](README.md)
