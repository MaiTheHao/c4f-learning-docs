# Database Internals

Nhánh tài liệu này đi vào cơ chế bên trong của hệ quản trị cơ sở dữ liệu quan hệ thay vì cách viết câu lệnh SQL. Nó trả lời ba câu hỏi: storage engine tổ chức dữ liệu trên page và index ra sao, kiểm soát tương tranh bằng cách nào, và những bảo đảm của transaction được hiện thực hoá bằng cơ chế gì. Trọng tâm là các quyết định kiến trúc lặp lại ở nhiều engine (**MVCC**, **index**, **write-ahead log**, **buffer pool**) cùng cách chúng biểu hiện thành hành vi quan sát được trong workload thực tế. Mỗi module nằm trong một thư mục có số thứ tự, có thể đọc tuần tự như một giáo trình hoặc tra cứu riêng từng chủ đề.

---

## Danh mục Module

1. **[01. MVCC](01_mvcc/README.md)**: Vì sao database phải quản lý nhiều phiên bản dữ liệu, hai mô hình lưu trữ phiên bản của **PostgreSQL** và **MySQL InnoDB**, bốn **isolation level** cùng những hiện tượng tương tranh mà từng mức cho phép hoặc ngăn chặn.

---

[← Back to README](../README.md)
