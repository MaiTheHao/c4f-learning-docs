# Onion Encryption trong CryptDB: Bóc lớp theo từng truy vấn

## Table of Contents

- [Onion là gì](#onion-là-gì)
- [Onion Encryption vận hành ra sao](#onion-encryption-vận-hành-ra-sao)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Bài trước đã điểm qua từng cipher level; bài này đi vào cách **CryptDB** tổ chức chúng thành các lớp lồng nhau và bóc dần theo truy vấn. Đây là phần quyết định những gì database quan sát được tại mỗi thời điểm.

---

## Onion là gì

**CryptDB** tổ chức chúng thành các **onion** (lớp bọc lồng nhau), mỗi onion phục vụ một nhóm phép toán:

| Onion | Phục vụ | Thứ tự lớp từ ngoài vào trong |
| :--- | :--- | :--- |
| **Eq** | So sánh bằng, nhóm, join bằng | `RND` → `DET` → `JOIN` |
| **Ord** | So sánh thứ tự, lọc phạm vi | `RND` → `OPE` → `OPE-JOIN` |
| **Add** | Phép cộng | `HOM` |
| **Search** | Tìm từ khóa | `SEARCH` |

Lớp ngoài cùng của onion Eq và Ord là **RND** để che giấu tối đa khi chưa cần truy vấn. Khi truy vấn yêu cầu chức năng sâu hơn, proxy bóc lớp ngoài để lộ lớp trong phù hợp.

> [!NOTE]
> Một cột có thể có nhiều biểu diễn mã hóa song song, mỗi onion một biểu diễn. Truy vấn cần onion nào thì proxy điều chỉnh onion đó; các onion còn lại không bị ảnh hưởng.

---

## Onion Encryption vận hành ra sao

**Onion Encryption** không có nghĩa mọi dữ liệu đi qua chuỗi `RND` rồi `DET` rồi `OPE` rồi `HOM`. Mỗi nhóm chức năng có onion riêng, mỗi onion có các lớp riêng.

### Trạng thái ban đầu

Với cột `age` và onion thứ tự, dữ liệu được lưu ở dạng lồng nhau:

```text
Lưu trữ: RND(OPE(age))
Trong đó OPE(age) nằm bên trong, RND(...) bọc bên ngoài
```

Database chỉ thấy lớp **RND** ngoài cùng nên chưa dùng được thứ tự của **OPE**.

### Khi truy vấn cần chức năng mới

Ứng dụng gửi `age > 30`. Proxy xác định cần khả năng thứ tự và điều chỉnh onion:

| Bước | Hành động | Kết quả |
| :--- | :--- | :--- |
| **1. Nhận truy vấn** | Proxy phân tích `age > 30` | Biết cần so sánh thứ tự |
| **2. Chọn onion và lớp đích** | Chọn onion Ord, đích là **OPE** | Không đụng onion Add hay Search |
| **3. Điều chỉnh mã hóa** | Proxy cung cấp thông tin để DBMS bóc lớp **RND** | Dữ liệu còn ở dạng bản mã **OPE**, không phải **Plaintext** |
| **4. Thực thi** | Database so sánh bản mã **OPE** | Lọc được các dòng thỏa mãn |
| **5. Trả kết quả** | Database trả bản mã, proxy giải mã theo quyền | Ứng dụng nhận dữ liệu rõ |

> [!IMPORTANT]
> Bóc lớp **RND** không đồng nghĩa giải mã toàn bộ. Sau bước 3, giá trị vẫn là bản mã **OPE**. Thứ tự bị lộ từ đây, nhưng nội dung gốc vẫn được bảo vệ bởi lớp **OPE**.

### Truy vấn tiếp theo

Sau khi onion đã ở **OPE**, các truy vấn phạm vi tiếp theo dùng trực tiếp lớp này mà không cần bóc lại. Điều này giảm thao tác điều chỉnh lặp lại nhưng đồng nghĩa thông tin thứ tự tiếp tục lộ ra. CryptDB ghi nhớ trạng thái lớp để phối hợp các truy vấn sau, và cần quản lý nhất quán khi nhiều truy vấn cùng truy cập.

---

## Tổng kết

- **Onion Encryption** điều chỉnh lớp mã hóa theo truy vấn: proxy xác định chức năng cần thiết, bóc lớp ngoài khi cần, database chạy phép toán trên lớp phù hợp.
- Onion Eq có thứ tự `RND → DET → JOIN`, onion Ord có thứ tự `RND → OPE → OPE-JOIN`, onion Add dùng **HOM**, onion Search dùng **SEARCH**.

---

## Related

* [Các Cipher Level trong CryptDB](./cryptdb_cipher_levels.md) — từng cơ chế **RND**, **DET**, **OPE**, **HOM**, **SEARCH**, **JOIN** mà các lớp onion bọc bên ngoài.
* [Rò rỉ, Tấn công và Hướng thay thế cho CryptDB](./encrypted_query_leakage_and_alternatives.md) — hệ quả của việc bóc lớp: thông tin gì bị lộ và bị khai thác ra sao.

---
[← Back to README](README.md)
