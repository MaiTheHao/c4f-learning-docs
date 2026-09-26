# HTTPS: Giao thức truyền tải siêu văn bản an toàn

HTTPS không phải là một giao thức hoàn toàn mới: nó chỉ là **HTTP** được "bọc" bên trong một đường hầm mã hóa **TLS**. Mỗi khi bạn gõ `https://example.com` vào trình duyệt, một chuỗi phối hợp chặt chẽ của nhiều giao thức xảy ra: phân giải **DNS**, bắt tay **TCP**, bắt tay **TLS** với xác thực **Certificate**, và cuối cùng là giao tiếp HTTP an toàn. Tài liệu này đi qua từng bước một của quy trình đó.

## Table of Contents

-   [1. Ba trụ cột bảo mật của HTTPS](#1-ba-trụ-cột-bảo-mật-của-https)
-   [2. Quy trình hoạt động Base của HTTPS (Luồng đầy đủ)](#2-quy-trình-hoạt-động-base-của-https-luồng-đầy-đủ)
-   [3. Bước 1: Phân giải DNS (Tìm địa chỉ)](#3-bước-1-phân-giải-dns-tìm-địa-chỉ)
-   [4. Bước 2: Bắt tay TCP (Mở kết nối)](#4-bước-2-bắt-tay-tcp-mở-kết-nối)
-   [5. Bước 3: Bắt tay TLS (Xác thực và Trao đổi khóa)](#5-bước-3-bắt-tay-tls-xác-thực-và-trao-đổi-khóa)
-   [6. Bước 4: Giao tiếp HTTP an toàn (Truyền dữ liệu)](#6-bước-4-giao-tiếp-http-an-toàn-truyền-dữ-liệu)
-   [7. Tổng kết](#7-tổng-kết)

---

## 1. Ba trụ cột bảo mật của HTTPS

Khi một kết nối sử dụng HTTPS, nó đảm bảo 3 yếu tố then chốt mà HTTP "trần" không có:

1.  **Encryption (Mã hóa):** Dữ liệu được xáo trộn. Không ai ở giữa (như ISP, hacker) có thể nghe lén nội dung cuộc hội thoại của bạn (ví dụ: mật khẩu, thông tin thẻ tín dụng).
2.  **Authentication (Xác thực):** Bạn biết chắc chắn mình đang nói chuyện với đúng máy chủ. (Ví dụ: Trình duyệt của bạn xác thực được rằng máy chủ nó đang kết nối _thực sự_ là `google.com` chứ không phải một kẻ giả mạo).
3.  **Integrity (Toàn vẹn):** Dữ liệu không bị thay đổi hoặc phá hỏng trên đường truyền mà không bị phát hiện.

---

## 2. Quy trình hoạt động "Base" của HTTPS (Luồng đầy đủ)

Đây là quy trình chuẩn, từng bước một, xảy ra mỗi khi bạn gõ `https://example.com` vào trình duyệt và nhấn Enter.

1.  **Bước 1: Phân giải DNS**
2.  **Bước 2: Bắt tay TCP**
3.  **Bước 3: Bắt tay TLS** (Đây là bước phức tạp nhất, bao gồm xác thực Certificate và trao đổi khóa)
4.  **Bước 4: Giao tiếp HTTP an toàn**

Chúng ta sẽ đi sâu vào từng bước.

---

## 3. Bước 1: Phân giải DNS (Tìm địa chỉ)

-   **Mục tiêu:** Tìm ra địa chỉ IP của máy chủ `example.com`.
-   **Giải thích:**
    Bạn gõ `https://example.com`. Hành động đầu tiên trình duyệt làm là hỏi hệ điều hành: "IP của `example.com` là gì?". Hệ điều hành sử dụng dịch vụ DNS (giống như "danh bạ điện thoại") để thực hiện truy vấn.
-   **Luồng hoạt động (tóm tắt):**
    1.  Máy của bạn (Client) hỏi **DNS Resolver** (thường là của ISP hoặc `8.8.8.8`).
    2.  Resolver thực hiện một chuỗi truy vấn phân cấp: hỏi **Root Server** (để tìm `.com`), rồi hỏi **TLD Server** (để tìm `example.com`), và cuối cùng hỏi **Authoritative Name Server** (máy chủ giữ bản ghi của `example.com`).
    3.  Resolver nhận được địa chỉ IP (ví dụ: `93.184.216.34`) và trả về cho trình duyệt.

> **Lưu ý quan trọng (Từ tài liệu DNS):**
> Theo truyền thống, các truy vấn DNS này là **plaintext** (văn bản thuần) qua cổng 53 (UDP). Điều này có nghĩa là ISP của bạn _biết_ mọi trang web bạn cố gắng truy cập.
>
> Các giải pháp hiện đại như **DoH (DNS over HTTPS)** hoặc **DoT (DNS over TLS)** được tạo ra để mã hóa chính các truy vấn DNS này, tăng cường sự riêng tư.

---

## 4. Bước 2: Bắt tay TCP (Mở kết nối)

-   **Mục tiêu:** Mở một kết nối mạng ổn định đến máy chủ.
-   **Giải thích:**
    Khi đã có địa chỉ IP (`93.184.216.34`), trình duyệt của bạn cần thiết lập một kết nối TCP (vì HTTP chạy trên TCP).
-   **Luồng hoạt động:**
    Trình duyệt và máy chủ thực hiện **3-Way Handshake** (bắt tay 3 bước) kinh điển:
    1.  **Client -> Server:** `SYN` (Tôi muốn kết nối)
    2.  **Server -> Client:** `SYN-ACK` (OK, tôi sẵn sàng)
    3.  **Client -> Server:** `ACK` (Đã nhận, kết nối được thiết lập)

> **Lưu ý quan trọng:**
> Kết nối này được mở đến một **port** cụ thể.
>
> -   HTTP "trần" dùng cổng **80**.
> -   HTTPS dùng cổng **443**.
>
> Vì bạn gõ `https://`, trình duyệt tự động biết phải kết nối đến cổng **443**.

---

## 5. Bước 3: Bắt tay TLS (Xác thực và Trao đổi khóa)

Đây là "trái tim" của HTTPS. Kết nối TCP đã mở, nhưng nó chưa an toàn. Bây giờ, trình duyệt và máy chủ phải thực hiện **TLS Handshake** (bắt tay TLS) _bên trong_ kết nối TCP đó.

Bắt tay này có 2 mục tiêu chính:

1.  **Xác thực danh tính:** Trình duyệt hỏi "Anh có đúng là `example.com` không?"
2.  **Thiết lập khóa mã hóa:** Cả hai bên đàm phán để tạo ra một **session key** (khóa phiên) dùng chung.

### 5.1. Xác thực (Dùng Certificate)

-   **Vấn đề:** Làm sao trình duyệt biết nó không bị tấn công **Man-in-the-Middle (MITM)**? (Kẻ tấn công giả mạo là `example.com`).
-   **Giải pháp:** Máy chủ `example.com` trình ra **Certificate** của mình.
-   **Luồng xác thực (tóm tắt):**
    1.  **Server gửi Certificate:** Máy chủ gửi **Certificate** của nó (và có thể cả chuỗi chứng thư trung gian) cho trình duyệt.
    2.  **Trình duyệt kiểm tra:** Trình duyệt nhận chứng thư và kiểm tra:
        -   **Tên miền:** Tên miền trong chứng thư (trường **SAN**) có khớp với `example.com` không?
        -   **Hiệu lực:** Chứng thư còn hạn sử dụng không?
        -   **Issuer (Nhà phát hành):** Ai đã ký chứng thư này? (Ví dụ: "Intermediate CA").
    3.  **Kiểm tra Chain of Trust (Chuỗi tin cậy):**
        -   Trình duyệt hỏi: "Tôi có tin 'Intermediate CA' không?".
        -   Nó kiểm tra xem ai đã ký cho 'Intermediate CA'. (Ví dụ: "Root CA").
        -   Trình duyệt tiếp tục hỏi: "Tôi có tin 'Root CA' không?".
        -   Nó tra cứu trong **Certificate Store** được cài sẵn trong Hệ điều hành/Trình duyệt.
        -   Nếu "Root CA" có trong kho tin cậy, chuỗi được xác thực. Trình duyệt tin rằng chứng thư này là hợp lệ và máy chủ đúng là `example.com`.

### 5.2. Trao đổi khóa (Dùng mật mã)

-   **Vấn đề:** Cần tạo ra một **Symmetric Key** (khóa đối xứng) để mã hóa dữ liệu (vì nó nhanh). Nhưng làm sao trao đổi khóa này qua mạng một cách an toàn?
-   **Giải pháp:** Sử dụng **Asymmetric Encryption** (mã hóa bất đối xứng) (chậm hơn) chỉ để trao đổi an toàn cái khóa đối xứng kia.

Có hai cách tiếp cận chính (tùy thuộc vào phiên bản TLS và cấu hình):

| Phương pháp                                            | Cách hoạt động                                                                                                                                                                                                               | Vấn đề / Ưu điểm                                                                                                                                                                                     |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RSA (TLS 1.2)**                                      | 1. Server gửi Public Key (có trong Certificate).<br>2. Client _tự tạo_ một bí mật ("pre-master").<br>3. Client _mã hóa_ bí mật đó bằng Public Key của Server và gửi đi.<br>4. Chỉ Server (với Private Key) mới giải mã được. | **Lỗ hổng:** Thiếu **Perfect Forward Secrecy (PFS)**. Nếu Private Key của Server bị lộ _trong tương lai_, kẻ tấn công có thể giải mã _toàn bộ_ lưu lượng đã ghi âm _trong quá khứ_.                  |
| **Diffie-Hellman (DH/ECDH)**<br>**(TLS 1.3 bắt buộc)** | 1. Client tạo bí mật (X) và gửi phần công khai (G^X).<br>2. Server tạo bí mật (Y) và gửi phần công khai (G^Y).<br>3. Cả hai bên _tự tính toán_ ra cùng một khóa chung (G^XY).                                                | **An toàn:** Đạt được **Perfect Forward Secrecy**. Kẻ tấn công không thể tìm ra khóa chung (G^XY) ngay cả khi có Private Key của Server. Các bí mật (X, Y) là tạm thời và bị hủy sau phiên làm việc. |

> **Kết quả của Bước 3:**
> Khi Bắt tay TLS hoàn tất, cả Trình duyệt (Client) và Máy chủ (Server) đều đã:
>
> 1.  Xác thực danh tính của nhau.
> 2.  Cùng sở hữu một **Symmetric Session Key** ("khóa vàng") bí mật, an toàn.

---

## 6. Bước 4: Giao tiếp HTTP an toàn (Truyền dữ liệu)

-   **Mục tiêu:** Gửi và nhận dữ liệu website.
-   **Giải thích:**
    Giờ đây, "đường hầm" an toàn đã sẵn sàng. Trình duyệt quay lại công việc chính của nó là tải trang web.
-   **Luồng hoạt động:**
    1.  **Client:** Trình duyệt tạo một yêu cầu HTTP "trần" (ví dụ: `GET /index.html HTTP/1.1`).
    2.  **Client (Mã hóa):** Trình duyệt dùng **Session Key** vừa tạo ở Bước 3 để **mã hóa** toàn bộ yêu cầu HTTP này.
    3.  Gói tin đã mã hóa được gửi qua kết nối TCP. (Lúc này ISP chỉ thấy một mớ dữ liệu xáo trộn, không đọc được).
    4.  **Server (Giải mã):** Máy chủ nhận gói tin, dùng **Session Key** (mà nó cũng có) để **giải mã** và đọc yêu cầu HTTP.
    5.  **Server (Xử lý):** Máy chủ xử lý yêu cầu (ví dụ: lấy tệp HTML).
    6.  **Server (Mã hóa):** Máy chủ dùng **Session Key** để **mã hóa** nội dung phản hồi (toàn bộ tệp HTML).
    7.  Gói tin phản hồi đã mã hóa được gửi lại cho Client.
    8.  **Client (Giải mã):** Trình duyệt nhận dữ liệu, dùng **Session Key** để **giải mã** và hiển thị trang web cho bạn. Bạn thấy biểu tượng ổ khóa an toàn.

---

## 7. Tổng kết

Quy trình "base" của HTTPS là một chuỗi phối hợp chặt chẽ của nhiều giao thức, mỗi giao thức giải quyết một vấn đề cụ thể:

1.  **DNS (UDP/53):** Trả lời câu hỏi "Địa chỉ ở đâu?"
2.  **TCP (Port 443):** Trả lời câu hỏi "Làm sao mở một kết nối ổn định?"
3.  **TLS (Certificates + Crypto):** Trả lời hai câu hỏi:
    -   "Tôi có đang nói chuyện đúng người không?" (Xác thực bằng Certificate).
    -   "Chúng ta dùng mật khẩu/khóa gì?" (Trao đổi khóa bằng DH/RSA).
4.  **HTTP (Encrypted):** Cuối cùng, thực hiện công việc chính là "Gửi/Nhận nội dung web" một cách an toàn.

Hy vọng tài liệu này giúp bạn hệ thống hóa được quy trình chuẩn khi thiết lập và gỡ lỗi một kết nối HTTPS!

---
[← Back to README](../README.md)
