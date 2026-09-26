# Cấu trúc TCP Segment và Phân tích TCP Header

Giống như gói tin IP và UDP, một **TCP segment** được đóng gói bên trong gói tin IP để truyền qua mạng, với một header giàu thông tin điều khiển. Tài liệu này phân tích chi tiết từng trường của **TCP Header**, vai trò của các cờ (**flags**), và mối quan hệ giữa **MSS** với **MTU** — nền tảng để hiểu về hiệu suất truyền tải.

## Table of Contents

-   [1. Tổng quan về TCP Segment](#1-tổng-quan-về-tcp-segment)
-   [2. Phân tích Cấu trúc chi tiết của TCP Header](#2-phân-tích-cấu-trúc-chi-tiết-của-tcp-header)
-   [3. Maximum Segment Size (MSS) và mối liên quan với MTU](#3-maximum-segment-size-mss-và-mối-liên-quan-với-mtu)

---

## 1. Tổng quan về TCP Segment

Giống như gói tin IP và UDP, chúng ta sẽ phân tích sâu vào cấu trúc của một **TCP segment** để hiểu rõ các trường thông tin (header) của nó.

Về cơ bản, một `TCP segment` được đóng gói bên trong một gói tin IP và trở thành phần dữ liệu (data) của gói tin IP đó. Header của TCP segment có kích thước mặc định là **20 bytes** và có thể mở rộng lên đến 60 bytes tùy thuộc vào các tùy chọn (options) bổ sung.

> Cấu trúc header mặc định bao gồm 5 hàng, mỗi hàng dài 4 bytes (tổng cộng `5 * 4 = 20 bytes`).

---

## 2. Phân tích Cấu trúc chi tiết của TCP Header

Header của TCP chứa nhiều trường quan trọng để quản lý kết nối, bao gồm số thứ tự, số xác nhận, kiểm soát luồng, và nhiều hơn nữa.

### 2.1. Source Port và Destination Port

-   **Source Port** (Cổng nguồn, 16 bits): Xác định cổng của ứng dụng gửi dữ liệu.
-   **Destination Port** (Cổng đích, 16 bits): Xác định cổng của ứng dụng nhận dữ liệu.
-   Với độ dài _16 bits_, chúng ta có đủ không gian để định danh cho hầu hết các ứng dụng cần thiết.

### 2.2. Sequence Number và Acknowledgment Number

-   **Sequence Number** (Số thứ tự, 32 bits): Đây là một số duy nhất cho mỗi segment được gửi đi. Nó liên tục tăng trong suốt quá trình truyền dữ liệu để đảm bảo các gói tin được sắp xếp đúng thứ tự ở phía nhận.
    -   📌 **Ghi nhớ:** Với kích thước 32 bits, `Sequence Number` có thể đạt tới khoảng 4 tỷ giá trị. Tuy nhiên, trong một kết nối có lưu lượng truyền tải rất lớn, con số này có thể bị dùng hết và quay vòng (**wrap around**) trở về 0.
-   **Acknowledgment Number** (Số xác nhận, 32 bits): Khi cờ `ACK` được bật, trường này chứa giá trị của `Sequence Number` tiếp theo mà bên nhận đang mong đợi. Điều này cho phép bên gửi biết rằng dữ liệu đã được nhận thành công.
    -   Việc có cả hai trường `Sequence` và `Acknowledgment` cho phép một thiết bị vừa gửi dữ liệu mới (với `Sequence Number` của riêng nó) vừa xác nhận dữ liệu đã nhận được trong cùng một segment.

### 2.3. Các trường điều khiển (Control Fields)

| Trường          | Kích thước | Chức năng                                                                                                                                                                                                           |
| :-------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Window Size** | 16 bits    | Dùng cho _flow control_ (kiểm soát luồng). Báo cho bên gửi biết lượng dữ liệu (tính bằng byte) mà bên nhận có thể xử lý. Mặc định tối đa là **65 KB**, nhưng có thể mở rộng lên đến 1 GB nhờ một tùy chọn đặc biệt. |
| **Flags**       | 9 bits     | Các cờ một bit dùng để quản lý kết nối.                                                                                                                                                                             |

#### Các cờ (Flags) quan trọng:

-   **SYN**: Dùng để bắt đầu một kết nối (trong quá trình bắt tay ba bước).
-   **FIN**: Dùng để đóng một kết nối.
-   **RST**: Reset lại kết nối khi có lỗi xảy ra.
-   **PSH**: Yêu cầu đẩy (**push**) dữ liệu ngay lập tức đến ứng dụng mà không cần đợi bộ đệm đầy.
-   **ACK**: Cho biết trường `Acknowledgment Number` là hợp lệ.
-   **ECE** và **CWR**: Được sử dụng trong cơ chế kiểm soát tắc nghẽn (congestion control), giúp router báo hiệu tình trạng tắc nghẽn sắp xảy ra mà không cần phải loại bỏ gói tin.

---

## 3. Maximum Segment Size (MSS) và mối liên quan với MTU

**MSS (Maximum Segment Size)** là một trong những khái niệm quan trọng nhất, đặc biệt khi bạn gửi một lượng lớn dữ liệu như tải lên một tệp tin. MSS xác định lượng dữ liệu tối đa có thể chứa trong một `TCP segment` duy nhất.

Giá trị của MSS phụ thuộc trực tiếp vào **MTU (Maximum Transmission Unit)** của mạng. MTU là kích thước tối đa của một khung dữ liệu (**frame**) có thể được truyền đi trên mạng.

💡 **Mẹo:** Cách tính MSS phổ biến nhất dựa trên MTU tiêu chuẩn của Internet là 1500 bytes:

> **MSS = MTU - Kích thước IP Header - Kích thước TCP Header**
>
> `1460 bytes = 1500 bytes - 20 bytes (IP) - 20 bytes (TCP)`

Trong một số mạng, chẳng hạn như môi trường đám mây (**cloud**), có thể sử dụng **Jumbo Frames**, cho phép MTU tăng lên đến 9000 bytes, nhờ đó MSS cũng sẽ lớn hơn rất nhiều, giúp tăng hiệu quả truyền tải.

---
[← Back to README](../README.md)
