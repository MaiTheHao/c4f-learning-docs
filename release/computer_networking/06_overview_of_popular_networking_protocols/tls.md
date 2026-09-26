# Giao thức TLS (Transport Layer Security)

Chúng ta không thể cứ thế gửi các gói tin IP với dữ liệu ở dạng **plaintext** mà bất kỳ ai trên mạng cũng có thể đọc được, vì vậy cần một tiêu chuẩn để mã hóa giao tiếp — đó chính là **TLS (Transport Layer Security)**. Bài viết đi qua các khái niệm cốt lõi của TLS: vị trí trong mô hình mạng, bài toán trao đổi khóa, cách hoạt động của **TLS 1.2 Handshake** với **RSA**, lỗ hổng của RSA, và giải pháp **Diffie-Hellman** trong TLS 1.3.

## Table of Contents

-   [1. TLS nằm ở đâu trong Mô hình OSI và TCP/IP?](#1-tls-nằm-ở-đâu-trong-mô-hình-osi-và-tcpip)
-   [2. Vanilla HTTP - Vấn đề là gì?](#2-vanilla-http---vấn-đề-là-gì)
-   [3. HTTPS (HTTP + TLS) - Giải pháp là gì?](#3-https-http--tls---giải-pháp-là-gì)
-   [4. Bài toán Trao đổi Khóa (The Key Problem)](#4-bài-toán-trao-đổi-khóa-the-key-problem)
-   [5. TLS 1.2 Handshake (Cách làm của RSA)](#5-tls-12-handshake-cách-làm-của-rsa)
-   [6. Lỗ hổng của RSA: Thiếu Perfect Forward Secrecy](#6-lỗ-hổng-của-rsa-thiếu-perfect-forward-secrecy)
-   [7. Giải pháp: Trao đổi khóa Diffie-Hellman (DH)](#7-giải-pháp-trao-đổi-khóa-diffie-hellman-dh)
-   [8. TLS 1.3 - Nhanh hơn, An toàn hơn](#8-tls-13---nhanh-hơn-an-toàn-hơn)
-   [9. Tổng kết](#9-tổng-kết)

---

## 1. TLS nằm ở đâu trong Mô hình OSI và TCP/IP?

TLS có thể chạy trên nhiều giao thức truyền vận khác nhau, nhưng việc xác định chính xác vị trí tầng của TLS thường gây tranh luận do sự khác biệt giữa lý thuyết mô hình và thực tế triển khai:

*   **Trong mô hình OSI (7 tầng):**
    *   **Nếu buộc phải chọn 1 tầng duy nhất:** **Layer 5 (Session Layer)** là đáp án gần đúng nhất. Lý do là TLS mang tính chất **Stateful** — quản lý toàn bộ vòng đời phiên bảo mật, biến phiên (session variables), các thông số bắt tay và bộ khóa mã hóa đối xứng đã thống nhất ngay phía trên **TCP (Layer 4)**.
    *   **Đáp án đầy đủ và chuẩn xác nhất (khi thi cử hoặc phỏng vấn):** TLS trải dài trên cả **Layer 5 (Session)** và **Layer 6 (Presentation)**. TLS đảm nhận việc thiết lập, duy trì phiên an toàn (Session), đồng thời mã hóa, giải mã và nén dữ liệu trước khi chuyển tiếp (Presentation). Cụ thể, TLS chạy trên nền **TCP (Layer 4)** và nằm ngay dưới **HTTP (Layer 7)** — thường được gọi là cơ chế *Transport-Layer Security* hay *Security Sub-layer*.
*   **Trong mô hình TCP/IP (4 tầng thực tế):**
    *   Mô hình TCP/IP không tách riêng Session hay Presentation. Do đó, TLS được xếp trọn vẹn vào **Application Layer**, đóng vai trò là một tầng đệm bảo mật trung gian nằm giữa giao thức truyền vận **TCP** và giao thức ứng dụng cấp cao như **HTTP**.

| Mô hình | Vị trí phân tầng của TLS | Vai trò cốt lõi |
| :--- | :--- | :--- |
| **OSI (7 tầng)** | **Layer 5 (Session)** & **Layer 6 (Presentation)** | Quản lý trạng thái phiên bắt tay, thỏa thuận khóa, mã hóa và giải mã dữ liệu payload |
| **TCP/IP (4 tầng)** | **Application Layer** (Sub-layer trên TCP) | Đóng gói bảo mật trung gian giữa **TCP (Transport)** và **HTTP (Application)** |


---

## 2. Vanilla HTTP - Vấn đề là gì?

Hãy xem HTTP hoạt động như thế nào khi _không_ có mã hóa (thường là trên cổng 80).

1.  **Bắt tay TCP:** Client và Server thực hiện bắt tay 3 bước (SYN, SYN-ACK, ACK) để mở một kết nối TCP.
2.  **Gửi yêu cầu:** Client gửi một yêu cầu HTTP. Về cơ bản, nó là một tệp văn bản thuần túy:
    ```
    GET /index.html HTTP/1.1
    Host: example.com
    ...
    ```
3.  **Phân đoạn:** Yêu cầu này được chia thành các phân đoạn TCP (TCP segments), sau đó đóng gói thành các gói tin IP (IP packets) và gửi đi.
4.  **Phản hồi:** Server nhận được, hiểu yêu cầu, và gửi lại một phản hồi (cũng là văn bản thuần túy):

    ```
    HTTP/1.1 200 OK
    Content-Type: text/html

    <html>...</html>
    ```

> **Vấn đề chí mạng:**
> Mọi thứ đều là **plaintext**. Bất kỳ ai ở giữa (như Router, hoặc nhà cung cấp dịch vụ Internet - ISP, nơi mà tất cả các gói tin IP của bạn phải đi qua) đều có thể _nhìn thấy_ chính xác yêu cầu của bạn và nội dung trang web bạn nhận được.

---

## 3. HTTPS (HTTP + TLS) - Giải pháp là gì?

Để khắc phục điều này, chúng ta sử dụng HTTPS (HTTP qua TLS). Luồng hoạt động có thêm một bước quan trọng:

1.  **Bắt tay TCP:** (Giống như trên).
2.  **Bắt tay TLS (TLS Handshake):** _Đây là bước mới\!_ Trước khi gửi bất kỳ dữ liệu HTTP nào, Client và Server thực hiện một loạt các bước đàm phán.
3.  **Mục tiêu của Handshake:** Mục tiêu cuối cùng của quá trình này là để cả Client và Server cùng sở hữu một **Symmetric Key** (khóa đối xứng) bí mật.
4.  **Giao tiếp an toàn:**
    -   Client dùng khóa bí mật này để _mã hóa_ yêu cầu `GET /...`.
    -   Gói tin được mã hóa đi qua mạng (ISP không thể đọc được).
    -   Server dùng _chính khóa bí mật đó_ để _giải mã_ yêu cầu.
    -   Server _mã hóa_ phản hồi (HTML,...) bằng khóa đó và gửi lại.

Câu hỏi là: Làm thế nào để Client và Server có thể trao đổi cái khóa bí mật đó một cách an toàn? Đây chính là "chìa khóa" (pun intended) của vấn đề.

---

## 4. Bài toán Trao đổi Khóa (The Key Problem)

Chúng ta có hai loại thuật toán mã hóa chính:

| Loại               | **Symmetric** (Mã hóa Đối xứng)                                                                                       | **Asymmetric** (Mã hóa Bất đối xứng)                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Cách hoạt động** | Dùng **cùng 1 khóa** để mã hóa và giải mã.                                                                            | Dùng 1 khóa để mã hóa (**Public Key**) và 1 khóa _khác_ để giải mã (**Private Key**). |
| **Tốc độ**         | **Siêu nhanh.** (Thường dùng phép toán XOR, cực kỳ nhanh cho CPU).                                                    | **Siêu chậm.** (Dựa trên các phép toán mũ, rất tốn CPU và năng lượng).               |
| **Vấn đề**         | Làm thế nào để _chia sẻ_ cái khóa duy nhất đó một cách an toàn? (Bạn không thể gửi nó qua mạng, kẻ gian sẽ bắt được). | Rất chậm, không thể dùng để mã hóa lượng lớn dữ liệu (như một file JavaScript 16MB). |

> [!NOTE]
> **Giải pháp kết hợp của TLS:**
>
> - **Client**: Chào Server, tôi muốn thiết lập kết nối an toàn.
> - **Server**: Chào Client, đây là **Certificate** chứa **Public Key** của tôi.
> - **Client**: Đã nhận khóa. Tôi tự sinh ngẫu nhiên một **Symmetric Key** cho phiên này, mã hóa nó bằng **Public Key** của Server rồi gửi lại.
> - **Server**: Nhận được rồi. Tôi dùng **Private Key** của mình để giải mã và trích xuất **Symmetric Key**.
>
> Sau bước này, cả hai bên đều sở hữu cùng một **Symmetric Key**. Mọi dữ liệu HTTP sau đó đều được mã hóa đối xứng (vừa bảo mật, vừa đạt tốc độ xử lý phần cứng cao).

---

## 5. TLS 1.2 Handshake (Cách làm của RSA)

Đây là cách TLS 1.2 từng triển khai rộng rãi, sử dụng thuật toán **RSA** để vận chuyển khóa (Key Transport).

1. **Bắt tay TCP:** Hoàn tất 3 bước (SYN, SYN-ACK, ACK).
2. **Client Hello:** Client gửi lời chào kèm danh sách các Cipher Suite hỗ trợ (ví dụ: trao đổi khóa bằng RSA, mã hóa đối xứng bằng AES).
3. **Server Hello & Certificate:** Server chọn Cipher Suite phù hợp và gửi lại **Certificate** (chứa **Public Key** của Server).
4. **Client sinh Pre-Master Secret:**
    - Client xác thực tính hợp lệ của Certificate (hạn dùng, CA tin cậy, tên miền trùng khớp).
    - Client tự tạo một chuỗi ngẫu nhiên bí mật gọi là **Pre-Master Secret**.
    - Client dùng **Public Key** của Server để mã hóa Pre-Master Secret này.
5. **Client Key Exchange:** Client gửi Pre-Master Secret đã mã hóa sang cho Server. Kẻ đứng giữa (ISP, Router) nếu bắt được gói tin cũng không thể giải mã.
6. **Server giải mã:** Server dùng **Private Key** bí mật của mình để giải mã và thu được Pre-Master Secret.
7. **Finished & Chuyển sang Symmetric Encryption:**
    - Cả hai bên độc lập đưa Pre-Master Secret qua hàm suy dẫn khóa để sinh ra bộ **Session Keys** (Symmetric Key dùng cho mã hóa payload và khóa xác thực tính toàn vẹn MAC).
    - Hai bên gửi thông điệp `Finished` (được mã hóa bằng Session Key mới) để xác thực toàn bộ quá trình bắt tay không bị giả mạo.

Kể từ thời điểm này, toàn bộ dữ liệu HTTP payload được bảo vệ bằng Symmetric Key.

---

## 6. Lỗ hổng của RSA: Thiếu Perfect Forward Secrecy

Cơ chế trao đổi khóa bằng RSA ẩn chứa một điểm yếu cốt tử về mặt thiết kế: không hỗ trợ **PFS (Perfect Forward Secrecy - Tính bảo mật chuyển tiếp hoàn hảo)**.

Hãy xét kịch bản tấn công hồi cứu (Retrospective Decryption):

1. **Ghi lại dữ liệu (Record):** Kẻ tấn công ở vị trí trung gian (như ISP hoặc kẻ nghe lén) ghi lại toàn bộ lưu lượng TLS đã mã hóa của người dùng trong nhiều tháng hoặc nhiều năm. Tại thời điểm đó, dữ liệu hoàn toàn an toàn do không có khóa để giải mã.
2. **Đánh cắp khóa dài hạn (Compromise):** Nhiều năm sau, kẻ tấn công xâm nhập được vào máy chủ hoặc khai thác lỗ hổng rò rỉ bộ nhớ (như lỗ hổng **Heartbleed**) để lấy cắp **Private Key** dài hạn của Server.
3. **Thảm họa giải mã hàng loạt:**
    - Kẻ tấn công mở lại kho dữ liệu đã thu thập trong quá khứ.
    - Dùng Private Key giải mã gói tin `Client Key Exchange` của từng phiên để trích xuất Pre-Master Secret.
    - Tái tạo lại Session Keys của từng phiên và giải mã toàn bộ dữ liệu lịch sử của hàng triệu người dùng.

> [!IMPORTANT]
> **Bản chất của PFS và sự khác biệt với thời hạn Certificate:**
> - **PFS** đảm bảo rằng việc **Private Key dài hạn bị lộ trong tương lai không làm phương hại đến tính bí mật của các phiên hội thoại trong quá khứ**. Muốn đạt được PFS, khóa phiên bắt buộc phải được thỏa thuận tạm thời (ephemeral) và bị hủy ngay sau khi phiên kết thúc.
> - **Lưu ý để tránh nhầm lẫn:** Việc các tổ chức CA rút ngắn thời hạn Certificate (từ vài năm xuống 90 ngày) là để **giảm thiểu cửa sổ mạo danh Server** khi chứng thư bị xâm phạm hoặc mất kiểm soát (do cơ chế thu hồi CRL/OCSP trên Internet thiếu tin cậy). Việc rút ngắn thời hạn Certificate **hoàn toàn không tạo ra PFS** cho phương thức mã hóa RSA cổ điển.

---

## 7. Giải pháp: Trao đổi khóa Diffie-Hellman (DH)

Để đạt được PFS, hệ thống chuyển sang sử dụng giao thức thỏa thuận khóa **Diffie-Hellman (DH)** (hoặc phiên bản đường cong elliptic **ECDH**). Với DH, **Private Key dài hạn của Server không còn được dùng để mã hóa hay suy dẫn khóa phiên nữa**.

### Nguyên lý toán học cốt lõi (Bài toán Logarithm Rời rạc)

Diffie-Hellman dựa trên tính bất đối xứng của hàm một chiều modulo:
- Cho số nguyên tố lớn $p$ và phần tử sinh $g$.
- Hai bên sinh số bí mật ngẫu nhiên: Client giữ số $x$, Server giữ số $y$.
- Client tính phần công khai: $A = g^x \pmod p$ rồi gửi cho Server.
- Server tính phần công khai: $B = g^y \pmod p$ rồi gửi cho Client.
- Nhờ tính chất số học modulo, hai bên tính ra bí mật chung $K$:
  - Client tính: $K = B^x \pmod p = (g^y)^x \pmod p = g^{xy} \pmod p$
  - Server tính: $K = A^y \pmod p = (g^x)^y \pmod p = g^{xy} \pmod p$

Kẻ nghe lén bắt được $g, p, A, B$ trên đường truyền không thể tính ngược lại $x$ hay $y$ trong thời gian khả thi vì vướng bài toán **Discrete Logarithm Problem (DLP)**, do đó không thể biết được $K$.

### Luồng bắt tay thực tế & Chống tấn công Man-In-The-Middle (MITM)

Nếu chỉ trao đổi $A$ và $B$ đơn thuần, kẻ đứng giữa có thể đóng giả cả hai bên (MITM attack). Do đó, vai trò của **Certificate** xuất hiện tại đây:

1. **Client Hello:** Gửi thông số đề xuất và tham số DH của Client ($g^x \pmod p$).
2. **Server Hello & Server Key Exchange:**
    - Server gửi tham số DH của mình ($g^y \pmod p$).
    - **Quan trọng:** Server dùng **Private Key dài hạn** (trong Certificate) để **ký số (Digital Signature)** lên các tham số DH này.
    - Server gửi kèm **Certificate** để Client xác minh chữ ký.
3. **Client xác thực & Tính khóa:**
    - Client kiểm tra Certificate và xác thực chữ ký số bằng Public Key của Server (loại bỏ hoàn toàn rủi ro MITM).
    - Cả hai bên độc lập tính ra $K = g^{xy} \pmod p$, từ đó suy dẫn ra Session Keys đối xứng.

> [!NOTE]
> **Tại sao cơ chế này thỏa mãn Perfect Forward Secrecy (DHE / ECDHE)?**
> Ký tự **E** đại diện cho **Ephemeral** (tạm thời). Các giá trị bí mật $x$ và $y$ chỉ tồn tại trong bộ nhớ RAM trong khoảnh khắc bắt tay rồi bị hủy ngay lập tức. Sau này, dù kẻ tấn công có đánh cắp được Private Key dài hạn của Server, khóa đó chỉ là khóa ký số xác thực, hoàn toàn không thể dùng để giải mã ngược ra $g^{xy} \pmod p$. Quá khứ được an toàn tuyệt đối.

---

## 8. TLS 1.3 - Nhanh hơn, An toàn hơn

TLS 1.2 vẫn duy trì RSA key transport vì mục đích tương thích ngược, nhưng **TLS 1.3** đã loại bỏ hoàn toàn RSA và các thuật toán không hỗ trợ PFS.

- **Bắt buộc Forward Secrecy:** 100% các phiên trao đổi khóa đều phải dùng các thuật toán tạm thời hỗ trợ PFS (chủ yếu là ECDHE như X25519 hoặc P-256).
- **Tối ưu hóa độ trễ (Chỉ 1-RTT Handshake):**
    - Trong TLS 1.2, Client và Server cần 2 round-trip (RTT) để thương lượng thông số rồi mới trao đổi khóa.
    - TLS 1.3 giả định trước nhóm đường cong phổ biến: Client gửi luôn phần chia sẻ khóa công khai ($g^x$) ngay trong gói tin **Client Hello** đầu tiên (`Key Share`). Server lập tức tính ra Session Key và phản hồi lại phần của mình ($g^y$) cùng Certificate. Handshake hoàn tất chỉ sau **1-RTT**.
- **0-RTT Resumption (Early Data) và đánh đổi bảo mật:**
    - Với các kết nối lặp lại, TLS 1.3 hỗ trợ tính năng **0-RTT**, cho phép gửi dữ liệu HTTP được mã hóa ngay trong gói tin đầu tiên dựa trên Session Ticket trước đó.
    - > [!WARNING]
      > **Cảnh báo an toàn của 0-RTT:** Dữ liệu Early Data trong 0-RTT **không có tính chất PFS** và dễ bị tổn thương trước hình thức tấn công phát lại (**Replay Attack**). Kẻ tấn công có thể bắt lại gói 0-RTT và gửi lại lên máy chủ. Do đó, 0-RTT chỉ an toàn khi dùng cho các yêu cầu phi trạng thái, mang tính bình đẳng phép toán (**Idempotent** như `GET`), tuyệt đối không dùng cho các giao dịch nhạy cảm (như lệnh chuyển tiền hay thay đổi mật khẩu).

---

## 9. Tổng kết

- **HTTP không mã hóa:** Truyền tải dữ liệu dạng plaintext, dễ bị nghe lén và can thiệp trên toàn bộ đường truyền.
- **HTTPS:** HTTP chạy trên tầng bảo mật TLS, kết hợp giữa mã hóa bất đối xứng (để thỏa thuận khóa) và mã hóa đối xứng (để mã hóa luồng dữ liệu).
- **TLS 1.2 (RSA Key Transport):** Client dùng Public Key của Server để mã hóa Pre-Master Secret. Điểm yếu: **Không có PFS**, nếu lộ Private Key của Server thì toàn bộ dữ liệu lịch sử bị giải mã.
- **TLS 1.2/1.3 (DHE / ECDHE):** Hai bên tự tính ra khóa chung mà không gửi khóa qua mạng. Đạt được **PFS**, bảo vệ tuyệt đối dữ liệu quá khứ.
- **TLS 1.3:** Chuẩn hóa chỉ dùng các bộ mã có PFS, rút ngắn Handshake xuống **1-RTT** và hỗ trợ **0-RTT** (đi kèm lưu ý về Replay Attack).

Hi vọng bài giảng này đã giúp bạn hiểu rõ hơn về "đường hầm" an toàn này\!

Bạn có muốn chúng ta tiếp tục tìm hiểu về vai trò của **Certificate (Chứng thư số)** và cách nó xác thực danh tính của máy chủ không?

---

## Liên quan

*   [Giao thức SSH (Secure Shell)](./ssh.md) — Đối chiếu cơ chế bảo vệ phiên quản trị từ xa, mô hình tín nhiệm TOFU phi tập trung với WebPKI CA của TLS.
*   [Giao thức HTTPS](./https.md) — Tìm hiểu cách TLS kết hợp cùng giao thức HTTP để bảo vệ ứng dụng web trên môi trường Internet.

---
[← Back to README](../README.md)
