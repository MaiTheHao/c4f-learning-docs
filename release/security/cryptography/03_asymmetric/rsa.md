# RSA: Tính chất, Giới hạn và các Vấn đề Triển khai

## Table of Contents

- [RSA giải quyết bài toán gì](#rsa-giải-quyết-bài-toán-gì)
- [Cặp khóa hình thành như thế nào](#cặp-khóa-hình-thành-như-thế-nào)
- [Tính chất cốt lõi](#tính-chất-cốt-lõi)
- [Vì sao RSA bắt buộc phải có padding](#vì-sao-rsa-bắt-buộc-phải-có-padding)
- [Ưu điểm](#ưu-điểm)
- [Nhược điểm và giới hạn](#nhược-điểm-và-giới-hạn)
- [Các vấn đề khi triển khai](#các-vấn-đề-khi-triển-khai)
- [RSA trong hệ thống hiện đại](#rsa-trong-hệ-thống-hiện-đại)
- [Chọn cỡ khóa như thế nào](#chọn-cỡ-khóa-như-thế-nào)
- [Tổng kết](#tổng-kết)
- [Related](#related)

**RSA** là thuật toán bất đối xứng lâu đời và phổ biến nhất, nhưng giá trị thực tế của nó không nằm ở việc "mã hóa dữ liệu" như nhiều tài liệu nhập môn trình bày. RSA giải quyết bài toán **thiết lập niềm tin giữa hai bên chưa chia sẻ bí mật**, và trong hệ thống hiện đại nó chủ yếu xuất hiện ở vai trò chữ ký số. Bài này giữ phần số học ở mức đủ để hiểu cặp khóa, rồi tập trung vào tính chất, giới hạn và các lỗi triển khai.

---

## RSA giải quyết bài toán gì

Mã hóa đối xứng như **AES** rất nhanh nhưng có một điểm yếu chí mạng: hai bên phải có cùng một khóa trước khi bắt đầu. Nếu kênh truyền đủ an toàn để gửi khóa thì không cần mã hóa nữa. Đây là bài toán phân phối khóa.

RSA giải bài toán đó bằng cách tách vai trò của hai khóa. Một khóa **công khai** có thể phát cho bất kỳ ai, dùng để mã hóa hoặc kiểm tra chữ ký. Một khóa **bí mật** do người sở hữu giữ, dùng để giải mã hoặc tạo chữ ký. Kẻ tấn công có khóa công khai vẫn không suy ra được khóa bí mật, vì suy ngược đòi hỏi phân tích một số nguyên rất lớn ra thừa số nguyên tố.

Điều này khiến RSA hữu dụng cho ba việc: trao đổi khóa trong giao thức cũ, ký số, và xác thực danh tính qua chứng chỉ. Nó không phù hợp để mã hóa khối lượng dữ liệu lớn, và lý do nằm ở chính cấu trúc toán học của nó.

---

## Cặp khóa hình thành như thế nào

Ở mức khái niệm, quy trình gồm bốn bước:

1. Chọn hai số nguyên tố rất lớn $p$ và $q$, giữ bí mật.
2. Tính modulus $n = p \times q$, công khai $n$ cùng số mũ mã hóa $e$.
3. Tính số mũ giải mã $d$ sao cho $e \times d \equiv 1$ theo modulo $\varphi(n) = (p-1)(q-1)$.
4. Công bố cặp $(n, e)$ làm khóa công khai, giữ $(n, d)$ làm khóa bí mật.

Hai phép toán định nghĩa toàn bộ thuật toán:

| Thao tác | Công thức | Dùng khóa nào |
| :--- | :--- | :--- |
| Mã hóa hoặc kiểm tra chữ ký | $C = M^e \bmod n$ | Công khai $(n, e)$ |
| Giải mã hoặc tạo chữ ký | $M = C^d \bmod n$ | Bí mật $(n, d)$ |

Không cần đi vào từng bước tính toán để thấy điểm mấu chốt: **mọi giá trị đều là số nguyên nhỏ hơn $n$**. Đây là nguồn gốc của mọi giới hạn thực tế của RSA.

> [!NOTE]
> Các chuẩn hiện đại (RFC 8017 cho PKCS#1, FIPS 186-5, SP 800-56B) định nghĩa khóa hợp lệ qua $\lambda(n) = \mathrm{lcm}(p-1, q-1)$ thay vì $\varphi(n)$. Giá trị $d$ tính theo $\varphi(n)$ vẫn thỏa điều kiện của PKCS#1, nhưng có thể không thỏa kiểm tra $d < \lambda(n)$ của SP 800-56B. Với mục đích học tập, dùng $\varphi(n)$ dễ hiểu hơn; với mục đích triển khai, hãy dùng thư viện chuẩn thay vì tự sinh khóa.

---

## Tính chất cốt lõi

| Tính chất | Giá trị hoặc đặc điểm | Hệ quả thực tế |
| :--- | :--- | :--- |
| **Cơ sở an toàn** | Độ khó phân tích số nguyên lớn ra thừa số | Không có thuật toán hiệu quả đã biết; an toàn phụ thuộc cỡ modulus |
| **Loại phép toán** | Lũy thừa modulo trên số nguyên lớn | Chậm hơn AES nhiều bậc; chỉ dùng cho dữ liệu nhỏ |
| **Kích thước bản rõ** | Nhỏ hơn modulus, trừ overhead padding | Với modulus `2048 bit`, bản rõ còn khoảng `190 byte` khi dùng OAEP-SHA256 |
| **Tính xác định** | Không padding thì cùng đầu vào cho cùng đầu ra | Bắt buộc phải có padding ngẫu nhiên; nếu không sẽ lộ và bị sửa có chủ đích |
| **Tính nhân** | $E(a) \times E(b) = E(a \times b)$ | Bản mã bị biến đổi có thể tạo ra bản rõ có quan hệ đã biết; là cơ sở của nhiều tấn công |
| **Bất đối xứng** | Hai khóa khác nhau cho hai chiều | Giải quyết phân phối khóa nhưng chi phí quản lý khóa cao hơn |
| **Không cần bí mật chung trước** | Chỉ cần khóa công khai đáng tin | Cần hạ tầng chứng chỉ hoặc kênh xác thực khóa công khai |

Cần phân biệt hai chế độ dùng RSA, vì chúng có yêu cầu khác nhau:

| Chế độ | Khóa dùng để làm gì | Yêu cầu bắt buộc |
| :--- | :--- | :--- |
| **Mã hóa** | Mã hóa bằng khóa công khai, giải mã bằng khóa bí mật | Padding ngẫu nhiên như **OAEP** |
| **Chữ ký** | Tạo chữ ký bằng khóa bí mật, kiểm tra bằng khóa công khai | Padding xác định như **PSS**, ký trên hash của thông điệp |

---

## Vì sao RSA bắt buộc phải có padding

Nếu dùng trực tiếp $C = M^e \bmod n$, thuật toán **textbook RSA** có ba tính chất nguy hiểm:

1. **Xác định**: cùng thông điệp luôn cho cùng bản mã. Kẻ tấn công có thể nhận biết hai bản ghi giống nhau, hoặc thử đoán nội dung bằng cách mã hóa lại ứng viên.
2. **Nhân**: từ $C_1 = M_1^e$ và $C_2 = M_2^e$ có thể tạo $C_1 \times C_2 = (M_1 \times M_2)^e$, tức là tạo ra bản mã hợp lệ của một thông điệp chưa từng được mã hóa.
3. **Không có xác thực**: không có cách nào phát hiện bản mã bị sửa hoặc bị ghép từ nhiều phần.

Padding giải quyết cả ba bằng cách chèn dữ liệu ngẫu nhiên có cấu trúc vào trước thông điệp, rồi kiểm tra cấu trúc đó khi giải mã. Hai chuẩn cần biết:

| Padding | Dùng cho | Trạng thái |
| :--- | :--- | :--- |
| **OAEP** | Mã hóa | Được khuyến nghị |
| **PKCS#1 v1.5** | Mã hóa, chữ ký | Bị NIST loại bỏ cho trao đổi khóa từ 2023; chỉ còn trong hệ thống cũ, có lớp tấn công **Bleichenbacher** và biến thể **ROBOT** |
| **PSS** | Chữ ký | Được khuyến nghị |

> [!WARNING]
> Không có "RSA an toàn" mà không có padding đúng. Các lỗi triển khai nổi tiếng nhất của RSA đều nằm ở tầng padding và cách xử lý lỗi giải mã, không nằm ở phép lũy thừa modulo.

---

## Ưu điểm

- **Giải quyết phân phối khóa**: không cần chia sẻ bí mật trước, điều mà mã hóa đối xứng không làm được.
- **Hỗ trợ cả mã hóa và chữ ký**: một cặp khóa phục vụ hai mục đích, dù không nên dùng cùng một khóa cho cả hai.
- **Kiểm tra chữ ký rẻ**: khi số mũ công khai nhỏ, xác minh chữ ký nhanh hơn tạo chữ ký đáng kể, phù hợp với hệ thống phải xác thực nhiều.
- **Được hỗ trợ rộng rãi**: có trong mọi thư viện, mọi hệ điều hành, mọi thiết bị, kể cả hệ thống cũ.
- **Nền tảng toán học đơn giản để giải thích**: chỉ cần số học modulo, không cần cấu trúc đại số phức tạp.

---

## Nhược điểm và giới hạn

- **Chậm**: lũy thừa modulo trên số vài nghìn bit tốn thời gian gấp nhiều bậc so với AES. Mã hóa vài kilobyte bằng RSA là lựa chọn sai về hiệu năng.
- **Dữ liệu rất nhỏ**: bản rõ phải nhỏ hơn modulus trừ overhead padding. Với khóa `2048 bit`, giới hạn thực tế chỉ khoảng vài trăm byte.
- **Bản mã phình to**: một giá trị nhỏ cũng chiếm toàn bộ kích thước modulus, nên chi phí lưu trữ và băng thông cao.
- **Padding là bắt buộc và phức tạp**: chọn sai padding hoặc xử lý lỗi sai cách sẽ tạo lỗ hổng nghiêm trọng.
- **Khóa lớn dần theo thời gian**: để giữ mức an toàn, modulus phải tăng, kéo theo chi phí tính toán và kích thước chữ ký.
- **Không kháng quantum**: thuật toán Shor phá được RSA trên máy tính lượng tử đủ lớn. Đây là lý do ngành đang chuyển sang **PQC**.
- **Quản lý khóa phức tạp**: cần hạ tầng chứng chỉ, thu hồi, xoay vòng và bảo vệ khóa bí mật.

---

## Các vấn đề khi triển khai

**1. Dùng textbook RSA.** Không padding thì mọi tính chất nguy hiểm ở trên đều xuất hiện. Đây là lỗi của bài tập và của thư viện tự viết.

**2. Dùng PKCS#1 v1.5 cho mã hóa trong hệ thống mới.** Padding này có lịch sử tấn công lâu dài. Nếu hệ thống còn dùng, cần biết rằng thông báo lỗi khác nhau giữa các trường hợp giải mã có thể đủ để phá.

**3. Dùng chung một khóa cho mã hóa và chữ ký.** Hai mục đích có yêu cầu padding và mô hình đe dọa khác nhau. Nên tách khóa.

**4. Số mũ công khai tùy tiện.** Giá trị $e$ nhỏ bất thường hoặc không nguyên tố cùng nhau với $\varphi(n)$ tạo ra khóa không hợp lệ hoặc yếu. Dùng giá trị chuẩn do thư viện chọn.

**5. Rò rỉ qua thời gian.** Phép lũy thừa modulo có thể bị đo thời gian để suy ra khóa nếu triển khai không constant-time. Các thư viện lớn đã xử lý, nhưng triển khai trong môi trường nhúng hoặc code tự viết thì không.

**6. Lẫn lộn giữa "mã hóa" và "ký".** Ký bằng khóa công khai hoặc giải mã bằng khóa bí mật của người khác là lỗi mô hình, không phải lỗi toán học, nhưng dẫn tới hậu quả tương đương.

**7. Bỏ qua kiểm tra chứng chỉ.** Khóa công khai chỉ có giá trị khi biết chắc nó thuộc về ai. Bỏ qua chuỗi chứng chỉ hoặc kiểm tra tên miền làm toàn bộ mô hình sụp đổ, bất kể RSA mạnh đến đâu.

---

## RSA trong hệ thống hiện đại

Vai trò của RSA đã thay đổi rõ rệt trong thập niên gần đây:

| Bối cảnh | Vai trò của RSA hiện nay |
| :--- | :--- |
| **TLS 1.3** | Chỉ dùng để **ký** handshake qua chứng chỉ; trao đổi khóa dùng ephemeral Diffie–Hellman để có forward secrecy |
| **TLS 1.2 và cũ** | Có thể dùng RSA để **mã hóa khóa phiên**, nhưng cách này đang bị loại bỏ vì mất forward secrecy |
| **Chứng chỉ và PKI** | Vẫn phổ biến, thường ở dạng chữ ký trên chứng chỉ |
| **Chữ ký văn bản, mã nguồn, gói phần mềm** | Phổ biến, cạnh tranh với ECDSA và EdDSA |
| **Mã hóa dữ liệu lớn** | Không phù hợp; luôn dùng mô hình lai với AES |

Xu hướng dài hạn là giảm dần vai trò của RSA: chuyển sang đường cong elliptic cho chữ ký và trao đổi khóa, đồng thời chuẩn bị các thuật toán kháng lượng tử. Bài [TLS: Bắt tay, Forward Secrecy và Vai trò của Chứng chỉ](../04_protocols/tls_handshake.md) trình bày bức tranh này ở tầng giao thức.

---

## Chọn cỡ khóa như thế nào

| Cỡ modulus | Mức bảo mật tương đương | Trạng thái khuyến nghị |
| :--- | :--- | :--- |
| `1024 bit` | Yếu | Không dùng |
| `2048 bit` | Khoảng `112 bit` đối xứng | Mức tối thiểu chấp nhận được, phù hợp hệ thống cũ |
| `3072 bit` | Khoảng `128 bit` đối xứng | Nên dùng cho hệ thống mới cần tuân thủ |
| `4096 bit` | Trên `128 bit` | Dùng khi cần biên dài hạn; chi phí cao hơn rõ rệt |

Ba lưu ý khi chọn:

- Cỡ khóa chỉ là một trục. Padding, cách sinh số nguyên tố, chất lượng nguồn ngẫu nhiên và bảo vệ khóa bí mật quan trọng không kém.
- Tăng gấp đôi cỡ khóa không làm chi phí tăng gấp đôi; phép lũy thừa modulo tăng nhanh hơn, nên `4096 bit` có thể chậm hơn `2048 bit` vài lần.
- Với mục tiêu chống lượng tử, tăng cỡ khóa RSA không phải giải pháp thực tế. Cần chuyển sang thuật toán kháng lượng tử.

---

## Tổng kết

- RSA giải bài toán **phân phối khóa và thiết lập niềm tin**, không phải bài toán mã hóa dữ liệu lớn.
- Cặp khóa dựa trên quan hệ giữa $n = p \times q$, $e$ và $d$; mọi giá trị đều nhỏ hơn $n$, nên dữ liệu phải nhỏ hơn modulus.
- **Padding là bắt buộc.** OAEP cho mã hóa, PSS cho chữ ký; PKCS#1 v1.5 chỉ còn trong hệ thống cũ.
- Điểm yếu thực tế thường nằm ở triển khai: thông báo lỗi, side-channel, kiểm tra chứng chỉ, quản lý khóa.
- Trong hệ thống hiện đại, RSA chủ yếu là thuật toán **chữ ký**; mã hóa dữ liệu thuộc về AES trong mô hình lai.

---

## Related

* [Chi tiết thuật toán AES](../02_symmetric/aes.md) — cùng câu hỏi chọn cỡ khóa và giới hạn sử dụng, ở phía đối xứng nhanh nhưng cần khóa chung.
* [Các con số trong mật mã: Kích thước khóa, khối, đầu ra và Mức an toàn](../01_foundations/cryptographic_sizes.md) — cùng chủ đề đọc cỡ modulus RSA và so sánh nó với cỡ khóa đối xứng qua **security strength**.
* [Các Cipher Level trong CryptDB](../05_encrypted_query/cryptdb_cipher_levels.md) — cùng họ mã hóa bất đối xứng, nơi biến thể **HOM** dựa trên cơ chế số học tương tự RSA.
* [TLS: Bắt tay, Forward Secrecy và Vai trò của Chứng chỉ](../04_protocols/tls_handshake.md) — nơi RSA chuyển từ mã hóa khóa phiên sang ký xác thực handshake.

---
[← Back to README](README.md)
