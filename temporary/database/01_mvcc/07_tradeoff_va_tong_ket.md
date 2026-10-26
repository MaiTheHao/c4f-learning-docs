# Trade-off và tổng kết MVCC

## Table of Contents

- [Lợi ích và chi phí](#lợi-ích-và-chi-phí)
- [Isolation level cũng là trade-off](#isolation-level-cũng-là-trade-off)
- [Tóm tắt cần nhớ](#tóm-tắt-cần-nhớ)
- [Câu hỏi tự kiểm tra](#câu-hỏi-tự-kiểm-tra)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)
- [Related](#related)

---

## Lợi ích và chi phí

MVCC không xoá bỏ toàn bộ xung đột; nó thay đổi cách database quản lý việc đọc và ghi đồng thời.

**Lợi ích chính:** transaction đọc dùng phiên bản khớp với snapshot của nó thay vì chờ transaction ghi kết thúc, nên reader và writer ít chặn nhau hơn và workload đọc nhiều vẫn được phục vụ trong khi có ghi liên tục.

**Chi phí chính:** database phải lưu giữ phiên bản cũ hoặc thông tin undo, xác định khi nào chúng không còn cần thiết, rồi dọn chúng. Transaction tồn tại lâu có thể giữ snapshot cũ và làm chậm việc thu hồi phiên bản, biến một thao tác tưởng như vô hại thành nguyên nhân khiến bảng và index phình ra.

- Trong **PostgreSQL**, dọn dẹp chậm khiến dead tuple tồn tại lâu hơn, **VACUUM** phải xử lý nhiều hơn và dung lượng bảng cùng index tăng.
- Trong **InnoDB**, dọn dẹp chậm khiến undo history và history list tăng, nên dựng lại một phiên bản cũ phải đi qua chuỗi undo dài hơn.

---

## Isolation level cũng là trade-off

Mức bảo đảm cao hơn ngăn được nhiều hiện tượng tương tranh hơn nhưng có thể làm tăng chi phí locking, thời gian chờ, hoặc buộc transaction bị huỷ rồi chạy lại. Vì vậy "mạnh hơn" không đồng nghĩa "nhanh hơn", và "snapshot ổn định" không đồng nghĩa "serializable".

Ba điểm chọn mức theo nhu cầu thực tế:

- Chọn `READ COMMITTED` khi mỗi câu lệnh cần dữ liệu commit mới nhất và transaction không cần một góc nhìn cố định.
- Chọn `REPEATABLE READ` khi transaction cần đọc lặp lại ổn định, ví dụ báo cáo nhiều bước, và chấp nhận rằng serialization anomaly vẫn có thể xảy ra.
- `SERIALIZABLE` phù hợp khi tính đúng của cả nhóm transaction quan trọng hơn chi phí, miễn là ứng dụng xử lý được retry sau khi bị huỷ.

---

## Tóm tắt cần nhớ

1. **MVCC quản lý nhiều phiên bản logic của dữ liệu**, cho phép transaction đọc phiên bản phù hợp với snapshot của nó.
2. **PostgreSQL giữ tuple version trong heap; InnoDB dùng undo log để tái tạo phiên bản cũ.** Đây là khác biệt kiến trúc quan trọng nhất giữa hai mô hình.
3. Phiên bản cũ cần được dọn khi không còn transaction nào cần tới: PostgreSQL dựa vào pruning và VACUUM, InnoDB dựa vào purge và quản lý undo history.
4. `READ COMMITTED` lấy snapshot mới cho từng câu lệnh; `REPEATABLE READ` giữ nguyên snapshot cho các lần đọc thông thường trong transaction; `SERIALIZABLE` hướng tới kết quả tương đương chạy tuần tự.
5. **PostgreSQL mặc định `READ COMMITTED`; InnoDB mặc định `REPEATABLE READ`.** Cùng một tên isolation level không bảo đảm hai engine có mọi hành vi giống nhau.
6. MVCC chỉ lo phần Isolation trong ACID; nó không thay thế các bảo đảm còn lại, constraint dữ liệu hay logic nghiệp vụ.

---

## Câu hỏi tự kiểm tra

1. Vì sao một transaction vẫn có thể đọc `stock = 10` trong khi giá trị hiện hành đã là `9`?
2. PostgreSQL và InnoDB khác nhau cơ bản ở đâu trong cách giữ hoặc dựng lại phiên bản cũ?
3. Dirty read, non-repeatable read và phantom read khác nhau thế nào?
4. Vì sao PostgreSQL `REPEATABLE READ` vẫn chưa tương đương `SERIALIZABLE`?
5. Vì sao MVCC giảm tranh chấp reader và writer nhưng vẫn cần cleanup và lock?
6. Isolation trong ACID khác gì với việc một câu `SELECT` đọc dữ liệu nhất quán theo snapshot?

---

## Tài liệu tham khảo

- PostgreSQL 18, [Introduction to MVCC](https://www.postgresql.org/docs/18/mvcc-intro.html)
- PostgreSQL 18, [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html)
- PostgreSQL 18, [SET TRANSACTION](https://www.postgresql.org/docs/18/sql-set-transaction.html)
- MySQL 8.4, [InnoDB Multi-Versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html)
- MySQL 8.4, [InnoDB Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)
- MySQL 8.4, [Consistent Nonlocking Reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html)
- Stonebraker et al., [The POSTGRES Data Model](https://doi.org/10.1145/16894.16888)

> [!NOTE]
> Các mô tả về hành vi cụ thể dựa trên tài liệu PostgreSQL 18 và MySQL 8.4. Khi đọc database hoặc phiên bản khác, cần đối chiếu tài liệu đúng phiên bản đó.

---

## Related

- [Vì sao database cần MVCC](./01_vi_sao_can_mvcc.md) — quay lại bài toán gốc và ba khái niệm nền tảng.
- [Hai mô hình lưu trữ phiên bản](./02_hai_mo_hinh_luu_truyen_phien_ban.md) — chi tiết cơ chế đứng sau phần chi phí dọn dẹp.
- [Bốn isolation level](./05_bon_isolation_levels.md) — bảng bảo đảm đầy đủ để đối chiếu với phần chọn mức ở trên.
- [Danh mục module MVCC](./README.md) — lộ trình đọc toàn bộ module.

---

[← Back to README](README.md)
