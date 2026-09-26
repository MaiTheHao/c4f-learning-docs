# Web Servers

Kho tài liệu tập hợp kiến thức về các **Web Server** hiệu năng cao và các thành phần hạ tầng vận hành chúng, từ kiến trúc tiến trình, cơ chế I/O đến các chiến lược triển khai Zero-Downtime trong môi trường sản xuất.

## Table of Contents

- [NGINX](#nginx)

---

## NGINX

**NGINX** là web server mã nguồn mở với kiến trúc **Event-Driven Non-blocking** và mô hình **Master-Worker**, được thiết kế để giải quyết bài toán C10K (hàng chục nghìn kết nối đồng thời) với lượng tài nguyên tối thiểu. Tài liệu này đi từ lịch sử ra đời và nền tảng kỹ thuật (`epoll`, `kqueue`, I/O Multiplexing) đến giải phẫu kiến trúc bên trong: Worker Process, Event Loop, Thread Pools, Thundering Herd prevention và cơ chế Zero-Downtime Reload.

[Xem chi tiết NGINX](./nginx/README.md)

---

[← Quay lại trang chủ](../README.md)
