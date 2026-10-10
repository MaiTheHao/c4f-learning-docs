# Nền tảng

Nhóm tài liệu này thiết lập mô hình nền tảng của proxy trong Spring: proxy là object trung gian, các actor, đường đi thực tế của một lời gọi và hiện tượng self-invocation.

## Lộ trình và bản đồ kiến thức

Bản đồ tổng thể của bộ tài liệu, danh sách câu hỏi cần trả lời được, ma trận định vị từng tài liệu theo mức độ và quy ước đọc sơ đồ. [Xem Lộ trình và bản đồ kiến thức](./knowledge_map.md).

## Mô hình nền tảng

Giải thích proxy là gì, các actor tham gia, phạm vi của proxy trong Spring và lý do proxy là một wrapper chứ không phải logic nghiệp vụ. [Xem Mô hình nền tảng](./proxy_model.md).

## Luồng gọi và self-invocation

Theo dõi một method call từ client qua proxy tới target, chỉ rõ vì sao lời gọi nội bộ bằng `this` không quay lại proxy và các hướng xử lý theo thứ tự ưu tiên. [Xem Luồng gọi và self-invocation](./call_flow_and_self_invocation.md).

---

[← Back to README](../README.md)
