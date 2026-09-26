# Digital Certificates - Chứng thư số

Nếu TLS là việc _mã hóa_ cuộc hội thoại, thì **Certificate** là việc _xác thực danh tính_ (**authentication**) — làm sao bạn biết người ở đầu bên kia đường hầm thực sự là người mà họ tuyên bố? Bài viết này giải thích vai trò của Certificate theo tiêu chuẩn **X.509**, cách hoạt động của **Chain of Trust**, và rủi ro **Man-in-the-Middle** khi Root CA giả mạo лọt vào Certificate Store.

## Table of Contents

-   [1. Certificate là gì? (Và vấn đề nó giải quyết)](#1-certificate-là-gì-và-vấn-đề-nó-giải-quyết)
-   [2. Bên trong Certificate có gì? (Tiêu chuẩn X.509)](#2-bên-trong-certificate-có-gì-tiêu-chuẩn-x509)
-   [3. Cách tạo Certificate: Self-Signed](#3-cách-tạo-certificate-self-signed)
-   [4. Giải pháp: Chain of Trust và CA](#4-giải-pháp-chain-of-trust-và-ca)
-   [5. Quy trình Xác thực Chuỗi hoạt động như thế nào?](#5-quy-trình-xác-thực-chuỗi-hoạt-động-như-thế-nào)
-   [6. Rủi ro bảo mật: Man-in-the-Middle với Root CA giả mạo](#6-rủi-ro-bảo-mật-man-in-the-middle-với-root-ca-giả-mạo)
-   [7. Tổng kết](#7-tổng-kết)

---

Chào bạn,

Tiếp nối bài giảng về TLS (nơi chúng ta đã hiểu cách tạo ra một "đường hầm" mã hóa), hôm nay chúng ta sẽ đào sâu vào một thành phần then chốt: **Certificate**.

---

## 1. Certificate là gì? (Và vấn đề nó giải quyết)

Chúng ta đều biết rằng HTTPS sử dụng mã hóa khóa công khai. Nhưng vấn đề là:

Khi bạn kết nối đến `example.com`, làm sao bạn biết được cái **Public Key** (Khóa công khai) mà bạn nhận được _thực sự_ thuộc về `example.com`? Sẽ ra sao nếu một hacker ở giữa (Man-in-the-Middle) chặn kết nối và gửi cho bạn Public Key _của hắn_ nhưng lại giả mạo là của `example.com`?

Đây là lúc Certificate phát huy tác dụng.

> **Certificate (Chứng thư số)** về cơ bản là một tệp siêu dữ liệu (metadata file) đóng vai trò như "chứng minh thư nhân dân" cho một máy chủ.
>
> Chức năng quan trọng nhất của nó là **chứa Public Key** và _chứng minh_ rằng Public Key đó thuộc về một chủ thể (ví dụ: `example.com`).

Khi bạn muốn lấy Public Key của ai đó, bạn không yêu cầu "cho tôi public key", mà bạn yêu cầu "cho tôi **certificate**".

---

## 2. Bên trong Certificate có gì? (Tiêu chuẩn X.509)

Certificate không chỉ chứa mỗi Public Key. Nó là một tệp dữ liệu có cấu trúc theo tiêu chuẩn (phổ biến nhất là **X.509**) và chứa rất nhiều thông tin hữu ích:

-   **Public Key:** Thành phần cốt lõi dùng để mã hóa (như trong TLS Handshake).
-   **Subject (Chủ thể):** Tên của chủ sở hữu chứng thư (ví dụ: Google LLC).
-   **Subject Alternative Name (SAN):** Đây là một trong những trường **quan trọng nhất**. Nó liệt kê tất cả các tên miền (website) mà chứng thư này đại diện (ví dụ: `google.com`, `*.google.com`, `youtube.com`). Khi trình duyệt kết nối, nó sẽ so sánh tên miền trên URL với danh sách này.
-   **Issuer (Nhà phát hành):** Tên của tổ chức đã cấp (ký) chứng thư này.
-   **Validity (Thời hạn):** Ngày **Valid From** (Từ) và ngày **Valid To** (Đến).
-   **Digital Signature (Chữ ký số):** Đây là "con dấu" của nhà phát hành, dùng để xác thực rằng toàn bộ thông tin bên trên là đúng và không bị thay đổi.
-   **Version, Signature Algorithm, v.v.:** Các thông tin kỹ thuật khác.

---

## 3. Cách tạo Certificate: Self-Signed

Làm thế nào để tạo ra một certificate? Rất đơn giản:

1.  Bạn tạo một cặp khóa: **Private Key** (bí mật) và **Public Key** (công khai).
2.  Bạn tạo một tệp certificate (theo chuẩn X.509).
3.  Bạn nhét **Public Key** của mình vào certificate.
4.  Bạn điền các thông tin khác (như tên website của bạn vào trường SAN).
5.  Cuối cùng, bạn dùng **Private Key** của mình để _ký_ vào toàn bộ certificate đó.

Kết quả là một **Self-Signed Certificate** (chứng thư tự ký).

> **Vấn đề:** Self-Signed Certificate thường **không được tin cậy** bởi các trình duyệt.
>
> Lý do là bất kỳ ai cũng có thể tự tạo một certificate tự ký. Tôi có thể tạo một certificate tự ký cho `google.com` và tự nhận mình là Google. Không có ai đứng ra "bảo lãnh" cho thông tin đó.
>
> Chúng chỉ hữu ích cho môi trường phát triển (**local**) hoặc mạng nội bộ.

---

## 4. Giải pháp: Chain of Trust và CA

Cách làm "hợp lệ" để được Internet công nhận là:

Bạn nhờ một bên thứ ba (mà mọi người đều tin tưởng) dùng Private Key _của họ_ để ký vào certificate _của bạn_. Bên thứ ba này được gọi là **Certificate Authority (CA)** (ví dụ: Let's Encrypt, DigiCert, Sectigo).

Nhưng làm thế nào chúng ta tin tưởng các CA này? Điều này dẫn đến khái niệm **Chain of Trust** (chuỗi tin cậy).

-   **Certificate Store (Kho chứng thư):** Khi bạn cài đặt hệ điều hành (Windows, macOS) hoặc trình duyệt (Chrome, Firefox), chúng đi kèm với một danh sách "cài sẵn" các chứng thư đặc biệt gọi là **Root Certificates** (chứng thư gốc).
-   **Root Certificates:** Đây là các chứng thư của các CA lớn nhất, đáng tin cậy nhất. Điều đặc biệt là chúng _cũng là tự ký_. Nhưng chúng ta tin tưởng chúng vì chúng được "nhúng" sẵn vào hệ điều hành bởi các nhà cung cấp như Microsoft, Apple, Google.
-   **Intermediate Certificates (Chứng thư trung gian):** Các Root CA (rất quyền lực) thường không trực tiếp ký cho các website cá nhân. Họ ký cho các CA cấp dưới (**Intermediate CA**). Các CA trung gian này sau đó mới ký cho certificate của bạn (`example.com`).

Kết quả là một chuỗi:
**Root CA** -> ký cho -> **Intermediate CA** -> ký cho -> **Your Website Certificate**

---

## 5. Quy trình Xác thực Chuỗi hoạt động như thế nào?

Đây là phần kỳ diệu nhất. Khi trình duyệt của bạn nhận được certificate từ một website (ví dụ `a.com`), nó sẽ thực hiện quy trình sau:

1.  **Client nhận "Leaf Certificate":** Trình duyệt nhận được certificate của `a.com` (gọi là "chứng thư lá").
2.  **Client kiểm tra (1):** "OK, cert này của `a.com`. Ai đã ký (Issuer) nó?" -> "Issuer là 'CA Trung Gian'."
3.  **Client kiểm tra (2):** "Tôi có tin 'CA Trung Gian' không?" Trình duyệt nhìn vào **Certificate Store** của mình. "Không, tôi không biết 'CA Trung Gian' là ai."
4.  **Client hỏi tiếp:** "Vậy ai đã ký cho 'CA Trung Gian'?"
    -   (Trong thực tế, máy chủ thường gửi kèm luôn cả certificate của 'CA Trung Gian' để tiết kiệm thời gian. Đây gọi là **"Full Chain"**.)
5.  **Client kiểm tra (3):** "OK, đây là cert của 'CA Trung Gian'. Ai đã ký nó?" -> "Issuer là 'Root CA'."
6.  **Client kiểm tra (4):** "Tôi có tin 'Root CA' không?" Trình duyệt nhìn vào Certificate Store của mình.
7.  **Kết luận:** "Aha! 'Root CA' **có** trong **Certificate Store** của tôi và được đánh dấu là 'Tin cậy'.
    -   Vì tôi tin 'Root CA', nên tôi tin 'CA Trung Gian' (vì Root CA đã ký cho nó).
    -   Vì tôi tin 'CA Trung Gian', nên tôi tin certificate của `a.com` là hợp lệ."

Nếu chuỗi này được xác thực thành công, trình duyệt sẽ hiển thị biểu tượng ổ khóa an toàn. Nếu thất bại (ví dụ: certificate hết hạn, tên miền không khớp, hoặc Root CA không đáng tin), bạn sẽ thấy cảnh báo bảo mật.

> **Lưu ý về các chuỗi phức tạp (Cross-chaining):**
> Đôi khi, một certificate có thể có nhiều **path** (đường xác thực) khác nhau để đi về Root, tạo ra các **chuỗi chéo**. Điều này làm tăng tính tương thích nhưng cũng khiến việc xác thực phức tạp hơn (ví dụ: trình duyệt phải kiểm tra theo chiều sâu hay chiều rộng?). Đây là một lĩnh vực kỹ thuật sâu và phức tạp.

---

## 6. Rủi ro bảo mật: Man-in-the-Middle với Root CA giả mạo

Toàn bộ hệ thống này dựa trên một giả định: **Certificate Store của bạn là an toàn và chỉ chứa các Root CA đáng tin cậy.**

Điều gì xảy ra nếu một kẻ tấn công cài đặt một "Root CA độc hại" vào máy của bạn? (Ví dụ: bạn cài một phần mềm lạ, hoặc máy tính của bạn bị cài đặt sẵn một HĐH đã bị chỉnh sửa).

Kịch bản tấn công **Man-in-the-Middle (MITM)** sẽ diễn ra như sau:

1.  **Cài cắm:** Máy của bạn có một "Root CA Độc Hại" trong Certificate Store. Kẻ tấn công giữ Private Key của Root CA này.
2.  **Truy cập:** Bạn gõ `https://google.com` vào trình duyệt.
3.  **Chặn kết nối:** Kẻ tấn công (ví dụ: ISP hoặc một proxy) chặn kết nối của bạn.
4.  **Giả mạo:** Kẻ tấn công _tự tạo ra một certificate giả mạo_ cho `google.com`, nhét Public Key _của hắn_ vào đó.
5.  **Ký giả mạo:** Kẻ tấn công dùng **Private Key** của "Root CA Độc Hại" để _ký_ lên certificate `google.com` giả mạo này.
6.  **Gửi cho bạn:** Kẻ tấn công gửi certificate giả mạo này cho trình duyệt của bạn.
7.  **Xác thực (Thảm họa):**
    -   Trình duyệt của bạn: "OK, đây là cert của `google.com`. Ai ký?" -> "Issuer là 'Root CA Độc Hại'."
    -   Trình duyệt kiểm tra store: "A! 'Root CA Độc Hại' **có** trong store của tôi và được đánh dấu 'Tin cậy'!"
    -   **Kết quả:** Trình duyệt tin tưởng certificate này. Bạn thấy ổ khóa màu xanh và tin rằng mình đang nói chuyện an toàn với Google.

Nhưng thực tế, toàn bộ dữ liệu của bạn đang được gửi đến kẻ tấn công. Hắn dùng Private Key của mình để giải mã, đọc tất cả (mật khẩu, cookie...), sau đó mã hóa lại (bằng cert thật của Google) và gửi tiếp đến Google. Bạn đã bị tấn công MITM mà không hề hay biết.

---

## 7. Tổng kết

-   **Certificate (X.509)** là "chứng minh thư" của website, chứa **Public Key** và các **Metadata** (như tên miền ở **SAN**).
-   **Self-Signed** (tự ký) thì không đáng tin cậy trên Internet.
-   Chúng ta dựa vào một **Chain of Trust** (chuỗi tin cậy), bắt đầu từ các **Root CA** được cài sẵn trong **Certificate Store** của hệ điều hành/trình duyệt.
-   Quy trình xác thực là đi ngược từ "lá" (`a.com`) lên "trung gian" (**Intermediate CA**) và cuối cùng về "gốc" (**Root CA**).
-   Hệ thống này rất an toàn, nhưng điểm yếu chí mạng của nó là sự tin tưởng tuyệt đối vào Certificate Store.

Hy vọng bài giảng này đã giúp bạn hiểu rõ vai trò của Certificate trong việc xác thực danh tính trên Internet!

Bạn có muốn tìm hiểu thêm về cách các trình duyệt quản lý Certificate Store của chúng không?

---
[← Back to README](../README.md)
