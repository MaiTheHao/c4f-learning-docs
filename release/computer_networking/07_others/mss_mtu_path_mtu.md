# MSS, MTU và Path MTU Discovery: Gói tin có thể lớn đến mức nào?

Mỗi giao dịch trên mạng chỉ có thể chở một lượng dữ liệu giới hạn ở từng tầng: **Frame** ở Lớp 2, **IP Packet** ở Lớp 3 và **TCP Segment** ở Lớp 4. Tài liệu này giải thích mối quan hệ phân cấp giữa các đơn vị đó, vai trò của **MTU**, **MSS**, vấn đề **Fragmentation**, và cơ chế **Path MTU Discovery** giúp gói tin đi qua đường truyền một cách tối ưu.

## Table of Contents

-   [1. Mối quan hệ Phân cấp: Frame, Packet, và Segment](#1-mối-quan-hệ-phân-cấp-frame-packet-và-segment)
-   [2. MTU (Maximum Transmission Unit) là gì?](#2-mtu-maximum-transmission-unit-là-gì)
-   [3. Vấn đề của Fragmentation (Phân mảnh)](#3-vấn-đề-của-fragmentation-phân-mảnh)
-   [4. MSS (Maximum Segment Size) là gì?](#4-mss-maximum-segment-size-là-gì)
-   [5. Path MTU Discovery](#5-path-mtu-discovery)
-   [6. Tổng kết](#6-tổng-kết)

---
## 1. Mối quan hệ Phân cấp: Frame, Packet, và Segment

Để hiểu rõ, chúng ta cần biết dữ liệu được "đóng gói" như thế nào qua các lớp (**layer**) mạng:

1.  **Lớp 4 (TCP):** Đơn vị của TCP là **Segment**. Đây là nơi chứa dữ liệu thực tế của ứng dụng bạn.
2.  **Lớp 3 (IP):** Segment được "lắp" vào bên trong một **IP Packet**. Gói tin IP lúc này chứa Segment cộng với Header của nó (**IP Header**).
3.  **Lớp 2 (Ethernet/Wi-Fi):** IP Packet lại được "lắp" vào bên trong một **Frame**.

Frame có một kích thước cố định dựa trên cấu hình mạng của bạn. Đây là giới hạn vật lý của card mạng (network interface).

> **Ghi nhớ:** Kích thước của Frame (Lớp 2) quyết định mọi thứ ở các lớp trên nó. Nó là giới hạn vật lý quan trọng nhất.

---

## 2. MTU (Maximum Transmission Unit) là gì?

**MTU (Maximum Transmission Unit)** về cơ bản chính là kích thước tối đa của Frame ở Lớp 2.

-   Nó là một thuộc tính của giao diện mạng (network interface property). Bạn có thể thấy cài đặt này trong router của mình.
-   Giá trị mặc định phổ biến nhất, đặc biệt là cho **Internet**, là **1500 bytes**.
-   Vì vậy, đừng bận tâm đến việc gửi bất cứ thứ gì lớn hơn 1500 byte trên Internet.

> **Ví dụ trừu tượng (Xe tải & Gầm cầu):**
>
> Nếu bạn đang lái xe trên Internet, hãy mặc định rằng _tất cả_ các gầm cầu (routers) đều có chiều cao chuẩn là **1500 cm**. Đừng cố gửi một chiếc xe tải cao hơn 1500 cm, nếu không nó sẽ bị kẹt.

### 2.1. Jumbo Frames

Một số mạng (thường là mạng nội bộ, như trong các trung tâm dữ liệu của Amazon, Google) sử dụng **Jumbo Frames**, có thể lên tới **9000 bytes** hoặc hơn.

Nếu bạn sở hữu toàn bộ phần cứng và đường truyền là nội bộ (ví dụ: hai máy chủ trong cùng một rack), tại sao không?

### 2.2. Ưu và Nhược điểm của Frame lớn

Việc sử dụng Frame lớn (MTU lớn) có cả lợi và hại:

-   **Ưu điểm (Latency thấp):** Frame càng lớn, bạn càng "nhét" được nhiều nội dung (**payload**) vào. Bạn gửi ít Frame hơn để truyền cùng một lượng dữ liệu, đồng nghĩa với **latency (độ trễ)** thấp hơn và tốn ít tài nguyên xử lý header hơn.
-   **Nhược điểm (Rủi ro cao):** Bạn không biết liệu gói tin "khổng lồ" đó có đến nơi mà không bị hỏng hay không. Nếu mạng không ổn định, chỉ cần **một bit bị lật (hỏng)**, toàn bộ gói tin IP khổng lồ đó bị coi là không hợp lệ và bạn phải **gửi lại toàn bộ**.

> **Câu hỏi hay:** Frame càng lớn có thể càng tệ?
>
> **Trả lời:** Có thể. Nếu một gói tin nhỏ bị hỏng, bạn chỉ mất ít dữ liệu. Nếu một gói tin "jumbo" 9000 byte bị hỏng, bạn mất nhiều hơn và phải truyền lại toàn bộ 9000 byte đó. Các **Cloud Provider** có lẽ đã nghiên cứu rất kỹ để tìm ra kích thước MTU tối ưu cho hệ thống của họ.

---

## 3. Vấn đề của Fragmentation (Phân mảnh)

Một gói tin IP _nên_ nằm gọn trong một Frame duy nhất.

### 3.1. Phân mảnh xảy ra khi nào?

> **Vấn đề:** Điều gì xảy ra nếu bạn có một gói tin IP 2000 byte nhưng MTU của mạng chỉ là 1500 byte?
>
> **Giải pháp (Của Router):** Router sẽ thực hiện **Fragmentation (Phân mảnh)**. Nó sẽ "chặt" gói tin 2000 byte đó thành nhiều phần nhỏ hơn (ví dụ: một gói 1500 byte và một gói 500 byte), sau đó các Frame này phải được "lắp ráp" (reassembled) lại ở phía nhận.

> **Lưu ý quan trọng:** Phân mảnh là một ý tưởng tồi. Nó làm tăng độ phức tạp, tốn tài nguyên CPU để lắp ráp lại, và có thể bị lợi dụng để tấn công (khá là "nasty stuff"). Chúng ta muốn tránh nó bằng mọi giá.

---

## 4. MSS (Maximum Segment Size) là gì?

**MSS (Maximum Segment Size)** được quyết định trực tiếp dựa trên MTU.

Đây là kích thước **payload** (dữ liệu thực tế) tối đa mà ứng dụng của bạn có thể gửi ở Lớp 4 (TCP).

### 4.1. Con số Vàng: 1460

> **Công thức:**
> **MSS = MTU - IP Header - TCP Header**

Với MTU chuẩn của Internet là 1500 byte:

-   `1500 (MTU)`
-   `- 20 (IP Header tối thiểu)`
-   `- 20 (TCP Header tối thiểu)`
-   `= 1460 bytes`

**1460 bytes** chính là kích thước "tiêu chuẩn vàng" cho MSS trên Internet.

> **Ghi nhớ:** Nếu bạn (với tư cách là lập trình viên) có thể nén hoặc đóng gói dữ liệu của mình (ví dụ: một request API) sao cho nó vừa khít trong **1460 byte**, nó sẽ được gửi đi trong **một Segment duy nhất**.

### 4.2. Tại sao một Segment lại quan trọng?

-   Gửi 1 Segment (ví dụ 1KB) tốt hơn là gửi 3 Segment (mỗi cái 333 byte).
-   Bạn muốn gửi càng ít Segment càng tốt, và đảm bảo chúng "đầy" thông tin hữu ích.
-   Nếu một HTTP Request bị chia thành nhiều Segment, tất cả chúng phải đến nơi và được lắp ráp lại theo đúng thứ tự thì mới được chuyển lên cho ứng dụng (ví dụ: web server) xử lý. Nếu thiếu một Segment, toàn bộ Request sẽ bị "treo".

### 4.3. Giải thích Sơ đồ (Minh họa từ Cisco)

(Bài giảng đề cập đến một sơ đồ của Cisco, có thể được mô tả như sau):

Hãy tưởng tượng một thanh dài đại diện cho toàn bộ **Hardware Frame**.

1.  Phần đầu tiên là **Ethernet Header** (14 byte).
2.  Phần còn lại (thường là 1500 byte) chính là **Hardware MTU**.
3.  Bên trong MTU, chúng ta có **IP Header** (20 byte).
4.  Tiếp theo là **TCP Header** (20 byte).
5.  Phần còn lại cuối cùng, phần cốt lõi, chính là **TCP MSS (Payload)**. Đây là không gian thực tế dành cho dữ liệu của ứng dụng bạn (ví dụ: JSON, HTML...).

---

## 5. Path MTU Discovery

MTU là thuộc tính của _từng_ giao diện mạng (từng router, từng máy chủ trên đường đi).

> **Vấn đề (Chuyến xe liên tỉnh):**
>
> Bạn (Client) bắt đầu ở TP.HCM với MTU của mình là 9000 (Jumbo Frame). Router đầu tiên trên đường đi có MTU là 1500. Router kế nữa (có thể là một mạng cũ) chỉ có MTU là 512. Router cuối cùng (Server) có MTU là 1500.
>
> **Câu hỏi hay:** Bạn phải dùng MTU nào cho toàn bộ chuyến đi?
>
> **Trả lời:** Bạn phải dùng **MTU nhỏ nhất** trên toàn bộ đường đi, tức là **512**. Nếu bạn cố gửi một gói tin 1500, nó sẽ bị "kẹt" (bị phân mảnh hoặc hủy) ở router 512.

**Path MTU Discovery (PMTUD)** là một cơ chế giúp Client tự động khám phá ra cái MTU _nhỏ nhất_ trên đường truyền này.

### 5.1. Luồng hoạt động của PMTUD

Đây là cách nó hoạt động, và nó thực sự rất "ngầu":

1.  **Bước 1: Client gửi Gói tin Thử nghiệm:** Client gửi một gói tin IP với MTU của chính nó (ví dụ: 1500 byte) và bật một cờ (flag) đặc biệt: **`Don't Fragment (DF)`** (Cấm Phân mảnh).
2.  **Bước 2: Router gặp vấn đề:** Gói tin này đi đến một router có MTU nhỏ hơn (ví dụ: 512). Router này _muốn_ phân mảnh gói tin 1500 byte, nhưng nó _không thể_ vì cờ `DF` đã cấm.
3.  **Bước 3: Router Từ chối và Báo cáo:** Router sẽ **hủy (drop)** gói tin 1500 byte đó.
4.  **Bước 4: ICMP xuất hiện:** Router gửi lại cho Client một tin nhắn **ICMP** (một giao thức "báo cáo" cực kỳ hay). Tin nhắn này có nội dung: **"Fragmentation Needed" (Cần Phân mảnh)**.
5.  **Bước 5: Client Điều chỉnh:** Client nhận được tin nhắn ICMP, nó hiểu rằng 1500 là quá lớn. Nó sẽ _giảm_ MTU của mình xuống (ví dụ: còn 1000) và gửi lại gói tin mới (vẫn với cờ `DF`).
6.  **Bước 6: Lặp lại:** Quá trình này lặp đi lặp lại. Nếu gói 1000 vẫn bị từ chối bởi router 512, Client sẽ tiếp tục giảm MTU cho đến khi gói tin đi qua được.

> **Ghi nhớ:** Mục tiêu cuối cùng của PMTUD là để **tránh Fragmentation** bằng mọi giá. Một khi đã tìm thấy MTU nhỏ nhất (ví dụ 512), Client sẽ biết MSS tối đa của mình (ví dụ: 512 - 20 - 20 = 472) và sẽ chỉ gửi các Segment có kích thước đó.

---

## 6. Tổng kết

-   **MTU** là kích thước truyền tải tối đa trên thiết bị (Lớp 2, thường là 1500 byte trên Internet).
-   **MSS** là kích thước phân đoạn tối đa (dữ liệu payload) ở Lớp 4 (thường là 1460 byte).
-   Nếu bạn có thể nhét nhiều dữ liệu hơn vào một Segment (ví dụ: bằng cách nén dữ liệu), bạn sẽ **giảm **latency** (độ trễ)** về mặt thiết kế.
-   Sử dụng ít Segment hơn cũng giúp **giảm **overhead** (chi phí)** từ Headers và chi phí xử lý của CPU.
-   Chúng ta có thể dùng **PMTUD** (sử dụng tin nhắn **ICMP**) để khám phá MTU thấp nhất trên đường truyền nhằm **tránh **Fragmentation** (phân mảnh)**.
-   Mặc dù nhét tất cả vào một Segment là rất tốt, nhưng các cơ chế như **Flow Control** (Kiểm soát Luồng) và **Congestion Control** (Kiểm soát Tắc nghẽn) của TCP vẫn cho phép chúng ta gửi nhiều Segment một cách hiệu quả mà không làm nghẽn mạng.

---
[← Back to README](../README.md)
