# Hai mô hình lưu trữ phiên bản: PostgreSQL và InnoDB

## Table of Contents

- [Câu hỏi kiến trúc](#câu-hỏi-kiến-trúc)
- [PostgreSQL: tuple version trong heap](#postgresql-tuple-version-trong-heap)
- [MySQL InnoDB: undo log](#mysql-innodb-undo-log)
- [Đối chiếu](#đối-chiếu)
- [Điều không nên suy ra](#điều-không-nên-suy-ra)
- [Related](#related)

---

## Câu hỏi kiến trúc

PostgreSQL và MySQL InnoDB đều sử dụng MVCC định hướng snapshot, nên khác biệt quan trọng không nằm ở việc bên nào "có MVCC". Câu hỏi thực sự là: khi một câu `UPDATE` chạy, thông tin về phiên bản cũ được đặt ở đâu, và khi một transaction cần phiên bản cũ thì engine lấy nó ra bằng cách nào.

Cả hai engine đều bị ràng buộc bởi cùng một yêu cầu: không được xoá mất dữ liệu mà một snapshot cũ vẫn có thể cần. Cách thoả mãn yêu cầu đó tạo ra hai kiến trúc lưu trữ khác nhau, kéo theo hai cơ chế dọn dẹp khác nhau.

---

## PostgreSQL: tuple version trong heap

Với một thao tác `UPDATE`, PostgreSQL thường tạo một tuple version mới trong **heap** của bảng, còn phiên bản cũ vẫn tồn tại cho đến khi không còn snapshot nào cần nó. Các phiên bản của cùng một dòng đều nằm trong heap và được phân biệt bằng thông tin visibility, không nhất thiết ở cạnh nhau.

- Transaction đang đọc theo snapshot cũ nhìn thấy phiên bản trước.
- Transaction bắt đầu đọc theo snapshot mới hơn nhìn thấy phiên bản đã cập nhật.

Các phiên bản không còn cần thiết được đánh dấu rồi dọn qua pruning và **VACUUM**; **autovacuum** chạy công việc bảo trì này tự động. Hình dung đơn giản: các phiên bản cùng nằm trong khu vực lưu trữ bảng, snapshot quyết định phiên bản nào được đọc, còn VACUUM thu hồi những phiên bản không còn ai cần.

> [!NOTE]
> Hệ quả trực tiếp của mô hình này là bảng và index có thể phình ra khi dọn dẹp chậm, vì phiên bản cũ vẫn chiếm chỗ trong cùng không gian lưu trữ.

---

## MySQL InnoDB: undo log

Trong InnoDB, phiên bản hiện hành của dòng thường nằm trong **clustered index**. Khi dòng bị thay đổi, InnoDB ghi thông tin cần thiết vào **undo log**. Nếu một consistent read cần phiên bản cũ thay vì phiên bản hiện tại, engine lần theo chuỗi thông tin undo để dựng lại nội dung phù hợp với snapshot đó.

Undo log không nên được hiểu là nơi luôn lưu một bản sao đầy đủ của cả dòng. Nó lưu thông tin cần cho rollback và cho việc tái tạo phiên bản trước. Cũng không nên hiểu rằng mọi cập nhật đều ghi đè tại chỗ: vị trí vật lý của bản ghi sau cập nhật phụ thuộc vào loại thay đổi và cấu trúc index.

Khi thông tin undo không còn snapshot nào cần, cơ chế **purge** dọn nó cùng những bản ghi đã được đánh dấu xoá và không còn transaction nào nhìn thấy. Hình dung đơn giản: InnoDB giữ phiên bản hiện hành trong index và giữ chuỗi undo để dựng lại phiên bản cũ khi snapshot yêu cầu.

---

## Đối chiếu

| Tiêu chí | PostgreSQL | MySQL InnoDB |
| :--- | :--- | :--- |
| **Nơi giữ phiên bản cũ** | Các tuple version cũ nằm trong heap của bảng | Thông tin undo dùng để tái tạo phiên bản trước |
| **Khi đọc theo snapshot cũ** | Chọn tuple version phù hợp với snapshot | Lần theo chuỗi undo để dựng phiên bản phù hợp |
| **Cơ chế dọn dẹp chính** | Pruning và **VACUUM** | **Purge** và dọn undo history |
| **Áp lực khi dọn dẹp chậm** | Dead tuple tồn tại lâu, bảng hoặc index có thể phình | Undo history và history list tăng, purge có thể bị chậm |
| **Điểm cần đánh đổi** | Quản lý phiên bản cũ ngay trong không gian bảng | Duy trì undo history đủ lâu để khôi phục phiên bản cần thiết |

---

## Điều không nên suy ra

> [!WARNING]
> Không nên rút ra kết luận rằng PostgreSQL luôn ghi chậm hơn hoặc InnoDB luôn cập nhật nhanh hơn.

Hiệu năng thực tế phụ thuộc vào workload, index, kích thước transaction, mẫu truy cập và cấu hình. Bảng đối chiếu ở trên mô tả khác biệt kiến trúc ở nơi lưu và cách tái tạo phiên bản, không phải kết quả benchmark.

---

## Related

- [Vì sao database cần MVCC](./01_vi_sao_can_mvcc.md) — định nghĩa Version, Snapshot và bài toán mà hai mô hình này cùng giải quyết.
- [Bốn isolation level](./05_bon_isolation_levels.md) — snapshot được tạo khi nào, và vì sao cùng một isolation level lại cho hành vi khác nhau ở hai engine.
- [Trade-off và tổng kết](./07_tradeoff_va_tong_ket.md) — hệ quả vận hành của việc dọn dẹp chậm ở từng mô hình.

---

[← Back to README](README.md)
