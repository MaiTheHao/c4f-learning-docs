# Các hiện tượng tương tranh

## Table of Contents

- [Vì sao phải học hiện tượng trước](#vì-sao-phải-học-hiện-tượng-trước)
- [Dirty read: đọc dữ liệu chưa commit](#dirty-read-đọc-dữ-liệu-chưa-commit)
- [Non-repeatable read: đọc lại một dòng](#non-repeatable-read-đọc-lại-một-dòng)
- [Phantom read: đọc lại một điều kiện](#phantom-read-đọc-lại-một-điều-kiện)
- [Serialization anomaly và write skew](#serialization-anomaly-và-write-skew)
- [Bảng phân biệt nhanh](#bảng-phân-biệt-nhanh)
- [Related](#related)

---

## Vì sao phải học hiện tượng trước

Isolation level thường được giải thích thông qua các hiện tượng có thể xảy ra khi nhiều transaction cùng thao tác dữ liệu. Cách tiếp cận này có lý do thực dụng: tên gọi của các mức chỉ có nghĩa khi biết chúng cho phép hoặc ngăn chặn hiện tượng nào. Học thuộc bốn tên gọi mà không nắm hiện tượng sẽ khiến việc chọn isolation level dựa trên cảm giác an toàn thay vì rủi ro cụ thể của workload.

Bốn hiện tượng dưới đây được sắp theo mức độ tinh vi tăng dần: từ việc đọc dữ liệu chưa từng được commit, tới những kết quả sai lệch chỉ lộ ra khi xét cả nhóm transaction.

---

## Dirty read: đọc dữ liệu chưa commit

Transaction A thay đổi một giá trị nhưng chưa commit. Transaction B đọc giá trị đó. Sau đó A rollback, và thay đổi của A bị huỷ. B đã đọc một giá trị chưa từng trở thành trạng thái đã commit.

Điểm nguy hiểm không nằm ở việc giá trị đó sai về mặt số học, mà ở chỗ nó có thể chưa bao giờ tồn tại trong lịch sử dữ liệu. Nếu B dùng giá trị ấy để ra quyết định rồi commit, sai lệch đã lan sang một transaction khác và không thể sửa bằng rollback của A.

---

## Non-repeatable read: đọc lại một dòng

Transaction A đọc một dòng và nhận giá trị `10`. Transaction B cập nhật dòng đó thành `9` rồi commit. Nếu A đọc lại đúng dòng ấy và nhận `9`, A đã gặp non-repeatable read.

Hiện tượng này chỉ liên quan tới **giá trị của một dòng đã đọc**. Nó chưa nói gì về việc tập kết quả của một truy vấn có thay đổi hay không, và đó là điểm khác biệt so với phantom read.

---

## Phantom read: đọc lại một điều kiện

A chạy một truy vấn lấy các đơn hàng có tổng tiền lớn hơn `100` và nhận về một tập dòng. B chèn một đơn hàng mới thoả điều kiện rồi commit. Khi A chạy lại đúng truy vấn đó, tập kết quả có thêm một dòng mới, và đó là phantom read.

Trọng tâm của phantom read là **tập dòng thoả một điều kiện truy vấn**, không phải giá trị của một dòng cụ thể. Vì vậy, cơ chế chống phantom thường phải bảo vệ cả khoảng dữ liệu (range) chứ không chỉ những dòng đã đọc. Các engine làm việc này bằng **next-key locking** hoặc bằng cách kiểm tra phụ thuộc ở mức snapshot.

---

## Serialization anomaly và write skew

Ngay cả khi mọi transaction chỉ đọc dữ liệu đã commit và giữ nguyên một snapshot từ đầu đến cuối, kết quả tổng hợp của chúng vẫn có thể không tương đương với bất kỳ thứ tự chạy tuần tự nào. Đây là **serialization anomaly**.

Ví dụ kinh điển là **write skew**: hai transaction dựa trên cùng một trạng thái để cập nhật hai dòng khác nhau, khiến một quy tắc tổng thể bị vi phạm dù không có hai transaction nào ghi đúng cùng một dòng. Chẳng hạn quy định luôn phải có ít nhất một bác sĩ trực. Hai bác sĩ cùng đọc trạng thái "đang có hai người trực", mỗi người cho rằng người kia vẫn ở lại nên quyết định xin nghỉ và cập nhật dòng của mình. Cả hai transaction đều hợp lệ khi xét riêng, nhưng kết quả cuối cùng vi phạm quy định.

> [!IMPORTANT]
> Snapshot ổn định không tự động loại bỏ serialization anomaly. Đây là lý do `REPEATABLE READ` và `SERIALIZABLE` không nên được xem là hai tên gọi cho cùng một mức bảo đảm.

---

## Bảng phân biệt nhanh

| Hiện tượng | Đối tượng bị thay đổi | Câu hỏi kiểm tra |
| :--- | :--- | :--- |
| **Dirty read** | Giá trị chưa commit | Giá trị mình vừa đọc đã từng là trạng thái đã commit chưa? |
| **Non-repeatable read** | Giá trị của một dòng đã đọc | Đọc lại đúng dòng đó có ra giá trị khác không? |
| **Phantom read** | Tập dòng thoả một điều kiện | Chạy lại đúng truy vấn đó có thêm dòng không? |
| **Serialization anomaly** | Quan hệ giữa nhiều transaction | Kết quả cuối có tương đương một thứ tự tuần tự nào không? |

---

## Related

- [Bốn isolation level](./05_bon_isolation_levels.md) — mức nào ngăn hiện tượng nào theo chuẩn SQL và theo từng engine.
- [Isolation nằm ở đâu trong ACID](./03_isolation_trong_acid.md) — vì sao đọc nhất quán chưa đủ để bảo đảm tính đúng của cả nhóm transaction.
- [Đối chiếu PostgreSQL và InnoDB](./06_doi_chieu_engine_va_vi_du.md) — ví dụ cụ thể cho thấy hai engine xử lý cùng một tình huống khác nhau.

---

[← Back to README](README.md)
