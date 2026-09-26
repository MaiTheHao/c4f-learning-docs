# Modularity Trong Kiến Trúc Phần Mềm

## Table of Contents

- [Bản chất và Định nghĩa của Modularity](#bản-chất-và-định-nghĩa-của-modularity)
- [Phân biệt Modularity và Granularity](#phân-biệt-modularity-và-granularity)
- [Ba Trụ cột Đo lường Modularity](#ba-trụ-cột-đo-lường-modularity)
- [Định hướng Tài liệu Chi tiết](#định-hướng-tài-liệu-chi-tiết)

---

## Bản chất và Định nghĩa của Modularity

Trong tác phẩm kinh điển *Composite/Structured Design* (1978), Glenford J. Myers từng nhận định:

> "95% of the words [written about software architecture] are spent extolling the benefits of “modularity” and little, if anything, is said about how to achieve it."

Các nền tảng công nghệ và ngôn ngữ lập trình khác nhau cung cấp nhiều cơ chế đóng gói và tái sử dụng mã nguồn khác nhau. Một mô-đun có thể là `class`, `package`, `namespace`, `component`, `assembly`, hay bất kỳ đơn vị trừu tượng nào hỗ trợ gom nhóm mã nguồn có liên quan. Tuy nhiên, việc định nghĩa mô-đun một cách tường minh thường rất mơ hồ và thiếu tính nhất quán.

Để xây dựng một hệ quy chiếu chung, các tác giả Mark Richards và Neal Ford trong cuốn *Fundamentals of Software Architecture* đưa ra định nghĩa mang tính nền tảng:

> [!IMPORTANT]
> **Mô-đun là sự gom nhóm logic của các đoạn mã có liên quan mật thiết với nhau (như các lớp hoặc các hàm), được biểu đạt qua cơ chế đóng gói của ngôn ngữ nhằm tạo ranh giới tổ chức, kiểm soát độ phụ thuộc (Coupling) và duy trì trật tự cho hệ thống.**

Từ góc nhìn vật lý học, các hệ thống phần mềm mô phỏng những hệ thống phức tạp luôn có xu hướng trôi về trạng thái entropy (sự hỗn loạn gia tăng). Trong hệ thống vật lý, năng lượng phải được liên tục bổ sung để duy trì trật tự. Tương tự trong phần mềm, kiến trúc sư phải không ngừng tiêu hao năng lượng quản trị cấu trúc để duy trì tính toàn vẹn của các ranh giới mô-đun hóa, bởi sự ngăn nắp và tính gắn kết không bao giờ tự nhiên diễn ra.

---

## Phân biệt Modularity và Granularity

Hai khái niệm **Modularity** và **Granularity** thường xuyên bị dùng lẫn lộn trong quá trình thiết kế hệ thống:

| Khái niệm | Bản chất Kỹ thuật | Trọng tâm Quyết định |
| :--- | :--- | :--- |
| **Modularity** | Hành vi chia tách hệ thống thành các phần nhỏ hơn có ranh giới rõ ràng. | Ranh giới phân chia logic và cơ chế đóng gói. |
| **Granularity** | Kích thước và phạm vi cụ thể của từng phần được chia tách. | Điểm cân bằng kích thước (quá thô hay quá mịn). |

> [!WARNING]
> Tác giả Mark Richards đưa ra nguyên lý cốt lõi:
>
> > *"Embrace modularity, but beware of granularity"*
>
> Việc xác định độ mịn không hợp lý sẽ tạo ra mạng lưới phụ thuộc chằng chịt, dẫn đến các phản mẫu kiến trúc nguy hiểm như **Spaghetti Architecture**, **Distributed Monolith**, hoặc **Big Ball of Distributed Mud**.

---

## Ba Trụ cột Đo lường Modularity

Để định lượng và kiểm soát tính mô-đun hóa thay vì phán đoán cảm tính, các tác giả của cuốn sách [Fundamentals of Software Architecture](../../../library/books/fundamentals_of_software_architecture_2nd.epub) đã hệ thống hóa và đưa ra ba đại lượng đo lường cốt lõi:

| Thước đo | Trọng tâm Đánh giá | Câu hỏi Kiến trúc Then chốt |
| :--- | :--- | :--- |
| **Cohesion** | Mức độ tập trung trách nhiệm bên trong một mô-đun. | Các phần tử bên trong mô-đun có cùng phục vụ một mục đích thống nhất hay không? |
| **Coupling** | Mức độ phụ thuộc lẫn nhau giữa các mô-đun khác nhau. | Thay đổi bên trong mô-đun này có lan truyền và bắt buộc thay đổi mô-đun khác không? |
| **Connascence** | Bản chất và mức độ gắn kết ràng buộc giữa các thành phần. | Dạng ràng buộc nào đang gắn chặt hai thành phần, và làm sao để giảm thiểu độ mạnh của ràng buộc đó? |

---

[← Back to README](README.md)