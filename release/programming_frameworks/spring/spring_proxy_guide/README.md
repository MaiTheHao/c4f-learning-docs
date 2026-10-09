# Spring Proxy Guide

Bộ tài liệu này xây dựng một mô hình tư duy nhất quán về Spring AOP dựa trên proxy, đi từ vấn đề cần giải quyết và các thành phần, qua đường đi của một method call và lựa chọn loại proxy, đến cấu hình, API, giới hạn và chẩn đoán. Nội dung được chia theo độ sâu từ nền tảng đến tham chiếu triển khai, kèm ví dụ Java và sơ đồ Mermaid tái sử dụng.

## Nền tảng

Nhóm này giải thích vì sao cần proxy, các actor tham gia, đường đi thực tế của một lời gọi và self-invocation, cùng bộ thuật ngữ cốt lõi. Đây là điểm bắt đầu phù hợp nếu chưa quen mô hình proxy-based AOP. [Xem Nền tảng](./01_nen_tang/README.md).

## Kỹ thuật

Nhóm này so sánh hai cơ chế tạo proxy (JDK dynamic proxy và CGLIB) và hệ thống hóa các giới hạn về cấu trúc của proxy cùng ranh giới khi nào cần cơ chế khác. [Xem Kỹ thuật](./02_ky_thuat/README.md).

## Triển khai

Nhóm này đi vào cách khai báo aspect bằng annotation, cơ chế auto-proxy và ba API tạo proxy thủ công. Đây là tài liệu tham chiếu cho cấu hình và viết code. [Xem Triển khai](./03_trien_khai/README.md).

## Thực hành

Nhóm này biến mô hình thành quy trình: chẩn đoán khi advice không chạy và các bài lab kiểm chứng call path, self-invocation, thứ tự interceptor. [Xem Thực hành](./04_thuc_hanh/README.md).

## Tra cứu

Từ điển thuật ngữ rút gọn kèm liên kết chính thức, dùng khi cần tra nhanh hoặc kiểm chứng nguồn. [Xem Tra cứu](./05_tra_cuu/README.md).

## Ví dụ

Ba ví dụ Java minh họa tạo proxy bằng ProxyFactory, áp dụng aspect @AspectJ bằng AspectJProxyFactory và call path bị bỏ qua proxy khi self-invocation. [Xem Ví dụ](./examples/README.md).

---

[← Back to README](../README.md)
