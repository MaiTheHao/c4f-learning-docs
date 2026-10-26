# Đối chiếu PostgreSQL và InnoDB qua một ví dụ

## Table of Contents

- [Đặt hai engine cạnh nhau](#đặt-hai-engine-cạnh-nhau)
- [Hai khác biệt mặc định](#hai-khác-biệt-mặc-định)
- [Ví dụ hai lần đọc trong cùng transaction](#ví-dụ-hai-lần-đọc-trong-cùng-transaction)
- [Vì sao cùng tên không bảo đảm cùng hành vi](#vì-sao-cùng-tên-không-bảo-đảm-cùng-hành-vi)
- [Related](#related)

---

## Đặt hai engine cạnh nhau

Sau khi đã nắm cơ chế lưu phiên bản và bốn isolation level, bước tiếp theo là đặt hai engine lên cùng một bộ câu hỏi. Cách này buộc phải trả lời bằng hành vi quan sát được thay vì bằng tên gọi.

| Câu hỏi | PostgreSQL | MySQL InnoDB |
| :--- | :--- | :--- |
| **Isolation level mặc định** | `READ COMMITTED` | `REPEATABLE READ` |
| **Snapshot ở mức mặc định** | Snapshot mới cho mỗi câu lệnh thông thường | Read View của consistent read được tái sử dụng trong transaction `REPEATABLE READ` |
| **`REPEATABLE READ` có phantom read không?** | Consistent read không gặp phantom read ở mức này | Consistent read dùng snapshot; locking read và DML dùng next-key locking trên index range được quét để ngăn phantom trong phạm vi đó |
| **Có thể gặp write skew ở `REPEATABLE READ` không?** | Có | Có, vì `REPEATABLE READ` không tương đương `SERIALIZABLE` |
| **Cách thực thi `SERIALIZABLE`** | SSI theo dõi các phụ thuộc và có thể huỷ transaction xung đột | Dựa nhiều hơn vào locking; plain `SELECT` có thể trở thành locking read khi `autocommit` tắt |
| **Cần lưu ý gì?** | Ở `SERIALIZABLE`, transaction có thể bị huỷ với serialization failure và phải retry | Phân biệt consistent nonlocking read với locking read; cách khoá phụ thuộc truy vấn và isolation level |

---

## Hai khác biệt mặc định

Hai khác biệt về giá trị mặc định thường gây lỗi khi chuyển ứng dụng từ engine này sang engine kia: câu lệnh không đổi nhưng kết quả đổi.

1. **PostgreSQL mặc định `READ COMMITTED`:** hai câu `SELECT` trong cùng transaction có thể thấy hai trạng thái đã commit khác nhau.
2. **InnoDB mặc định `REPEATABLE READ`:** các consistent nonlocking read trong cùng transaction thường tiếp tục dùng chung một Read View, nên có thể vẫn thấy trạng thái cũ dù transaction khác đã commit thay đổi.

Đó là khác biệt về góc nhìn dữ liệu và quy tắc cô lập, không chỉ là khác biệt tên gọi.

---

## Ví dụ hai lần đọc trong cùng transaction

Hai transaction sau chạy trên cùng một dòng với `stock = 10` tại thời điểm ban đầu.

```text
Transaction A                         Transaction B
--------------                         --------------
BEGIN
SELECT stock  -> 10
                                       UPDATE stock = 9
                                       COMMIT
SELECT stock  -> ?
COMMIT
```

Kết quả lần đọc thứ hai phụ thuộc isolation level và engine.

- **PostgreSQL `READ COMMITTED`:** thường trả về `9`, vì câu lệnh thứ hai có snapshot mới.
- **PostgreSQL `REPEATABLE READ`:** vẫn nhìn thấy `10` theo snapshot ổn định của A.
- **InnoDB `REPEATABLE READ`:** một consistent nonlocking `SELECT` thứ hai thường vẫn nhìn thấy `10` theo Read View cũ.
- **`SERIALIZABLE`:** lần đọc thứ hai của A vẫn trả `10` ở cả hai engine; khác biệt nằm ở phía khoá và xử lý xung đột. InnoDB có thể khiến B phải chờ nếu `autocommit` tắt, còn PostgreSQL có thể huỷ transaction khi phát hiện chu trình phụ thuộc giữa các transaction có ghi.

> [!NOTE]
> `10` không phải giá trị hiện hành của bảng ở thời điểm A đọc lần hai; đó là giá trị A nhìn thấy theo snapshot của nó. Nếu A chạy một locking read thay cho `SELECT` thường, câu lệnh sẽ đọc phiên bản hiện hành và có thể nhận `9` kèm khoá.

---

## Vì sao cùng tên không bảo đảm cùng hành vi

Tên isolation level mô tả mức bảo đảm tối thiểu, còn hành vi thực tế là kết quả của ba lớp cộng lại: cơ chế lưu phiên bản của engine, quy tắc tạo snapshot, và cách engine xử lý locking read.

Vì thế khi đọc tài liệu hoặc thiết kế một transaction quan trọng, cần trả lời ba câu hỏi theo đúng engine và phiên bản đang dùng. Snapshot được tạo ở thời điểm nào? Câu lệnh này là consistent read hay locking read? Khi xung đột xảy ra, engine cho transaction chờ hay huỷ nó? Không có câu trả lời chung cho mọi hệ quản trị cơ sở dữ liệu.

---

## Related

- [Bốn isolation level](./05_bon_isolation_levels.md) — mô tả chi tiết từng mức và các cơ chế đằng sau bảng so sánh này.
- [Hai mô hình lưu trữ phiên bản](./02_hai_mo_hinh_luu_truyen_phien_ban.md) — lý do kiến trúc khiến hai engine xử lý cùng một tình huống khác nhau.
- [Trade-off và tổng kết](./07_tradeoff_va_tong_ket.md) — tổng hợp hệ quả vận hành và các điểm cần nhớ.

---

[← Back to README](README.md)
