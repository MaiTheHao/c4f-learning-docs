# Isolation nằm ở đâu trong ACID

## Table of Contents

- [Bốn thuộc tính của ACID](#bốn-thuộc-tính-của-acid)
- [MVCC là cơ chế cho Isolation](#mvcc-là-cơ-chế-cho-isolation)
- [Hai nghĩa của nhất quán](#hai-nghĩa-của-nhất-quán)
- [Related](#related)

---

## Bốn thuộc tính của ACID

ACID là bốn thuộc tính thường dùng để mô tả các bảo đảm của transaction. Mỗi thuộc tính được hiện thực hoá bởi những cơ chế khác nhau trong storage engine, nên cần tách bạch chúng trước khi gán vai trò cho MVCC.

| Thuộc tính | Ý nghĩa |
| :--- | :--- |
| **Atomicity** | Transaction hoặc hoàn tất toàn bộ thay đổi, hoặc không để lại thay đổi nào; nếu rollback, các thay đổi đã thực hiện được hoàn tác theo quy tắc của database. |
| **Consistency** | Transaction đưa dữ liệu từ trạng thái hợp lệ sang trạng thái hợp lệ khác, theo các constraint và quy tắc nghiệp vụ mà hệ thống xác định. |
| **Isolation** | Isolation quy định một transaction chạy đồng thời được nhìn thấy những thay đổi nào của transaction khác; isolation level ấn định mức bảo đảm cụ thể. |
| **Durability** | Khi transaction đã commit, kết quả được ghi xuống bộ nhớ bền và còn nguyên sau sự cố, trong giới hạn cấu hình durability của hệ thống. |

---

## MVCC là cơ chế cho Isolation

> [!IMPORTANT]
> MVCC là một cơ chế giúp thực hiện **Isolation**, không phải toàn bộ ACID.

MVCC giúp transaction đọc đúng phiên bản dữ liệu theo góc nhìn của nó, nhưng tự nó không bảo đảm một tập transaction chạy đồng thời cho kết quả tương đương với một thứ tự tuần tự nào đó. Chính **isolation level** mới xác định mức bảo đảm khi có tương tranh, và như sẽ thấy ở các bài sau, hai engine có thể chọn cách hiện thực hoá khác nhau cho cùng một tên mức.

Các thuộc tính còn lại có cơ chế riêng. Atomicity và Durability dựa vào cơ chế ghi log và phục hồi, còn Consistency phụ thuộc vào constraint cùng logic nghiệp vụ. Nhầm lẫn giữa các nhóm cơ chế này thường dẫn tới kỳ vọng sai, ví dụ cho rằng bật MVCC là đủ để dữ liệu luôn nhất quán về mặt nghiệp vụ.

---

## Hai nghĩa của nhất quán

Từ "nhất quán" xuất hiện ở hai ngữ cảnh không thay thế nhau.

- **Consistent read** nói về góc nhìn đọc: một truy vấn đọc theo snapshot có quy tắc rõ ràng về việc nó được nhìn thấy phiên bản nào.
- **Consistency trong ACID** nói về trạng thái dữ liệu: transaction phải duy trì các điều kiện hợp lệ, phụ thuộc vào constraint và quy tắc được định nghĩa.

Một hệ thống có thể cho **consistent read** đúng như mô tả mà vẫn vi phạm quy tắc nghiệp vụ, nếu logic ứng dụng không kiểm tra đúng. Ngược lại, một transaction tuân thủ mọi constraint vẫn có thể chỉ thấy dữ liệu cũ nếu isolation level cho phép.

> [!NOTE]
> Đọc dữ liệu nhất quán theo snapshot và bảo đảm kết quả tương đương thực thi tuần tự là hai mức bảo đảm khác nhau. Bài [Bốn isolation level](./05_bon_isolation_levels.md) làm rõ khoảng cách đó.

---

## Related

- [Vì sao database cần MVCC](./01_vi_sao_can_mvcc.md) — cơ chế tạo ra góc nhìn đọc mà bài này đặt vào ACID.
- [Bốn isolation level](./05_bon_isolation_levels.md) — những mức bảo đảm cụ thể mà Isolation trong ACID được hiện thực hoá qua đó.
- [Các hiện tượng tương tranh](./04_cac_hien_tuong_tuong_tranh.md) — những gì có thể xảy ra khi Isolation bị nới lỏng.

---

[← Back to README](README.md)
