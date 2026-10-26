# Các lớp mã hóa trong CryptDB và Onion Encryption

---

## Table of Contents

- [Bài toán truy vấn trên dữ liệu mã hóa](#bài-toán-truy-vấn-trên-dữ-liệu-mã-hóa)
- [Cipher level là gì](#cipher-level-là-gì)
- [RND](#rnd)
- [DET](#det)
- [OPE](#ope)
- [HOM](#hom)
- [Các cơ chế chuyên biệt](#các-cơ-chế-chuyên-biệt)
- [Onion Encryption hoạt động ra sao](#onion-encryption-hoạt-động-ra-sao)
- [Bảng tổng hợp và Trade-off](#bảng-tổng-hợp-và-trade-off)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Bài này giải thích vì sao database có thể chạy SQL trên dữ liệu đã mã hóa, các cơ chế **RND**, **DET**, **OPE**, **HOM** khác nhau ra sao, và **Onion Encryption** bóc lớp theo truy vấn như thế nào. Trọng tâm là luồng dữ liệu và kết quả quan sát được (input, output, database thấy gì), không đi sâu toán học mật mã.

---

## Bài toán truy vấn trên dữ liệu mã hóa

Xét bảng `employees` với cột `age` và `salary`. Nếu mã hóa toàn bộ bằng **AES** ở chế độ ngẫu nhiên (mỗi lần mã hóa dùng IV hoặc nonce mới), database chỉ thấy các chuỗi **Ciphertext** không có thứ tự hay cấu trúc số học.

Ví dụ truy vấn lọc theo tuổi.

Câu lệnh SQL cần chạy trên database:

```sql
-- Lọc nhân viên trên 30 tuổi
SELECT * FROM employees WHERE age > 30;
```

Database không thể so sánh trực tiếp các **Ciphertext** ngẫu nhiên như số nguyên. Có hai hướng xử lý:

| Hướng xử lý | Cách làm | Hệ quả |
| :--- | :--- | :--- |
| **Giải mã rồi truy vấn** | Tải dữ liệu về ứng dụng, giải mã rồi lọc | Tăng lượng truyền, tăng độ trễ, dữ liệu nhạy cảm lộ ở tầng ứng dụng |
| **Mã hóa phù hợp truy vấn** | Dùng cơ chế mã hóa giữ lại đúng thuộc tính cần cho phép toán | Database chạy được một tập SQL giới hạn mà không thấy **Plaintext** |

**CryptDB** chọn hướng thứ hai. Nó cho phép một số truy vấn SQL chạy trực tiếp trên dữ liệu mã hóa thông qua các cơ chế chuyên biệt và một lớp proxy điều phối.

> [!IMPORTANT]
> Không có cơ chế nào vừa giữ toàn bộ tính năng SQL vừa không lộ thêm thông tin. Mỗi khả năng truy vấn đều đánh đổi bằng một dạng rò rỉ có kiểm soát (mẫu trùng lặp, thứ tự, hoặc khả năng tính toán).

---

## Cipher level là gì

Trong bài này, cipher level được hiểu là lớp mã hóa mà một cột đang dùng để đáp ứng một nhóm phép toán cụ thể.

Điểm cần làm rõ ngay từ đầu là **RND**, **DET**, **OPE**, **HOM** không phải bốn nấc thang tuyến tính của cùng một thuật toán. Chúng là các cơ chế khác nhau cho các mục tiêu khác nhau. **CryptDB** tổ chức chúng thành nhiều onion riêng biệt (onion cho so sánh bằng, onion cho so sánh thứ tự, onion cho phép cộng, onion cho tìm kiếm).

Mỗi onion có thể có nhiều lớp bọc ngoài nhau. Với onion Eq và onion Ord thì lớp ngoài cùng là **RND** để che giấu tối đa khi chưa cần truy vấn. Với onion Add thì lớp ngoài cùng là **HOM** còn onion Search thì lớp ngoài cùng là **SEARCH**. Khi truy vấn yêu cầu chức năng sâu hơn, proxy cho bóc lớp ngoài để lộ lớp trong phù hợp hơn.

> [!NOTE]
> Hãy hình dung một cột `age` có nhiều biểu diễn mã hóa song song, mỗi onion phục vụ một nhóm phép toán. Truy vấn nào cần onion nào thì proxy điều chỉnh onion đó, các onion còn lại không bị ảnh hưởng.

---

## RND

**RND** (Randomized Encryption) ưu tiên bảo mật khi database không cần tính toán trực tiếp trên cột đó.

Giả sử giá trị đầu vào là tuổi 25.

Minh họa hai lần mã hóa cùng giá trị (tên mã chỉ mang tính minh họa):

```text
Encrypt_RND(25) -> CIPHER_A
Encrypt_RND(25) -> CIPHER_B (khác CIPHER_A)
```

Database lưu `CIPHER_A`, không thấy số `25`. Hai nhân viên cùng 25 tuổi sẽ có hai **Ciphertext** khác nhau nên database không thể kết luận họ bằng tuổi nhau.

| Truy vấn | **RND** hỗ trợ trực tiếp |
| :--- | :--- |
| Đọc giá trị sau khi giải mã ở proxy | Có (proxy giữ khóa và giải mã khi trả về ứng dụng) |
| `WHERE age = 25` | Không (không so sánh được trên **Ciphertext** ngẫu nhiên) |
| `WHERE age > 25` | Không |
| `ORDER BY age` | Không |
| `SUM(age)` | Không |

Trong **CryptDB**, **RND** thường là lớp bọc ngoài của onion so sánh bằng và onion so sánh thứ tự. Khi cần chức năng sâu hơn, proxy bóc lớp **RND** để lộ **DET** hoặc **OPE** bên trong.

> [!WARNING]
> **RND** hạn chế rò rỉ từ quan hệ giữa các **Ciphertext**, nhưng mức bảo mật thực tế vẫn phụ thuộc thuật toán, cách triển khai, quản lý khóa và mô hình đe dọa. Không nên coi mọi triển khai ngẫu nhiên đều có cùng bảo đảm lý thuyết như mô tả trong bài báo gốc.

---

## DET

**DET** (Deterministic Encryption) cho phép kiểm tra tính bằng nhau trên dữ liệu mã hóa.

Giả sử ba đầu vào tuổi được mã hóa xác định bằng cùng khóa và cùng cơ chế cho một cột.

Minh họa quan hệ bằng nhau được giữ lại (tên mã minh họa):

```text
DET(25) -> CIPHER_25
DET(25) -> CIPHER_25 (giống nhau)
DET(30) -> CIPHER_30 (khác)
```

Database thấy hai bản ghi đầu có **Ciphertext** giống nhau nên kết luận giá trị gốc bằng nhau, dù không biết đó là số `25`.

Luồng truy vấn bằng nhau diễn ra theo 5 bước.

Câu lệnh SQL mà ứng dụng muốn chạy:

```sql
-- Lọc nhân viên đúng 30 tuổi
SELECT * FROM employees WHERE age = 30;
```

| Bước | Thành phần | Việc làm |
| :--- | :--- | :--- |
| **1. Nhận điều kiện** | Ứng dụng gửi `age = 30` | Chưa có mã hóa ở bước này |
| **2. Chuyển điều kiện** | Proxy mã hóa giá trị điều kiện bằng cùng cơ chế **DET** | Tạo `DET(30)` để so sánh |
| **3. So sánh** | Database so sánh **Ciphertext** với nhau | Không thấy **Plaintext** |
| **4. Trả bản mã** | Database trả các dòng khớp | Vẫn ở dạng mã hóa |
| **5. Giải mã** | Proxy giải mã theo quyền rồi trả cho ứng dụng | Ứng dụng thấy kết quả rõ |

| Truy vấn | **DET** hỗ trợ |
| :--- | :--- |
| `WHERE age = 30` | Có |
| `GROUP BY age` | Có |
| `COUNT(DISTINCT age)` | Có (tùy cách viết truy vấn và proxy xử lý) |
| `WHERE age > 25` | Không bảo đảm |
| `ORDER BY age` theo số học | Không |

> [!WARNING]
> **DET** làm lộ mẫu trùng lặp. Kẻ quan sát database biết những bản ghi nào có cùng giá trị và có thể suy luận thêm từ tần suất xuất hiện kết hợp thông tin phụ trợ bên ngoài (ví dụ phân bố tuổi trong một công ty).

---

## OPE

**OPE** (Order-Preserving Encryption) giữ lại quan hệ thứ tự để lọc phạm vi và sắp xếp.

**DET** chỉ trả lời câu hỏi bằng hay khác. **OPE** trả lời câu hỏi lớn hơn hay nhỏ hơn.

Bảng minh họa quan hệ thứ tự được bảo toàn (số mã hóa chỉ là ví dụ giả lập):

| Giá trị gốc | Giá trị **OPE** minh họa |
| :--- | :--- |
| **20** | `103` |
| **25** | `145` |
| **30** | `211` |
| **35** | `287` |

Thứ tự gốc `20 < 25 < 30 < 35` tương ứng thứ tự mã `103 < 145 < 211 < 287`. Database so sánh **Ciphertext** theo thứ tự này mà không cần giải mã.

Câu lệnh SQL cần khả năng thứ tự:

```sql
-- Lọc nhân viên trên 30 tuổi
SELECT * FROM employees WHERE age > 30;
```

Luồng xử lý khái quát gồm xác định onion thứ tự, bóc lớp **RND** ngoài để lộ **OPE**, database so sánh **Ciphertext** theo thứ tự được bảo toàn, proxy giải mã kết quả.

> [!WARNING]
> **OPE** chủ động tiết lộ thứ tự để đổi lấy khả năng truy vấn phạm vi. Nếu kẻ tấn công biết thêm một vài giá trị thật hoặc miền dữ liệu (ví dụ tuổi nhân viên thường từ 18 đến 65), khả năng suy luận các giá trị còn lại tăng lên đáng kể.

---

## HOM

**HOM** (Homomorphic Encryption) cho phép tính toán trực tiếp trên **Ciphertext** mà không cần giải mã trung gian.

**DET** và **OPE** giải quyết so sánh. **HOM** giải quyết tính toán.

Ví dụ cộng hai mức lương mà không lộ từng mức ở database.

Minh họa phép cộng đồng cấu trên bản mã (tên hàm minh họa):

```text
C_A = Encrypt(12)
C_B = Encrypt(18)
C_SUM = HomomorphicAdd(C_A, C_B)
Decrypt(C_SUM) = 30
```

Luồng tổng quát gồm mã hóa từng toán hạng, thực hiện phép toán trên **Ciphertext**, giải mã kết quả ở thành phần được phép (proxy hoặc client giữ khóa).

| Toán hạng | Dạng lưu ở database | Database thấy gì |
| :--- | :--- | :--- |
| **Lương A** | `C_A` | Không thấy số `12` |
| **Lương B** | `C_B` | Không thấy số `18` |
| **Tổng** | `C_SUM` | Kết quả mã hóa của `30`, tính được mà không giải mã từng toán hạng |

> [!IMPORTANT]
> Thiết kế gốc của **CryptDB** dùng **additive homomorphic encryption** cho phép cộng được hỗ trợ, không phải mã hóa đồng cấu hoàn toàn cho mọi phép toán. Không nên suy ra mọi phép nhân, chia hay mọi truy vấn SQL đều chạy được. Phép `SUM` được hỗ trợ trực tiếp còn `AVG` được suy ra từ tổng và số lượng do proxy kết hợp. Khả năng thực tế phụ thuộc phép toán được triển khai và cách biểu diễn dữ liệu.

---

## Các cơ chế chuyên biệt

Bốn cơ chế trên chưa bao phủ tìm kiếm văn bản và kết hợp bảng. **CryptDB** bổ sung ba cơ chế riêng cho các nhu cầu này.

| Cơ chế | Mục tiêu | Ví dụ |
| :--- | :--- | :--- |
| **SEARCH** | Tìm từ khóa trong văn bản mã hóa | Tìm ghi chú chứa từ `backend` |
| **JOIN** | Kết hợp hai cột theo điều kiện bằng nhau | Ghép `employees.department_id` với `departments.id` |
| **OPE-JOIN** | Kết hợp hai cột theo điều kiện thứ tự | Ghép các bản ghi theo quan hệ lớn hơn hoặc nhỏ hơn |

Ví dụ tìm kiếm văn bản trong cột mô tả.

Nội dung gốc và nhu cầu tìm kiếm:

```text
Mô tả: Java backend developer
Từ khóa cần tìm: backend
```

Cơ chế **SEARCH** cho phép database kiểm tra từ khóa qua biểu diễn mã hóa dành cho tìm kiếm. Bản gốc tập trung vào tìm từ khóa hoàn chỉnh theo giao thức đã triển khai, không mặc định hỗ trợ mọi regex hay mọi `LIKE` chuỗi con tùy ý.

Ví dụ kết hợp hai bảng theo khóa bằng nhau.

Câu lệnh SQL cần hỗ trợ:

```sql
-- Lấy tên nhân viên kèm tên phòng ban
SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

**DET** thông thường dùng khóa riêng theo từng cột nên không thể so sánh chéo trực tiếp. Cơ chế **JOIN** xử lý so khớp giữa các cột mà không buộc dùng chung khóa **DET** cho toàn bộ database.

> [!NOTE]
> **SEARCH**, **JOIN** và **OPE-JOIN** không phải nấc tiếp theo sau **HOM**. Mỗi cơ chế phục vụ một loại phép toán riêng. **SEARCH** có onion tìm kiếm riêng còn **JOIN** thuộc onion Eq và **OPE-JOIN** thuộc onion Ord.

---

## Onion Encryption hoạt động ra sao

Đây là phần quan trọng nhất. **Onion Encryption** không có nghĩa mọi dữ liệu đi qua chuỗi `RND` rồi `DET` rồi `OPE` rồi `HOM`. Mỗi nhóm chức năng có onion riêng, mỗi onion có các lớp của nó.

### Trạng thái ban đầu

Xét onion thứ tự của cột `age` khi chưa cần so sánh. Dữ liệu được lưu theo dạng lồng nhau.

Mô tả cấu trúc lồng nhau (giả mã minh họa):

```text
Lưu trữ: RND(OPE(age))
Trong đó OPE(age) nằm bên trong, RND(...) bọc bên ngoài
```

Database chỉ thấy lớp **RND** ngoài cùng nên chưa thể dùng thứ tự của **OPE**.

### Khi truy vấn cần chức năng mới

Ứng dụng gửi điều kiện `age > 30`. Proxy xác định cần khả năng thứ tự và điều chỉnh onion qua 5 bước.

| Bước | Hành động | Kết quả |
| :--- | :--- | :--- |
| **1. Nhận truy vấn** | Proxy phân tích `age > 30` | Biết cần so sánh thứ tự |
| **2. Chọn onion và lớp đích** | Chọn onion thứ tự, đích là **OPE** | Không đụng tới onion cộng hay onion tìm kiếm |
| **3. Điều chỉnh mã hóa** | Proxy cung cấp thông tin để DBMS bóc lớp **RND** | Dữ liệu còn ở dạng **Ciphertext OPE**, không phải **Plaintext** |
| **4. Thực thi** | Database so sánh **Ciphertext OPE** | Lọc được các dòng thỏa mãn |
| **5. Trả kết quả** | Database trả bản mã, proxy giải mã theo quyền | Ứng dụng nhận dữ liệu rõ |

> [!IMPORTANT]
> Bóc lớp **RND** không đồng nghĩa giải mã toàn bộ. Sau bước 3, giá trị vẫn là **Ciphertext OPE**. Thứ tự bị lộ từ đây, nhưng nội dung gốc vẫn được bảo vệ bởi lớp **OPE**.

### Điều gì xảy ra với truy vấn tiếp theo

Sau khi onion đã ở **OPE**, các truy vấn phạm vi tiếp theo dùng trực tiếp lớp này mà không cần bóc lại. Điều này giảm thao tác điều chỉnh lặp lại nhưng đồng nghĩa thông tin thứ tự tiếp tục lộ ra cho database. **CryptDB** ghi nhớ trạng thái lớp để phối hợp các truy vấn sau và cần quản lý nhất quán khi nhiều truy vấn cùng truy cập.

---

## Bảng tổng hợp và Trade-off

| Cơ chế | Database có thể làm gì | Thông tin bị lộ nổi bật |
| :--- | :--- | :--- |
| **RND** | Lưu trữ và trả dữ liệu mã hóa | Hạn chế rò rỉ từ quan hệ giữa các **Ciphertext** |
| **DET** | So sánh bằng, một số phép nhóm và kết hợp | Mẫu giá trị trùng nhau và tần suất |
| **OPE** | So sánh thứ tự, lọc phạm vi | Quan hệ lớn hơn và nhỏ hơn |
| **HOM** | Thực hiện phép cộng được hỗ trợ | Phụ thuộc hệ mã hóa và phép toán cụ thể |
| **SEARCH** | Tìm từ khóa theo giao thức | Kết quả và mẫu tìm kiếm được hỗ trợ |
| **JOIN** | So khớp giá trị giữa các cột | Quan hệ bằng nhau giữa các bản ghi |
| **OPE-JOIN** | So khớp thứ tự giữa các cột | Quan hệ thứ tự giữa các cột |

Ba điểm cần nhớ khi đánh giá **Trade-off**:

1. Khả năng truy vấn tăng lên thường đi kèm rò rỉ nhiều hơn. Không có thứ tự bảo mật tuyệt đối áp dụng cho mọi cơ chế.
2. Tần suất truy vấn cũng là thông tin. Onion nào bị bóc xuống càng sâu và càng lâu thì database càng học được nhiều.
3. Phân biệt lớp truy vấn với thuật toán nền. **AES** và **RSA** là thuật toán mã hóa cụ thể. **RND**, **DET**, **OPE**, **HOM** là cách dùng mã hóa để giữ lại đúng thuộc tính cần cho SQL.

---

## Tổng kết

- **RND**, **DET**, **OPE**, **HOM** là các cơ chế cho các mục tiêu khác nhau, không phải bốn nấc tuyến tính của một thuật toán duy nhất.
- **Onion Encryption** điều chỉnh lớp mã hóa theo truy vấn. Proxy xác định chức năng cần thiết, bóc lớp ngoài khi cần, database chạy phép toán trên lớp phù hợp.
- **Trade-off** cốt lõi là khả năng SQL đổi bằng rò rỉ có kiểm soát. **DET** lộ mẫu trùng lặp. **OPE** lộ thứ tự. **HOM** chỉ tính được trong phạm vi được hỗ trợ.
- Tham khảo gốc là bài báo **CryptDB** (onion encryption và điều chỉnh theo truy vấn với **RND**, **DET**, **OPE**, **HOM**, **SEARCH**, **JOIN**).

---

## Related

- [Tổng quan Encryption](introduce.md) (cùng nguyên lý **Trade-off** giữa khả năng dùng dữ liệu và mức độ lộ thông tin, cùng mô hình kết hợp nhiều cơ chế thay vì một thuật toán duy nhất).
- [Chi tiết thuật toán RSA](algorithms/RSA.md) (cùng họ mã hóa bất đối xứng, nền tảng thường gặp cho các biến thể **HOM** và trao đổi khóa).

---
[← Back to README](README.md)
