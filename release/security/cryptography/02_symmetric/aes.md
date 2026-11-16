# AES: Tính chất, Mode và các Vấn đề Triển khai

## Table of Contents

- [AES giải quyết bài toán gì](#aes-giải-quyết-bài-toán-gì)
- [Tính chất cốt lõi](#tính-chất-cốt-lõi)
- [Hệ quả thứ nhất: thông điệp dài hơn một khối](#hệ-quả-thứ-nhất-thông-điệp-dài-hơn-một-khối)
- [Hệ quả thứ hai: cùng đầu vào cho cùng đầu ra](#hệ-quả-thứ-hai-cùng-đầu-vào-cho-cùng-đầu-ra)
- [Ưu điểm](#ưu-điểm)
- [Nhược điểm và giới hạn](#nhược-điểm-và-giới-hạn)
- [Các vấn đề khi triển khai](#các-vấn-đề-khi-triển-khai)
- [Chọn cỡ khóa như thế nào](#chọn-cỡ-khóa-như-thế-nào)
- [Tổng kết](#tổng-kết)
- [Related](#related)

**AES** là chuẩn **symmetric block cipher** được dùng nhiều nhất hiện nay, nhưng bản thân nó chỉ là một phép biến đổi trên đúng một khối dữ liệu cố định. Hầu hết sự cố thực tế không đến từ thuật toán mà từ cách bọc nó: chọn mode sai, tái sử dụng IV/nonce, hoặc bỏ qua xác thực toàn vẹn. Bài này giữ phần cơ chế ở mức tối thiểu và tập trung vào tính chất, đánh đổi và các lỗi triển khai đi kèm. Mode và AEAD ở bài [Mode và AEAD cho AES](./aes_modes_aead.md).

---

## AES giải quyết bài toán gì

Bài toán đặt ra rất cụ thể: cần một phép biến đổi **đối xứng** (một khóa cho cả hai chiều) đủ nhanh để mã hóa khối lượng dữ liệu lớn, đủ an toàn để không bị phân tích khi kẻ tấn công có cả bản rõ lẫn bản mã, và đủ chuẩn hóa để nhiều hệ thống khác nhau tương thích.

**AES** đáp ứng cả ba bằng một phép hoán vị có khóa trên không gian khối. Mỗi vòng biến đổi gồm ba thao tác khái niệm: thay thế từng byte theo bảng tra, hoán vị vị trí các byte, và trộn khóa vào dữ liệu. Lặp đủ số vòng thì quan hệ giữa khóa, bản rõ và bản mã trở nên không thể tách rời bằng phân tích thống kê. Chi tiết từng phép biến đổi không cần thiết để ra quyết định thiết kế, nên bài này không đi sâu vào đó.

Điều cần nắm: AES là một **phép hoán vị có khóa**, không phải hàm băm, không phải giao thức, và không tự sinh khóa.

---

## Tính chất cốt lõi

| Tính chất | Giá trị | Hệ quả thực tế |
| :--- | :--- | :--- |
| **Kích thước khối** | Cố định `128 bit` (`16 byte`) | Thông điệp dài phải chia khối và cần mode; thông điệp ngắn hơn vẫn chiếm một khối |
| **Kích thước khóa** | `128`, `192` hoặc `256 bit` | Ba biến thể, không phải ba "cấp độ" của cùng một cấu hình |
| **Số vòng** | `10`, `12`, `14` tương ứng ba cỡ khóa | Chi phí tăng nhẹ theo cỡ khóa, không tuyến tính theo kích thước dữ liệu |
| **Cấu trúc** | Mạng thay thế và hoán vị (SPN) | Không dựa trên bài toán số học khó; an toàn đến từ số vòng và thiết kế bảng tra |
| **Tính xác định** | Cùng khóa, cùng khối vào → cùng khối ra | Không che được mẫu lặp nếu dùng trực tiếp; đây là gốc của lỗi ECB |
| **Chi phí** | Rất thấp trên CPU hiện đại, có tăng tốc phần cứng | Phù hợp mã hóa đĩa, cơ sở dữ liệu, luồng mạng; không phù hợp để tự giải bài toán phân phối khóa |
| **Đối xứng** | Một khóa cho cả mã hóa và giải mã | Hiệu năng cao nhưng khóa phải đến được cả hai phía qua kênh an toàn |

Cần phân biệt rõ ba đại lượng thường bị nhầm: kích thước khối, kích thước khóa và độ dài thông điệp. Chúng độc lập với nhau. Bài [Các con số trong mật mã: Kích thước khóa, khối, đầu ra và Mức an toàn](../01_foundations/cryptographic_sizes.md) phân tích riêng quan hệ này.

> [!NOTE]
> Kích thước khóa không phải thước đo duy nhất của độ an toàn. Cùng một khóa `128 bit` có thể bị vô hiệu hoàn toàn nếu IV hoặc nonce bị lặp, hoặc nếu khóa bị tái sử dụng giữa các ngữ cảnh khác nhau.

---

## Hệ quả thứ nhất: thông điệp dài hơn một khối

AES chỉ định nghĩa phép biến đổi trên một khối `16 byte`. Đây là giới hạn của thuật toán, không phải giới hạn của dữ liệu người dùng cần mã hóa.

Để mã hóa thông điệp dài tùy ý, hệ thống dùng **mode of operation**: một quy tắc bọc phép biến đổi khối để xử lý chuỗi khối, kèm cách sinh giá trị khởi tạo và cách xử lý khối cuối. Mode quyết định ba thứ:

1. Có cần padding khi độ dài không chia hết cho `16 byte` hay không.
2. Có thể mã hóa song song nhiều khối hay phải tuần tự.
3. Cần tham số phụ nào (IV, nonce, bộ đếm, tag) và ràng buộc của tham số đó.

Điểm quan trọng: **mode không làm AES mạnh hơn**. Mode chỉ quyết định cách dùng AES và do đó quyết định luôn loại rò rỉ mà hệ thống phải chấp nhận.

---

## Hệ quả thứ hai: cùng đầu vào cho cùng đầu ra

AES là phép hoán vị có khóa, nên nếu mã hóa hai lần cùng một khối với cùng khóa thì kết quả giống hệt nhau. Với dữ liệu có cấu trúc và lặp lại (bảng lương, bản ghi người dùng, ảnh bitmap), điều này tạo ra mẫu nhìn thấy được ngay cả khi không giải mã.

Có hai cách xử lý, và chúng phục vụ hai mục tiêu khác nhau:

| Cách xử lý | Cơ chế | Đánh đổi |
| :--- | :--- | :--- |
| **Randomized** | Mỗi lần mã hóa dùng IV/nonce mới, nên cùng bản rõ cho bản mã khác nhau | Không so sánh được bản mã; cần lưu IV/nonce kèm dữ liệu |
| **Deterministic** | Cố ý giữ cùng bản mã cho cùng bản rõ để so sánh được | Lộ mẫu trùng lặp và tần suất; chỉ dùng khi thật sự cần tìm kiếm bằng |

Chọn randomized hay deterministic là quyết định ở tầng hệ thống, không phải ở tầng thuật toán. Chương [Truy vấn trên dữ liệu mã hóa](../05_encrypted_query/cryptdb_cipher_levels.md) phân tích sâu đánh đổi này dưới dạng các cipher level.

---

## Ưu điểm

- **Hiệu năng**: nhanh hơn nhiều bậc so với mã hóa bất đối xứng, đủ để mã hóa toàn bộ ổ đĩa hoặc toàn bộ lưu lượng của một service.
- **Tăng tốc phần cứng**: hầu hết CPU hiện đại có lệnh chuyên dụng cho AES, giảm chi phí CPU và giảm một số kênh side-channel ở tầng phần mềm.
- **Đã được phân tích rất kỹ**: sau hơn hai thập kỷ, chưa có tấn công thực tế nào phá được AES đầy đủ. Kết quả tốt nhất trên bản đầy đủ chỉ cải thiện rất nhỏ so với tìm kiếm vét cạn và vẫn ở mức không khả thi; phần lớn tấn công học thuật nhắm vào phiên bản rút gọn số vòng.
- **Chuẩn hóa và phổ biến**: có trong mọi thư viện mật mã, mọi nền tảng, mọi thiết bị.
- **Linh hoạt qua mode**: cùng một lõi thuật toán phục vụ được truyền thông, lưu trữ, và cả tìm kiếm có kiểm soát khi chấp nhận đánh đổi.

---

## Nhược điểm và giới hạn

- **Không giải quyết phân phối khóa**: AES cần cả hai phía đã có cùng khóa. Bài toán khó nhất của mã hóa đối xứng nằm ngoài thuật toán.
- **Khối cố định `128 bit`**: mọi thông điệp đều phải qua mode, kèm tham số phụ và quy tắc xử lý khối cuối. Đây là bề mặt lỗi lớn.
- **Tính xác định của lõi**: nếu không có IV/nonce, AES tự nó không che được mẫu dữ liệu.
- **Không có xác thực mặc định**: bản thân AES không phát hiện sửa đổi. Phải dùng AEAD hoặc kết hợp MAC, và việc kết hợp sai cũng là một lớp lỗi.
- **Không kháng quantum theo nghĩa tuyệt đối**: tấn công của Grover làm giảm biên an toàn, nên giới hạn bảo mật dài hạn cần tính đến.
- **Phụ thuộc triển khai**: cùng thuật toán nhưng thư viện, cách sinh số ngẫu nhiên và cách xử lý lỗi quyết định độ an toàn thực tế.

---

## Các vấn đề khi triển khai

Lỗi về mode, IV/nonce và padding ở bài [Mode và AEAD](./aes_modes_aead.md). Hai vấn đề còn lại thuộc về bản thân thuật toán và môi trường chạy:

**1. Side-channel ở tầng triển khai.** Bảng tra phụ thuộc dữ liệu từng tạo ra cache-timing attack đo được. Tăng tốc phần cứng thu hẹp bề mặt này nhưng không xóa bỏ nó: các tấn công đo tần số và điện năng như **Hertzbleed** cho thấy thời gian thực thi vẫn có thể phụ thuộc dữ liệu ngay cả khi thuật toán được viết theo hướng constant-time. Kết luận thực dụng là dùng thư viện đã được kiểm chứng, không tự viết lại lõi AES.

**2. Quản lý khóa yếu.** Khóa lưu trong mã nguồn, trong biến môi trường không được bảo vệ, hoặc dùng lại một khóa cho nhiều mục đích. Đây thường là điểm yếu thực tế lớn hơn mọi vấn đề của thuật toán.

> [!CAUTION]
> Không có cấu hình AES nào an toàn nếu khóa bị lộ. Ưu tiên đầu tư vào KMS, phân tách khóa theo mục đích và xoay vòng khóa trước khi tối ưu tham số thuật toán.

---

## Chọn cỡ khóa như thế nào

Nguyên tắc thực dụng:

- **`128 bit`** đủ cho phần lớn hệ thống, đặc biệt khi dữ liệu không cần bảo mật hàng chục năm.
- **`256 bit`** phù hợp khi cần biên an toàn dài hạn, khi có yêu cầu tuân thủ, hoặc khi muốn dự phòng rủi ro quantum. Chi phí hiệu năng chênh lệch không đáng kể trên CPU có tăng tốc phần cứng.
- Câu "AES-256 để chống máy tính lượng tử" cần đặt trong ngữ cảnh: tấn công Grover không đơn giản chia đôi số bit hiệu dụng, vì chi phí thực tế còn phụ thuộc số lần lượng tử hóa và giới hạn độ sâu mạch. Các đánh giá độc lập theo mô hình chi phí của NIST đều cho thấy AES-128 vẫn còn biên rộng, còn AES-256 có biên lớn hơn rõ rệt. Vì vậy chọn `256 bit` là để dự phòng dài hạn, không phải vì AES-128 đã bị phá.
- Không có thứ tự "an toàn hơn" tuyệt đối giữa hai cỡ khóa. Trong mô hình tấn công liên quan khóa (kẻ tấn công kiểm soát quan hệ giữa nhiều khóa), AES-256 có kết quả tấn công tốt hơn AES-128. Mô hình đó không áp dụng cho giao thức thực tế nơi mỗi khóa được sinh độc lập.

---

## Tổng kết

- AES là **block cipher** với khối cố định `128 bit` và ba cỡ khóa `128`/`192`/`256 bit`; bản thân nó chỉ biến đổi một khối.
- Mọi thứ liên quan đến thông điệp dài, độ dài tùy ý và xác thực đều do **mode** quyết định, xem bài [Mode và AEAD](./aes_modes_aead.md).
- Hiệu năng của AES rất cao, nhưng an toàn thực tế phụ thuộc vào sinh số ngẫu nhiên, quản lý khóa và cách xử lý lỗi.
- Chọn `128` hay `256 bit` là quyết định về biên an toàn và tuân thủ, không phải về tốc độ.

---

## Related

* [Mode of Operation và AEAD cho AES](./aes_modes_aead.md) — cùng thuật toán nhưng ở tầng bọc ngoài: ECB/CBC/CTR/GCM/XTS, xác thực toàn vẹn và lỗi nonce/padding.
* [Các con số trong mật mã: Kích thước khóa, khối, đầu ra và Mức an toàn](../01_foundations/cryptographic_sizes.md) — cùng chủ đề tách bạch kích thước khối, kích thước khóa và độ dài thông điệp, kèm bản đồ con số của AES.
* [Mã hóa lai](../01_foundations/hybrid_encryption.md) — cùng nguyên tắc chọn mode và tham số cho tầng đối xứng bảo vệ dữ liệu trong mô hình lai.
* [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md) — cùng câu hỏi về chọn cỡ khóa và giới hạn sử dụng, nhưng ở phía bất đối xứng.
* [Mật mã kháng lượng tử](../04_protocols/post_quantum_transition.md) — tấn công Grover và lý do tầng đối xứng chỉ cần tăng cỡ khóa thay vì thay thuật toán.

---
[← Back to README](README.md)
