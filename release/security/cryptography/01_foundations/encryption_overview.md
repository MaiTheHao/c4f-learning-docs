# Encryption: Tổng quan và Cách chọn họ thuật toán

## Table of Contents

- [Encryption là gì](#encryption-là-gì)
- [Encryption làm được gì và không làm được gì](#encryption-làm-được-gì-và-không-làm-được-gì)
- [Hai họ mã hóa](#hai-họ-mã-hóa)
- [Mã hóa đối xứng](#mã-hóa-đối-xứng)
- [Mã hóa bất đối xứng](#mã-hóa-bất-đối-xứng)
- [Vì sao bất đối xứng chậm hơn](#vì-sao-bất-đối-xứng-chậm-hơn)
- [So sánh trực tiếp](#so-sánh-trực-tiếp)
- [Mã hóa lai: điểm hội tụ](#mã-hóa-lai-điểm-hội-tụ)
- [Ưu điểm và thách thức](#ưu-điểm-và-thách-thức)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Mọi hệ thống có dữ liệu nhạy cảm đều phải trả lời cùng một câu hỏi: làm sao để người không có quyền không đọc được dữ liệu, trong khi hệ thống vẫn dùng được dữ liệu đó bình thường. Bài này đặt nền cho toàn bộ chuyên đề: **Encryption** bảo vệ cái gì, hai họ thuật toán khác nhau ở đâu, và vì sao hệ thống thực tế luôn dùng cả hai. Các chi tiết về thuật toán cụ thể được tách sang chương riêng để bài này giữ được vai trò định hướng.

---

## Encryption là gì

**Encryption** là phép biến đổi dữ liệu gốc (**Plaintext**) thành dạng không đọc được (**Ciphertext**) bằng một thuật toán và một khóa. Chỉ ai có khóa phù hợp mới đảo ngược được phép biến đổi.

| Thành phần | Vai trò |
| :--- | :--- |
| **Plaintext** | Dữ liệu gốc: văn bản, file, payload API |
| **Encryption Algorithm** | Quy tắc biến đổi, công khai và được phân tích rộng rãi |
| **Key** | Thông tin bí mật điều khiển phép biến đổi |
| **Ciphertext** | Kết quả sau biến đổi, không đọc được nếu thiếu khóa |

Nguyên tắc quan trọng nhất của mật mã hiện đại: **thuật toán công khai, chỉ khóa là bí mật**. Một thuật toán chỉ an toàn khi bị giữ bí mật thì không được coi là an toàn, vì nó sẽ bị lộ và không có ai kiểm chứng được nó.

---

## Encryption làm được gì và không làm được gì

Đây là chỗ nhiều tài liệu nhập môn gây hiểu lầm. Encryption **không** tự nó đáp ứng mọi mục tiêu an toàn. Mỗi mục tiêu cần một cơ chế riêng:

| Mục tiêu | Encryption thuần có đáp ứng | Cơ chế thực sự cần |
| :--- | :--- | :--- |
| **Confidentiality** (không ai đọc được nội dung) | Có | Encryption |
| **Integrity** (phát hiện dữ liệu bị sửa) | Không | MAC hoặc chế độ **AEAD** |
| **Authentication** (biết dữ liệu đến từ ai) | Không | MAC, chữ ký số, hoặc chứng chỉ |
| **Non-repudiation** (không thể phủ nhận đã gửi) | Không | Chữ ký số |
| **Access Control** (ai được đọc ghi cái gì) | Không | Tầng phân quyền và quản lý khóa |

Hệ quả thực tế: mã hóa mà không xác thực toàn vẹn có thể bị sửa mà bên nhận không biết. Đó là lý do các chế độ hiện đại như **AES-GCM** trả về cả bản mã lẫn tag xác thực, và lý do chữ ký số tồn tại như một cơ chế độc lập với mã hóa.

> [!IMPORTANT]
> "Đã mã hóa" không đồng nghĩa "đã an toàn". Cần biết rõ hệ thống đang bảo vệ mục tiêu nào trong bảng trên, và cơ chế nào chịu trách nhiệm cho mục tiêu đó.

---

## Hai họ mã hóa

Mọi thuật toán mã hóa hiện đại thuộc một trong hai họ, phân biệt bởi cách tổ chức khóa:

| Họ | Cách tổ chức khóa | Bài toán nó giải |
| :--- | :--- | :--- |
| **Mã hóa đối xứng** | Một khóa dùng cho cả hai chiều | Bảo vệ dữ liệu với chi phí thấp |
| **Mã hóa bất đối xứng** | Một cặp khóa, mỗi khóa một vai trò | Thiết lập niềm tin khi chưa có bí mật chung |

Cách phân loại này quan trọng hơn danh sách thuật toán, vì nó quyết định **loại vấn đề** mà mỗi họ có thể giải. Nhớ tên thuật toán mà không nhớ họ của nó thường dẫn tới chọn sai công cụ.

---

## Mã hóa đối xứng

Hai bên dùng **cùng một khóa bí mật** để mã hóa và giải mã. Đây là họ nhanh nhất và được dùng cho gần như toàn bộ dữ liệu thực tế.

**Đặc điểm cần nhớ**

- Một khóa cho cả hai chiều, nên khóa phải đến được cả hai phía qua kênh an toàn.
- Tốc độ cao, phù hợp mã hóa đĩa, cơ sở dữ liệu và lưu lượng mạng.
- Bản thân thuật toán không cho biết dữ liệu có bị sửa hay không; cần thêm cơ chế xác thực.
- Vấn đề khó nhất không phải thuật toán mà là **phân phối và quản lý khóa**.

**Thuật toán tiêu biểu:** **AES** là chuẩn phổ biến nhất hiện nay; các thuật toán cũ như **3DES** và **Blowfish** chỉ còn trong hệ thống legacy. Chi tiết về tính chất và các lỗi triển khai của AES nằm ở bài [Chi tiết thuật toán AES](../02_symmetric/aes.md).

---

## Mã hóa bất đối xứng

Mỗi bên có một cặp khóa: **Public Key** phát công khai và **Private Key** giữ bí mật. Khóa này không thay thế được khóa kia.

**Đặc điểm cần nhớ**

- Không cần chia sẻ bí mật trước, chỉ cần khóa công khai đáng tin.
- Chậm hơn nhiều so với mã hóa đối xứng, vì phép toán trên số lớn.
- Chỉ chứa được dữ liệu nhỏ hơn modulus, trừ overhead padding.
- Cung cấp thêm khả năng chữ ký số, thứ mà mã hóa đối xứng không có.

**Thuật toán tiêu biểu:** **RSA** dựa trên độ khó phân tích số nguyên lớn; **ECC** dựa trên logarit rời rạc trên đường cong elliptic và đạt cùng mức an toàn với khóa ngắn hơn nhiều. **DSA** chỉ dùng cho chữ ký. Chi tiết về tính chất, padding và giới hạn của RSA nằm ở bài [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md).

---

## Vì sao bất đối xứng chậm hơn

Sự chênh lệch hiệu năng không phải do triển khai kém mà do bản chất phép toán:

| Họ | Loại phép toán | Chi phí |
| :--- | :--- | :--- |
| **Đối xứng** | Thay thế, hoán vị, XOR trên từng khối nhỏ | Tuyến tính theo độ dài dữ liệu, rất thấp |
| **Bất đối xứng** | Lũy thừa modulo trên số nguyên hàng nghìn bit | Tăng nhanh theo kích thước khóa, rất cao |

Hệ quả là khoảng cách hiệu năng có thể lên tới nhiều bậc. Vì vậy không có thiết kế hợp lý nào dùng mã hóa bất đối xứng cho dữ liệu lớn. Vai trò của nó là **thiết lập khóa và xác thực**, không phải bảo vệ nội dung.

Chi tiết về cấu trúc bên trong của từng thuật toán được trình bày ở hai chương [Thuật toán đối xứng](../02_symmetric/README.md) và [Thuật toán bất đối xứng](../03_asymmetric/README.md), nơi trọng tâm là tính chất và vấn đề triển khai thay vì từng bước biến đổi.

---

## So sánh trực tiếp

| Tiêu chí | Mã hóa đối xứng | Mã hóa bất đối xứng |
| :--- | :--- | :--- |
| **Số khóa** | Một khóa chung | Một cặp khóa |
| **Tốc độ** | Rất cao | Thấp hơn nhiều bậc |
| **Kích thước dữ liệu** | Tùy ý, qua mode | Nhỏ hơn modulus |
| **Phân phối khóa** | Khó: cần kênh an toàn trước | Giải được bằng khóa công khai |
| **Xác thực toàn vẹn** | Cần MAC hoặc AEAD | Không tự có; cần chữ ký số |
| **Chống chối bỏ** | Không | Có, qua chữ ký |
| **Chi phí quản lý khóa** | Tăng theo số bên tham gia | Tăng theo hạ tầng chứng chỉ |
| **Ảnh hưởng của quantum** | Giảm biên, có thể bù bằng khóa dài hơn | Bị phá bởi thuật toán Shor |
| **Thuật toán tiêu biểu** | AES | RSA, ECC, DSA |

Điểm cần nhớ: hai họ không thay thế nhau. Bảng này cho thấy chúng giải hai lớp bài toán khác nhau.

---

## Mã hóa lai: điểm hội tụ

Mọi giao thức thực tế đều dùng **mã hóa lai**: tầng bất đối xứng để thiết lập khóa và xác thực, tầng đối xứng để bảo vệ dữ liệu.

Ví dụ với HTTPS:

1. Client và server thương lượng thuật toán.
2. Hai bên thiết lập một bí mật chung chỉ tồn tại trong phiên.
3. Từ bí mật chung, mỗi bên dẫn xuất khóa phiên đối xứng.
4. Toàn bộ dữ liệu HTTP được mã hóa và xác thực bằng khóa phiên đó.

Trong TLS hiện đại, khóa dài hạn của server chỉ dùng để **ký** handshake, không dùng để mã hóa khóa phiên. Điều này mang lại **forward secrecy**: lộ khóa dài hạn trong tương lai không làm lộ các phiên đã kết thúc.

Khái niệm mô hình lai ở [Mã hóa lai](./hybrid_encryption.md); luồng bắt tay TLS ở [TLS](../04_protocols/tls_handshake.md); lộ trình kháng lượng tử ở [Mật mã kháng lượng tử](../04_protocols/post_quantum_transition.md).

---

## Ưu điểm và thách thức

**Ưu điểm**

- Bảo vệ dữ liệu cả khi truyền (**Data in Transit**) lẫn khi lưu trữ (**Data at Rest**).
- Giảm thiệt hại khi dữ liệu bị lộ ở tầng lưu trữ hoặc sao lưu.
- Là điều kiện bắt buộc của nhiều chuẩn tuân thủ.
- Có thể triển khai ở nhiều tầng: ứng dụng, database, ổ đĩa, mạng.

**Thách thức**

- **Quản lý khóa** là chi phí lớn nhất: sinh, lưu trữ, phân quyền, xoay vòng, thu hồi.
- **Hiệu năng**: chọn sai thuật toán hoặc sai mode làm tăng CPU và độ trễ.
- **Phức tạp triển khai**: mode, IV, nonce, padding, xác thực toàn vẹn đều có thể bị dùng sai.
- **Giới hạn của mô hình đe dọa**: mã hóa không bảo vệ dữ liệu khi hệ thống đã bị chiếm quyền và khóa đang nằm trong bộ nhớ.
- **Chuyển đổi thuật toán**: hạ tầng cũ, chứng chỉ và thiết bị nhúng làm việc nâng cấp kéo dài nhiều năm.

---

## Tổng kết

- Encryption bảo vệ **confidentiality**; integrity, authentication và non-repudiation cần cơ chế bổ sung.
- Hai họ thuật toán giải hai lớp bài toán khác nhau: đối xứng cho tốc độ, bất đối xứng cho thiết lập niềm tin.
- Bất đối xứng chậm vì phép toán trên số lớn, nên không dùng cho dữ liệu khối lượng lớn.
- Hệ thống thực tế luôn dùng **mã hóa lai**, và TLS hiện đại đã bỏ mô hình mã hóa khóa phiên bằng RSA để có forward secrecy.
- Quản lý khóa và lỗi cấu hình là rủi ro thực tế lớn hơn mọi yếu điểm lý thuyết của thuật toán.

---

## Related

* [Mã hóa lai](./hybrid_encryption.md) — cùng mô hình kết hợp hai họ thuật toán, đi sâu vào hai nghĩa của "lai" và nguyên tắc bất đối xứng chỉ chạm vào khóa.
* [Các con số trong mật mã: Kích thước khóa, khối, đầu ra và Mức an toàn](./cryptographic_sizes.md) — cùng câu hỏi tách bạch kích thước khóa, kích thước khối và độ dài thông điệp, đi từ cách đọc các con số.
* [Truy vấn trên dữ liệu mã hóa](../05_encrypted_query/cryptdb_cipher_levels.md) — cùng nguyên lý **Trade-off** giữa khả năng dùng dữ liệu và mức độ rò rỉ thông tin.

---
[← Back to README](README.md)
