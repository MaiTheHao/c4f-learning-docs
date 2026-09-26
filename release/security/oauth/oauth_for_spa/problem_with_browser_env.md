# Giới hạn Môi trường Trình duyệt (Browser Environment Constraints)

Tài liệu này vạch trần các thách thức bảo mật cố hữu của môi trường trình duyệt web, các lỗ hổng tấn công phổ biến (XSS, rò rỉ mã nguồn), và cách thức các rào cản này định hình các quyết định thiết kế kiến trúc bảo mật OAuth 2.0 dành cho ứng dụng Single Page Application (SPA).

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Giới hạn cố hữu của Trình duyệt với OAuth cho SPA](#2-giới-hạn-cố-hữu-của-trình-duyệt-với-oauth-cho-spa)
3. [Vấn đề Bảo mật Khóa Bí mật (Client Secret)](#3-vấn-đề-bảo-mật-khóa-bí-mật-client-secret)
4. [Lỗ hổng Bảo mật XSS (Cross-Site Scripting)](#4-lỗ-hổng-bảo-mật-xss-cross-site-scripting)
5. [Rủi ro từ Thư viện và Mã JavaScript Bên thứ ba](#5-rủi-ro-từ-thư-viện-và-mã-javascript-bên-thứ-ba)
6. [Nguy cơ từ Trình cắm Extension của Trình duyệt](#6-nguy-cơ-từ-trình-cắm-extension-của-trình-duyệt)
7. [Giới hạn trong Khả năng Lưu trữ an toàn (Storage Constraints)](#7-giới-hạn-trong-khả-năng-lưu-trữ-an-toàn-storage-constraints)
8. [Chính sách Khống chế Rủi ro trên Authorization Server](#8-chính-sách-khống-chế-rủi-ro-trên-authorization-server)
9. [Tổng kết](#9-tổng-kết)

---

## 1. Giới thiệu

Ứng dụng Single Page Application (SPA) viết bằng các thư viện như React, Angular, hay Vue đã trở thành tiêu chuẩn vàng của thiết kế giao diện web hiện đại. Dù chạy trên nền tảng Cloud hay các dịch vụ lưu trữ tĩnh (như AWS S3, GitHub Pages), tất cả các ứng dụng này đều phải chịu chung một ranh giới bảo mật nghiêm ngặt: **Môi trường Trình duyệt (Browser Sandbox)**.

---

## 2. Giới hạn cố hữu của Trình duyệt với OAuth cho SPA

Bản chất của ứng dụng Client-side chạy bằng JavaScript là toàn bộ mã nguồn, tài nguyên và trạng thái ứng dụng bắt buộc phải được tải xuống trực tiếp thiết bị của người dùng để thực thi. Điều này khiến cho SPA được xếp vào nhóm **Public Client** - không có khả năng bảo vệ bất kỳ khóa bí mật mật mã nào.

---

## 3. Vấn đề Bảo mật Khóa Bí mật (Client Secret)

> [!CAUTION]
> **Không có cách nào che giấu thông tin bí mật trong JavaScript:**
> Nhiều nhà phát triển cố gắng nhúng `Client Secret` hoặc API Key vào mã nguồn JavaScript, sau đó áp dụng các công cụ làm rối mã (Obfuscation) hay mã hóa nông. 
> Kẻ tấn công hoặc bất kỳ người dùng thông thạo kỹ thuật nào cũng có thể dễ dàng nhấn F12 (Inspect Element), mở tab Network, hoặc đọc file `.js` tải về để trích xuất khóa bí mật thô trong vài giây.

Do hoàn toàn thiếu vắng `Client Secret`, Authorization Server không thể áp dụng luồng xác thực Client truyền thống cho SPA, đặt ra yêu cầu bắt buộc phải chuyển đổi sang giải pháp không dùng Secret là **PKCE (Proof Key for Code Exchange)**.

---

## 4. Lỗ hổng Bảo mật XSS (Cross-Site Scripting)

Thách thức bảo mật chí mạng tiếp theo trong trình duyệt là nguy cơ bị tấn công **XSS (Cross-Site Scripting)**. 

> [!WARNING]
> **XSS là mối đe dọa hủy diệt đối với SPA:**
> Nếu kẻ tấn công khai thác thành công một lỗ hổng XSS (ví dụ: qua các ô input không được làm sạch đầu vào), chúng có thể thực thi mã JavaScript độc hại ngay bên trong phiên làm việc hợp lệ của ứng dụng.
> Khi đó, kẻ tấn công có toàn quyền:
> 1.  Đọc sạch toàn bộ Access Tokens hoặc Refresh Tokens lưu trong bộ nhớ trình duyệt.
> 2.  Âm thầm gửi các request API giả mạo lên Resource Server thay mặt người dùng ngay cả khi không nhìn thấy token.

---

## 5. Rủi ro từ Thư viện và Mã JavaScript Bên thứ ba

Để xây dựng một ứng dụng SPA hiện đại, chúng ta thường phải tích hợp hàng tá thư viện và dịch vụ JavaScript bên thứ ba như: Analytics (Google Analytics), Ads Networks, SDK theo dõi lỗi (Sentry), chat widget, hoặc CSS/UI Frameworks.

*   Mỗi tệp tin script bên thứ ba được nhúng trực tiếp vào trang web đều có chung quyền hạn thực thi JavaScript ngang hàng với mã nguồn chính chủ của bạn.
*   Nếu bất kỳ máy chủ CDN của bên thứ ba nào bị hack, kẻ tấn công có thể tiêm mã độc vào các thư viện này và tự động kiểm soát ứng dụng của bạn để đánh cắp token người dùng từ xa.

---

## 6. Nguy cơ từ Trình cắm Extension của Trình duyệt

Một rủi ro nằm ngoài tầm kiểm soát của nhà phát triển là các **Trình cắm trình duyệt (Browser Extensions)** do người dùng tự cài đặt.
*   Nhiều Extension (như chặn quảng cáo, ví điện tử crypto, công cụ dịch thuật) yêu cầu quyền đọc và thay đổi toàn bộ dữ liệu trên các website mà người dùng truy cập.
*   Mã độc cài cắm trong các Extension này có thể dễ dàng can thiệp vào bộ nhớ JavaScript của SPA để đánh cắp Access Token mà các chính sách bảo mật máy chủ như CSP (Content Security Policy) hoàn toàn bất lực không thể chặn đứng được.

---

## 7. Giới hạn trong Khả năng Lưu trữ an toàn (Storage Constraints)

Một hạn chế nghiêm trọng của môi trường trình duyệt là **hoàn toàn không có bất kỳ cơ chế lưu trữ dữ liệu an toàn nào** chống lại được mã độc JavaScript.

| Phương thức lưu trữ | Khả năng truy cập từ JS | Mức độ an toàn trước XSS |
| :--- | :---: | :--- |
| **LocalStorage** | **Có** | **Rất nguy hiểm**. Mã độc XSS chỉ cần gọi `localStorage.getItem()` để lấy sạch token. |
| **SessionStorage** | **Có** | **Rất nguy hiểm**. Dễ dàng bị đánh cắp tương tự LocalStorage. |
| **JS Memory (Variables)** | **Có** | **Tương đối**. Khó bị đánh cắp hơn do nằm ngoài Storage, nhưng vẫn có thể bị chặn bắt bằng cách hook/ghi đè các API request. |
| **Cookie (HttpOnly, Secure)** | **Không** | **An toàn nhất**. JavaScript hoàn toàn bị cấm đọc cookie này, triệt tiêu 100% rủi ro bị XSS lấy trộm token. |

---

## 8. Chính sách Khống chế Rủi ro trên Authorization Server

Do nhận thức rõ các rủi ro bảo mật cố hữu của trình duyệt, các Authorization Servers hiện đại áp dụng các chính sách nghiêm ngặt dành riêng cho SPA:
*   **Hạn chế thời gian sống của token:** Access Token cấp cho SPA thường có thời gian hết hạn cực ngắn (ví dụ: 15 - 30 phút) để hạn chế rác rưởi nếu bị rò rỉ.
*   **Cơ chế Refresh Token Rotation:** Mỗi khi Client dùng Refresh Token để lấy Access Token mới, Auth Server lập tức hủy Refresh Token cũ và cấp Refresh Token mới. Nếu kẻ tấn công cố tình dùng lại Refresh Token cũ đã bị đánh cắp, Auth Server sẽ lập tức phát hiện hành vi gian lận và khóa toàn bộ phiên làm việc của người dùng đó.

---

## 9. Tổng kết

*   **SPA là Public Client:** Tuyệt đối không nhúng hoặc lưu trữ Client Secret trên trình duyệt.
*   **Chống XSS chủ động:** Thiết lập chính sách bảo mật CSP chặt chẽ, kiểm soát chặt mã bên thứ ba và chọn lựa phương thức lưu trữ token cẩn trọng.
*   **Lựa chọn mô hình tối ưu:** 
    *   Nếu muốn chạy SPA thuần túy $\rightarrow$ Sử dụng *Authorization Code Flow kết hợp PKCE* và lưu token trong cookie bảo mật.
    *   Nếu muốn an toàn tuyệt đối $\rightarrow$ Chuyển đổi sang mô hình *Backend-for-Frontend (BFF)* để giữ sạch token hoàn toàn ngoài trình duyệt.

---
[← Quay lại mục lục](../README.md)
