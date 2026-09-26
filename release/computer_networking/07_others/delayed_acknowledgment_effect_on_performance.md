# Thuật toán Delayed Acknowledgment (ACK Trì hoãn) và Hiệu suất

Giống như Nagle, **Delayed Acknowledgment** cũng xuất phát từ một ý tưởng tiết kiệm băng thông: thay vì trả **ACK** cho từng segment, phía nhận gộp nhiều ACK làm một. Tài liệu này phân tích ý tưởng đó, thảm họa **deadlock** khi Delayed ACK kết hợp với **Nagle's Algorithm**, và giải pháp bằng tùy chọn socket **`TCP_QUICKACK`**.

## Table of Contents

-   [1. Ý tưởng của Delayed ACK: Tiết kiệm là tốt?](#1-ý-tưởng-của-delayed-ack-tiết-kiệm-là-tốt)
-   [2. Thảm họa: Khi Delayed ACK gặp Nagle](#2-thảm-họa-khi-delayed-ack-gặp-nagle)
-   [3. Giải pháp: `TCP_QUICKACK`](#3-giải-pháp-tcp_quickack)
-   [4. Tổng kết](#4-tổng-kết)

---
## 1. Ý tưởng của Delayed ACK: Tiết kiệm là tốt?

Giống như Nagle, thuật toán này cũng xuất phát từ một ý tưởng tốt: Tiết kiệm băng thông.

> **Vấn đề:**
>
> Thật lãng phí khi phải gửi một gói tin ACK (Acknowledgement) ngay lập tức cho _mỗi_ segment dữ liệu nhận được. Một gói tin ACK về cơ bản là "rỗng" (chỉ chứa header), nó cũng chiếm băng thông và tài nguyên xử lý.

> **Giải pháp (của Delayed ACK):**
>
> Thay vì ACK ngay, phía nhận (receiver) sẽ **trì hoãn** việc gửi ACK. Nó sẽ đợi một chút (ví dụ: 100ms - 400ms) để xem có nhận thêm segment nào nữa không. Nếu có, nó có thể gửi **một gói tin ACK duy nhất** để xác nhận cho tất cả các segment đã nhận.
>
> Đây chính là ý tưởng "một ACK để cai trị tất cả" (one ack to rule them all).

> **Ví dụ trừu tượng (Người nhận hàng lười biếng):**
>
> -   Bạn (Sender) gửi 4 gói hàng liên tiếp (Segments 1-4).
> -   Người nhận (Receiver) nhận được gói 1. Thay vì gọi bạn ngay để "Xác nhận", anh ta nghĩ: "Chắc là còn nữa. Đợi một lát xem sao, gọi một thể cho đỡ tốn điện thoại."
> -   Anh ta đợi, nhận thêm gói 2, 3, 4.
> -   Cuối cùng, anh ta gọi bạn một cuộc (One ACK) và nói: "Tôi nhận đủ cả 4 gói rồi nhé."
> -   -> Tiết kiệm được 3 cuộc gọi (3 gói tin ACK).

Bản thân việc trì hoãn này đã có thể gây ra vấn đề: phía gửi có thể nghĩ rằng gói tin của mình đã bị mất (vì không thấy ACK) và kích hoạt **Retransmission** một cách không cần thiết, gây lãng phí.

---

## 2. Thảm họa: Khi Delayed ACK gặp Nagle

Nhưng thảm họa thực sự xảy ra khi bạn kết hợp cả hai thuật toán này với nhau. Hãy quay lại ví dụ gửi **5000 bytes** (với MSS là 1460 bytes) từ bài trước.

Nó sẽ được chia thành 3 segment đầy (1460B) và 1 segment "non" (620B).

**Đây là luồng "chết chóc" khi cả Nagle và Delayed ACK cùng được bật:**

1.  **Bước 1: Phía gửi (Client A) gửi dữ liệu:** Client A gửi đi 3 segment đầy (1460 bytes) liên tiếp.
2.  **Bước 2: Nagle kích hoạt (Phía gửi A):** Client A còn 620 byte cuối cùng (segment "non"). **Thuật toán Nagle** (ở A) chặn nó lại và nói: "Không được gửi! Hãy đợi cho đến khi nhận được ACK cho 3 segment kia đã."
3.  **Bước 3: Delayed ACK kích hoạt (Phía nhận B):** Server B nhận được 3 segment đầy. **Thuật toán Delayed ACK** (ở B) kích hoạt và nói: "Đừng gửi ACK vội! Hãy đợi một chút (ví dụ 400ms) xem A có gửi thêm dữ liệu không, mình gộp ACK một thể."
4.  **Bước 4: Deadlock (Chờ đợi lẫn nhau):**
    -   Client A (Nagle) đang **chờ** Server B gửi **ACK**.
    -   Server B (Delayed ACK) đang **chờ** A gửi thêm dữ liệu (hoặc chờ timer 400ms hết).
    -   **Kết quả:** Một khoảng trễ "**chết**" (**brutal delay**) lên tới **400ms** mà không ai làm gì cả. Cả hai bên đều đang đợi nhau.
5.  **Bước 5: Hết giờ:** Cuối cùng, timer của Delayed ACK (ở B) hết. B "chịu thua" và gửi đi một gói tin ACK, xác nhận 3 segment đầu tiên.
6.  **Bước 6: Gửi nốt:** A nhận được ACK, Nagle được "mở khóa". Chỉ _sau đó_ A mới được phép gửi nốt 620 byte cuối cùng.

> **Ghi nhớ: Thảm họa Nagle + Delayed ACK**
>
> Thảm họa này xảy ra vì hai thuật toán "chờ đợi" ở hai đầu đường truyền:
>
> -   **Phía gửi (Nagle):** Chờ ACK để gửi segment nhỏ.
> -   **Phía nhận (Delayed ACK):** Chờ thêm segment để gửi ACK.
>
> Cả hai cùng "chờ" nhau, gây ra một độ trễ rất lớn và hoàn toàn không cần thiết.

---

## 3. Giải pháp: `TCP_QUICKACK`

Giống như Nagle, chúng ta cũng có thể tắt Delayed Acknowledgment.

Giải pháp là bật một tùy chọn socket (socket option) có tên là **`TCP_QUICKACK`**.

-   Việc bật `TCP_QUICKACK` (set `TCP_QUICKACK` = true) sẽ **TẮT** thuật toán Delayed Acknowledgment.
-   Điều này yêu cầu hệ điều hành gửi ACK ngay lập tức, không trì hoãn.
-   Đây là một tùy chọn socket ở tầng thấp (**low-level**), có sẵn trong các ngôn ngữ như C và đôi khi được "phơi" ra trong các môi trường như Node.js hoặc Python.

---

## 4. Tổng kết

-   **Delayed Acknowledgment (ACK Trì hoãn)** là một cơ chế phía _người nhận_ (receiver-side) nhằm giảm số lượng gói tin ACK bằng cách đợi và gộp nhiều ACK làm một.
-   Bản thân nó có thể gây trễ nhẹ và làm **Sender** tưởng nhầm là mất gói, trigger **Retransmission**.
-   **Thảm họa hiệu suất** xảy ra khi **Delayed ACK** (phía nhận) kết hợp với **Nagle's Algorithm** (phía gửi).
-   **Deadlock:** Hai cơ chế này "chờ đợi lẫn nhau", có thể gây ra độ trễ "chết" lên đến hàng trăm mili giây (ví dụ: 400ms).
-   Giải pháp là tắt Delayed ACK bằng cách bật tùy chọn socket **`TCP_QUICKACK`**.
-   Đối với các ứng dụng yêu cầu độ trễ thấp (như game, chat, hoặc các API request nhanh), các lập trình viên thường tắt cả Nagle (bằng **`TCP_NODELAY`**) và Delayed ACK (bằng **`TCP_QUICKACK`**).

---
[← Back to README](../README.md)
