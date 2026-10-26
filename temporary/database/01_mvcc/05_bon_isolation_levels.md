# Bốn isolation level

## Table of Contents

- [Thang bảo đảm](#thang-bảo-đảm)
- [Ma trận hiện tượng](#ma-trận-hiện-tượng)
- [READ COMMITTED](#read-committed)
- [REPEATABLE READ](#repeatable-read)
- [SERIALIZABLE](#serializable)
- [READ UNCOMMITTED](#read-uncommitted)
- [Consistent read và locking read](#consistent-read-và-locking-read)
- [Related](#related)

---

## Thang bảo đảm

Bốn mức phổ biến trong SQL là `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` và `SERIALIZABLE`. Có thể hình dung chúng như một thang bảo đảm tăng dần, nhưng cách triển khai cụ thể còn tuỳ database, nên tên gọi chỉ là điểm khởi đầu chứ không phải đặc tả đầy đủ.

Điều quan trọng là phân biệt hai tầng: mức tối thiểu mà chuẩn SQL quy định, và mức thực tế engine cung cấp. Một engine có quyền bảo đảm mạnh hơn tên gọi, và điều đó xảy ra khá thường xuyên với `REPEATABLE READ` cùng các consistent read.

---

## Ma trận hiện tượng

| Isolation level | Dirty read | Non-repeatable read | Phantom read | Ý nghĩa chính |
| :--- | :--- | :--- | :--- | :--- |
| **READ UNCOMMITTED** | Có thể xảy ra | Có thể thay đổi | Có thể thay đổi | Mức cho phép nhiều hiện tượng tương tranh nhất trong bốn mức chuẩn. |
| **READ COMMITTED** | Không | Có thể thay đổi | Có thể thay đổi | Mỗi câu lệnh đọc dữ liệu đã commit tại góc nhìn của câu lệnh đó; câu sau có thể thấy commit mới. |
| **REPEATABLE READ** | Không | Không thay đổi trong góc nhìn snapshot | Theo mức tối thiểu của SQL, phantom vẫn có thể được phép; engine có thể bảo đảm mạnh hơn | Các lần đọc thông thường giữ góc nhìn ổn định hơn, nhưng vẫn có thể có serialization anomaly. |
| **SERIALIZABLE** | Không | Không | Không | Kết quả đã commit phải tương đương với một thứ tự chạy tuần tự; database có thể phải chờ hoặc huỷ một transaction xung đột. |

Bảng trên mô tả ý nghĩa khái quát và mức bảo đảm tối thiểu theo SQL. Chẳng hạn, cả PostgreSQL và InnoDB đều giữ một snapshot nhất quán cho consistent read ở `REPEATABLE READ`, trong khi cách xử lý locking read và truy vấn theo range thì khác nhau.

> [!WARNING]
> Không nên suy ra hành vi chỉ từ tên isolation level mà không xét database engine.

---

## READ COMMITTED

Một truy vấn chỉ nhìn thấy dữ liệu đã commit trước khi câu lệnh bắt đầu. Nếu một transaction chạy hai câu `SELECT` mà ở giữa có một transaction khác commit, hai câu đó có thể nhìn thấy hai trạng thái khác nhau.

- **PostgreSQL** dùng `READ COMMITTED` làm mặc định. Mỗi câu lệnh thông thường có snapshot riêng.
- **InnoDB** cũng hỗ trợ `READ COMMITTED`; mỗi consistent read tạo một Read View mới thay vì dùng chung một Read View cho cả transaction.

Mức này phù hợp khi mỗi câu lệnh cần nhìn thấy dữ liệu commit mới nhất tại thời điểm câu lệnh bắt đầu, nhưng không cần toàn bộ transaction dùng chung một snapshot. Đổi lại, các phép đọc lặp lại trong cùng transaction không bảo đảm tính ổn định.

---

## REPEATABLE READ

Mục tiêu của mức này là giữ kết quả đọc lặp lại ổn định hơn trong cùng một transaction. Tuy nhiên cần tách rõ hai điều: **snapshot ổn định không tự động đồng nghĩa với serializable**.

- **PostgreSQL** cho các câu lệnh trong transaction dùng chung một snapshot ổn định. Consistent read ở mức này không gặp phantom read, nhưng vẫn có thể gặp serialization anomaly như write skew.
- **InnoDB** dùng `REPEATABLE READ` làm mặc định. Các consistent nonlocking read trong transaction thường dùng chung Read View được tạo ở lần consistent read đầu tiên. Những câu lệnh đọc có khoá như `SELECT ... FOR UPDATE` hoặc `SELECT ... FOR SHARE` tuân theo cơ chế locking read và không nên bị nhầm với consistent read dùng snapshot. InnoDB còn dùng next-key locking cho các câu lệnh có khoá quét qua một khoảng trên index, nhờ đó ngăn phantom trong phạm vi khoảng đó.

Vì vậy, ngay cả khi hai hệ thống đều đặt `REPEATABLE READ`, hành vi của từng loại truy vấn cụ thể vẫn có thể khác nhau.

---

## SERIALIZABLE

Đây là isolation level nghiêm ngặt nhất trong bốn mức phổ biến. Mục tiêu là làm cho kết quả của các transaction đã commit tương đương với một cách sắp xếp chạy tuần tự, như thể từng transaction chạy lần lượt theo một thứ tự nào đó.

Cái giá phải trả có thể là nhiều chờ đợi hơn, phát hiện xung đột, hoặc transaction bị huỷ để tránh kết quả không hợp lệ. Cách xử lý xung đột khác nhau theo engine.

- **PostgreSQL** dùng **Serializable Snapshot Isolation** (SSI) để phát hiện các mẫu phụ thuộc có nguy cơ tạo ra kết quả không tuần tự hoá được. Một transaction có thể bị huỷ với lỗi serialization và cần được chạy lại.
- **InnoDB** tăng mức độ locking ở `SERIALIZABLE`. Khi `autocommit` tắt, plain `SELECT` được xử lý như locking read dạng `FOR SHARE`, vì thế thao tác đọc có thể chặn thao tác ghi trong những trường hợp xung đột. Khi `autocommit` bật, một plain `SELECT` là transaction read-only riêng, nên nó không khoá dòng và không chặn thao tác ghi.

Không có quy tắc rằng `SERIALIZABLE` luôn là lựa chọn tốt nhất cho mọi transaction. Nó cung cấp mức bảo đảm mạnh nhất nhưng có thể tăng chi phí thực thi hoặc buộc ứng dụng phải xử lý retry.

---

## READ UNCOMMITTED

Mức này cho phép dirty read theo định nghĩa chuẩn. Điểm cần biết là hai engine không hành xử giống nhau ở đây.

- **PostgreSQL** vẫn chấp nhận tên `READ UNCOMMITTED` nhưng thực thi như `READ COMMITTED`, do đó không cung cấp dirty read ở mức này.
- **InnoDB** có cách xử lý `READ UNCOMMITTED` riêng và có thể cho phép đọc dữ liệu chưa commit.

Đây là ví dụ rõ nhất cho việc tên gọi không mô tả đầy đủ hành vi: cùng một câu lệnh đặt isolation level, hai engine cho hai kết quả khác nhau.

---

## Consistent read và locking read

Trong một transaction có hai loại đọc với ngữ nghĩa khác nhau, và việc trộn chúng là nguồn gốc của nhiều hiểu nhầm.

| Loại đọc | Dữ liệu nhìn thấy | Có khoá không |
| :--- | :--- | :--- |
| **Consistent nonlocking read** | Phiên bản phù hợp với snapshot của transaction | Không |
| **Locking read** | Phiên bản hiện hành đã commit, kèm khoá theo isolation level | Có |

> [!IMPORTANT]
> **Consistent read** và **locking read** là hai khái niệm khác nhau. Một transaction đang giữ snapshot cũ vẫn đọc được giá trị mới nhất nếu câu lệnh của nó là locking read.

---

## Related

- [Các hiện tượng tương tranh](./04_cac_hien_tuong_tuong_tranh.md) — định nghĩa của bốn hiện tượng được dùng trong ma trận phía trên.
- [Đối chiếu PostgreSQL và InnoDB](./06_doi_chieu_engine_va_vi_du.md) — bảng so sánh trực tiếp hai engine và một ví dụ chạy tay.
- [Trade-off và tổng kết](./07_tradeoff_va_tong_ket.md) — chi phí của việc chọn mức bảo đảm cao hơn.

---

[← Back to README](README.md)
