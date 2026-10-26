# Vì sao độ dài dữ liệu không cần bằng độ dài khóa

---

## Table of Contents

- [Hiểu lầm phổ biến](#hiểu-lầm-phổ-biến)
- [AES và khác biệt giữa khối và khóa](#aes-và-khác-biệt-giữa-khối-và-khóa)
- [AES xử lý dữ liệu dài hơn một khối](#aes-xử-lý-dữ-liệu-dài-hơn-một-khối)
- [Vì sao OTP yêu cầu khóa dài bằng bản rõ](#vì-sao-otp-yêu-cầu-khóa-dài-bằng-bản-rõ)
- [Nguyên lý chung của mật mã hiện đại](#nguyên-lý-chung-của-mật-mã-hiện-đại)
- [Độ dài khóa được chọn dựa trên điều gì](#độ-dài-khóa-được-chọn-dựa-trên-điều-gì)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Bài này làm rõ một hiểu lầm phổ biến cho rằng dữ liệu đầu vào phải dài bằng khóa. Trọng tâm là phân biệt bốn đại lượng khác nhau (kích thước khối, kích thước khóa, độ dài thông điệp, tham số bổ sung) qua hai ví dụ đối lập là **AES** và **One-Time Pad**, sau đó khái quát thành nguyên lý chọn độ dài khóa trong mật mã hiện đại.

---

## Hiểu lầm phổ biến

Khi mới học mật mã, nhiều người mặc định rằng input càng dài thì key phải càng dài theo. Suy nghĩ này thường đến từ việc khái quát hóa một trường hợp đặc biệt thành quy tắc chung.

Cách tiếp cận đúng là đặt ba câu hỏi riêng cho mỗi thuật toán (thuật toán thuộc loại nào, nó xử lý dữ liệu theo cơ chế nào, kích thước khóa và các tham số bổ sung được quy định ra sao). Khi trả lời xong ba câu hỏi này thì quan hệ giữa độ dài dữ liệu và độ dài khóa tự trở nên rõ ràng.

> [!NOTE]
> Khối dữ liệu, khóa, thông điệp, nonce và tag là các đại lượng có vai trò khác nhau. Chúng có thể liên quan về mặt thiết kế nhưng không bắt buộc bằng nhau.

---

## AES và khác biệt giữa khối và khóa

**AES** là thuật toán **symmetric block cipher**. Chuẩn này quy định hai khái niệm độc lập là kích thước khối và kích thước khóa.

| Đại lượng | Giá trị trong AES | Vai trò |
| :--- | :--- | :--- |
| **Kích thước khối** | Cố định `128 bit` (tương đương `16 byte`) | Lượng dữ liệu được biến đổi trong một lần gọi phép mã hóa khối |
| **Kích thước khóa** | Một trong `128`, `192` hoặc `256 bit` | Thông tin bí mật điều khiển quá trình biến đổi |

Ba biến thể khóa tương ứng với ba độ dài byte khác nhau.

```text
AES-128 sử dụng khóa 128 bit (16 byte).
AES-192 sử dụng khóa 192 bit (24 byte).
AES-256 sử dụng khóa 256 bit (32 byte).
```

Điểm cần nhớ là khối dữ liệu luôn dài `16 byte` trong cả ba biến thể. Ví dụ khi dùng **AES-256** thì khóa dài `32 byte` nhưng mỗi khối được xử lý vẫn chỉ dài `16 byte`. Điều này hoàn toàn bình thường vì khối là thứ được biến đổi còn khóa là thứ điều khiển cách biến đổi.

---

## AES xử lý dữ liệu dài hơn một khối

**AES** nguyên bản chỉ định nghĩa phép biến đổi trên một khối `16 byte`. Để mã hóa thông điệp dài tùy ý, hệ thống dùng các **mode of operation** bọc ngoài phép biến đổi khối đó.

Giả sử cần mã hóa thông điệp dài `100 byte`. Vì `100 byte` lớn hơn một khối nên hệ thống phải có cơ chế xử lý toàn bộ thông điệp, và cách xử lý phụ thuộc mode được chọn.

| Mode | Cách xử lý độ dài tùy ý | Có cần padding khi lẻ khối không |
| :--- | :--- | :--- |
| **CBC** thông thường | Biểu diễn dữ liệu thành các khối đầy đủ rồi xâu chuỗi | Thường cần padding cho khối cuối |
| **CTR** | Dùng **AES** để sinh dòng khóa theo bộ đếm rồi XOR với dữ liệu | Không cần padding, dữ liệu có thể dừng giữa khối |
| **GCM** | Kết hợp mã hóa kiểu bộ đếm với xác thực toàn vẹn | Không yêu cầu độ dài là bội số của `16 byte` |

> [!IMPORTANT]
> Cần phân biệt kích thước khối mà thuật toán xử lý với độ dài thông điệp mà hệ thống dùng **AES** có thể bảo vệ. Thông điệp dài không đòi hỏi khóa dài tương ứng. Hệ thống vẫn dùng một khóa đúng quy định rồi để mode lo phần xử lý độ dài.

---

## Vì sao OTP yêu cầu khóa dài bằng bản rõ

**One-Time Pad** (thường viết tắt là **OTP**) là trường hợp đặc biệt, không phải khuôn mẫu chung. Để đạt **perfect secrecy**, mô hình chuẩn của **OTP** yêu cầu khóa ngẫu nhiên thực sự, độc lập với bản rõ, giữ bí mật, chỉ dùng một lần và dài bằng bản rõ.

Trong mô hình nhị phân, quan hệ mã hóa và giải mã dùng phép **XOR** theo từng bit.

Công thức mã hóa và giải mã như sau.

```text
Mã hóa: C = P XOR K
Giải mã: P = C XOR K
```

Trong đó `P` là **plaintext**, `K` là khóa bí mật, `C` là **ciphertext** và **XOR** kết hợp từng bit tương ứng. Vì XOR một giá trị với chính nó cho kết quả bằng không nên XOR bản mã với cùng khóa sẽ khôi phục bản rõ.

Ví dụ nếu bản rõ dài `1000 bit` thì mô hình chuẩn cần `1000 bit` khóa ngẫu nhiên. Thông điệp dài hơn thì cần thêm lượng khóa tương ứng. Cái giá phải trả là bài toán tạo, phân phối, lưu trữ và bảo vệ khóa trở nên rất nặng nề, và tái sử dụng khóa có thể làm lộ quan hệ giữa các bản rõ.

> [!WARNING]
> **AES** không hoạt động theo cơ chế **OTP**. **AES** dùng một khóa có kích thước quy định sẵn để thực hiện nhiều phép biến đổi trên dữ liệu, vì vậy khóa **AES** không cần dài bằng thông điệp.

---

## Nguyên lý chung của mật mã hiện đại

Mật mã hiện đại không có quy tắc chung buộc độ dài khóa bằng độ dài dữ liệu. Mỗi họ thuật toán có mô hình xử lý và tham số riêng.

| Họ thuật toán | Cách xử lý độ dài | Quan hệ giữa khóa và dữ liệu |
| :--- | :--- | :--- |
| **Mật mã khối** (ví dụ **AES**) | Biến đổi từng khối cố định, mode lo phần thông điệp dài | Một khóa ngắn điều khiển nhiều khối |
| **stream cipher** | Sinh dòng khóa từ khóa bí mật và nonce rồi kết hợp với dữ liệu | Dữ liệu có thể dài hơn khóa rất nhiều |
| **cryptographic hash** | Nén đầu vào dài tùy ý thành đầu ra dài cố định | Không có khái niệm khóa dài bằng dữ liệu |
| **MAC** | Tạo mã xác thực từ khóa và thông điệp | Khóa cố định, thông điệp tùy ý |
| **KDF** | Dẫn xuất khóa mới từ vật liệu bí mật | Đầu ra phục vụ mục đích sử dụng chứ không sao chép độ dài đầu vào |
| **Chữ ký số** | Ký bằng khóa riêng, kiểm tra bằng khóa công khai | Không yêu cầu khóa dài bằng thông điệp |
| **Trao đổi khóa** | Thiết lập vật liệu khóa chung qua giao thức | Không gửi trực tiếp khóa dài bằng thông điệp |

Những thành phần này giải quyết các mục tiêu khác nhau (bảo mật nội dung, toàn vẹn, xác thực nguồn gốc, dẫn xuất khóa, chống chối bỏ). Vì vậy không thể lấy quy tắc kích thước khối của **AES** rồi áp cho hàm băm hay chữ ký số, và càng không thể lấy quy tắc của **OTP** rồi áp cho toàn bộ mật mã.

---

## Độ dài khóa được chọn dựa trên điều gì

Trong thực tế, độ dài khóa thường được chọn dựa trên mức bảo mật mục tiêu, thuật toán cụ thể, yêu cầu hiệu năng và giới hạn triển khai.

Ví dụ số lượng khóa có thể có về mặt lý thuyết là `2^128` đối với **AES-128** và `2^256` đối với **AES-256**. Con số này nói về không gian khóa chứ không phải số byte dữ liệu mà mỗi khóa mã hóa được.

Tuy nhiên độ dài khóa không phải yếu tố duy nhất quyết định bảo mật. Hệ thống còn phải dùng mode phù hợp, quản lý khóa an toàn, bảo đảm nonce đáp ứng yêu cầu thuật toán và kiểm tra toàn vẹn khi cần.

Ví dụ **AES-GCM** cung cấp cả bảo mật nội dung và xác thực toàn vẹn. Nonce của **GCM** thường được chọn dài `96 bit` theo khuyến nghị phổ biến còn tag xác thực thường dài `128 bit`. Đây là các tham số có vai trò khác nhau, không đồng nhất với kích thước khóa **AES** hay độ dài thông điệp.

> [!TIP]
> Khi đọc một thiết kế mật mã, hãy tách riêng bốn câu hỏi (khóa dài bao nhiêu, khối hoặc dòng khóa xử lý ra sao, thông điệp dài bao nhiêu, nonce và tag nào đi kèm). Trộn lẫn chúng là nguồn gốc của hầu hết hiểu lầm về độ dài.

---

## Tổng kết

- Hiểu lầm dữ liệu và khóa phải dài bằng nhau xuất phát từ việc khái quát hóa đặc điểm của **OTP** thành quy tắc chung.
- Với **AES**, kích thước khối luôn là `128 bit` trong khi khóa có thể dài `128`, `192` hoặc `256 bit`. Các mode như **CBC**, **CTR**, **GCM** cho phép mã hóa thông điệp dài tùy giới hạn của mode và cách triển khai.
- Với **OTP** trong mô hình chuẩn, khóa phải dài bằng bản rõ để đạt **perfect secrecy**, đi kèm chi phí quản lý khóa rất lớn.
- Cách học đúng là xác định loại thuật toán, cơ chế xử lý dữ liệu, quy định kích thước khóa và vai trò tham số bổ sung, thay vì giả định dữ liệu và khóa luôn bằng nhau.

---

## Related

- [Tổng quan Encryption](introduce.md) (cùng phân loại mã hóa đối xứng và bất đối xứng cùng mô hình **Hybrid Encryption** làm nền cho cách dùng khóa trong thực tế).
- [Các lớp mã hóa trong CryptDB và Onion Encryption](cryptdb_cipher_levels_onion_encryption.md) (cùng nguyên lý **Trade-off** khi chọn cơ chế mã hóa theo mục đích truy vấn thay vì một quy tắc độ dài duy nhất).
- [Chi tiết thuật toán RSA](algorithms/RSA.md) (cùng chủ đề quản lý khóa và quan hệ giữa kích thước khóa với độ an toàn).

---
[← Back to README](README.md)
