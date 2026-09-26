# Ưu và Nhược điểm của UDP

UDP mang đến tốc độ và sự gọn nhẹ vượt trội, nhưng cái giá phải trả là độ tin cậy và các cơ chế kiểm soát truyền tải. Tài liệu này tổng hợp ưu điểm, nhược điểm của UDP trong dạng bảng đối chiếu để bạn nhanh chóng quyết định giao thức phù hợp cho ứng dụng của mình.

## Table of Contents

-   [1. Ưu điểm của UDP](#1-ưu-điểm-của-udp)
-   [2. Nhược điểm của UDP](#2-nhược-điểm-của-udp)
-   [3. Tóm tắt](#3-tóm-tắt)

---

## 1. Ưu điểm của UDP

| Đặc điểm                 | Mô tả                                                                                                                |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Tốc độ & Độ trễ thấp** | Không cần bắt tay **handshake**, gửi dữ liệu ngay lập tức, không chờ xác nhận, lý tưởng cho ứng dụng thời gian thực. |
| **Gọn nhẹ & Hiệu quả**   | Header chỉ 8 bytes, tiết kiệm băng thông, giảm tải xử lý cho CPU, tăng thông lượng.                                  |
| **Stateless**            | Máy chủ không lưu trạng thái kết nối, phục vụ số lượng lớn **client** mà không tốn nhiều bộ nhớ.                      |
| **Broadcast/Multicast**  | Hỗ trợ gửi một gói tin đến nhiều thiết bị cùng lúc (**broadcast**, **multicast**), TCP không làm được điều này.       |

**Ứng dụng phổ biến:** Game online, livestreaming, VoIP (Zalo, Skype, Google Meet), DNS, DHCP.

---

## 2. Nhược điểm của UDP

| Đặc điểm                      | Mô tả                                                                                                     |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Không đáng tin cậy**        | Không đảm bảo gói tin đến nơi, đúng thứ tự, có thể bị trùng lặp; trách nhiệm xử lý thuộc về lớp ứng dụng. |
| **Không kiểm soát luồng**     | Không điều chỉnh tốc độ gửi, máy gửi nhanh có thể làm "ngập" máy nhận chậm, gây mất gói tin.              |
| **Không kiểm soát tắc nghẽn** | Không tự động giảm tốc độ khi mạng tắc nghẽn, có thể làm tình trạng tồi tệ hơn.                           |
| **Bảo mật kém**               | Dễ bị giả mạo địa chỉ IP, thường bị khai thác trong các cuộc tấn công DoS, Amplification.                 |

---

## 3. Tóm tắt

-   UDP lý tưởng cho ứng dụng cần tốc độ, độ trễ thấp, chấp nhận mất mát dữ liệu nhỏ.
-   Header nhỏ gọn, không lưu trạng thái, hỗ trợ broadcast/multicast.
-   Không đảm bảo độ tin cậy, không kiểm soát luồng/tắc nghẽn, bảo mật thấp.

---
[← Back to README](../README.md)
