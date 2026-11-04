# Lối tư duy Component

## Table of Contents

- [Ranh giới và Trục thay đổi](#ranh-giới-và-trục-thay-đổi)
- [Bản đồ Đóng gói và Bảo trì](#bản-đồ-đóng-gói-và-bảo-trì)
- [Quản lý Phụ thuộc và Độ ổn định](#quản-lý-phụ-thuộc-và-độ-ổn-định)
- [Architectural Quantum](#architectural-quantum)
- [Cân bằng Động](#cân-bằng-động)
- [Liên quan](#liên-quan)

---

## Ranh giới và Trục thay đổi

Tư duy theo component không đơn thuần là gom các đoạn mã vào thư mục. Ranh giới component phải được thiết lập dựa trên **trục thay đổi**: những mã nguồn thay đổi cùng lý do và cùng thời điểm nên nằm chung một component, còn những mã nguồn không thực sự dùng chung thì không nên bị ép phụ thuộc lẫn nhau.

Hai nguyên tắc dẫn đường cho quyết định này:

- **Common Closure Principle (CCP)**: gom vào cùng component những lớp thay đổi cùng lúc vì cùng một lý do nghiệp vụ. Khi yêu cầu thay đổi, phạm vi ảnh hưởng bị giới hạn trong một component thay vì rải khắp hệ thống.
- **Common Reuse Principle (CRP)**: chỉ gom vào cùng component những thứ thực sự được dùng chung. Ép các lớp không liên quan vào chung một artifact khiến người dùng phải kéo theo những phụ thuộc họ không cần.

CCP kéo component về phía lớn hơn để dễ bảo trì, CRP kéo về phía nhỏ hơn để tránh phát hành dư thừa. Sự căng thẳng giữa hai lực này là chủ đề của [Vấn đề và Thách thức](04_challenges.md).

---

## Bản đồ Đóng gói và Bảo trì

Đồ thị phụ thuộc giữa các component không mô tả chức năng nghiệp vụ của ứng dụng. Nó thực chất là **bản đồ thể hiện khả năng đóng gói và khả năng bảo trì** của hệ thống.

Một đồ thị có nhiều cạnh cắt ngang, nhiều vòng lặp hoặc nhiều component phụ thuộc vào một khối trung tâm cho thấy chi phí thay đổi sẽ cao, bất kể nghiệp vụ có đơn giản đến đâu. Ngược lại, một đồ thị thưa, có hướng rõ ràng cho phép build, test và phát hành từng phần một cách độc lập.

---

## Quản lý Phụ thuộc và Độ ổn định

Ba nguyên tắc quyết định hình dạng của đồ thị phụ thuộc:

| Nguyên tắc | Nội dung | Hệ quả |
| :--- | :--- | :--- |
| **Stable Dependencies Principle (SDP)** | Phụ thuộc phải luôn hướng về phía component ổn định hơn. | Component hay thay đổi không được kéo theo component khó thay đổi. |
| **Stable Abstractions Principle (SAP)** | Component càng ổn định thì càng phải trừu tượng. | Nơi khó sửa phải được thiết kế để mở rộng mà không cần sửa. |
| **Acyclic Dependencies Principle (ADP)** | Đồ thị phụ thuộc phải là đồ thị có hướng không chu kỳ (DAG). | Không có vòng lặp thì mới build, test và phát hành độc lập được. |

SDP và SAP là hai mặt của cùng một nguyên lý: độ ổn định chỉ có giá trị khi đi kèm khả năng mở rộng. Một component cực kỳ ổn định nhưng hoàn toàn cụ thể sẽ trở thành **Zone of Pain**, nơi mọi thay đổi đều đắt đỏ vì nhiều thành phần khác phụ thuộc vào nó. ADP bảo vệ cấu trúc khỏi vòng lặp phụ thuộc, thứ khiến việc biên dịch và kiểm thử độc lập trở nên bất khả thi.

---

## Architectural Quantum

Ở cấp độ kiến trúc tổng thể, một hoặc nhiều component kết hợp với cơ sở dữ liệu và hạ tầng liên quan tạo thành một **Architectural Quantum**: ranh giới vận hành độc lập, có độ gắn kết chức năng cao và ghép nối tĩnh bên ngoài thấp.

Quantum là đơn vị để xác định phạm vi áp dụng của một bộ đặc tính kiến trúc. Cách xác định ranh giới này được trình bày chi tiết trong [Phạm vi Áp dụng và Architectural Quantum](../02_architectural_characteristics/04_scope_and_quantum.md).

---

## Cân bằng Động

Cấu trúc component của một dự án không cố định ngay từ đầu mà tiến hóa theo độ trưởng thành của hệ thống. Ở giai đoạn đầu, kiến trúc sư ưu tiên **develop-ability** để đội ngũ có thể di chuyển nhanh và thay đổi hướng thiết kế mà không phải trả giá lớn. Khi dự án trưởng thành, trọng tâm dịch dần sang **reusability**, vì lúc này chi phí duy trì nhiều biến thể và phụ thuộc chéo bắt đầu lớn hơn lợi ích của việc thay đổi tự do.

Đây là một trade-off theo thời gian, không phải một lựa chọn cố định. Một cấu trúc component tối ưu cho giai đoạn khởi đầu có thể trở thành gánh nặng khi hệ thống đã ổn định, và ngược lại.

---

## Liên quan

*   [Component Trong Kiến Trúc Phần Mềm](01_introduction.md) — cùng trục **ranh giới component**: bài trước định nghĩa component từ ba góc nhìn, bài này biến định nghĩa đó thành nguyên tắc thiết kế cụ thể.
*   [Component Giải quyết Vấn đề gì](03_benefits.md) — các nguyên tắc về ranh giới và độ ổn định chỉ có ý nghĩa khi gắn với **lợi ích thực tế** mà chúng mang lại cho vòng đời phát triển.

---
[← Back to README](README.md)
