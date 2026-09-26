# Tổng quan về DNS, TLS, và HTTPS

Khi đã hiểu về các giao thức nền tảng như **IP**, **TCP** và **UDP**, bạn sẽ nhận ra rằng hầu hết mọi giao thức chúng ta sử dụng hàng ngày đều được xây dựng dựa trên chúng: HTTP chạy trên TCP, còn DNS thường chạy trên UDP. Bài viết này tập trung vào nhóm giao thức then chốt trong việc vận hành và bảo mật website: **DNS**, **SSL/TLS**, **Certificate**, và **HTTPS**.

> **Lưu ý:** Mỗi giao thức này đều xứng đáng có cả một khóa học riêng biệt với hàng chục bài giảng vì chúng rất sâu sắc và có lịch sử phát triển lâu dài. Mục tiêu của bài viết này là cung cấp một cái nhìn **tổng quan cấp cao** (**high-level summary**) cho mỗi chủ đề, giúp bạn hiểu vai trò và cách chúng phối hợp với nhau.

## Table of Contents

-   [1. DNS (Domain Name System) - Hệ thống phân giải tên miền](#1-dns-domain-name-system---hệ-thống-phân-giải-tên-miền)
-   [2. SSL (Secure Sockets Layer) và TLS (Transport Layer Security)](#2-ssl-secure-sockets-layer-và-tls-transport-layer-security)
-   [3. Certificate - "Chứng minh thư" của Website](#3-certificate---chứng-minh-thư-của-website)
-   [4. HTTPS (Hypertext Transfer Protocol Secure)](#4-https-hypertext-transfer-protocol-secure)
-   [5. Tổng kết luồng hoạt động khi truy cập một website HTTPS](#5-tổng-kết-luồng-hoạt-động-khi-truy-cập-một-website-https)

---

## 1. DNS (Domain Name System) - Hệ thống phân giải tên miền

### Giải thích ngắn gọn

DNS giống như "danh bạ điện thoại" của Internet. Con người chúng ta dễ nhớ tên (ví dụ: `google.com`), nhưng máy tính giao tiếp với nhau bằng địa chỉ **IP** (ví dụ: `142.250.199.14`).

**DNS** là dịch vụ chịu trách nhiệm dịch (phân giải) từ tên miền mà con người đọc được sang địa chỉ IP mà máy tính hiểu được.

### Luồng hoạt động cơ bản

Như đã đề cập trong phần giới thiệu, DNS thường chạy trên nền **UDP** (vì nó ưu tiên tốc độ, không yêu cầu độ tin cậy tuyệt đối như TCP).

1.  **Người dùng:** Bạn gõ `google.com` vào thanh địa chỉ của trình duyệt.
2.  **Hệ điều hành:** Máy tính của bạn gửi một truy vấn DNS đến máy chủ DNS (thường là của nhà cung cấp dịch vụ Internet - **ISP**).
3.  **Máy chủ DNS:** Máy chủ này tìm kiếm trong cơ sở dữ liệu của nó (hoặc hỏi các máy chủ DNS khác) để tìm địa chỉ IP tương ứng với `google.com`.
4.  **Phản hồi:** Máy chủ DNS trả về địa chỉ IP `142.250.199.14`.
5.  **Kết nối:** Trình duyệt của bạn lúc này mới sử dụng địa chỉ IP này để bắt đầu một kết nối (ví dụ: TCP) đến máy chủ của Google.

---

## 2. SSL (Secure Sockets Layer) và TLS (Transport Layer Security)

### Giải thích ngắn gọn

Khi bạn kết nối đến một website, dữ liệu (như mật khẩu, thông tin thẻ tín dụng) được truyền đi trên mạng. Nếu kết nối này là "trần" (**plaintext**), bất kỳ ai ở giữa (ví dụ: tin tặc, nhà mạng) đều có thể "nghe lén" và đánh cắp thông tin này.

**SSL** và **TLS** là các giao thức mã hóa, chúng tạo ra một "đường hầm" an toàn và riêng tư giữa trình duyệt của bạn và máy chủ web. Mọi dữ liệu đi qua đường hầm này đều bị xáo trộn (mã hóa) và không thể bị đọc trộm.

Các giao thức này hoạt động bên trên **TCP**. Chúng "bọc" lấy kết nối TCP để mã hóa mọi thứ được gửi qua nó.

### So sánh SSL và TLS

Mặc dù thường được gọi chung là "SSL", nhưng thực tế đây là hai giao thức riêng biệt.

| Đặc điểm       | SSL (Secure Sockets Layer)                                                                        | TLS (Transport Layer Security)                                                                 |
| :------------- | :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------- |
| **Lịch sử**    | Phiên bản cũ, ra đời trước.                                                                       | Phiên bản mới, được phát triển để thay thế SSL.                                                |
| **Bảo mật**    | Các phiên bản SSL (v1, v2, v3) đều đã được chứng minh là **không còn an toàn** và có nhiều lỗ hổng. | Là tiêu chuẩn hiện tại (các phiên bản phổ biến là TLS 1.2 và TLS 1.3), an toàn và mạnh mẽ hơn. |
| **Hiện trạng** | Hầu hết các trình duyệt hiện đại đã ngừng hỗ trợ SSL.                                             | Được hỗ trợ bởi tất cả các trình duyệt và máy chủ hiện đại.                                    |

> **Ghi nhớ quan trọng:**
> Ngày nay, khi bạn nghe ai đó nói "SSL" (ví dụ: "Mua chứng chỉ SSL"), họ gần như chắc chắn đang đề cập đến **TLS**. Thuật ngữ SSL vẫn được dùng phổ biến do thói quen và marketing, nhưng về mặt kỹ thuật, giao thức đang chạy là TLS.

---

## 3. Certificate - "Chứng minh thư" của Website

### Giải thích ngắn gọn

OK, chúng ta đã có TLS để mã hóa kết nối. Nhưng có một vấn đề:

*Làm sao trình duyệt của bạn biết rằng máy chủ mà nó đang kết nối *thực sự* là `google.com` chứ không phải là một máy chủ giả mạo do tin tặc dựng lên?*

Đây là lúc **Certificate** phát huy tác dụng.

Nó giống như "chứng minh thư nhân dân" hoặc "giấy phép kinh doanh" của một website. Chứng thư này là một tệp dữ liệu nhỏ, được cấp bởi một bên thứ ba đáng tin cậy gọi là **Certificate Authority (CA)** (ví dụ: Let's Encrypt, DigiCert, Sectigo).

### Chứng thư này xác nhận điều gì?

Một **Certificate** hợp lệ sẽ xác nhận các thông tin sau:

-   **Domain Name (Tên miền):** Chứng thư này được cấp cho tên miền nào (ví dụ: `*.google.com`).
-   **Owner (Chủ sở hữu):** Tên tổ chức sở hữu tên miền đó (ví dụ: Google LLC).
-   **Public Key (Khóa công khai):** Đây là thành phần quan trọng nhất, dùng trong quá trình **handshake** để thiết lập mã hóa TLS.
-   **Issuer - CA (Nhà cấp phát):** Ai đã cấp chứng thư này.
-   **Validity (Thời hạn):** Chứng thư có hiệu lực từ ngày nào đến ngày nào.

Khi bạn truy cập một website, máy chủ sẽ gửi **Certificate** này cho trình duyệt. Trình duyệt sẽ kiểm tra xem CA cấp chứng thư này có đáng tin cậy không (có trong danh sách tin cậy của nó không) và tên miền có khớp không.

---

## 4. HTTPS (Hypertext Transfer Protocol Secure)

### Giải thích ngắn gọn

HTTPS không phải là một giao thức hoàn toàn mới. Nó chỉ đơn giản là sự kết hợp của giao thức **HTTP** (dùng để tải nội dung web) và giao thức bảo mật **SSL/TLS**.

> **Công thức đơn giản:**
> **HTTPS = HTTP + SSL/TLS**

Giao thức HTTP truyền thống vốn không an toàn (**plaintext**). Khi được "bọc" trong một kết nối TLS đã được mã hóa, chúng ta gọi nó là HTTPS.

Toàn bộ quá trình giao tiếp HTTP (như `GET /index.html`, gửi biểu mẫu, cookie...) sẽ được mã hóa bởi lớp TLS. Điều này đảm bảo 3 yếu tố:

1.  **Encryption (Mã hóa):** Không ai có thể nghe lén nội dung.
2.  **Authentication (Xác thực):** Bạn đang nói chuyện đúng với máy chủ `google.com` (nhờ Certificate).
3.  **Integrity (Toàn vẹn):** Dữ liệu không bị thay đổi trên đường truyền.

---

## 5. Tổng kết luồng hoạt động khi truy cập một website HTTPS

Hãy xem tất cả các mảnh ghép này hoạt động cùng nhau như thế nào khi bạn truy cập `https://google.com` (Lưu ý: "HTTLS" không tồn tại, thuật ngữ đúng là **HTTPS**).

1.  **Bước 1: Phân giải DNS**

    -   Trình duyệt của bạn gửi một truy vấn **DNS** (qua UDP) để hỏi: "Địa chỉ IP của `google.com` là gì?"
    -   Máy chủ DNS trả về: "Đó là `142.250.199.14`."

2.  **Bước 2: Bắt tay TCP**

    -   Trình duyệt của bạn mở một kết nối **TCP** đến địa chỉ IP `142.250.199.14` trên cổng `443` (cổng mặc định cho HTTPS).

3.  **Bước 3: Bắt tay TLS (kết hợp Certificate)**

    -   Đây là bước phức tạp nhất, nhưng tóm tắt là:
    -   **Client Hello:** Trình duyệt nói: "Hello, tôi muốn kết nối TLS. Tôi hỗ trợ các phiên bản TLS này..."
    -   **Server Hello:** Máy chủ trả lời: "Hello, chúng ta hãy dùng TLS 1.3. Đây là **Certificate** của tôi."
    -   **Xác thực:** Trình duyệt kiểm tra Certificate: "OK, chứng thư này được cấp cho `google.com` bởi một CA đáng tin cậy. Chứng thư hợp lệ."
    -   **Trao đổi khóa:** Trình duyệt và máy chủ sử dụng các kỹ thuật mật mã (dựa trên thông tin trong **Certificate**) để đàm phán và tạo ra một **session key** mà chỉ hai bên biết.

4.  **Bước 4: Giao tiếp an toàn**

    -   Kết nối TLS đã được thiết lập thành công. Mọi dữ liệu từ đây sẽ được mã hóa bằng **session key** đã tạo ở trên.
    -   Trình duyệt gửi một yêu cầu **HTTP** (ví dụ: `GET /homepage`) qua đường hầm TLS đã được mã hóa.
    -   Máy chủ nhận yêu cầu, giải mã nó, xử lý, sau đó mã hóa phản hồi (nội dung HTML của trang chủ) và gửi lại cho trình duyệt.
    -   Trình duyệt nhận về, giải mã và hiển thị trang web cho bạn. Bạn thấy biểu tượng ổ khóa an toàn trên trình duyệt.

---
[← Back to README](../README.md)
