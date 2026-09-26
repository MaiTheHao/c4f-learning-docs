# Quy trình Đăng ký OAuth Client

Tài liệu này hướng dẫn chi tiết quy trình đăng ký ứng dụng khách (**OAuth Client Registration**), các thông tin siêu dữ liệu (metadata) cần thiết, vai trò mật mã học của Client ID/Secret, và giải pháp bảo vệ Redirect URIs trước các nguy cơ tấn công mạng.

## Mục lục

1. [Khái niệm Đăng ký Client](#1-khái-niệm-đăng-ký-client)
2. [Quy trình Thực tế Đăng ký](#2-quy-trình-thực-tế-đăng-ký)
3. [Các Siêu dữ liệu Yêu cầu khi Đăng ký](#3-các-siêu-dữ-liệu-yêu-cầu-khi-đăng-ký)
4. [Bảo mật Redirect URI](#4-bảo-mật-redirect-uri)
5. [Cấp phát Client ID và Client Secret](#5-cấp-phát-client-id-và-client-secret)
6. [Lưu ý Quan trọng khi Sử dụng Client Secret](#6-lưu-ý-quan-trọng-khi-sử-dụng-client-secret)
7. [Tổng kết](#7-tổng-kết)

---

## 1. Khái niệm Đăng ký Client

Trước khi ứng dụng khách (Client) có thể bắt đầu bất kỳ luồng giao dịch ủy quyền OAuth 2.0 nào với Authorization Server, nó bắt buộc phải được đăng ký danh tính chính thức trên máy chủ xác thực.

Quá trình đăng ký này thực hiện hai nhiệm vụ cốt lõi:
1.  Khai báo các thuộc tính logic của ứng dụng (Tên, tên miền, redirect URL).
2.  Nhận các thông tin xác thực mật mã để máy chủ nhận diện ứng dụng trong suốt quá trình chạy.

---

## 2. Quy trình Thực tế Đăng ký

*   **Với các dịch vụ API công khai (Public SaaS APIs):** Các dịch vụ lớn như Google, GitHub, Twitter hỗ trợ một cổng thông tin tự phục vụ dành riêng cho nhà phát triển (**Developer Portal**). Bạn chỉ cần tạo tài khoản Developer, tạo một dự án mới, khai báo thông tin và nhận khóa xác thực ngay lập tức.
*   **Với hệ thống doanh nghiệp (Enterprise APIs):** Các dịch vụ lưu trữ nội bộ hoặc private APIs thường không hỗ trợ tự đăng ký. Bạn sẽ cần gửi yêu cầu cấu hình (thường qua tệp YAML, GitOps, hoặc hệ thống ticket hỗ trợ) để quản trị viên hệ thống (Admin) cấu hình và cung cấp khóa bí mật một cách an toàn.

---

## 3. Các Siêu dữ liệu Yêu cầu khi Đăng ký

Khi đăng ký, Authorization Server sẽ yêu cầu bạn khai báo các thuộc tính siêu dữ liệu (metadata) cơ bản sau:

*   **Application Name (Tên ứng dụng):** Tên thương hiệu hiển thị công khai trên màn hình Consent Screen để người dùng nhận diện ứng dụng.
*   **Application Logo (Logo ứng dụng):** Hiển thị trên giao diện xác thực của Auth Server.
*   **Terms of Service & Privacy Policy URLs:** Đường dẫn chính sách bảo mật và điều khoản sử dụng, bắt buộc đối với các ứng dụng công khai để người dùng duyệt trước khi đồng ý cấp quyền.
*   **Client Type (Loại ứng dụng):** Khai báo rõ ràng là *Confidential* (Web App Server-side) hay *Public* (SPA/Mobile App) để Auth Server áp dụng các chính sách cấp phát Refresh Token và bật CORS thích hợp.

---

## 4. Bảo mật Redirect URI

> [!IMPORTANT]
> **Redirect URI là thông số cấu hình tối quan trọng nhất khi đăng ký:**
> Redirect URI (Đường dẫn chuyển hướng) là địa chỉ máy chủ của bạn mà Auth Server sẽ gửi người dùng quay trở lại kèm theo Authorization Code sau khi đăng nhập thành công.

### Ràng buộc bảo mật của Redirect URI:
*   **Chống Open Redirect Attack:** Kẻ tấn công có thể cố tình gửi Client ID của ứng dụng bạn, nhưng điền tham số redirect URI trỏ về server độc hại của hắn. Nếu Auth Server không có whitelist đăng ký trước để đối chiếu, nó sẽ gửi thẳng mã ủy quyền (Code) về server của kẻ tấn công.
*   **Cấm tuyệt đối ký tự đại diện (Wildcards):** Cấm các cấu hình lỏng lẻo như `https://*.example.com` hoặc `https://example.com/oauth/callback?*`. Kẻ tấn công có thể lợi dụng wildcard này để tiêm các đường dẫn phụ độc hại và vượt qua bước kiểm tra regex của server.

---

## 5. Cấp phát Client ID và Client Secret

Sau khi hoàn tất đăng ký, Auth Server sẽ trả về cặp thông tin xác thực mật mã:

*   `**Client ID**` (Định danh Client): Là chuỗi ký tự công khai duy nhất đại diện cho ứng dụng. Bạn có thể thoải mái đưa Client ID vào mã nguồn, file JavaScript (SPA), hoặc nhúng trong URL chuyển hướng.
*   `**Client Secret**` (Khóa bí mật Client): Là chuỗi ký tự ngẫu nhiên có độ dài mật mã lớn hoạt động giống như **mật khẩu của ứng dụng**. Client Secret chỉ được dùng ở kết nối Kênh sau (Back Channel) để xác thực danh tính thực của ứng dụng khi đổi Code lấy Token.

---

## 6. Lưu ý Quan trọng khi Sử dụng Client Secret

> [!WARNING]
> **Quy tắc vàng về bảo vệ Client Secret:**
> *   Nếu ứng dụng của bạn là **Public Client** (Mobile App, JavaScript SPA), khi đăng ký Auth Server sẽ thông minh cấu hình chỉ cấp phát `Client ID` mà **không cấp phát `Client Secret`**.
> *   Nếu bạn vô tình nhận được Client Secret cho một SPA hoặc Mobile App, **tuyệt đối không được đưa nó vào mã nguồn**. Bất kỳ ai cũng có thể mở thanh F12 (Inspect Element) hoặc dịch ngược file `.apk/.ipa` để đánh cắp Secret trong vòng vài giây.
> *   Client Secret chỉ được lưu trữ an toàn trong các biến môi trường (`.env`), tệp cấu hình bảo mật ở Web Server Backend (Confidential Client), nơi người dùng đầu cuối hoàn toàn không có quyền truy cập trực tiếp.

---

## 7. Tổng kết

*   **Đăng ký chính xác:** Luôn khai báo chính xác thuộc tính ứng dụng (đặc biệt là Client Type) khi đăng ký trên Auth Server.
*   **White-list tuyệt đối:** Đăng ký chính xác, cụ thể các Redirect URIs (sử dụng giao thức HTTPS bảo mật) và tuyệt đối không dùng wildcard.
*   **Bảo mật khóa:** Bảo vệ Client Secret giống như bảo vệ mật khẩu cơ sở dữ liệu của bạn, chỉ sử dụng trên môi trường Server-side an toàn.

---
[← Quay lại mục lục](../README.md)
