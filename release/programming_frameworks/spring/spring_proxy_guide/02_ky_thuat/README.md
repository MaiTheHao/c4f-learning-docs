# Kỹ thuật

Nhóm tài liệu này đi sâu vào cơ chế: hai cách tạo proxy mà Spring dùng và các giới hạn kiến trúc khiến advice không thể chạy trong một số trường hợp.

## JDK dynamic proxy và CGLIB

Phân biệt proxy dựa trên interface và proxy dựa trên subclass, bảng so sánh theo `final`, `private`, kiểu reference, cùng quy tắc chọn và gợi ý chẩn đoán. [Xem JDK dynamic proxy và CGLIB](./jdk_proxy_va_cglib.md).

## Giới hạn proxy và khi nào cần cơ chế khác

Liệt kê các giới hạn mang tính kiến trúc (self-invocation, method không override được, client không gọi qua proxy, phạm vi join point) và bảng chọn Spring AOP hay AspectJ weaving. [Xem Giới hạn proxy và khi nào cần cơ chế khác](./gioi_han_va_ngoai_le.md).

---

[← Back to README](../README.md)
