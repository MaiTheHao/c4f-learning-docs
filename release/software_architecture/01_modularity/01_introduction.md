# Modularity Trong Kiến Trúc Phần Mềm

## Table of Contents

- [Bản chất và Định nghĩa của Modularity](#bản-chất-và-định-nghĩa-của-modularity)
- [Modularity Giải quyết Vấn đề gì](#modularity-giải-quyết-vấn-đề-gì)
- [Phân biệt Modularity và Granularity](#phân-biệt-modularity-và-granularity)
- [Ba Trụ cột Đo lường Modularity](#ba-trụ-cột-đo-lường-modularity)
- [Liên quan](#liên-quan)

---

## Bản chất và Định nghĩa của Modularity

Trong tác phẩm kinh điển *Composite/Structured Design* (1978), Glenford J. Myers từng nhận định:

> "95% of the words [written about software architecture] are spent extolling the benefits of “modularity” and little, if anything, is said about how to achieve it."

Các nền tảng công nghệ và ngôn ngữ lập trình khác nhau cung cấp nhiều cơ chế đóng gói và tái sử dụng mã nguồn khác nhau. Một mô-đun có thể là `class`, `package`, `namespace`, `component`, `assembly`, hay bất kỳ đơn vị trừu tượng nào hỗ trợ gom nhóm mã nguồn có liên quan. Tuy nhiên, việc định nghĩa mô-đun một cách tường minh thường rất mơ hồ và thiếu tính nhất quán.

Để xây dựng một hệ quy chiếu chung, các tác giả Mark Richards và Neal Ford trong cuốn *Fundamentals of Software Architecture* đưa ra định nghĩa mang tính nền tảng:

> [!IMPORTANT]
> **Mô-đun là sự gom nhóm logic của các đoạn mã có liên quan mật thiết với nhau (như các lớp hoặc các hàm), được biểu đạt qua cơ chế đóng gói của ngôn ngữ nhằm tạo ranh giới tổ chức, kiểm soát Coupling và duy trì trật tự cho hệ thống.**

Modularity không chỉ tồn tại ở tầng mã nguồn. Ở tầng **logic**, ranh giới mô-đun được biểu đạt bằng `package`, `namespace` hay `class`. Ở tầng **vật lý**, ranh giới đó kết tinh thành những đơn vị đóng gói và triển khai độc lập như thư viện, container image hay service. Hai tầng này không nhất thiết trùng khớp: một hệ thống có thể mô-đun hóa rất chặt chẽ ở tầng logic nhưng vẫn triển khai như một khối duy nhất (Modular Monolith), hoặc ngược lại.

Từ góc nhìn vật lý học, các hệ thống phần mềm mô phỏng những hệ thống phức tạp luôn có xu hướng trôi về trạng thái entropy (sự hỗn loạn gia tăng). Trong hệ thống vật lý, năng lượng phải được liên tục bổ sung để duy trì trật tự. Tương tự trong phần mềm, kiến trúc sư phải không ngừng tiêu hao năng lượng quản trị cấu trúc để duy trì tính toàn vẹn của các ranh giới mô-đun hóa, bởi sự ngăn nắp và tính gắn kết không bao giờ tự nhiên diễn ra.

---

## Modularity Giải quyết Vấn đề gì

Modularity không phải là mục tiêu tự thân, mà là công cụ để kiểm soát những lực luôn kéo hệ thống về phía hỗn loạn khi quy mô mã nguồn và đội ngũ tăng lên. Bốn lợi ích dưới đây là lý do cấu trúc mô-đun trở thành yêu cầu bắt buộc thay vì một lựa chọn thẩm mỹ.

- **Kiểm soát Software Entropy**: Ranh giới mô-đun ngăn hệ thống trượt dần thành *Big Ball of Mud* hay *Spaghetti Code* khi hàng trăm thay đổi nhỏ tích tụ theo thời gian.
- **Isolate Changes**: Một chỉnh sửa chỉ lan truyền trong phạm vi mô-đun chứa nó, thay vì kích hoạt một làn sóng sửa lỗi dây chuyền trên toàn hệ thống.
- **Independent Developability và Deployability**: Nhiều đội ngũ có thể phát triển song song trên các mô-đun khác nhau mà không giẫm chân lên nhau, và có thể triển khai lại một mô-đun mà không phải dựng lại toàn bộ ứng dụng.
- **Maintainability và Testability**: Mô-đun có ranh giới rõ ràng dễ đọc, dễ kiểm thử đơn vị độc lập và dễ tái sử dụng ở ngữ cảnh khác.

> [!NOTE]
> Modularity không miễn phí. Mỗi ranh giới được dựng lên đều kéo theo chi phí giao tiếp, indirection và công sức duy trì tính nhất quán giữa các mô-đun. Giá trị của nó chỉ xuất hiện khi lợi ích về cô lập thay đổi lớn hơn chi phí quản trị ranh giới đó.

---

## Phân biệt Modularity và Granularity

Hai khái niệm **Modularity** và **Granularity** thường xuyên bị dùng lẫn lộn trong quá trình thiết kế hệ thống:

| Khái niệm | Bản chất Kỹ thuật | Trọng tâm Quyết định |
| :--- | :--- | :--- |
| **Modularity** | Hành vi chia tách hệ thống thành các phần nhỏ hơn có ranh giới rõ ràng. | Ranh giới phân chia logic và cơ chế đóng gói. |
| **Granularity** | Kích thước và phạm vi cụ thể của từng phần được chia tách. | Điểm cân bằng kích thước (quá thô hay quá mịn). |

Modularity trả lời câu hỏi *hệ thống được chia ở đâu*, còn Granularity trả lời câu hỏi *chia đến mức nào*. Một hệ thống hoàn toàn có thể mô-đun hóa đúng nguyên tắc nhưng vẫn thất bại vận hành nếu mỗi mô-đun bị băm quá nhỏ, bởi khi đó số lượng đường giao tiếp tăng nhanh hơn giá trị mà ranh giới mang lại.

> [!WARNING]
> Nguyên lý cốt lõi của Mark Richards: *"Embrace modularity, but beware of granularity."*
>
> Việc xác định độ mịn không hợp lý sẽ tạo ra mạng lưới phụ thuộc chằng chịt, dẫn đến các phản mẫu kiến trúc nguy hiểm như **Spaghetti Architecture**, **Distributed Monolith**, hoặc **Big Ball of Distributed Mud**.

---

## Ba Trụ cột Đo lường Modularity

Để định lượng và kiểm soát tính mô-đun hóa thay vì phán đoán cảm tính, các tác giả của cuốn sách *Fundamentals of Software Architecture* đã hệ thống hóa và đưa ra ba đại lượng đo lường cốt lõi:

| Thước đo | Trọng tâm Đánh giá | Câu hỏi Kiến trúc Then chốt |
| :--- | :--- | :--- |
| **Cohesion** | Mức độ tập trung trách nhiệm bên trong một mô-đun. | Các phần tử bên trong mô-đun có cùng phục vụ một mục đích thống nhất hay không? |
| **Coupling** | Mức độ phụ thuộc lẫn nhau giữa các mô-đun khác nhau. | Thay đổi bên trong mô-đun này có lan truyền và bắt buộc thay đổi mô-đun khác không? |
| **Connascence** | Bản chất và mức độ gắn kết ràng buộc giữa các thành phần. | Dạng ràng buộc nào đang gắn chặt hai thành phần, và làm sao để giảm thiểu độ mạnh của ràng buộc đó? |

Ba thước đo này bổ trợ cho nhau thay vì thay thế nhau. **Cohesion** nhìn vào bên trong một mô-đun, **Coupling** nhìn vào đường nối giữa các mô-đun, còn **Connascence** đi sâu hơn một bậc: nó không chỉ đếm số lượng phụ thuộc mà còn mô tả *bản chất* của sự ràng buộc, nhờ đó phân biệt được một phụ thuộc lành mạnh với một phụ thuộc sẽ phát nổ mỗi khi có thay đổi.

> [!TIP]
> Mục tiêu tối ưu luôn là **High Cohesion** đi kèm **Loose Coupling**. Hai mục tiêu này không đạt được bằng cách chia nhỏ mã nguồn nhiều hơn, mà bằng cách đặt ranh giới đúng chỗ để mỗi mô-đun giữ trọn một trách nhiệm và giao tiếp với bên ngoài qua bề mặt hẹp nhất có thể.

---

## Liên quan

*   [Bối cảnh Trong Kiến Trúc Phần Mềm](../00_introduction/01_architectural_context.md) — cùng nguyên lý **Trade-off theo bối cảnh**: Modularity chỉ là phương tiện, và việc chọn mức độ mô-đun hóa phải xuất phát từ ràng buộc thực tế của hệ thống chứ không từ một công thức cố định.
*   [Architectural Characteristics Trong Kiến Trúc Phần Mềm](../02_architectural_characteristics/01_introduction.md) — **Modularity** là một **Structural Characteristic** trong khung phân loại đặc tính kiến trúc, nên hai bài chia sẻ cùng trục **ranh giới cấu trúc và khả năng tiến hóa của hệ thống**.
*   [Component Trong Kiến Trúc Phần Mềm](../03_components/01_introduction.md) — cùng trục **ranh giới cấu trúc**: Modularity gom mã nguồn thành mô-đun logic, còn Component nâng ranh giới đó lên thành đơn vị triển khai được.

---
[← Back to README](README.md)
