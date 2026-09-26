# Mạng máy tính (Computer Networking)

Kho tài liệu này hệ thống hóa kiến thức cốt lõi về **Mạng máy tính** theo một trục logic nhất quán: bắt đầu từ khung tham chiếu phân tầng (**OSI** và **TCP/IP**) để định hình dòng chảy dữ liệu, đi qua nền tảng địa chỉ hóa và các giao thức điều khiển của **Internet Protocol Suite**, rồi chạm tới tầng giao vận với hai cực **TCP** và **UDP** cùng các kỹ thuật tối ưu hiệu năng thực chiến. Phần cuối khép lại bằng các giao thức tầng ứng dụng quan trọng nhất (**DNS**, **TLS**, **HTTPS**) và các mô hình kiến trúc hệ thống mạng như **Proxy** hay **Load Balancing**. Mỗi bài viết được tổ chức độc lập nhưng liên kết chéo với nhau, cho phép đọc tuần tự như một giáo trình hoặc tra cứu rời theo nhu cầu.

---

## Nền tảng Lý thuyết & Mô hình Phân tầng

Khung tham chiếu lý thuyết là điểm khởi đầu của mọi phân tích mạng, bởi nó định nghĩa ngôn ngữ chung để mô tả hành trình của một gói tin từ ứng dụng này sang ứng dụng khác. Bài viết đầu tiên trình bày **Mô hình OSI** với bảy tầng học thuật, vai trò và ranh giới trách nhiệm của từng tầng. Bài viết thứ hai đối chiếu **TCP/IP** — mô hình phân tầng thực tiễn đang vận hành Internet — với OSI để chỉ ra vì sao thực chiến luôn quy về bốn tầng gọn hơn. [Xem chi tiết Mô hình Tham chiếu OSI 7 Tầng](./00_osi_model/osi_7_layers.md). [Xem chi tiết Bộ Giao thức TCP/IP so sánh với OSI](./00_osi_model/tcp_ip_vs_osi.md).

---

## Nền tảng Mạng (Network Foundations)

Nhóm bài này xây dựng nền móng về địa chỉ hóa và các giao thức điều khiển cốt lõi của Internet Protocol Suite. Bạn sẽ học cách **IP address**, **Subnet** và **Default Gateway** phối hợp để định tuyến gói tin ra khỏi mạng nội bộ, sau đó mổ xẻ cấu trúc **IP Packet** và giao thức báo lỗi **ICMP**. Tiếp theo là cuộc chuyển dịch từ **IPv4** sang **IPv6** cùng những đánh đổi của nó, trước khi bước sang hai giao thức điều hướng quan trọng bậc nhất trong mạng thực tế: **ARP** phân giải địa chỉ và **NAT** dịch địa chỉ mạng. Bài về **MSS**, **MTU** và **Path MTU Discovery** khép lại nhóm này bằng bài toán phân đoạn dữ liệu trên đường truyền có giới hạn. [Xem chi tiết Địa chỉ IP, Subnet và Default Gateway](./01_internet_protocol/the_ip_building_blocks.md). [Xem chi tiết Cấu trúc Gói tin IP](./01_internet_protocol/ip_packet.md). [Xem chi tiết ICMP – Giao thức điều khiển và báo lỗi](./01_internet_protocol/icmp.md). [Xem chi tiết So sánh IPv4 và IPv6](./01_internet_protocol/ipv4_ipv6.md). [Xem chi tiết ARP – Giao thức phân giải địa chỉ](./02_routing/arp.md). [Xem chi tiết NAT – Dịch địa chỉ mạng](./02_routing/nat.md). [Xem chi tiết MSS, MTU và Path MTU Discovery](./07_others/mss_mtu_path_mtu.md).

---

## Giao thức Tầng Giao vận (Transport Layer)

Tầng giao vận là nơi quyết định chất lượng truyền dữ liệu đầu-cuối: tin cậy có kiểm soát hay tốc độ tối đa không trạng thái. Nhóm **UDP** mở đầu bằng bản chất phi kết nối (**connectionless**) của giao thức, tiếp tục với cấu trúc **UDP Datagram** tối giản chỉ có 8 bytes header, rồi cân nhắc **Trade-off** giữa độ trễ thấp và sự thiếu đảm bảo phân phối. Nhóm **TCP** đối xứng lại với cơ chế bắt tay, đảm bảo phân phối và kiểm soát luồng: bài đầu giới thiệu tổng quan **TCP**, bài giữa mổ xẻ cấu trúc **TCP Segment** cùng các trường header, bài cuối tổng kết ưu nhược điểm khi lựa chọn giữa hai giao thức. [Xem chi tiết UDP là gì? Đặc điểm và ứng dụng](./03_udp/what_is_udp.md). [Xem chi tiết Cấu trúc của UDP Datagram](./03_udp/user_datagram_structure.md). [Xem chi tiết Ưu và Nhược điểm của UDP](./03_udp/pros_cons.md). [Xem chi tiết TCP là gì? Đặc điểm và ứng dụng](./04_tcp/what_is_tcp.md). [Xem chi tiết Cấu trúc của TCP Segment](./04_tcp/tcp_segment.md). [Xem chi tiết Ưu và Nhược điểm của TCP](./04_tcp/pros_cons.md).

---

## Tối ưu hóa Hiệu suất TCP (TCP Performance Tuning)

Trong mạng thực tế, hiệu năng TCP không chỉ phụ thuộc băng thông mà còn bị chi phối bởi các thuật toán tương tác ở tầng ứng dụng. Bài về **Thuật toán Nagle** giải thích vì sao việc gom nhỏ gói tin tiết kiệm băng thông lại có thể làm tăng **latency** một cách khó lường. Bài về **Delayed Acknowledgment** phân tích hiện tượng chờ ACK kéo dài và cái bẫy "chết người" khi hai cơ chế này kết hợp với nhau, kèm hướng dẫn nhận diện và khắc phục. [Xem chi tiết Thuật toán Nagle và ảnh hưởng đến hiệu suất](./07_others/nagles_algorithm_effect_on_performance.md). [Xem chi tiết Delayed Acknowledgment và sự kết hợp với Nagle](./07_others/delayed_acknowledgment_effect_on_performance.md).

---

## Giao thức Tầng Ứng dụng & Bảo mật (Application Layer & Security)

Nhóm này theo dõi hành trình bảo mật hóa dòng dữ liệu mạng từ phân giải tên miền, mã hóa web đại trà đến quản trị máy chủ từ xa. Bài tổng quan phác thảo bức tranh **DNS**, **TLS** và **HTTPS** trước khi đi vào từng chuyên đề: **DNS** với hệ thống phân giải phân tầng và cơ chế caching, **TLS** với bắt tay mật mã và các phiên bản giao thức, **Digital Certificates** với chuỗi tin cậy và hạ tầng **PKI**, **HTTPS** — kết quả tổng hợp khi HTTP chạy trên nền TLS, và **SSH** — tiêu chuẩn mã hóa cho điều khiển máy chủ từ xa, mô hình tin cậy TOFU, ghép kênh và tạo đường hầm an toàn. [Xem chi tiết Tổng quan về DNS, TLS và HTTPS](./06_overview_of_popular_networking_protocols/introduce.md). [Xem chi tiết Giao thức DNS (Domain Name System)](./06_overview_of_popular_networking_protocols/dns.md). [Xem chi tiết Giao thức TLS (Transport Layer Security)](./06_overview_of_popular_networking_protocols/tls.md). [Xem chi tiết Digital Certificates - Chứng thư số](./06_overview_of_popular_networking_protocols/certificates.md). [Xem chi tiết HTTPS: Giao thức truyền tải siêu văn bản an toàn](./06_overview_of_popular_networking_protocols/https.md). [Xem chi tiết Giao thức SSH (Secure Shell)](./06_overview_of_popular_networking_protocols/ssh.md).

---

## Kiến trúc Hệ thống Mạng (Network System Architecture)

Ở biên ứng dụng, bài toán chuyển từ giao thức sang quy hoạch hệ thống chịu tải. Bài về **Proxy** và **Reverse Proxy** phân tích vai trò trung gian hóa lưu lượng, từ caching, kiểm soát truy cập đến che giấu kiến trúc nội bộ. Bài về **Load Balancing** so sánh cân bằng tải ở **L4** và **L7**: khác biệt về tầng thao tác, độ sâu hiểu biết giao thức, hiệu năng và độ linh hoạt định tuyến, làm cơ sở lựa chọn cho kiến trúc hệ thống phân tán. [Xem chi tiết Proxy và Reverse Proxy](./07_others/the_importance_of_proxy_and_reverse_proxies.md). [Xem chi tiết Cân bằng tải L4 vs L7](./07_others/load_balancing_at_l4_vs_l7.md).

---
[← Back to README](../README.md)
