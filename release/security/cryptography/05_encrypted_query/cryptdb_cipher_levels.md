# Các Cipher Level trong CryptDB: RND, DET, OPE, HOM, SEARCH và JOIN

## Table of Contents

- [Bài toán: SQL trên dữ liệu đã mã hóa](#bài-toán-sql-trên-dữ-liệu-đã-mã-hóa)
- [Cipher level](#cipher-level)
- [RND](#rnd)
- [DET](#det)
- [OPE](#ope)
- [HOM](#hom)
- [SEARCH, JOIN và OPE-JOIN](#search-join-và-ope-join)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Mã hóa dữ liệu trong database rất dễ nếu chấp nhận mất khả năng truy vấn. Khó ở chỗ database vẫn phải chạy `WHERE`, `ORDER BY`, `SUM` và `JOIN` trên dữ liệu mà nó không được đọc. Bài này tập trung vào từng cơ chế mã hóa mà **CryptDB** dùng để trả lời các phép toán đó: mỗi level nhắm vào nhóm truy vấn nào và đổi bằng dạng rò rỉ nào. Cách tổ chức chúng thành các lớp lồng nhau ở bài [Onion Encryption](./cryptdb_onion_encryption.md).

---

## Bài toán: SQL trên dữ liệu đã mã hóa

Xét bảng `employees` với cột `age` và `salary`. Nếu mã hóa toàn bộ bằng mã hóa ngẫu nhiên (mỗi lần một IV mới), database chỉ thấy các chuỗi **Ciphertext** không có thứ tự và không có quan hệ số học.

Truy vấn cần chạy:

```sql
-- Lọc nhân viên trên 30 tuổi
SELECT * FROM employees WHERE age > 30;
```

Database không thể so sánh trực tiếp các bản mã ngẫu nhiên. Có hai hướng:

| Hướng | Cách làm | Hệ quả |
| :--- | :--- | :--- |
| **Giải mã rồi truy vấn** | Tải dữ liệu về ứng dụng, giải mã, lọc | Tăng băng thông và độ trễ; dữ liệu nhạy cảm lộ ở tầng ứng dụng |
| **Mã hóa phù hợp truy vấn** | Dùng cơ chế mã hóa giữ lại đúng thuộc tính cần cho phép toán | Database chạy được một tập SQL giới hạn mà không thấy **Plaintext** |

**CryptDB** chọn hướng thứ hai. Hệ thống gồm một **proxy** đặt giữa ứng dụng và DBMS: proxy giữ khóa, viết lại truy vấn, và điều chỉnh lớp mã hóa khi cần. DBMS được giả định là **curious nhưng thụ động**: chạy đúng truy vấn và có thể ghi lại mọi thứ nó thấy, nhưng không sửa dữ liệu. Tính toàn vẹn và tính đầy đủ của dữ liệu nằm ngoài phạm vi bảo vệ.

> [!IMPORTANT]
> Mỗi khả năng truy vấn đều đổi bằng một dạng rò rỉ. Không có cấu hình nào vừa giữ toàn bộ tính năng SQL vừa không tiết lộ thêm thông tin. Câu hỏi đúng không phải "có an toàn không" mà "chấp nhận rò rỉ nào cho loại dữ liệu nào".

---

## Cipher level

**Cipher level** là lớp mã hóa mà một cột đang dùng để đáp ứng một nhóm phép toán. Bốn level cơ bản là **RND**, **DET**, **OPE**, **HOM**; ba cơ chế chuyên biệt là **SEARCH**, **JOIN**, **OPE-JOIN**.

Điểm dễ hiểu lầm: đây **không phải bốn nấc thang của cùng một thuật toán**. Chúng là các cơ chế khác nhau cho các mục tiêu khác nhau, dùng nền tảng mật mã khác nhau.

---

## RND

**RND** (Randomized Encryption) ưu tiên bảo mật khi database không cần tính toán trực tiếp trên cột.

Minh họa hai lần mã hóa cùng giá trị (tên mã chỉ mang tính minh họa):

```text
Encrypt_RND(25) -> CIPHER_A
Encrypt_RND(25) -> CIPHER_B (khác CIPHER_A)
```

Database không thấy số `25`, và hai nhân viên cùng 25 tuổi có hai bản mã khác nhau nên không thể kết luận họ bằng tuổi nhau.

| Truy vấn | **RND** hỗ trợ trực tiếp |
| :--- | :--- |
| Đọc giá trị sau khi proxy giải mã | Có |
| `WHERE age = 25` | Không |
| `WHERE age > 25` | Không |
| `ORDER BY age` | Không |
| `SUM(age)` | Không |

Trong CryptDB, **RND** là lớp ngoài cùng của onion Eq và Ord. Đây là trạng thái "nghỉ" an toàn nhất: dữ liệu nằm trong database nhưng chưa phục vụ phép toán nào.

> [!WARNING]
> **RND** giới hạn rò rỉ từ quan hệ giữa các bản mã, nhưng mức bảo mật thực tế vẫn phụ thuộc thuật toán, cách triển khai và quản lý khóa. Không nên đồng nhất "randomized" với một bảo đảm lý thuyết mạnh như mô tả trong bài báo gốc.

---

## DET

**DET** (Deterministic Encryption) cho phép kiểm tra tính bằng nhau trên dữ liệu mã hóa.

```text
DET(25) -> CIPHER_25
DET(25) -> CIPHER_25 (giống nhau)
DET(30) -> CIPHER_30 (khác)
```

Database thấy hai bản ghi có cùng bản mã nên kết luận giá trị gốc bằng nhau, dù không biết đó là số `25`.

Luồng truy vấn bằng nhau:

```sql
-- Lọc nhân viên đúng 30 tuổi
SELECT * FROM employees WHERE age = 30;
```

| Bước | Thành phần | Việc làm |
| :--- | :--- | :--- |
| **1. Nhận điều kiện** | Ứng dụng gửi `age = 30` | Chưa có mã hóa ở bước này |
| **2. Chuyển điều kiện** | Proxy mã hóa giá trị bằng cùng cơ chế **DET** | Tạo `DET(30)` để so sánh |
| **3. So sánh** | Database so sánh hai bản mã | Không thấy **Plaintext** |
| **4. Trả bản mã** | Database trả các dòng khớp | Vẫn ở dạng mã hóa |
| **5. Giải mã** | Proxy giải mã theo quyền rồi trả ứng dụng | Ứng dụng thấy kết quả rõ |

| Truy vấn | **DET** hỗ trợ |
| :--- | :--- |
| `WHERE age = 30` | Có |
| `GROUP BY age` | Có |
| `COUNT(DISTINCT age)` | Có |
| `WHERE age > 25` | Không |
| `ORDER BY age` theo số học | Không |

> [!WARNING]
> **DET** làm lộ **mẫu trùng lặp** và tần suất. Kẻ quan sát biết những bản ghi nào có cùng giá trị, và có thể suy luận giá trị thật nếu có thông tin phụ trợ như phân bố tuổi trong một công ty hoặc danh sách nhân viên công khai.

---

## OPE

**OPE** (Order-Preserving Encryption) giữ lại quan hệ thứ tự để lọc phạm vi và sắp xếp.

**DET** trả lời "bằng hay khác". **OPE** trả lời "lớn hơn hay nhỏ hơn".

| Giá trị gốc | Giá trị **OPE** minh họa |
| :--- | :--- |
| **20** | `103` |
| **25** | `145` |
| **30** | `211` |
| **35** | `287` |

Thứ tự gốc `20 < 25 < 30 < 35` tương ứng thứ tự mã `103 < 145 < 211 < 287`. Database so sánh bản mã theo thứ tự này mà không cần giải mã.

```sql
-- Lọc nhân viên trên 30 tuổi
SELECT * FROM employees WHERE age > 30;
```

Luồng xử lý: xác định onion thứ tự, bóc lớp **RND** ngoài để lộ **OPE**, database so sánh bản mã theo thứ tự được bảo toàn, proxy giải mã kết quả.

> [!WARNING]
> **OPE** chủ động tiết lộ thứ tự để đổi lấy khả năng truy vấn phạm vi. Nếu biết thêm vài giá trị thật hoặc miền dữ liệu (tuổi nhân viên thường từ 18 đến 65), khả năng suy luận các giá trị còn lại tăng mạnh. Đây là rò rỉ có cấu trúc, không phải rò rỉ ngẫu nhiên.

---

## HOM

**HOM** (Homomorphic Encryption) cho phép tính toán trực tiếp trên bản mã mà không cần giải mã từng toán hạng.

**DET** và **OPE** giải quyết so sánh. **HOM** giải quyết tính toán.

```text
C_A = Encrypt(12)
C_B = Encrypt(18)
C_SUM = HomomorphicAdd(C_A, C_B)
Decrypt(C_SUM) = 30
```

| Toán hạng | Dạng lưu ở database | Database thấy gì |
| :--- | :--- | :--- |
| **Lương A** | `C_A` | Không thấy số `12` |
| **Lương B** | `C_B` | Không thấy số `18` |
| **Tổng** | `C_SUM` | Bản mã của `30`, tính được mà không giải mã từng toán hạng |

> [!IMPORTANT]
> CryptDB dùng **additive homomorphic encryption** (Paillier), không phải mã hóa đồng cấu hoàn toàn. Chỉ `SUM` được hỗ trợ trực tiếp; `AVG` do proxy suy ra từ `SUM` và `COUNT`. Bản thân `COUNT` là phép đếm trên lớp **DET**, không phải phép toán của **HOM**. Mọi phép nhân, chia hay truy vấn SQL tùy ý đều không chạy được.

Chi phí cần biết: bản mã Paillier lớn hơn dữ liệu gốc nhiều lần. Một số nguyên `4 byte` có thể chiếm vài trăm byte bản mã, tức hàng chục lần dữ liệu gốc, bất kể kiểu dữ liệu được lưu. Đây là lý do **HOM** chỉ dùng cho cột thật sự cần tính tổng.

---

## SEARCH, JOIN và OPE-JOIN

Ba cơ chế này xử lý hai nhu cầu mà bốn level trên không phủ: tìm từ khóa trong văn bản và kết hợp bảng.

| Cơ chế | Mục tiêu | Thuộc onion |
| :--- | :--- | :--- |
| **SEARCH** | Tìm từ khóa trong văn bản mã hóa | Search |
| **JOIN** | So khớp bằng giữa hai cột | Eq, lớp trong cùng |
| **OPE-JOIN** | So khớp thứ tự giữa hai cột | Ord, lớp trong cùng |

Ví dụ tìm kiếm văn bản:

```text
Mô tả: Java backend developer
Từ khóa cần tìm: backend
```

**SEARCH** cho phép database kiểm tra từ khóa qua biểu diễn mã hóa dành cho tìm kiếm. Cơ chế này tìm **từ hoàn chỉnh** theo giao thức đã triển khai, không hỗ trợ regex hay mọi biến thể `LIKE` chuỗi con.

Ví dụ kết hợp bảng:

```sql
-- Lấy tên nhân viên kèm tên phòng ban
SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

**DET** thông thường dùng khóa riêng theo từng cột nên không so sánh chéo được. **JOIN** xử lý việc này bằng cách cho các cột trong cùng một **join group** chia sẻ thành phần so khớp, hoặc bằng cơ chế điều chỉnh lúc chạy (thường gọi là **JOIN-ADJ**) để hai cột trở nên so sánh được mà không buộc dùng chung khóa cho toàn database.

> [!NOTE]
> **SEARCH**, **JOIN** và **OPE-JOIN** không phải "nấc tiếp theo" sau **HOM**. Mỗi cơ chế phục vụ một loại phép toán riêng và có onion riêng. **JOIN** là lớp trong cùng của onion Eq, còn **OPE-JOIN** là lớp trong cùng của onion Ord; cấu trúc onion ở bài [Onion Encryption](./cryptdb_onion_encryption.md).

---

## Tổng kết

- **RND**, **DET**, **OPE**, **HOM** là các cơ chế cho các mục tiêu khác nhau, không phải bốn nấc tuyến tính của một thuật toán.
- **Trade-off** cốt lõi là khả năng SQL đổi bằng rò rỉ có cấu trúc: **DET** lộ mẫu bằng nhau, **OPE** lộ thứ tự và phân bố, **HOM** chỉ tính được phép cộng.

---

## Related

* [Onion Encryption trong CryptDB](./cryptdb_onion_encryption.md) — cách các cipher level này được tổ chức thành lớp lồng nhau và bóc dần theo truy vấn.
* [Rò rỉ, Tấn công và Hướng thay thế cho CryptDB](./encrypted_query_leakage_and_alternatives.md) — cái giá thực tế của từng cơ chế và trạng thái của hướng tiếp cận này.
* [Tổng quan Encryption](../01_foundations/encryption_overview.md) — cùng nguyên lý **Trade-off** giữa khả năng dùng dữ liệu và mức độ lộ thông tin.
* [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md) — cùng họ mã hóa bất đối xứng, nền tảng của biến thể **HOM** dựa trên bài toán số học.

---
[← Back to README](README.md)
