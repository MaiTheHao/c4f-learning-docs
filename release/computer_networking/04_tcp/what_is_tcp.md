# Giới thiệu về TCP (Transmission Control Protocol)

TCP là giao thức lớp **Transport** cốt lõi của Internet, đảm bảo dữ liệu được truyền tải đầy đủ, đúng thứ tự và đáng tin cậy bên trên giao thức IP. Tài liệu này đi qua toàn bộ vòng đời của một kết nối TCP: từ thiết lập bằng **Three-Way Handshake**, truyền và nhận dữ liệu, xử lý mất gói, cho đến đóng kết nối bằng **Four-Way Handshake**.

## Table of Contents

-   [1. Giới thiệu về TCP](#1-giới-thiệu-về-tcp)
-   [2. Khái niệm Kết nối (Connection) trong TCP](#2-khái-niệm-kết-nối-connection-trong-tcp)
-   [3. Thiết lập Kết nối - Three-Way Handshake](#3-thiết-lập-kết-nối---three-way-handshake)
-   [4. Truyền và Nhận Dữ liệu](#4-truyền-và-nhận-dữ-liệu)
-   [5. Xử lý Mất dữ liệu và Truyền lại](#5-xử-lý-mất-dữ-liệu-và-truyền-lại)
-   [6. Đóng Kết nối - Four-Way Handshake](#6-đóng-kết-nối---four-way-handshake)
-   [7. Ghép kênh và Phân kênh](#7-ghép-kênh-và-phân-kênh)
-   [8. Các khái niệm và Bổ sung](#8-các-khái-niệm-và-bổ-sung)

---
## 1. Giới thiệu về TCP

-   **Tổng quan và Vị trí:** TCP (Transmission Control Protocol) là một giao thức cốt lõi thuộc Lớp 4 trong mô hình mạng, hoạt động bên trên giao thức IP. Tên gọi của nó nhấn mạnh vào khả năng **kiểm soát (Control)** việc truyền tải dữ liệu, đảm bảo thông tin được gửi đi một cách có trật tự và đáng tin cậy.

-   **Mục đích và Đặc điểm chính:** Mục đích chính của TCP là cung cấp một phương thức giao tiếp **reliable** và **stateful**. Nó đảm bảo rằng dữ liệu được giao đầy đủ, đúng thứ tự thông qua các cơ chế như truyền lại các gói tin bị mất và xác nhận dữ liệu đã nhận.

-   **So sánh với UDP:** Không giống như UDP, vốn được ví như một **firehose** (vòi rồng) chỉ phun dữ liệu đi mà không cần kiểm soát, TCP quản lý chặt chẽ luồng truyền. Chính vì sự thiếu kiểm soát này mà đôi khi tường lửa (**firewall**) sẽ chặn các gói tin UDP.

-   **Các ứng dụng phổ biến:** TCP là nền tảng cho hầu hết các ứng dụng yêu cầu độ tin cậy cao. Ví dụ điển hình bao gồm:

    -   **Truyền thông web:** HTTP/1 và HTTP/2 đều được xây dựng trên TCP.
    -   **Kết nối từ xa:** Giao thức như **SSH** cần TCP để đảm bảo các lệnh được thực thi chính xác.
    -   **Kết nối cơ sở dữ liệu:** Việc gửi các truy vấn SQL không thể bị xáo trộn, nếu không một lệnh `SELECT` có thể bị biến thành `TRUNCATE`.
    -   **Trò chuyện (Chat):** Tin nhắn văn bản cần được nhận một cách nguyên vẹn và đúng thứ tự.

-   **Giao tiếp hai chiều (Bidirectional):** TCP cho phép giao tiếp hai chiều hoàn toàn, nghĩa là cả **client** và **server** đều có thể gửi và nhận dữ liệu bất kỳ lúc nào sau khi kết nối được thiết lập. Điều này khác với mô hình **request-response** nghiêm ngặt của HTTP.

---

## 2. Khái niệm Kết nối (Connection) trong TCP

-   **Bản chất của một kết nối:** Một kết nối TCP là một **agreement** (thỏa thuận) giữa client và server, tạo ra một trạng thái được lưu trữ trong bộ nhớ ở cả hai phía. Đây là một khái niệm không tồn tại trong IP hay UDP.

-   **Tại sao cần kết nối?** Việc phải thiết lập kết nối trước khi gửi dữ liệu mang lại hai lợi ích chính:

    -   **An ninh:** Nó giúp ngăn chặn việc giả mạo (**spoofing**), vì server sẽ từ chối các gói tin TCP không thuộc về một kết nối đã tồn tại.
    -   **Độ tin cậy:** Kết nối đảm bảo cả hai bên đều sẵn sàng và đồng bộ trước khi bắt đầu trao đổi dữ liệu.

-   **Định danh kết nối:** Mỗi kết nối TCP được xác định duy nhất bởi một bộ bốn thông số (**four-tuple**):

    -   Source IP (Địa chỉ IP nguồn)
    -   Source Port (Cổng nguồn)
    -   Destination IP (Địa chỉ IP đích)
    -   Destination Port (Cổng đích)

-   **Socket / File Descriptor:** Hệ điều hành sẽ lấy bốn thông số trên, **băm (hash)** chúng lại để tạo ra một giá trị duy nhất. Giá trị hash này được dùng để tra cứu một cấu trúc dữ liệu gọi là **file descriptor** (trên Linux/Unix) hay **socket**. File descriptor này chứa toàn bộ trạng thái của kết nối, bao gồm số thứ tự (**sequence number**), kích thước cửa sổ, v.v...

-   **Chi phí:** Vì mỗi kết nối là có trạng thái, nó tiêu tốn một lượng tài nguyên **RAM** và **CPU** hữu hạn trên server. Do đó, số lượng kết nối đồng thời mà một server có thể xử lý là có giới hạn. Ví dụ, server của WhatsApp được biết là có thể xử lý tới **3 triệu kết nối TCP** đồng thời.

---

## 3. Thiết lập Kết nối - Three-Way Handshake

-   **Mục đích:** Quy trình bắt tay ba bước được thực hiện để hai bên **đồng bộ hóa số thứ tự (Synchronize Sequence Numbers)** với nhau, tạo tiền đề cho việc trao đổi dữ liệu một cách đáng tin cậy.

-   **Quy trình 3 bước:**

    1.  **SYN:** Client gửi một gói tin có cờ **SYN** (Synchronize) đến server. Gói tin này chứa số thứ tự ban đầu do client khởi tạo (ví dụ: 1000).
    2.  **SYN-ACK:** Server nhận được gói SYN, phản hồi lại bằng một gói tin có cả hai cờ **SYN** và **ACK** (Acknowledgment). Gói tin này chứa số thứ tự ban đầu của server (ví dụ: 5000) và xác nhận (ACK) số thứ tự của client.
    3.  **ACK:** Client nhận được gói SYN-ACK và gửi lại một gói tin **ACK** cuối cùng để xác nhận số thứ tự của server. Quá trình bắt tay hoàn tất.

-   **Kết quả:** Sau khi hoàn tất, một file descriptor sẽ được tạo ra ở cả client và server, chính thức thiết lập một kết nối sẵn sàng cho việc truyền dữ liệu.

---

## 4. Truyền và Nhận Dữ liệu

-   **Đóng gói dữ liệu:** Dữ liệu từ tầng ứng dụng được chia nhỏ và đóng gói vào các đơn vị gọi là **segment** của TCP.

-   **Tính tuần tự (Sequencing):** Mỗi segment được gán một **sequence number**. Nhờ đó, ngay cả khi các gói tin IP chứa các segment này đến nơi không đúng thứ tự (do định tuyến khác nhau trên mạng), bên nhận vẫn có thể sắp xếp chúng lại một cách chính xác.

-   **Cơ chế Xác nhận (Acknowledgment - ACK):**

    -   Khi bên nhận nhận được một segment, nó sẽ gửi lại một gói tin ACK để xác nhận.
    -   **Cumulative ACK (Xác nhận tích lũy):** TCP sử dụng cơ chế xác nhận tích lũy rất hiệu quả. Một gói tin ACK với số thứ tự là `N` có nghĩa là bên nhận đã nhận thành công tất cả các segment từ đầu cho đến `N-1`. Ví dụ, ACK(3) xác nhận đã nhận segment 1 và 2.

-   **Gửi nhiều segment trước khi nhận ACK:** Client có thể gửi nhiều segment liên tiếp mà không cần chờ ACK cho từng segment một. Tuy nhiên, số lượng dữ liệu có thể gửi đi bị giới hạn bởi hai cơ chế quan trọng là **Flow Control** (Điều khiển luồng) và **Congestion Control** (Điều khiển tắc nghẽn).

---

## 5. Xử lý Mất dữ liệu và Truyền lại

-   **Phát hiện mất segment:** Bên gửi sẽ biết một segment đã bị mất nếu nó không nhận được ACK cho segment đó sau một khoảng thời gian nhất định. Ví dụ, nếu bên gửi đã gửi các segment 1, 2, 3 nhưng chỉ nhận lại ACK(2), nó sẽ hiểu rằng segment 3 có thể đã bị thất lạc.

-   **Cơ chế Truyền lại (Retransmission):** Khi phát hiện mất dữ liệu, bên gửi sẽ **tự động gửi lại (retransmit)** segment bị thiếu.

-   **Đảm bảo độ tin cậy:** Chính cơ chế truyền lại này là cốt lõi làm nên sự đáng tin cậy của TCP. Nó đảm bảo rằng dữ liệu sẽ được giao đầy đủ và chính xác đến nơi nhận, dù cho mạng có không ổn định.

---

## 6. Đóng Kết nối - Four-Way Handshake

-   **Mục đích:** Để kết thúc một kết nối một cách an toàn (**gracefully**), đảm bảo không có dữ liệu nào đang truyền bị mất giữa chừng.

-   **Quy trình 4 bước:**

    1.  **FIN:** Bên muốn đóng kết nối (ví dụ: client) gửi một gói tin có cờ **FIN** (Finish).
    2.  **ACK:** Bên kia (server) nhận được FIN và gửi lại một gói **ACK** để xác nhận yêu cầu đóng.
    3.  **FIN:** Sau khi đã sẵn sàng, server cũng gửi gói tin **FIN** của riêng nó để báo hiệu nó cũng muốn đóng.
    4.  **ACK:** Client nhận được FIN của server và gửi gói **ACK** cuối cùng. Kết nối được đóng hoàn toàn.

-   **Trạng thái TIME_WAIT:** Bên khởi xướng việc đóng kết nối sẽ giữ file descriptor ở trạng thái **TIME_WAIT** trong một khoảng thời gian (khoảng vài phút). Mục đích là để xử lý bất kỳ gói tin nào còn bị trễ trên mạng, tránh việc chúng ảnh hưởng đến một kết nối mới có cùng thông số (IP, port) được tạo ra ngay sau đó.

---

## 7. Ghép kênh và Phân kênh

-   **Vấn đề:** Một máy chủ (**host**) với một địa chỉ IP duy nhất có thể chạy nhiều ứng dụng mạng cùng lúc (ví dụ: trình duyệt web, SSH, ứng dụng chat). Cần có cơ chế để phân biệt và chuyển dữ liệu đến đúng ứng dụng.

-   **Giải pháp - Cổng (Ports):** Số cổng hoạt động như một địa chỉ định danh cho từng ứng dụng hoặc tiến trình trên một host.

-   **Nguyên lý hoạt động:**

    -   **Multiplexing (Ghép kênh - Phía gửi):** Hệ điều hành thu thập dữ liệu từ nhiều socket ứng dụng khác nhau và gói chúng vào các segment TCP, sau đó gửi đi qua một giao diện mạng duy nhất.
    -   **Demultiplexing (Phân kênh - Phía nhận):** Khi một gói tin đến, hệ điều hành sẽ kiểm tra bộ bốn thông số (IP nguồn, cổng nguồn, IP đích, cổng đích) trong header. Dựa vào đó, nó xác định chính xác file descriptor (socket) của ứng dụng nào đang chờ dữ liệu này và chuyển segment đến cho nó.

---

## 8. Các khái niệm và Bổ sung

-   **Header Overhead:** Chi phí cho phần header của TCP khá lớn. Một header TCP chiếm từ 20 đến 60 bytes, cộng với header IP (20-60 bytes), tổng cộng có thể lên tới **120 bytes** chỉ cho thông tin điều khiển, đôi khi gây lãng phí băng thông nếu dữ liệu truyền đi rất nhỏ.

-   **MultiPath TCP (MPTCP):** Là một phần mở rộng của TCP cho phép một kết nối duy nhất có thể sử dụng đồng thời nhiều đường truyền vật lý, ví dụ như dùng cả Wi-Fi và mạng di động (LTE) trên điện thoại để tăng tốc độ và độ tin cậy.

-   **Tấn công liên quan đến kết nối:** Kẻ tấn công có thể giả mạo (**spoof**) một gói tin FIN để đóng một kết nối đang tồn tại nếu họ biết được đầy đủ bộ bốn thông số định danh của kết nối đó.

-   **Tóm tắt các tính năng chính của TCP:** Đáng tin cậy (**guaranteed delivery**), có thứ tự (**ordered packets**), có trạng thái và hướng kết nối (**stateful & connection-oriented**), kiểm soát luồng (**flow control**), kiểm soát tắc nghẽn (**congestion control**), và giao tiếp hai chiều (**bidirectional**).

---
[← Back to README](../README.md)
