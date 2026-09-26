# Cân bằng tải Lớp 4 (L4) vs. Lớp 7 (L7): Cuộc chiến giữa Tốc độ và Trí thông minh

**Load Balancer** là trạm điều phối trung tâm của mọi hạ tầng có tính sẵn sàng cao, và nó tồn tại chủ yếu ở hai cấp độ: **L4** (Transport Layer) — nhanh, rẻ, chỉ đọc **IP/Port**, và **L7** (Application Layer) — thông minh, đọc được nội dung HTTP/gRPC để định tuyến theo ngữ cảnh. Tài liệu này phân tích cơ chế hoạt động của từng cấp độ, ưu nhược điểm, ma trận so sánh để chọn L4 hay L7, và mô hình kiến trúc kết hợp cả hai trong thực tế.

## Table of Contents

-   [1. Load Balancer là gì?](#1-load-balancer-là-gì)
-   [2. Cân bằng tải Lớp 4 (L4): Người Giao hàng Tốc độ](#2-cân-bằng-tải-lớp-4-l4-người-giao-hàng-tốc-độ)
-   [3. Ưu và Nhược điểm của L4](#3-ưu-và-nhược-điểm-của-l4)
-   [4. Cân bằng tải Lớp 7 (L7): Người Quản lý Thông minh](#4-cân-bằng-tải-lớp-7-l7-người-quản-lý-thông-minh)
-   [5. Ưu và Nhược điểm của L7](#5-ưu-và-nhược-điểm-của-l7)
-   [6. Ma trận So sánh Kỹ thuật](#6-ma-trận-so-sánh-kỹ-thuật)
-   [7. Tổng kết và Tiêu chí Lựa chọn](#7-tổng-kết-và-tiêu-chí-lựa-chọn)

---

## 1. Load Balancer là gì?

Một **Load Balancer (LB)** (bộ cân bằng tải) là một hệ thống được thiết kế nhằm nâng cao tính sẵn sàng và khả năng chịu lỗi (**fault tolerance**) cho toàn bộ hạ tầng mạng.

Từ góc độ của Client, mọi tương tác chỉ diễn ra với một địa chỉ **Virtual IP (VIP)** duy nhất đại diện cho Load Balancer. Phía sau bức màn đó, LB điều phối lưu lượng tới một cụm gồm nhiều máy chủ backend.

> [!NOTE]
> **Công thức cốt lõi:**
>
> $$\text{Load Balancer} = \text{Reverse Proxy} + \text{Logic Cân bằng tải}$$
>
> Mọi Load Balancer đều hoạt động như một Reverse Proxy, nhưng Reverse Proxy đơn thuần có thể chỉ trỏ cố định về một backend duy nhất. Load Balancer bắt buộc phải sở hữu thuật toán phân phối lưu lượng (như Round Robin, Least Connections, IP Hash) để dàn đều tải cho hạ tầng.

Kiến trúc tổng quan luồng đi của gói tin qua một hệ thống cân bằng tải:

```mermaid
---
config:
  layout: elk
---
flowchart LR
    accTitle: "Kiến trúc tổng quan Load Balancer"
    accDescr: "Mô hình Client gửi yêu cầu tới Load Balancer đại diện, sau đó Load Balancer phân phối tải tới các máy chủ Backend"

    client1["fa:fa-user Client A"]
    client2["fa:fa-user Client B"]
    lb["fa:fa-network-wired Load Balancer<br/>(Virtual IP / Reverse Proxy)"]

    subgraph BackendCluster["Hạ tầng Backend Servers"]
        serverA["fa:fa-server Server 1<br/>192.168.1.10"]
        serverB["fa:fa-server Server 2<br/>192.168.1.11"]
        serverC["fa:fa-server Server 3<br/>192.168.1.12"]
    end

    client1 -->|"Gửi Request"| lb
    client2 -->|"Gửi Request"| lb

    lb -->|"Điều phối tải 1"| serverA
    lb -->|"Điều phối tải 2"| serverB
    lb -->|"Điều phối tải 3"| serverC
```

| Thành phần | Vai trò | Chi tiết kỹ thuật |
| :--- | :--- | :--- |
| **Client** | Điểm khởi tạo kết nối | Giao tiếp với duy nhất một địa chỉ Virtual IP (VIP) của Load Balancer. |
| **Load Balancer** | Trạm trung chuyển & điều phối | Tiếp nhận kết nối, áp dụng thuật toán phân phối tải và quản lý kết nối tới backend. |
| **Backend Cluster** | Xử lý logic nghiệp vụ | Cụm máy chủ nhận request phân bổ, đảm bảo tính dự phòng và khả năng mở rộng ngang (*horizontal scaling*). |

---

## 2. Cân bằng tải Lớp 4 (L4): Người Giao hàng Tốc độ

Bộ cân bằng tải **L4** hoạt động tại **Transport Layer** (Lớp Vận chuyển) trong mô hình OSI.

Ở tầng này, bộ cân bằng tải chỉ trích xuất và xử lý thông tin tiêu đề L4: **Địa chỉ IP nguồn/đích** và **Cổng (Port)**. Nó hoàn toàn không giải mã hoặc phân tích nội dung dữ liệu bên trong các gói tin. Đối với **L4 LB**, mọi giao thức như HTTP, gRPC, WebSocket hay database payload đều chỉ là một dòng chảy của các **TCP segment** hoặc **UDP datagram**.

> [!TIP]
> **Ẩn dụ Bưu điện Lớp 4:**
> - **Nhiệm vụ:** Nhân viên giao hàng chỉ nhìn vào mã màu trên nhãn phong bì (IP:Port).
> - **Quy tắc:** "Tất cả gói mang nhãn Client A phải chuyển thẳng vào hòm thư Backend 1."
> - **Hành động:** Nhân viên không mở thư kiểm tra nội dung. Quá trình xử lý diễn ra trực tiếp ở cấp độ packet-forwarding, đem lại tốc độ cực nhanh và mức tiêu thụ CPU tối thiểu.

### 2.1. Cơ chế Hoạt động Cốt lõi (Sticky Connection)

Mô hình ánh xạ 1:1 theo kết nối TCP của L4 Load Balancing:

```mermaid
---
config:
  layout: elk
---
flowchart TD
    accTitle: "Cơ chế Sticky Connection tại Lớp 4"
    accDescr: "Luồng hoạt động của L4 Load Balancer: bắt tay TCP với Client, chọn kết nối backend tương ứng và chuyển tiếp segment cố định theo kết nối"

    subgraph ClientSpace["Phía Client"]
        clientConn["fa:fa-desktop Client TCP Connection<br/>(198.51.100.2:54321)"]
    end

    subgraph L4Layer["L4 Load Balancer"]
        l4Decision{"fa:fa-microchip Đọc IP:Port Header<br/>Áp dụng thuật toán L4"}
        natEngine["Chuyển tiếp TCP Segment<br/>(NAT / DSR / IP Tunneling)"]
    end

    subgraph BackendSpace["Backend Servers"]
        backendA["fa:fa-server Backend A<br/>(10.0.0.1:80)"]
        backendB["fa:fa-server Backend B<br/>(10.0.0.2:80)"]
    end

    clientConn ==>|"TCP Handshake & Segments"| l4Decision
    l4Decision -->|"Gán cố định vào Backend A"| natEngine
    natEngine ==>|"Forward Segment 1, 2, 3..."| backendA
    natEngine -.->|"Không thể chia rẽ segment"| backendB
```

Chu trình xử lý diễn ra theo 4 giai đoạn kỹ thuật:

1. **Khởi tạo & Duy trì Pool:** LB có thể duy trì pool kết nối sẵn hoặc thiết lập cơ chế NAT / Direct Server Return (DSR) tới backend.
2. **Client bắt tay kết nối:** Khi Client khởi tạo bắt tay TCP 3 bước (`SYN`, `SYN-ACK`, `ACK`) tới VIP, thuật toán L4 được kích hoạt.
3. **Ánh xạ 1:1 (Stateful Table):** LB ghi nhận entry vào bảng trạng thái (Connection Tracking Table), ghép nối socket Client với một backend được chọn.
4. **Chuyển tiếp cố định (Sticky):** Mọi segment tiếp theo trên cùng socket TCP này bắt buộc phải đi đúng tới backend đó. L4 không thể chuyển segment 1 sang Backend A và segment 2 sang Backend B vì sẽ làm sai lệch TCP Sequence Number và phá vỡ phiên truyền thông.

---

## 3. Ưu và Nhược điểm của L4

| Ưu điểm (Pros) | Nhược điểm (Cons) |
| :--- | :--- |
| **Đơn giản & Thông lượng cực cao:** Không tốn chi phí CPU để parse payload hay buffering. Chỉ đọc/ghi packet header ở kernel space (như IPVS, DPDK). | **Không thể định tuyến thông minh:** Không đọc được URI path, HTTP headers hoặc payload để điều phối yêu cầu theo ngữ cảnh. |
| **Bảo mật End-to-End:** Traffic TLS đi xuyên suốt (pass-through) từ Client tới Backend. LB không cần lưu trữ Certificate/Private Key. | **Dính chặt (Connection-bound):** Tất cả requests trên cùng 1 kết nối TCP (ví dụ HTTP/2 multiplexing) đều đổ dồn vào duy nhất 1 backend server. |
| **Độc lập giao thức (Protocol-Agnostic):** Hỗ trợ toàn bộ các giao thức chạy trên TCP/UDP (MySQL, PostgreSQL, Redis, DNS, Game UDP, gRPC raw TCP). | **Không hỗ trợ Caching & L7 Security:** Không thể tự động cache tài nguyên tĩnh, không kiểm tra được WAF rules hay payload injection. |
| **Hỗ trợ Direct Server Return (DSR):** Cho phép backend phản hồi trực tiếp cho Client mà không cần đi vòng lại qua LB, tối ưu hóa băng thông tải về khổng lồ. | **Rủi ro khi giao thức nâng cấp:** Khi gặp giao thức chuyển tiếp như WebSocket qua HTTP Upgrade, L4 không kiểm soát được các policy mức ứng dụng sau đó. |

---

## 4. Cân bằng tải Lớp 7 (L7): Người Quản lý Thông minh

Bộ cân bằng tải **L7** hoạt động ở **Application Layer** (Lớp Ứng dụng), phụ thuộc chặt chẽ vào giao thức ứng dụng (**protocol-specific**) như HTTP/1.1, HTTP/2, HTTP/3, gRPC, WebSocket.

Ở tầng này, LB đóng vai trò là một điểm kết thúc kết nối đầy đủ. Nó nhận dữ liệu, giải mã TLS, gom các segment thành một thông điệp HTTP hoàn chỉnh, sau đó đọc từng thành phần: Request Method, Path, Header, Cookie và Body.

> [!IMPORTANT]
> **Ẩn dụ Bưu điện Lớp 7:**
> - **Nhiệm vụ:** Người quản lý bưu điện mở từng phong bì (giải mã TLS) và đọc kỹ văn bản bên trong.
> - **Quy tắc:** "Nếu thư yêu cầu thanh toán (`/api/v1/billing`), chuyển tới phòng Tài chính (Backend 1). Nếu yêu cầu tải ảnh (`/static/images`), chuyển tới kho Lưu trữ (Backend 2)."
> - **Hành động:** Khả năng định tuyến linh hoạt tuyệt đối, nhưng tốn nhiều chi phí xử lý và yêu cầu LB phải thông thạo ngôn ngữ giao thức của thông điệp.

### 4.1. Cơ chế Hoạt động Cốt lõi (Buffering, TLS Termination & Multiplexing)

Mô hình định tuyến dựa trên nội dung (Content-based Routing) và tách biệt kết nối tại L7:

```mermaid
---
config:
  layout: elk
---
flowchart TD
    accTitle: "Cơ chế Content-based Routing tại Lớp 7"
    accDescr: "Luồng hoạt động của L7 Load Balancer: tiếp nhận kết nối Client, giải mã TLS, đệm dữ liệu thành request hoàn chỉnh và định tuyến tới microservices tương ứng"

    subgraph ClientTraffic["Lưu lượng từ Client"]
        conn1["Client Connection 1<br/>(TLS Encrypted)"]
    end

    subgraph L7Engine["L7 Load Balancer (Nginx / Envoy / HAProxy)"]
        tlsTerm["fa:fa-key Chấm dứt TLS<br/>(TLS Termination & Decrypt)"]
        bufferEngine["fa:fa-layer-group Request Buffering<br/>& Parsing Header/Path"]
        routeDecision{"Phân tích URI Path / Header"}
    end

    subgraph BackendServices["Hạ tầng Microservices"]
        authService["fa:fa-shield-alt Auth Service<br/>(Backend 1)"]
        apiService["fa:fa-cogs Order API Service<br/>(Backend 2)"]
        staticStorage["fa:fa-images Static CDN / S3<br/>(Backend 3)"]
    end

    conn1 ==>|"Encrypted Traffic"| tlsTerm
    tlsTerm --> bufferEngine
    bufferEngine --> routeDecision

    routeDecision -->|"GET /auth/login"| authService
    routeDecision -->|"POST /api/v1/orders"| apiService
    routeDecision -->|"GET /static/banner.png"| staticStorage
```

### 4.2. Trình tự Xử lý Kỹ thuật (Sequence Flow)

Trình tự tách biệt 2 phiên TCP riêng biệt giữa Client - LB và LB - Backend:

```mermaid
---
config:
  layout: elk
---
sequenceDiagram
    autonumber
    actor Client
    participant L7 as fa:fa-network-wired L7 Load Balancer
    participant Auth as fa:fa-shield-alt Auth Backend
    participant Order as fa:fa-cogs Order Backend

    Client->>L7: TCP Handshake & TLS Client Hello
    L7-->>Client: TLS Certificate & Key Exchange (TLS Terminated)
    Note over Client,L7: Kết nối Client-LB được mã hóa

    Client->>L7: HTTP Request 1 (GET /api/auth/token)
    Note over L7: L7 đệm đủ segment, giải mã & phân tích path
    L7->>Auth: Chuyển tiếp Request 1 (Upstream Connection Pool)
    Auth-->>L7: 200 OK + Payload
    L7-->>Client: HTTP Response 1

    Client->>L7: HTTP Request 2 (POST /api/orders) [Cùng TCP Conn]
    Note over L7: Phân tích thấy path /orders khác biệt
    L7->>Order: Chuyển tiếp Request 2 sang Server Order
    Order-->>L7: 201 Created
    L7-->>Client: HTTP Response 2
```

| Bước | Hành động | Giải thích kỹ thuật |
| :--- | :--- | :--- |
| **1 - 2** | **TLS Termination** | Kết nối TLS giữa Client và LB hoàn tất độc lập. LB nắm giữ SSL Certificate. |
| **3 - 4** | **Đệm & Định tuyến Request 1** | LB nhận các segment, ráp thành request `/api/auth/token` và đẩy sang Auth Backend. |
| **5 - 6** | **Phản hồi Request 1** | Nhận kết quả từ Auth Backend và trả về qua socket mã hóa của Client. |
| **7 - 9** | **Multiplexing Request 2** | Dù cùng 1 kết nối Client, request `/api/orders` được định tuyến độc lập sang Order Backend. |

---

## 5. Ưu và Nhược điểm của L7

| Ưu điểm (Pros) | Nhược điểm (Cons) |
| :--- | :--- |
| **Định tuyến thông minh (Content-aware):** Phân luồng dựa trên URL Path, Query string, HTTP Method, Header, Cookie. Tối ưu cho kiến trúc Microservices và API Gateway. | **Tốn tài nguyên tính toán (High CPU & RAM):** Tốn chu kỳ CPU đáng kể cho tác vụ giải mã TLS, đệm bộ nhớ (buffering) và phân tích chuỗi ký tự HTTP. |
| **Tối ưu hóa kết nối Backend:** Hỗ trợ connection pooling và multiplexing: hàng ngàn client connections có thể chia sẻ một số lượng nhỏ persistent connections tới backend. | **Bắt buộc hỗ trợ giao thức:** LB phải tích hợp parser cụ thể cho từng giao thức. Nếu LB không hỗ trợ gRPC streaming hay HTTP/3, nó không thể hoạt động ở chế độ L7 cho giao thức đó. |
| **Tích hợp Caching & Compression:** Tự động phản hồi các tài nguyên tĩnh từ bộ nhớ cache hoặc nén gzip/brotli trực tiếp, giảm tải tới 80% lưu lượng cho backend. | **Độ trễ bổ sung (Latency Overhead):** Quá trình gom đủ segment tạo thành full logical request trước khi gửi làm tăng độ trễ thêm một khoảng nhỏ (thường vài mili-giây). |
| **Tính năng API Gateway toàn diện:** Hỗ trợ JWT validation, rate limiting theo IP/User, WAF injection inspection, header modification và canary deployment. | **Rủi ro bảo mật tập trung:** Vì TLS bị ngắt tại LB, toàn bộ dữ liệu ở dạng cleartext bên trong bộ nhớ của LB và yêu cầu quản lý khóa bí mật (Private Key) an toàn tuyệt đối. |

---

## 6. Ma trận So sánh Kỹ thuật

```mermaid
---
config:
  layout: elk
---
flowchart LR
    accTitle: "Cây quyết định lựa chọn L4 vs L7 Load Balancer"
    accDescr: "Lược đồ cây quyết định giúp kỹ sư lựa chọn giữa L4 hoặc L7 Load Balancer dựa trên yêu cầu hệ thống"

    rootCheck{"Nhu cầu chính của hệ thống?"}
    
    rootCheck -->|"Định tuyến theo URL / Microservices / API Gateway"| needL7["fa:fa-check-circle Lựa chọn L7 Load Balancer<br/>(Nginx, Envoy, Traefik, ALB)"]
    rootCheck -->|"Cần Caching / WAF / Header Manipulation"| needL7
    
    rootCheck -->|"Hiệu năng tối đa / Siêu băng thông / Hàng triệu RPS"| needL4["fa:fa-bolt Lựa chọn L4 Load Balancer<br/>(IPVS, Katran, AWS NLB, HAProxy TCP)"]
    rootCheck -->|"Giao thức không phải HTTP (DB, Game, raw TCP/UDP)"| needL4
    rootCheck -->|"TLS Pass-through / Mã hóa End-to-End"| needL4
```

Bảng so sánh chi tiết các chỉ số kỹ thuật giữa hai kiến trúc:

| Tiêu chí | Cân bằng tải Lớp 4 (L4) | Cân bằng tải Lớp 7 (L7) |
| :--- | :--- | :--- |
| **Tầng hoạt động** | Transport Layer (TCP / UDP) | Application Layer (HTTP, HTTPS, gRPC, WebSocket) |
| **Đơn vị xử lý** | IP Packet / TCP Segment | Logical Application Message (HTTP Request/Response) |
| **Khả năng định tuyến** | Địa chỉ IP và Port đích | URI Path, HTTP Headers, Cookie, Payload data |
| **TLS / SSL** | Pass-through (Không can thiệp giải mã) | TLS Termination (Giải mã và mã hóa lại nếu cần) |
| **Độ trễ (Latency)** | Cực thấp (Microseconds - $\mu s$) | Thấp tới Trung bình (Milliseconds - $ms$) |
| **Thông lượng (Throughput)** | Hàng triệu RPS với chi phí phần cứng tối thiểu | Giới hạn hơn do ràng buộc CPU/RAM cho việc parse |
| **Mô hình kết nối** | 1 Client Connection $\rightarrow$ 1 Backend Connection | Nhiều Client Requests $\rightarrow$ Ghép Pool Backend Connections |
| **Giải pháp tiêu biểu** | AWS NLB, Linux IPVS, Katran (Meta), HAProxy (TCP mode) | AWS ALB, Nginx, Envoy Proxy, Traefik, Kong |

---

## 7. Tổng kết và Tiêu chí Lựa chọn

Trong thực tế thiết kế hệ thống quy mô lớn, kiến trúc hiện đại thường **kết hợp cả hai**: Sử dụng L4 Load Balancer ở tuyến đầu (như Maglev, Katran hoặc AWS NLB) để đón đầu hàng triệu luồng kết nối Internet, sau đó phân phối lưu lượng tới cụm L7 Load Balancers (như Envoy, Nginx) để thực hiện định tuyến microservices, lọc bảo mật và quản lý giao thức.

```mermaid
---
config:
  layout: elk
---
flowchart TD
    accTitle: "Mô hình kiến trúc kết hợp L4 và L7 trong thực tế"
    accDescr: "Mô hình phối hợp hai tầng: L4 đón lưu lượng Internet quy mô lớn rồi chuyển tiếp cho tầng L7 điều phối Microservices"

    internetTraffic["fa:fa-globe Lưu lượng Internet diện rộng"]
    l4Layer["fa:fa-bolt Tuyến đầu: L4 Load Balancer<br/>(Chịu tải cao / DDOS mitigation / DSR)"]
    
    subgraph L7Tier["Tầng L7 Load Balancers (Ingress / API Gateway)"]
        l7Node1["fa:fa-shield-alt Envoy / Nginx Ingress 1"]
        l7Node2["fa:fa-shield-alt Envoy / Nginx Ingress 2"]
    end

    subgraph ServiceMesh["Backend Microservices"]
        userService["User Service"]
        paymentService["Payment Service"]
    end

    internetTraffic ==> l4Layer
    l4Layer -->|"Phân bổ kết nối L4"| l7Node1
    l4Layer -->|"Phân bổ kết nối L4"| l7Node2

    l7Node1 -->|"Route /users"| userService
    l7Node1 -->|"Route /payments"| paymentService
    l7Node2 -->|"Route /users"| userService
    l7Node2 -->|"Route /payments"| paymentService
```

- **Chọn Lớp 4 (L4)** khi ưu tiên hàng đầu là hiệu năng thô, độ trễ tối thiểu, tải lượng dữ liệu khổng lồ hoặc các giao thức phi HTTP.
- **Chọn Lớp 7 (L7)** khi hệ thống vận hành theo kiến trúc Microservices đòi hỏi khả năng điều hướng thông minh theo đường dẫn, kiểm soát chính sách bảo mật và tối ưu hóa tài nguyên ứng dụng.

---
[← Back to README](../README.md)

