# Các con số trong mật mã: Kích thước khóa, khối, đầu ra và Mức an toàn

## Table of Contents

- [Bit, byte và không gian khóa](#bit-byte-và-không-gian-khóa)
- [Năm loại kích thước thường bị nhầm](#năm-loại-kích-thước-thường-bị-nhầm)
- [Bản đồ con số theo thuật toán](#bản-đồ-con-số-theo-thuật-toán)
- [Vì sao AES-256 và RSA-2048 không so sánh trực tiếp được](#vì-sao-aes-256-và-rsa-2048-không-so-sánh-trực-tiếp-được)
- [Ví dụ: Hash và đầu ra cố định](#ví-dụ-hash-và-đầu-ra-cố-định)
- [Hiểu lầm phổ biến: dữ liệu phải dài bằng khóa](#hiểu-lầm-phổ-biến-dữ-liệu-phải-dài-bằng-khóa)
- [Nguyên lý chung của mật mã hiện đại](#nguyên-lý-chung-của-mật-mã-hiện-đại)
- [Độ dài khóa được chọn dựa trên điều gì](#độ-dài-khóa-được-chọn-dựa-trên-điều-gì)
- [Tổng kết](#tổng-kết)
- [Related](#related)

`AES-256`, `RSA-2048` và `SHA-256` cùng có một con số trong tên, nhưng con số đó không nói cùng một thứ: `256` của AES là cỡ khóa, `2048` của RSA là cỡ modulus, còn `256` của SHA-256 là cỡ đầu ra. Vậy có so sánh được chúng với nhau không, và vì sao `AES-256` không "mạnh gấp 8 lần" `RSA-2048`? Bài này trả lời theo ba bước: hiểu `bit` và các con số, xem một ví dụ hash để thấy đầu ra cố định, rồi mới gỡ hiểu lầm phổ biến rằng dữ liệu phải dài bằng khóa.

---

## Bit, byte và không gian khóa

**Bit** là đơn vị thông tin nhỏ nhất: một bit có hai trạng thái. Một khóa dài `n` bit có `2^n` giá trị có thể, gọi là **không gian khóa** (keyspace). `1 byte` bằng `8 bit`, nên khóa `128 bit` là một chuỗi `16 byte`.

| Cỡ khóa | Số byte | Không gian khóa |
| :--- | :--- | :--- |
| `64 bit` | `8 byte` | `2^64` ≈ `1,8 × 10^19` |
| `112 bit` | `14 byte` | `2^112` ≈ `5,2 × 10^33` |
| `128 bit` | `16 byte` | `2^128` ≈ `3,4 × 10^38` |
| `192 bit` | `24 byte` | `2^192` ≈ `6,3 × 10^57` |
| `256 bit` | `32 byte` | `2^256` ≈ `1,2 × 10^77` |

Quy tắc duy nhất cần nhớ: **thêm `1` bit là gấp đôi khối lượng tìm kiếm**, vì `2^(n+1) = 2 × 2^n`. Đây là lý do các cỡ khóa nhảy theo cấp số nhân chứ không theo cấp số cộng.

`2^128` lớn đến mức nào? Với giả định rộng rãi cho kẻ tấn công là `7 tỉ` máy, mỗi máy `4 GHz` và mỗi chu kỳ thử được một khóa, thời gian vét cạn `2^128` vào khoảng `4 × 10^11` năm, tức chừng `28` lần tuổi vũ trụ (Aumasson, EPFL, 2009). Giả định trên đã rất lạc quan về tốc độ, nên thời gian thực tế còn dài hơn.

> [!NOTE]
> Đừng dùng câu "khóa `128 bit` nhiều hơn số nguyên tử trong vũ trụ". Số nguyên tử ước chừng `10^80`, còn `2^128` chỉ khoảng `3,4 × 10^38`; chỉ `2^256` (≈ `1,2 × 10^77`) mới ở cùng bậc với con số đó. So sánh sai kiểu này xuất hiện nhiều trên blog.

---

## Năm loại kích thước thường bị nhầm

Mỗi thuật toán có nhiều con số, và chúng trả lời năm câu hỏi khác nhau:

| Loại kích thước | Nghĩa | Ví dụ | Ai quyết định |
| :--- | :--- | :--- | :--- |
| **Kích thước khóa** | Số bit của vật liệu bí mật | **AES**: `128`, `192` hoặc `256 bit` | Chuẩn quy định tập hợp lệ, hệ thống chọn một giá trị |
| **Kích thước khối** | Lượng dữ liệu một lần biến đổi | **AES**: `128 bit`, cố định cho cả ba cỡ khóa | Thuật toán, không đổi được |
| **Kích thước đầu ra** | Độ dài giá trị do hàm tạo ra | **SHA-256**: `256 bit`; tag **GCM**: `128 bit` | Chuẩn của hàm hoặc mode |
| **Nonce hoặc IV** | Giá trị dùng một lần cho mỗi lần mã hóa | **GCM** và **ChaCha20**: `96 bit` | Chuẩn, đôi khi giao thức thu hẹp thêm |
| **Độ dài thông điệp** | Lượng dữ liệu người dùng cần bảo vệ | Tùy ý, từ vài byte tới hàng terabyte | Người dùng, không phải thuật toán |

Điểm cốt lõi: **năm con số này độc lập với nhau**. Một thông điệp `1 GB` không làm khóa dài thêm, và một khóa `256 bit` không làm đầu ra hash dài thêm.

---

## Bản đồ con số theo thuật toán

Bảng tra nhanh các con số chuẩn, kèm văn bản định nghĩa:

| Thuật toán | Con số | Con số đó là gì | Chuẩn |
| :--- | :--- | :--- | :--- |
| **AES** | `128` / `192` / `256 bit` | Cỡ khóa; chỉ ba giá trị này hợp chuẩn | FIPS 197-upd1 (2023) |
| **AES** | `128 bit` | Cỡ khối, cố định cho cả ba cỡ khóa | FIPS 197-upd1 (2023) |
| **AES** | `10` / `12` / `14` vòng | Số vòng tương ứng ba cỡ khóa | FIPS 197-upd1 (2023) |
| **AES-GCM** | `96 bit` | Cỡ nonce được khuyến nghị | NIST SP 800-38D (2007) |
| **AES-GCM** | `128 bit` | Cỡ tag thông dụng nhất; các cỡ hợp lệ khác là `120`, `112`, `104`, `96` | NIST SP 800-38D (2007) |
| **ChaCha20-Poly1305** | `256` / `96` / `128 bit` | Cỡ khóa, nonce, tag theo thứ tự | RFC 8439 (2018) |
| **RSA** | `2048` / `3072` / `4096 bit` | Cỡ modulus; khi sinh khóa, chuẩn yêu cầu tối thiểu `2048 bit` và là số chẵn | FIPS 186-5 (2023) |
| **ECC** | `256 bit` (P-256), `255 bit` (Curve25519) | Cỡ khóa; Curve25519 mã hóa thành `32 byte` | FIPS 186-5, RFC 7748 |
| **ECDSA P-256** | `512 bit` | Cỡ chữ ký, gồm hai thành phần `256 bit` | FIPS 186-5, SP 800-186 |
| **HMAC-SHA256** | `256` / `512` / `≥112 bit` | Cỡ đầu ra, cỡ khối bên trong, cỡ khóa tối thiểu | FIPS 198-1, SP 800-131A |

Đọc bảng này theo một câu hỏi duy nhất: *con số đang xét là khóa, khối, đầu ra hay tham số phụ?* Trả lời được câu đó là hết phần lớn nhầm lẫn.

---

## Vì sao AES-256 và RSA-2048 không so sánh trực tiếp được

Số bit khóa chỉ so sánh được giữa hai thuật toán cùng họ. Muốn so sánh khác họ, phải quy về **security strength** (mức an toàn): số bit của một khóa đối xứng mà kẻ tấn công phải vét cạn hết để phá. `112 bit` security strength nghĩa là phá được cần khoảng `2^112` phép thử trong mô hình tấn công tốt nhất đã biết.

| Security strength | Thuật toán đối xứng | Modulus RSA | Đường cong ECC |
| :--- | :--- | :--- | :--- |
| `112 bit` | 3TDEA (đã ngừng dùng) | `2048 bit` | `224–255 bit` |
| `128 bit` | **AES-128** | `3072 bit` | `256–383 bit` |
| `192 bit` | **AES-192** | `7680 bit` | `384–511 bit` |
| `256 bit` | **AES-256** | `15360 bit` | `≥ 512 bit` |

Bảng này giải thích trực tiếp câu hỏi mở đầu: `AES-256` tương đương `RSA-15360`, còn `RSA-2048` chỉ ngang `AES-128`. Vì sao RSA cần modulus lớn đến vậy? Khóa AES là chuỗi bit ngẫu nhiên bất kỳ, nên không có cách nào nhanh hơn thử hết `2^n`. Khóa RSA có cấu trúc toán học, là tích của hai số nguyên tố, nên tồn tại thuật toán phân tích nhanh hơn vét cạn rất nhiều; muốn đạt cùng mức công `2^n` cho kẻ tấn công, modulus phải lớn hơn hẳn. ECC nằm giữa hai thế cực vì chưa có thuật toán dưới mũ nào đã biết cho bài toán logarit rời rạc trên đường cong.

> [!NOTE]
> Bảng tương đương lấy từ NIST SP 800-57 Part 1 Rev.5 (05/2020), Bảng 2. Về lộ trình: NIST IR 8547 (bản cuối `27/10/2026`) xếp các mức đã phê duyệt, trong đó có `112 bit`, vào diện *deprecated sau 2030* và *disallowed sau 2035* — nên `RSA-2048` không bị cấm ngay sau 2030. Bản quy định trạng thái thuật toán đang hiệu lực vẫn là SP 800-131A Rev.2 (2019); Rev.3 (2024) mới là bản nháp.

---

## Ví dụ: Hash và đầu ra cố định

**Hash** là hàm một chiều không có khóa: đưa vào dữ liệu dài bao nhiêu cũng được, nhận lại một chuỗi dài cố định. Đây là ví dụ rõ nhất cho việc "độ dài đầu vào" và "con số của thuật toán" không liên quan nhau.

| Hàm | Đầu ra | Ký tự hex | Chống collision | Chống preimage | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MD5 | `128 bit` | `32` | Đã bị phá (va chạm công bố 2004) | `128 bit` trên lý thuyết | Không dùng |
| SHA-1 | `160 bit` | `40` | `< 80 bit`, thấp hơn mức `80` danh nghĩa | `160 bit` | NIST chuyển khỏi SHA-1 cho bảo vệ mới trước `2030` |
| SHA-256 | `256 bit` | `64` | `128 bit` | `256 bit` | Khuyến nghị |
| SHA-512 | `512 bit` | `128` | `256 bit` | `512 bit` | Khuyến nghị |
| SHA3-256 | `256 bit` | `64` | `128 bit` | `256 bit` | Khuyến nghị |

Cột "chống collision" thấp hơn cột "chống preimage" đúng một nửa. Lý do: tìm preimage phải thử tới khi trúng một giá trị cụ thể, còn tìm collision chỉ cần hai đầu vào bất kỳ trùng nhau, nên chỉ cần khoảng `2^(n/2)` phép thử. NIST phát biểu quy tắc này trong SP 800-107 Rev.1 (2012): hàm băm `n` bit có collision resistance kỳ vọng `n/2` bit và preimage resistance `n` bit.

Thí nghiệm dưới đây băm ba đầu vào có độ dài chênh nhau hàng triệu lần:

```text
>>> import hashlib
>>> hashlib.sha256(b"a").hexdigest()
'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
>>> hashlib.sha256("Mã hóa là nghệ thuật giữ bí mật.".encode()).hexdigest()
'0f0c3838fea5eac1b366f009e5087173bce42f425c30e279767424b7ad517679'
>>> hashlib.sha256(b"A" * 3 * 1024 * 1024).hexdigest()
'a57493c037eb3a8a86ff87072edde226110455cd7fdab2f87bb4df072f67ffb0'
```

Ba lần gọi trên băm ba đầu vào dài `1 byte`, `44 byte` và `3 145 728 byte`; cả ba trả về đúng `64` ký tự hex, tức `256 bit`.

**Hiệu ứng avalanche**: đổi đúng một ký tự cuối của đầu vào 2, từ `.` sang `!`, ta được `2bd554e7ea845abdabaa03a1a239b83f298a99015d4f8f198f33f67187c59d67` — khác `125` trên `256` bit so với hash cũ. Đầu vào gần như giống hệt, đầu ra không giữ lại chút cấu trúc nào.

Chốt lại: hash không có khóa, đầu ra cố định, và con số `256` trong `SHA-256` chỉ nói về đầu ra. Đây là bằng chứng đầu tiên cho thấy không có quy tắc nào buộc một con số của thuật toán phải bằng độ dài dữ liệu.

---

## Hiểu lầm phổ biến: dữ liệu phải dài bằng khóa

Với các con số ở trên, có thể phát biểu hiểu lầm cho gọn: "muốn mã hóa `1 GB` thì khóa cũng phải `1 GB`". Điều này chỉ đúng với một mô hình, **One-Time Pad**, và sai với mọi thuật toán còn lại.

**Với AES**, khối luôn là `128 bit`, còn khóa là `128`, `192` hoặc `256 bit`. Thông điệp dài hơn một khối được xử lý bởi **mode of operation** — lớp bọc quyết định cách ghép các khối, có cần padding hay không, và có chạy song song được hay không:

| Mode | Cần padding | Chạy song song | Rủi ro chính |
| :--- | :--- | :--- | :--- |
| **CBC** | Có, cho khối cuối | Giải mã song song, mã hóa tuần tự | IV đoán được, rò rỉ qua lỗi padding |
| **CTR** | Không | Có | Tái sử dụng nonce làm lộ XOR hai bản rõ |
| **GCM** | Không | Có | Tái sử dụng nonce phá cả bí mật lẫn xác thực |

Nhờ mode, cùng một khóa `256 bit` bảo vệ được dữ liệu lớn tùy ý. Chi tiết từng mode ở bài [Mode of Operation và AEAD cho AES](../02_symmetric/aes_modes_aead.md).

**Với OTP**, quan hệ ngược lại: khóa phải ngẫu nhiên thực sự, giữ bí mật, chỉ dùng một lần và **dài đúng bằng bản rõ**. Phép toán chỉ là XOR:

```text
Mã hóa:  C = P XOR K
Giải mã: P = C XOR K
```

Vì mỗi bit khóa chỉ dùng một lần và không có cấu trúc, bản mã không tiết lộ gì về bản rõ, kể cả với kẻ tấn công có vô hạn thời gian — tính chất này gọi là **perfect secrecy**. Cái giá là phải tạo, phân phối và bảo vệ một lượng khóa bằng đúng lượng dữ liệu, nên OTP chỉ dùng trong trường hợp đặc biệt.

> [!WARNING]
> **AES** không hoạt động như **OTP**. AES dùng một khóa ngắn, cố định để thực hiện nhiều phép biến đổi trên dữ liệu, nên khóa AES không cần dài bằng thông điệp. Ngược lại, dùng lại một khóa OTP cho hai thông điệp là lỗi thảm họa, còn dùng lại khóa AES cho nhiều thông điệp với nonce mới là thiết kế bình thường.

---

## Nguyên lý chung của mật mã hiện đại

Mật mã hiện đại không có quy tắc chung buộc độ dài khóa bằng độ dài dữ liệu. Mỗi họ thuật toán có mô hình xử lý độ dài riêng:

| Họ thuật toán | Cách xử lý độ dài | Quan hệ giữa khóa và dữ liệu |
| :--- | :--- | :--- |
| **Mật mã khối** (ví dụ **AES**) | Biến đổi từng khối cố định, mode lo phần thông điệp dài | Một khóa ngắn điều khiển nhiều khối |
| **Stream Cipher** | Sinh dòng khóa từ khóa bí mật và nonce rồi kết hợp với dữ liệu | Dữ liệu có thể dài hơn khóa rất nhiều |
| **MAC** | Tạo mã xác thực từ khóa và thông điệp | Khóa cố định, thông điệp tùy ý |
| **KDF** | Dẫn xuất khóa mới từ vật liệu bí mật | Đầu ra phục vụ mục đích sử dụng chứ không sao chép độ dài đầu vào |
| **Chữ ký số** | Ký bằng khóa riêng, kiểm tra bằng khóa công khai | Không yêu cầu khóa dài bằng thông điệp |
| **Trao đổi khóa** | Thiết lập vật liệu khóa chung qua giao thức | Không gửi trực tiếp khóa dài bằng thông điệp |

Những thành phần này giải quyết các mục tiêu khác nhau (bảo mật nội dung, toàn vẹn, xác thực nguồn gốc, dẫn xuất khóa, chống chối bỏ). Vì vậy không thể lấy quy tắc kích thước khối của **AES** rồi áp cho hàm băm hay chữ ký số, và càng không thể lấy quy tắc của **OTP** rồi áp cho toàn bộ mật mã.

---

## Độ dài khóa được chọn dựa trên điều gì

Trong thực tế, độ dài khóa được chọn dựa trên mức bảo mật mục tiêu, thuật toán cụ thể, yêu cầu hiệu năng và giới hạn triển khai. Về mặt lý thuyết, số khóa có thể có là `2^128` với **AES-128** và `2^256` với **AES-256**; con số này nói về không gian khóa, không phải số byte dữ liệu mà mỗi khóa mã hóa được.

Độ dài khóa cũng không phải yếu tố duy nhất quyết định bảo mật. Hệ thống còn phải dùng mode phù hợp, quản lý khóa an toàn, bảo đảm nonce đáp ứng yêu cầu thuật toán và kiểm tra toàn vẹn khi cần.

> [!TIP]
> Khi đọc một thiết kế mật mã, hãy tách riêng bốn câu hỏi: khóa dài bao nhiêu, khối hoặc dòng khóa xử lý ra sao, thông điệp dài bao nhiêu, nonce và tag nào đi kèm. Trộn lẫn chúng là nguồn gốc của hầu hết hiểu lầm về độ dài.

---

## Tổng kết

- Khóa `n` bit có `2^n` giá trị, và thêm `1` bit là gấp đôi khối lượng tìm kiếm vét cạn.
- Kích thước khóa, kích thước khối, kích thước đầu ra, nonce/IV và độ dài thông điệp là năm đại lượng độc lập; mỗi con số trong tên thuật toán chỉ nói về một trong số đó.
- `AES-256` không so sánh trực tiếp được với `RSA-2048`: phải quy về **security strength**, và theo thang đó `AES-256` tương đương `RSA-15360`, còn `RSA-2048` chỉ ngang `AES-128`.
- Hash cho thấy rõ nhất đầu ra cố định: đầu vào `1 byte` hay `3 MB` đều cho `256 bit` với **SHA-256**.
- Hiểu lầm "dữ liệu phải dài bằng khóa" đến từ việc khái quát hóa **OTP** thành quy tắc chung; **AES** dùng khóa ngắn và để mode xử lý độ dài.
- Độ dài khóa được chọn theo mức bảo mật mục tiêu, thuật toán, hiệu năng và giới hạn triển khai, không theo độ dài dữ liệu.

---

## Related

* [Tổng quan Encryption](./encryption_overview.md) — cùng trục phân loại hai họ mã hóa, nơi khóa đóng hai vai trò khác nhau.
* [Chi tiết thuật toán AES](../02_symmetric/aes.md) — cùng chủ đề ba cỡ khóa và khối cố định `128 bit`, ở mức tính chất thuật toán.
* [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md) — cùng chủ đề đọc cỡ modulus và giới hạn dữ liệu, ở phía bất đối xứng.
* [Mode of Operation và AEAD cho AES](../02_symmetric/aes_modes_aead.md) — cùng chủ đề xử lý thông điệp dài hơn một khối, đi vào từng mode và lỗi nonce.

---
[← Back to README](README.md)
