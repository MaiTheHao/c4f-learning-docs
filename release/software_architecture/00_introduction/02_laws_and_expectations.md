# Quy Luật Kiến Trúc & Kỳ Vọng Năng Lực

## Table of Contents

- [Ba Quy Luật Kiến Trúc Bất Biến](#ba-quy-luật-kiến-trúc-bất-biến)
- [1. First Law: Everything in Software Architecture is a Trade-off](#1-first-law-everything-in-software-architecture-is-a-trade-off)
- [2. Second Law: Why is More Important than How](#2-second-law-why-is-more-important-than-how)
- [3. Third Law: Most Architecture Decisions Exist on a Spectrum between Extremes](#3-third-law-most-architecture-decisions-exist-on-a-spectrum-between-extremes)

---

## Ba Quy Luật Kiến Trúc Bất Biến

Hệ thống phần mềm phức tạp hiếm khi sụp đổ vì lập trình viên thiếu kỹ năng viết mã. Phần lớn sự cố bắt nguồn từ những quyết định kiến trúc mang tính giáo điều, coi một giải pháp kỹ thuật là **"Silver Bullet"** và áp dụng bất chấp bối cảnh vận hành.

Trong tác phẩm kinh điển *Fundamentals of Software Architecture*, hai tác giả Mark Richards và Neal Ford đã đúc kết ba quy luật nền tảng chi phối toàn bộ tiến trình thiết kế hệ thống:

| Quy Luật | Trọng Tâm Thiết Kế | Hệ Quả Thực Chiến & Sai Lầm Thường Gặp |
| :--- | :--- | :--- |
| **First Law** | Đánh giá đa chiều mọi hệ quả kỹ thuật | Lầm tưởng tồn tại giải pháp hoàn hảo; bỏ qua chi phí ẩn về hạ tầng và độ phức tạp vận hành. |
| **Second Law** | Bảo toàn lý do và bối cảnh ra quyết định | Chỉ ghi chép công nghệ triển khai (`How`) mà quên lưu trữ lý do (`Why`), khiến đội ngũ kế thừa không dám tái cấu trúc. |
| **Third Law** | Định vị điểm cân bằng trên dải quang phổ | Lầm tưởng rằng có kết quả tuyệt đối đúng hoặc sai; áp đặt mô hình phức tạp khi bối cảnh thực tế chưa đòi hỏi. |

---

## 1. First Law: Everything in Software Architecture is a Trade-off

Kỹ nghệ phần mềm không tồn tại giải pháp tối ưu tuyệt đối trên mọi phương diện. Mọi cải tiến ở một thuộc tính kiến trúc đều phải trả giá bằng sự suy giảm hoặc ràng buộc ở những thuộc tính khác:

- **Microservices**: Mang lại khả năng mở rộng độc lập và tốc độ phát hành theo từng domain, nhưng đánh đổi bằng việc gia tăng `latency` mạng, ví dụ `p99 latency` từ 2ms khi gọi hàm in-memory tăng lên 35ms qua mạng, cùng chi phí tài nguyên và rủi ro bất đồng bộ dữ liệu phân tán.
- **Tái sử dụng mã nguồn**: Tiết kiệm thời gian lập trình ban đầu nhưng dễ tạo ra mức độ **Coupling** nguy hiểm. Chia sẻ thư viện dùng chung rất hiệu quả cho các tiện ích hạ tầng ổn định (logging, metrics), nhưng trở thành cái bẫy nếu áp dụng cho domain logic có tần suất thay đổi cao giữa các phòng ban.

> [!IMPORTANT]
> Mục tiêu thực tế của kiến trúc sư không phải là tìm kiếm thiết kế hoàn hảo, mà là xác định phương án **Least Worst Architecture**—giải pháp dung hòa tối ưu nhất giữa các ràng buộc kỹ thuật, ngân sách và thời hạn bàn giao.

---

## 2. Second Law: Why is More Important than How

Chi tiết kỹ thuật triển khai (`How`) biến đổi liên tục theo sự đào thải của công nghệ. Ngược lại, lý do kiến trúc và bối cảnh kinh doanh (`Why`) hình thành nên quyết định mới là tri thức cốt lõi cần lưu trữ dài hạn:

- **Thiếu bối cảnh Why**: Một ghi chép ghi nhận *"Hệ thống sử dụng `Apache Kafka`"* chỉ mô tả công cụ. Khi quy mô thay đổi hoặc chi phí duy trì cụm cluster tăng cao, đội ngũ tiếp quản không có căn cứ để đánh giá việc thay thế.
- **Bảo toàn bối cảnh Why**: Ghi chép nêu rõ *"Sử dụng message broker phân tán bất đồng bộ để đệm tải cho cổng thanh toán, duy trì `p99 latency` dưới 150ms và thông lượng 12.000 req/s khi chiến dịch khuyến mại đạt đỉnh"* giúp đội ngũ tự tin cân nhắc các giải pháp thay thế như `RabbitMQ`, `NATS` hoặc `Cloud Pub/Sub` mà không sợ phá vỡ cam kết SLO.

Công cụ chuẩn mực để lưu trữ bối cảnh này là tài liệu **ADR**, bao gồm: Bối cảnh, Quyết định, Các phương án thay thế bị loại trừ và Hệ quả đánh đổi được chấp thuận.

---

## 3. Third Law: Most Architecture Decisions Exist on a Spectrum between Extremes

Trong đời sống thực tế cũng như kỹ nghệ phần mềm, mọi quyết định hiếm khi rạch ròi giữa hai thái cực trắng đen:

- **Không có kết quả nào là đúng hoặc sai**: Tranh cãi xem **Monolith** là sai hay **Microservices** mới là đúng hoàn toàn không mang lại giá trị kỹ thuật. Trong kiến trúc, không có quyết định nào là đúng hoặc sai tuyệt đối; một giải pháp chỉ có thể được xem là phù hợp hay không phù hợp với từng bài toán cụ thể.
- **Tư duy dải quang phổ**: Mọi giải pháp kiến trúc đều phân bổ trên một dải quang phổ giữa hai thái cực đối nghịch. Lựa chọn hợp lý không phải là cố gắng tìm kiếm một phương án "đúng" duy nhất, mà là xác định điểm cân bằng **Sweet Spot** tương thích nhất với quy mô đội ngũ, khối lượng tải và nguồn lực tại thời điểm hiện tại.

---

[← Back to README](README.md)
