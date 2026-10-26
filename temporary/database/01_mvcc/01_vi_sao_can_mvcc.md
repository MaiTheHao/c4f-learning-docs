# Vì sao database cần MVCC

## Table of Contents

- [Vấn đề: một dòng dữ liệu, hai góc nhìn](#vấn-đề-một-dòng-dữ-liệu-hai-góc-nhìn)
- [MVCC giải quyết điều gì](#mvcc-giải-quyết-điều-gì)
- [Ba khái niệm cốt lõi](#ba-khái-niệm-cốt-lõi)
- [Lịch sử hình thành](#lịch-sử-hình-thành)
- [Điều MVCC không thay đổi](#điều-mvcc-không-thay-đổi)
- [Cần nhớ](#cần-nhớ)
- [Related](#related)

---

## Vấn đề: một dòng dữ liệu, hai góc nhìn

Giả sử một sản phẩm đang có `stock = 10`. Transaction A đọc số lượng tồn kho. Gần như cùng lúc, transaction B đặt hàng và cập nhật tồn kho thành `9`.

Database phải quyết định A nhìn thấy giá trị nào: `10` tại thời điểm A đọc, hay `9` sau khi B hoàn tất. Câu trả lời phải tuân theo một quy tắc nhất quán, không phụ thuộc vào việc hai câu lệnh tình cờ chạy nhanh hay chậm.

Cách xử lý cổ điển là dùng **lock** để điều phối quyền đọc và ghi. Lock vẫn cần thiết, nhưng nếu thao tác đọc phải chờ thao tác ghi và ngược lại thì các transaction ghìm chân nhau. Với mô hình **single-version** (mỗi dòng chỉ có một vị trí vật lý và mọi cập nhật ghi đè trực tiếp lên đó), reader và writer buộc phải loại trừ nhau. Vì thế một transaction dài có thể chặn mọi lượt đọc cùng dòng, và thời gian chạy của nó trở thành giới hạn trên cho **throughput** của hệ thống.

---

## MVCC giải quyết điều gì

**MVCC (Multi-Version Concurrency Control)** cho phép nhiều phiên bản logic của một dòng dữ liệu tồn tại song song trong một khoảng thời gian. Khi ghi, database tạo phiên bản mới thay vì ghi đè phiên bản cũ. Khi đọc, transaction được phục vụ phiên bản phù hợp với góc nhìn dữ liệu của nó.

Hệ quả là reader không cần khoá dòng mà writer đang sửa, và writer cũng không phải chờ reader đọc xong. Đây là nguồn gốc câu mô tả quen thuộc: reader không chặn writer, writer không chặn reader.

> [!NOTE]
> Câu mô tả trên chỉ đúng cho **consistent read**, tức loại đọc lấy dữ liệu theo snapshot. Các thao tác cần khoá như ghi đè cùng dòng, đọc có khoá hay DDL vẫn chặn nhau như bình thường.

---

## Ba khái niệm cốt lõi

### Version

Mỗi lần một dòng được cập nhật, database phải giữ đủ thông tin để những transaction đang đọc theo góc nhìn cũ vẫn nhận được dữ liệu phù hợp. Vì vậy tại một thời điểm có thể tồn tại đồng thời phiên bản trước và phiên bản hiện hành của cùng một dòng.

Với `stock` ở ví dụ trên, lịch sử phiên bản theo góc nhìn logic diễn ra như sau.

| Thời điểm | Phiên bản tồn tại | Góc nhìn tương ứng |
| :--- | :--- | :--- |
| Trước khi B commit | `stock = 10` đã commit, `stock = 9` chưa commit | Transaction có snapshot cũ thấy `10`; transaction khác không thấy `9` vì phiên bản này chưa commit |
| Sau khi B commit, A chưa kết thúc | `stock = 10` và `stock = 9` đều đã commit | Snapshot cũ của A vẫn thấy `10`; transaction mới thấy `9` |

Bảng này mô tả quan hệ logic giữa các phiên bản, không mô tả vị trí vật lý, vì hai engine có thể đặt chúng ở hai nơi hoàn toàn khác nhau.

### Snapshot

**Snapshot** là góc nhìn dùng để xác định phiên bản nào được phép nhìn thấy trong một lần đọc. Nó không đơn giản là "lấy dữ liệu mới nhất", cũng không nhất thiết là một mốc giờ trên đồng hồ.

- Một transaction đọc theo snapshot cũ có thể vẫn nhìn thấy `stock = 10`.
- Một transaction có snapshot mới hơn nhìn thấy `stock = 9` sau khi thay đổi đã commit.
- Dữ liệu của transaction chưa commit không được coi là đã commit ở các isolation level thông thường.

Quy tắc tạo mới và tái sử dụng snapshot phụ thuộc vào **isolation level** và database engine, nên cùng một câu `SELECT` có thể trả về hai kết quả khác nhau ở hai hệ thống.

### Dọn dẹp

Phiên bản cũ chỉ cần thiết chừng nào còn transaction có thể phải đọc nó, hoặc còn cần cho rollback và phục hồi. Khi không còn nhu cầu, database có thể thu hồi phần dữ liệu ấy để tái sử dụng không gian.

Điều này dẫn tới **Trade-off** căn bản của MVCC: các transaction đọc và ghi ít cản trở nhau hơn, nhưng database phải trả giá bằng công việc quản lý và dọn dẹp phiên bản cũ.

---

## Lịch sử hình thành

Ý tưởng quản lý nhiều phiên bản dữ liệu và kiểm soát tương tranh được nghiên cứu từ những năm 1970 và 1980, song song với các phương pháp dựa trên lock. Bài báo thiết kế POSTGRES năm 1986 nổi tiếng với hướng **no-overwrite** và mục tiêu lưu trữ lịch sử, nhưng điều đó không có nghĩa PostgreSQL hiện đại đã dùng snapshot MVCC ngay từ năm 1986.

PostgreSQL bổ sung mô hình MVCC cho phép đọc dữ liệu nhất quán trong lúc ghi vào cuối thập niên 1990. InnoDB chọn một cách hiện thực hoá khác dựa trên **undo log**, và giữ hướng đó khi được tích hợp vào MySQL đầu thập niên 2000. Hai hệ thống cùng dùng multi-versioning nhưng khác nhau ở cách giữ và truy xuất phiên bản cũ, và chính khác biệt đó là nội dung của bài tiếp theo.

---

## Điều MVCC không thay đổi

> [!IMPORTANT]
> MVCC không có nghĩa là database không còn lock. Các transaction ghi cùng dữ liệu, truy vấn đọc có khoá, DDL và nhiều hoạt động khác vẫn có thể cần lock hoặc phải chờ nhau.

MVCC thay đổi cách database quản lý việc đọc và ghi đồng thời, không xoá bỏ xung đột. Vì thế khi đánh giá một hệ thống có MVCC, cần hỏi thêm hai câu: phiên bản cũ được dọn bởi cơ chế nào, và transaction giữ snapshot lâu có làm chậm việc dọn dẹp hay không.

---

## Cần nhớ

1. **MVCC quản lý nhiều phiên bản logic của dữ liệu**, cho phép transaction đọc phiên bản phù hợp với snapshot của nó thay vì chờ writer.
2. Ba khái niệm cốt lõi là **Version**, **Snapshot** và **Dọn dẹp**; thiếu một trong ba thì không giải thích nổi hành vi mà người dùng quan sát.
3. Snapshot không đồng nghĩa với "dữ liệu mới nhất" và không nhất thiết là một mốc thời gian vật lý.
4. MVCC giảm tranh chấp giữa reader và writer nhưng tạo ra chi phí lưu trữ và dọn dẹp phiên bản cũ.

---

## Related

- [Hai mô hình lưu trữ phiên bản](./02_hai_mo_hinh_luu_truyen_phien_ban.md) — trả lời câu hỏi mà bài này để mở: phiên bản cũ được giữ ở đâu và tái tạo bằng cách nào.
- [Bốn isolation level](./05_bon_isolation_levels.md) — quy tắc tạo và tái sử dụng snapshot thay đổi theo isolation level nào.
- [Danh mục module MVCC](./README.md) — lộ trình đọc toàn bộ module.

---

[← Back to README](README.md)
