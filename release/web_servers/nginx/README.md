# NGINX

**NGINX** là web server mã nguồn mở hiệu năng cao, được Igor Sysoev thiết kế từ năm 2002 để giải quyết bài toán **C10K** — xử lý đồng thời hàng chục nghìn kết nối với mức tiêu thụ tài nguyên tối thiểu. Kiến trúc **Event-Driven**, **Non-blocking I/O** và mô hình **Master-Worker** là ba trụ cột khiến NGINX trở thành xương sống của hạ tầng Internet hiện đại, từ Web Server và Reverse Proxy đến Load Balancer và API Gateway.

## Table of Contents

- [Chương 1. Tổng quan & Lịch sử ra đời](#chương-1-tổng-quan--lịch-sử-ra-đời)
- [Chương 2. Kiến trúc & Khái niệm Cốt lõi](#chương-2-kiến-trúc--khái-niệm-cốt-lõi)

---

## Chương 1. Tổng quan & Lịch sử ra đời

Chương này xây dựng nền tảng nhận thức về NGINX: từ lịch sử ra đời, vai trò đa năng trong hệ thống, đến bài toán C10K đã thúc đẩy sự ra đời của kiến trúc hướng sự kiện. Trọng tâm là cơ chế **I/O Multiplexing** (`epoll`, `kqueue`, `IOCP`) — bước ngoặt kỹ thuật định hình lại toàn bộ hệ sinh thái phần mềm hiện đại, và lý do tại sao mô hình Thread/Process-per-connection của các web server thế hệ cũ tất yếu sụp đổ dưới quy mô kết nối lớn.

[Xem chi tiết Chương 1](./01_introduction.md)

---

## Chương 2. Kiến trúc & Khái niệm Cốt lõi

Chương này đi vào bên trong kiến trúc NGINX để giải phẫu từng thành phần: Master Process, Worker Process, Cache Loader và Cache Manager. Nội dung bao gồm vòng lặp sự kiện **Event Loop**, cơ chế **Non-blocking I/O**, giới hạn **File Descriptors**, chiến lược chống **Thundering Herd** qua `accept_mutex` và `SO_REUSEPORT`, Thread Pools cho Disk I/O offload, và quan trọng nhất — cơ chế **Zero-Downtime** với Graceful Reload và Hot Binary Upgrade.

[Xem chi tiết Chương 2](./02_architecture.md)

---

[← Quay lại Web Servers](../README.md)
