# Docker

Docker đóng gói ứng dụng cùng toàn bộ dependency vào một đơn vị chạy thống nhất, nhờ đó môi trường phát triển, kiểm thử và production hành xử giống nhau. Giá trị cốt lõi nằm ở chỗ container chia sẻ **Kernel** với host nên khởi động nhanh và nhẹ hơn máy ảo, nhưng chính đặc điểm đó cũng đặt ra giới hạn: ranh giới cô lập mỏng hơn ranh giới phần cứng ảo hoá, và mọi thứ bên trong container vẫn chạm tới được Kernel của máy. Nhánh tài liệu này ghi chú nhanh về nền tảng đó, hiện tập trung vào bài toán cô lập môi trường chạy cho **AI Coding Agent**: khi một tiến trình tự quyết định lệnh nào sẽ chạy, câu hỏi không còn là đóng gói ứng dụng mà là giới hạn **Blast Radius** mà nó có thể gây ra.

---

## Danh mục Module

1. **[01. Sandbox](01_sandbox/README.md)**: Vì sao container thường không đủ cho Agent tự trị, mô hình **microVM** đặt Docker Engine vào bên trong một ranh giới phần cứng ảo hoá, và cách mô hình đó xử lý file, mạng cùng credential.

---

[← Back to README](../README.md)
