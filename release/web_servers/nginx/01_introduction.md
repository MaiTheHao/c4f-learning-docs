# Chương 1. Tổng quan & Lịch sử ra đời NGINX

Chương này cung cấp cái nhìn tổng quan về NGINX, nguồn gốc ra đời và mục tiêu thiết kế cốt lõi của hai phiên bản NGINX Open Source và NGINX Plus.

## Table of Contents

- [1.1 NGINX là gì?](#11-nginx-là-gì)
- [1.2 Lịch sử ra đời & Nguồn gốc tên gọi](#12-lịch-sử-ra-đời--nguồn-gốc-tên-gọi)
- [1.3 Mục tiêu thiết kế cốt lõi của NGINX](#13-mục-tiêu-thiết-kế-cốt-lõi-của-nginx)

---

## 1.1 NGINX là gì?

**NGINX** (phát âm là *"Engine-X"*) là máy chủ mã nguồn mở hiệu năng cao, ban đầu được thiết kế để phục vụ nội dung tĩnh với tốc độ tối ưu và xử lý hàng chục nghìn kết nối đồng thời với lượng tài nguyên CPU & RAM cực kỳ tiết kiệm.

Theo thời gian, NGINX phát triển thành một giải pháp đa năng trong hạ tầng hệ thống:
- **Web Server**: Phục vụ nội dung tĩnh và xử lý yêu cầu HTTP/HTTPS.
- **Reverse Proxy**: Tiếp nhận yêu cầu từ client và chuyển tiếp an toàn đến các ứng dụng backend.
- **Load Balancer**: Phân phối lưu lượng truy cập ở cả tầng L4 (TCP/UDP) và L7 (HTTP/gRPC).
- **API Gateway**: Quản lý, xác thực, điều hướng và giới hạn tốc độ (rate limiting) cho microservices.
- **Content Cache**: Bộ đệm lưu trữ nội dung tĩnh/động để giảm tải cho máy chủ backend.

---

## 1.2 Lịch sử ra đời & Nguồn gốc tên gọi

Dự án NGINX được kỹ sư phần mềm người Nga **Igor Sysoev** bắt đầu phát triển từ năm 2002 nhằm giải quyết vấn đề hiệu năng cho website Rambler.ru (một trong những cổng thông tin lượng truy cập lớn nhất nước Nga thời điểm đó).

**Nguồn gốc tên gọi:** Tên gọi **NGINX** xuất phát từ thuật ngữ *"Engine-X"*, biểu thị một bộ máy động cơ (Engine) với khả năng mở rộng không giới hạn (ký tự $X$).

---

> Nội dung chi tiết về bài toán C10K, I/O Multiplexing (`kqueue`/`epoll`/`IOCP`) [Bài toán C10K & Bước ngoặt I/O Multiplexing](../../../interesting/historical_breakthroughs/c10k_problem.md).

---

## 1.3 Mục tiêu thiết kế cốt lõi của NGINX

Nhờ kết hợp kiến trúc **Event-Driven**, **Asynchronous** và **Non-blocking I/O**, NGINX xử lý hàng chục nghìn kết nối đồng thời với mức tiêu thụ tài nguyên tối thiểu (chi tiết lịch sử bài toán C10K xem tài liệu liên kết ở trên).

Mỗi Worker Process chạy một vòng lặp sự kiện đơn luồng xử lý hàng nghìn kết nối đồng thời. Với các tác vụ I/O đĩa có nguy cơ gây nghẽn, NGINX sử dụng thêm luồng phụ (Thread Pool hoặc `aio threads`) để tránh làm gián đoạn Event Loop chính.

| Tiêu chí | Mô hình Đa luồng / Đa tiến trình | Mô hình Hướng sự kiện (NGINX) |
| :--- | :--- | :--- |
| **Phân bổ tài nguyên** | 1 Luồng hoặc Tiến trình cho mỗi kết nối | 1 Worker Process quản lý hàng nghìn kết nối đồng thời |
| **Tiêu thụ bộ nhớ RAM** | Tăng tuyến tính theo số kết nối ($O(N)$) | Tăng rất chậm / duy trì ở mức thấp khi quy mô kết nối tăng |
| **Chuyển đổi ngữ cảnh** | Chi phí Context Switching rất cao | Cực kỳ thấp do Event Loop đơn luồng |
| **Phục vụ tệp tĩnh** | Hiệu năng trung bình (phụ thuộc I/O luồng) | Tối ưu tuyệt đối (sử dụng syscall zero-copy `sendfile`) |
| **Khả năng chịu tải** | Dễ bị quá tải khi vượt mốc 1.000 – 5.000 kết nối | Có thể xử lý vượt 100.000 kết nối khi được tinh chỉnh đúng thông số hệ thống (`worker_connections`, `ulimit`, `somaxconn`) |

---

[← Back to README](../README.md)