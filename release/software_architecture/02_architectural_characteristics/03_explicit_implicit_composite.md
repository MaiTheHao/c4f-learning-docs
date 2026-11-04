# Explicit, Implicit và Composite

## Table of Contents

- [Ba loại theo Mức độ Rõ ràng](#ba-loại-theo-mức-độ-rõ-ràng)
- [Implicit và Rủi ro Không được Nghiệm thu](#implicit-và-rủi-ro-không-được-nghiệm-thu)
- [Composite và Mục tiêu Chiến lược](#composite-và-mục-tiêu-chiến-lược)
- [Liên quan](#liên-quan)

---

## Ba loại theo Mức độ Rõ ràng

Không phải đặc tính nào cũng xuất hiện rõ như nhau trong yêu cầu. Ba loại dưới đây khác nhau ở nguồn gốc và cách kiểm chứng:

| Loại | Nguồn gốc | Ví dụ |
| :--- | :--- | :--- |
| **Explicit** | Ghi trực tiếp trong tài liệu yêu cầu kinh doanh. | Hệ thống phải phục vụ một lượng người dùng đồng thời cụ thể. |
| **Implicit** | Không ghi rõ nhưng bắt buộc để dự án thành công, hoặc xuất phát từ tri thức miền của kiến trúc sư. | An ninh cơ bản, Availability, Modularity. |
| **Composite** | Mục tiêu kinh doanh lớn, không có thước đo đơn lẻ, cấu thành từ nhiều đặc tính nhỏ hơn. | **Agility** = Maintainability + Testability + Deployability. |

---

## Implicit và Rủi ro Không được Nghiệm thu

**Implicit** là vùng nguy hiểm nhất. Không ai viết chúng vào tài liệu, cũng không ai nghiệm thu, nên hệ thống có thể đáp ứng đủ mọi yêu cầu explicit mà vẫn sụp đổ ở sự cố đầu tiên. Kiến trúc sư có trách nhiệm phát hiện và nêu rõ chúng trước khi chúng thành khiếm khuyết cấu trúc.

> [!WARNING]
> Một đặc tính implicit chỉ được coi là đã xử lý khi nó có thang đo và cách kiểm chứng cụ thể. Nếu vẫn chỉ nằm trong đầu kiến trúc sư, nó sẽ bị hy sinh đầu tiên mỗi khi tiến độ chịu áp lực.

---

## Composite và Mục tiêu Chiến lược

**Bài toán**: lãnh đạo yêu cầu hệ thống phải "agile", nhưng không có con số nào đo trực tiếp "agile". **Composite** giải quyết bằng cách phân rã mục tiêu thành tập đặc tính thành phần, mỗi thành phần có thang đo và cách kiểm chứng riêng.

**Agility** là kết quả cộng hưởng của **Maintainability**, **Testability** và **Deployability**. Cải thiện một thành phần chỉ làm tăng Agility khi hai thành phần còn lại không trở thành nút thắt.

---

## Liên quan

*   [Phân loại Đặc tính Kiến trúc](02_classification.md) — cùng trục **cấu trúc hóa danh mục đặc tính**: một bài chia theo phạm vi ảnh hưởng, bài này chia theo mức độ rõ ràng trong yêu cầu.
*   [Phạm vi Áp dụng và Architectural Quantum](04_scope_and_quantum.md) — sau khi xác định loại đặc tính, câu hỏi tiếp theo là nó **áp dụng cho phạm vi nào** của hệ thống.

---
[← Back to README](README.md)