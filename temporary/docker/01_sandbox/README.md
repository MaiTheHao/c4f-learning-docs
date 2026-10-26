# Sandbox - Cô lập môi trường chạy cho AI Coding Agent

**Sandbox** là lớp ranh giới do hạ tầng áp đặt, quyết định một tiến trình nhìn thấy gì, chạm tới được gì và mang secret nào ra ngoài. Với **AI Coding Agent**, ranh giới đó không còn là chi tiết triển khai mà là điều kiện để cho phép tự chủ: Agent cần shell tuỳ ý, cài system package và build container, trong khi máy của developer vẫn phải an toàn. Module này đi từ bài toán **Blast Radius** của mô hình chạy trực tiếp trên host, qua các hướng cô lập trước đó (container, máy ảo truyền thống, WASM) để thấy mỗi hướng buộc phải bỏ đi một yêu cầu, rồi phân tích mô hình **microVM** cùng cách nó xử lý file, mạng và credential. Trọng tâm không phải so sánh tính năng mà là hiểu ranh giới bảo mật được đặt ở tầng nào, và vì sao lựa chọn tầng đó quyết định toàn bộ phần còn lại.

---

## Bối cảnh và mô hình

Hai bài trong module đi theo một mạch nhân quả. Bài đầu đặt vấn đề: Agent chạy bằng quyền của developer nên **Blast Radius** là toàn bộ máy, trong khi ba yêu cầu cô lập mạnh, môi trường Docker đầy đủ và khởi động nhanh phải thoả cùng lúc, và mỗi giải pháp trước đây đều hy sinh một trong ba. Bài thứ hai mô tả mô hình giải quyết được cả ba: mỗi phiên Agent chạy trong một **microVM** riêng có Docker Engine bên trong, kèm cách cô lập file, mạng và credential, rồi đối chiếu với Docker thường để thấy khác biệt cốt lõi nằm ở tầng ranh giới chứ không ở danh sách tính năng. [Xem chi tiết Bối cảnh và lý do ra đời](./01_docker_sbx_boi_canh.md). [Xem chi tiết Mô hình và so sánh với Docker thường](./02_docker_sbx_mo_hinh.md).

---

[← Back to README](../README.md)
