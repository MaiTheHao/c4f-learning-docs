# Mô hình Tham chiếu OSI (Open Systems Interconnection)

Mô hình tham chiếu **OSI (Open Systems Interconnection)** được phát triển bởi **ISO** vào những năm 1980 với mục tiêu thiết lập một khung tham chiếu vạn năng, không phụ thuộc vào bất kỳ nhà sản xuất hay công nghệ cụ thể nào. Mô hình này chia hệ thống truyền thông thành bảy tầng trừu tượng xếp chồng lên nhau, trong đó mỗi tầng chỉ tương tác trực tiếp với tầng ngay bên dưới và cung cấp dịch vụ cho tầng ngay bên trên.

## Table of Contents

*   [1. Bản chất Kiến trúc và Cấu trúc Phân tầng](#1-bản-chất-kiến-trúc-và-cấu-trúc-phân-tầng)
*   [2. Phân tích Chức năng Chi tiết 7 Tầng](#2-phân-tích-chức-năng-chi-tiết-7-tầng)
*   [3. Phân tách Dịch vụ Tầng Mạng trong OSI: CLNS và CONS](#3-phân-tách-dịch-vụ-tầng-mạng-trong-osi-clns-và-cons)

---

## 1. Bản chất Kiến trúc và Cấu trúc Phân tầng

Kiến trúc phân tầng của OSI tuân thủ nguyên tắc mô-đun hóa, phân tách rõ rệt vai trò của từng tầng nhằm cô lập lỗi và cho phép thay thế hoặc nâng cấp công nghệ ở một tầng mà không làm ảnh hưởng đến các tầng khác.

### Kiến trúc Tổng quan 7 Tầng OSI

![Mô hình Phân tầng và Chức năng của 7 Tầng OSI](../assets/OSI.png)

### Bảng 1: Cấu trúc chi tiết của Mô hình Tham chiếu OSI 7 Tầng

| Tầng (Layer) | Đơn vị Dữ liệu (PDU) | Chức năng Kỹ thuật Chính | Giao thức & Tiêu chuẩn Tiêu biểu |
| :--- | :--- | :--- | :--- |
| **Layer 7: Application** (Ứng dụng) | Data / Message | Điểm tương tác trực tiếp với người dùng và phần mềm ứng dụng; xác định đối tác giao tiếp và khả năng sẵn sàng của tài nguyên. | HTTP/HTTPS, SMTP, FTP, DNS, DHCP, FTAM |
| **Layer 6: Presentation** (Trình diễn) | Data / Message | Biên dịch định dạng dữ liệu, nén dữ liệu tối ưu băng thông và thực hiện các thuật toán mã hóa/giải mã bảo mật. | SSL/TLS, MIME, JPEG, MPEG, GIF |
| **Layer 5: Session** (Phiên) | Data / Message | Thiết lập, duy trì, đồng bộ hóa và chấm dứt các phiên kết nối giữa các ứng dụng; quản lý hội thoại và phục hồi qua checkpoint. | RPC, NetBIOS, SQL sessions |
| **Layer 4: Transport** (Giao vận) | Segment (TCP) / Datagram (UDP) | Truyền thông tiến trình-tiến trình đầu-cuối; kiểm soát lưu lượng, phát hiện và sửa lỗi toàn cục. | TCP, UDP, SCTP |
| **Layer 3: Network** (Mạng) | Packet | Định tuyến gói tin qua các mạng khác nhau, gán địa chỉ logic toàn cầu (IP) và xử lý phân mảnh. | IP (IPv4/IPv6), ICMP, IGMP, OSPF, IPsec |
| **Layer 2: Data Link** (Liên kết Dữ liệu) | Frame | Truyền tải dữ liệu tin cậy giữa hai nút mạng trong cùng một phân đoạn vật lý; quản lý địa chỉ MAC và kiểm soát lỗi cục bộ. | Ethernet, PPP, PPTP, L2TP |
| **Layer 1: Physical** (Vật lý) | Bit | Truyền luồng bit thô qua các phương tiện truyền dẫn vật lý; định nghĩa các thông số cơ-điện-quang và xung nhịp. | USB, RJ-45, đặc tả SONET/SDH, cáp quang |

---

## 2. Phân tích Chức năng Chi tiết 7 Tầng

### 1. Tầng Vật lý (Physical Layer - Layer 1)
Tầng Vật lý chịu trách nhiệm chuyển đổi dòng dữ liệu nhị phân thành các tín hiệu vật lý (điện, quang hoặc sóng vô tuyến) và truyền tải chúng qua các phương tiện truyền dẫn vật lý. Tầng này xác định các đặc tính cơ điện của cáp, đầu nối, điện áp, xung nhịp và cấu trúc liên kết mạng vật lý. Sự thống nhất ở tầng này đảm bảo rằng các thiết bị phần cứng từ các nhà sản xuất khác nhau có thể nhận diện chính xác các bit `1` và `0` từ tín hiệu vật lý truyền qua đường truyền.

### 2. Tầng Liên kết Dữ liệu (Data Link Layer - Layer 2)
Tầng Liên kết Dữ liệu thực hiện việc truyền tải dữ liệu tin cậy giữa hai nút mạng nằm trong cùng một phân đoạn mạng cục bộ (**LAN**). Tầng này đóng gói các gói tin từ tầng mạng thành các khung dữ liệu (**Frames**), quản lý cơ chế **Flow Control** và **Error Control** cục bộ thông qua mã kiểm tra **FCS (Frame Check Sequence)**. Tầng này được chia thành hai phân tầng chức năng chuyên biệt:
*   **Phân tầng LLC (Logical Link Control)**: Quản lý các liên kết logic, kiểm soát lỗi và hoạt động như một giao diện cho các giao thức tầng trên.
*   **Phân tầng MAC (Media Access Control)**: Giải quyết tranh chấp quyền truy cập vào môi trường truyền dẫn vật lý và quản lý địa chỉ **MAC**.

### 3. Tầng Mạng (Network Layer - Layer 3)
Tầng Mạng giải quyết bài toán định tuyến và chuyển tiếp các gói tin (**Packets**) giữa các thiết bị nằm ở các mạng khác nhau. Tầng này chịu trách nhiệm gán địa chỉ logic (như địa chỉ **IPv4** hoặc **IPv6**), xác định lộ trình tối ưu cho gói tin đi qua các **Router** trung gian và xử lý việc phân mảnh gói tin khi kích thước vượt quá giới hạn truyền tải của liên kết vật lý.

### 4. Tầng Giao vận (Transport Layer - Layer 4)
Tầng Giao vận cung cấp dịch vụ truyền thông **End-to-End** trực tiếp giữa các tiến trình chạy trên các máy chủ khác nhau. Tầng này nhận dữ liệu từ tầng phiên, cắt nhỏ thành các phân đoạn (**Segments**) ở phía gửi và tái ráp chúng ở phía nhận. Đây là tầng chịu trách nhiệm tối ưu hóa tốc độ truyền tin thông qua cơ chế **Sliding Window** để tránh gây tràn bộ đệm của thiết bị nhận có kết nối chậm.

### 5. Tầng Phiên (Session Layer - Layer 5)
Tầng Phiên hoạt động như một "người quản lý hội thoại", chịu trách nhiệm thiết lập, duy trì, đồng bộ hóa và chấm dứt các phiên kết nối giữa các ứng dụng trên các thiết bị khác nhau. Tầng này có khả năng chèn các điểm kiểm tra (**Checkpoints**) vào dòng dữ liệu. Nếu xảy ra sự cố ngắt kết nối giữa chừng, quá trình truyền dữ liệu có thể được khôi phục từ điểm kiểm tra gần nhất thay vì phải truyền lại từ đầu.

### 6. Tầng Trình diễn (Presentation Layer - Layer 6)
Tầng Trình diễn đóng vai trò là bộ dịch thuật dữ liệu của mạng. Do các thiết bị khác nhau có thể sử dụng các hệ thống mã hóa ký tự hoặc cấu trúc dữ liệu khác nhau, tầng này sẽ chuẩn hóa định dạng dữ liệu đầu vào thành một cú pháp chung để tầng ứng dụng có thể hiểu được. Tầng này cũng đảm nhận vai trò nén dữ liệu để tối ưu băng thông và thực hiện các thuật toán mã hóa/giải mã bảo mật (như **SSL/TLS**).

### 7. Tầng Ứng dụng (Application Layer - Layer 7)
Tầng Ứng dụng là tầng trên cùng, giao tiếp trực tiếp với các phần mềm ứng dụng của người dùng. Tầng này cung cấp các dịch vụ mạng như duyệt web, gửi email, truyền tệp và phân giải tên miền. Khi một ứng dụng muốn truyền dữ liệu qua mạng, nó sẽ gọi các giao thức tại tầng này như **HTTP/HTTPS**, **SMTP**, **FTP**, **DHCP** và **DNS**.

---

## 3. Phân tách Dịch vụ Tầng Mạng trong OSI: CLNS và CONS

Kiến trúc tầng mạng của OSI được thiết kế để hỗ trợ hai loại mô hình dịch vụ truyền thông hoàn toàn khác biệt:

### CLNS (Connectionless-mode Network Service)
Đây là dịch vụ mạng không hướng kết nối, hoạt động theo nguyên lý **Best-Effort** tương tự như giao thức IP. Trong mô hình này, mỗi gói tin chứa đầy đủ thông tin địa chỉ đích và được định tuyến độc lập qua mạng mà không cần thiết lập một đường truyền logic trước đó. Giao thức triển khai dịch vụ này trong thế giới OSI là **CLNP (Connectionless-mode Network Protocol)**.

### CONS (Connection-Oriented Network Service)
Ngược lại với CLNS, CONS yêu cầu thiết lập một **Virtual Circuit** tường minh giữa nguồn và đích trước khi bất kỳ dữ liệu nào được phép truyền tải. Giao thức triển khai dịch vụ này là **CONP (Connection-Oriented Network Protocol)**, được xây dựng trên nền tảng của bộ giao thức X.25. CONS đảm bảo chất lượng dịch vụ (**QoS**) chặt chẽ và thứ tự phân phối gói tin nhưng đòi hỏi tài nguyên hệ thống lớn hơn để duy trì trạng thái kết nối.

> [!NOTE]
> Sự phân tách rạch ròi giữa giao diện dịch vụ (API) như CLNS và giao thức thực thi vật lý như CLNP thể hiện tư duy kiến trúc mô-đun hóa tối đa của mô hình OSI, cho phép thay thế các giao thức bên dưới mà không làm ảnh hưởng đến cấu trúc lập trình ứng dụng ở các tầng trên.

---

*   [→ Tiếp theo: Bộ Giao thức TCP/IP và So sánh đối chiếu với OSI](./tcp_ip_vs_osi.md)

---
[← Back to README](../README.md)
