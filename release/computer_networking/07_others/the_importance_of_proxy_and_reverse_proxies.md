# Proxy vs. Reverse Proxy: Giải mã "Người gác cổng" Mạng

Cả **Proxy** và **Reverse Proxy** đều là những "người gác cổng" của mạng, nhưng đứng hai phía ngược nhau: Proxy đi ra ngoài thay cho **Client**, còn Reverse Proxy đứng trước chặn traffic đi vào **backend**. Tài liệu này giải mã bản chất hai công nghệ đó qua các ẩn dụ trực quan, luồng hoạt động kỹ thuật, các trường hợp sử dụng thực tiễn, và bảng so sánh L4/L7 mức độ cùng tồn tại với **VPN** hay **HTTPS**.

## Table of Contents

-   [1. Proxy là gì?](#1-proxy-là-gì)
-   [2. Các trường hợp sử dụng Proxy](#2-các-trường-hợp-sử-dụng-proxy)
-   [3. Reverse Proxy là gì?](#3-reverse-proxy-là-gì)
-   [4. Các trường hợp sử dụng Reverse Proxy](#4-các-trường-hợp-sử-dụng-reverse-proxy)
-   [5. So sánh nhanh Proxy và Reverse Proxy](#5-so-sánh-nhanh-proxy-và-reverse-proxy)
-   [6. Các câu hỏi thường gặp (FAQs)](#6-các-câu-hỏi-thường-gặp-faqs)
-   [7. Tổng kết](#7-tổng-kết)

---

## 1. Proxy là gì?

**Proxy** (hay **Forward Proxy**) là một máy chủ trung gian **thực hiện các yêu cầu thay mặt cho bạn** (client) khi đi ra ngoài Internet.

> **Ví dụ trực quan (Người Quản gia):**
>
> -   **Bạn (Client):** Muốn lấy một cuốn sách từ Thư viện (ví dụ: `google.com`).
> -   **Đích đến:** Bạn *biết rõ* địa chỉ Thư viện là `google.com`.
> -   **Người Quản gia (Proxy):** Bạn không tự đi. Thay vào đó, bạn nói với người Quản gia (`my-proxy.com`): "Hãy đến `google.com` và lấy cuốn sách này cho tôi."
> -   **Hành động:** Người Quản gia *tự mình* đi đến Thư viện, lấy sách và mang về cho bạn.
> -   **Kết quả:** Thư viện (`google.com`) chỉ biết rằng ông Quản gia (`my-proxy.com`) đã đến lấy sách. Họ *không hề biết* cuốn sách đó là dành cho bạn.

### 1.1. Luồng hoạt động Kỹ thuật

1.  **Bước 1 - Cấu hình:** Máy Client (bạn) được cấu hình để trỏ traffic đến máy chủ Proxy (ví dụ: `my-proxy.com`).
2.  **Bước 2 - Kết nối Client -> Proxy:** Khi bạn truy cập `google.com`, máy của bạn tạo một **kết nối TCP** trực tiếp với `my-proxy.com`.
3.  **Bước 3 - Gửi yêu cầu:** Bên trong kết nối đó, bạn gửi một yêu cầu HTTP/HTTPS chỉ định đích đến (ví dụ: `CONNECT google.com:443` hoặc `GET http://google.com`).
4.  **Bước 4 - Kết nối Proxy -> Server:** Proxy nhận yêu cầu, tạo một **kết nối TCP hoàn toàn mới** từ chính IP của nó đến `google.com`.
5.  **Bước 5 - Che giấu IP:** Từ góc độ máy chủ đích, `google.com` *chỉ* thấy kết nối đến từ IP của Proxy, hoàn toàn ẩn danh IP gốc của bạn.

> **Định nghĩa cốt lõi:**
>
> -   **Client (Bạn) BIẾT** máy chủ đích cuối cùng.
> -   **Máy chủ đích KHÔNG BIẾT** Client thực sự là ai (chỉ thấy Proxy).

---

## 2. Các trường hợp sử dụng Proxy

-   **Anonymity** (Ẩn danh): Ẩn địa chỉ IP thật của bạn khỏi máy chủ đích để bảo vệ quyền riêng tư.
-   **Caching** (Bộ nhớ đệm): Proxy trong mạng doanh nghiệp hoặc trường học lưu bản sao các trang web tĩnh. Nếu nhiều người cùng truy cập một tài liệu, Proxy chỉ tải một lần từ Internet và phân phối nội bộ.
-   **Content Filtering** (Chặn truy cập): Kiểm soát và chặn các tên miền không mong muốn (mạng xã hội, cờ bạc, website độc hại) trước khi request rời khỏi mạng nội bộ.
-   **Logging & Monitoring** (Giám sát): Ghi nhận toàn bộ luồng request ra ngoài của hệ thống. Trong kiến trúc **Service Mesh**, Sidecar Proxy (như Envoy) chạy cạnh microservice để đo lường độ trễ và **tracing**.
-   **Debugging** (Gỡ lỗi mạng): Các công cụ như Charles Proxy hay Fiddler đứng giữa ứng dụng và Internet, hỗ trợ can thiệp và kiểm tra cấu trúc **request/response**.

---

## 3. Reverse Proxy là gì?

**Reverse Proxy** (Proxy Đảo ngược) là máy chủ trung gian đại diện cho **hệ thống backend**, đứng trước các máy chủ dịch vụ để tiếp nhận toàn bộ traffic từ client gửi đến.

> **Ví dụ trực quan (Người Lễ tân Tổng đài):**
>
> -   **Bạn (Client):** Muốn gọi điện cho một công ty lớn (ví dụ: `google.com`).
> -   **Đích đến:** Bạn *chỉ biết* số Tổng đài duy nhất (`google.com`). Bạn *không hề biết* số máy lẻ của phòng Kế toán hay phòng Kỹ thuật.
> -   **Người Lễ tân (Reverse Proxy):** Người Lễ tân nhấc máy. Đây là điểm chạm duy nhất mà bạn kết nối.
> -   **Hành động:** Bạn nói: "Tôi muốn thanh toán hóa đơn" (`/api/billing`). Lễ tân tự động chuyển tiếp cuộc gọi đến máy chủ Kế toán nội bộ. Nếu bạn nói "Tôi muốn đọc tin tức" (`/news`), Lễ tân chuyển hướng đến máy chủ Tin tức.
> -   **Kết quả:** Bạn hoàn toàn không biết cấu trúc cụ thể đằng sau gồm bao nhiêu máy chủ, chỉ tương tác với duy nhất một đầu mối.

### 3.1. Luồng hoạt động Kỹ thuật

1.  **Bước 1 - Client gọi Reverse Proxy:** Client kết nối TCP đến địa chỉ công khai của Reverse Proxy (ví dụ qua DNS của `google.com`) và tin rằng đó là máy chủ cuối.
2.  **Bước 2 - Ẩn giấu Hạ tầng:** Client không thể nhìn thấy IP nội bộ hoặc topology của các máy chủ backend phía sau.
3.  **Bước 3 - Điều phối Backend:** Reverse Proxy nhận request, phân tích quy tắc (**routing rules**, **header**, **path**) rồi mở kết nối nội bộ đến máy chủ upstream phù hợp để lấy dữ liệu trả về cho Client.

> **Định nghĩa cốt lõi:**
>
> -   **Client (Bạn) KHÔNG BIẾT** máy chủ nội bộ nào thực sự xử lý yêu cầu.
> -   **Client (Bạn) CHỈ BIẾT** Reverse Proxy là điểm đến duy nhất.

---

## 4. Các trường hợp sử dụng Reverse Proxy

-   **Load Balancing** (Cân bằng tải): Phân phối traffic đồng đều đến cụm máy chủ backend qua các thuật toán (`Round-robin`, `Least Connections`, `IP Hash`), tránh quá tải cục bộ.
-   **SSL/TLS Termination:** Đảm nhận toàn bộ việc giải mã HTTPS và quản lý chứng chỉ SSL ngay tại cổng vào, giúp các máy chủ backend giảm tải xử lý CPU mã hóa/giải mã.
-   **API Gateway / Ingress Routing:** Cổng phân luồng trung tâm cho kiến trúc Microservices (như Nginx, Kong, Traefik, K8s Ingress), điều hướng request theo URI:
    -   `/api/users` -> Tới User Service.
    -   `/api/orders` -> Tới Order Service.
-   **CDN (Content Delivery Network):** Mạng lưới phân phối nội dung thực chất là hệ thống Reverse Proxy phân tán toàn cầu, lưu cache dữ liệu tĩnh gần người dùng nhất để tối ưu tốc độ tải.
-   **Security & WAF** (Tường lửa ứng dụng): Ngăn chặn các cuộc tấn công DDoS, SQL Injection, XSS và ẩn giấu hoàn toàn địa chỉ IP thật của máy chủ ứng dụng.
-   **Canary & Blue-Green Deployment:** Điều phối tỷ lệ traffic (ví dụ 95% request vào phiên bản **v1**, 5% vào phiên bản **v2**) để kiểm thử tính năng mới mà không gây gián đoạn dịch vụ.

---

## 5. So sánh nhanh Proxy và Reverse Proxy

| Tiêu chí | Forward Proxy | Reverse Proxy |
| :--- | :--- | :--- |
| **Đại diện cho** | Client (Người gửi yêu cầu) | Máy chủ Backend (Hệ thống tiếp nhận) |
| **Bảo vệ / Che giấu** | IP và danh tính thật của Client | Cấu trúc mạng và IP thật của Server |
| **Vị trí đứng** | Cổng ra mạng nội bộ Client (Egress) | Cổng vào hạ tầng máy chủ (Ingress) |
| **Use case chính** | Vượt tường lửa, lọc web, ẩn danh, client cache | Cân bằng tải, SSL Termination, API Gateway, WAF |

---

## 6. Các câu hỏi thường gặp (FAQs)

> **Có thể sử dụng Proxy và Reverse Proxy cùng một lúc không?**
>
> **Có.** Khi bạn ngồi trong mạng công ty dùng **Forward Proxy** để duyệt web, request đi qua Forward Proxy ra ngoài Internet, sau đó chạm vào **Reverse Proxy** (như Cloudflare/Nginx) của nhà cung cấp dịch vụ trước khi tới cụm máy chủ Backend.

> **Proxy có thể dùng thay VPN để bảo mật hoàn toàn không?**
>
> **Không hẳn.** Proxy thông thường hoạt động ở tầng ứng dụng hoặc phiên (**Layer 4/Layer 7**), chỉ chuyển tiếp traffic cho các ứng dụng được cấu hình cụ thể. VPN hoạt động ở tầng mạng (**Layer 3**), mã hóa toàn bộ dữ liệu IP xuất phát từ thiết bị của bạn.

> **Proxy có đọc được nội dung traffic HTTPS không?**
>
> -   **Chế độ HTTP Tunneling (`CONNECT`):** Proxy chỉ mở kết nối TCP thô giữa Client và Server. Dữ liệu TLS được mã hóa đầu cuối nên Proxy hoàn toàn không đọc được nội dung bên trong.
> -   **Chế độ SSL Interception (MitM):** Proxy của tổ chức có thể giải mã và đọc được HTTPS nếu thiết bị Client cài đặt sẵn **Root CA** do chính tổ chức đó cung cấp.

---

## 7. Tổng kết

Sơ đồ sequence dưới đây tổng kết hai kịch bản "gác cổng": **Forward Proxy** kiểm soát outbound traffic từ Client phía nội bộ ra Internet, và **Reverse Proxy** kiểm soát inbound traffic từ Internet vào hạ tầng backend.

```mermaid
sequenceDiagram
    autonumber

    %% --- KỊCH BẢN 1: FORWARD PROXY ---
    box "Mạng Nội Bộ (Internal Network)"
        participant Client as Internal Client
        participant FProxy as Forward Proxy
    end
    participant Origin as Origin Server<br/>(Internet)

    Note over Client, Origin: CASE 1: FORWARD PROXY (Kiểm soát Outbound Traffic)

    Client->>FProxy: 1. Khởi tạo Request (Target: Origin)
    activate FProxy
    Note right of FProxy: Masking Client IP<br/>Filtering / Caching
    FProxy->>Origin: 2. Chuyển tiếp (Source IP: Proxy)
    deactivate FProxy

    activate Origin
    Note left of Origin: Origin chỉ thấy IP của Proxy
    Origin-->>FProxy: 3. Phản hồi Response
    deactivate Origin

    activate FProxy
    FProxy-->>Client: 4. Trả về Client
    deactivate FProxy

    %% --- KHOẢNG CÁCH ---
    Note over Client, Origin:  

    %% --- KỊCH BẢN 2: REVERSE PROXY ---
    participant ExtUser as External Client<br/>(Internet)
    box "Hạ Tầng Backend (Internal/DMZ)"
        participant RProxy as Reverse Proxy<br/>(Gateway)
        participant Upstream as Upstream Server
    end

    Note over ExtUser, Upstream: CASE 2: REVERSE PROXY (Kiểm soát Inbound Traffic)

    ExtUser->>RProxy: 1. Gửi Request (Target: Public IP)
    activate RProxy
    Note left of RProxy: Client chỉ thấy Reverse Proxy
    Note right of RProxy: Load Balancing<br/>SSL Termination / WAF
    RProxy->>Upstream: 2. Điều phối Request
    deactivate RProxy

    activate Upstream
    Upstream-->>RProxy: 3. Xử lý & Phản hồi
    deactivate Upstream

    activate RProxy
    RProxy-->>ExtUser: 4. Trả về Client
    deactivate RProxy
```

---
[← Back to README](../README.md)
