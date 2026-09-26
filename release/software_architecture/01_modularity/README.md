# Modularity - Tính Mô-đun Trong Kiến Trúc Phần Mềm

## Table of Contents

- [Abstract](#abstract)
- [Danh mục Tài liệu](#danh-mục-tài-liệu)

---

## Abstract

**Modularity** là nguyên lý nền tảng giúp kiểm soát tính hỗn loạn (entropy) trong các hệ thống phần mềm phức tạp thông qua việc thiết lập ranh giới đóng gói logic rõ ràng giữa các thành phần mã nguồn. Mặc dù lợi ích của việc chia nhỏ hệ thống thường được ca ngợi, chìa khóa thực chất nằm ở việc làm chủ điểm cân bằng về **Granularity** nhằm ngăn chặn các phản mẫu cấu trúc nguy hiểm. Để biến trực giác thiết kế thành các quyết định kỹ thuật định lượng và nhất quán, [Fundamentals of Software Architecture: Second Edition](../../../library/books/fundamentals_of_software_architecture_2nd.epub) cung cấp ba trụ cột đo lường cốt lõi: tối đa hóa sự tập trung trách nhiệm nội bộ (**Cohesion**), giảm thiểu mức độ phụ thuộc lan truyền giữa các mô-đun (**Coupling**), và nhận diện bản chất ràng buộc mã nguồn để tối ưu hóa vị trí cùng mức độ gắn kết (**Connascence**).

---

## Danh mục Tài liệu

1. **[01. Bản chất Modularity & Khung Đo lường](01_introduction.md)**: Định nghĩa nền tảng về Modularity, sự khác biệt giữa Modularity và Granularity, cùng ba trụ cột đo lường do Mark Richards & Neal Ford hệ thống hóa.
2. **[02. Về Các Đại Lượng Đo Lường Modularity](02_modularity_metrics.md)**: Diễn giải chi tiết về thang đo Cohesion, công thức LCOM, hệ chỉ số Robert C. Martin ($C_a, C_e, A, I, D$) và các thuộc tính quản trị Connascence.

---

[← Quay lại Software Architecture](../README.md)
