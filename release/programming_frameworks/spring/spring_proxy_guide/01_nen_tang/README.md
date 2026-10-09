# Nền tảng

Nhóm tài liệu này thiết lập mô hình nền tảng của Spring AOP dựa trên proxy: bài toán cross-cutting concern, các actor, đường đi thực tế của một lời gọi, hiện tượng self-invocation và bộ thuật ngữ cốt lõi.

## Lộ trình và bản đồ kiến thức

Bản đồ tổng thể của bộ tài liệu, danh sách câu hỏi cần trả lời được, ma trận định vị từng tài liệu theo mức độ và quy ước đọc sơ đồ. [Xem Lộ trình và bản đồ kiến thức](./ban_do_kien_thuc.md).

## Mô hình nền tảng

Giải thích proxy ra đời để giải quyết vấn đề gì, các actor tham gia, phạm vi của Spring AOP và lý do proxy là một wrapper chứ không phải logic nghiệp vụ. [Xem Mô hình nền tảng](./mo_hinh_nen_tang.md).

## Luồng gọi và self-invocation

Theo dõi một method call từ client qua proxy tới target, chỉ rõ vì sao lời gọi nội bộ bằng `this` không quay lại proxy và các hướng xử lý theo thứ tự ưu tiên. [Xem Luồng gọi và self-invocation](./luong_goi_va_self_invocation.md).

## Thuật ngữ AOP

Định nghĩa thực dụng cho target, proxy, join point, pointcut, advice, advisor, aspect, interceptor chain và introduction, kèm các loại advice và cách đọc pointcut expression. [Xem Thuật ngữ AOP](./thuat_ngu_aop.md).

---

[← Back to README](../README.md)
