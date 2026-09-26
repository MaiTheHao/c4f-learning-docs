# ID Token là gì? Khái niệm về OpenID Connect

Tài liệu này cung cấp kiến thức nền tảng về **OpenID Connect (OIDC)**, bản chất và chức năng của **ID Token**, cấu trúc chuyên sâu của JSON Web Token (JWT), và bảng phân tích các Claims định danh tiêu chuẩn.

## Mục lục

1. [Giới thiệu về OpenID Connect](#1-giới-thiệu-về-openid-connect)
2. [Bản chất của ID Token](#2-bản-chất-của-id-token)
3. [Cấu trúc của ID Token (JWT)](#3-cấu-trúc-của-id-token-jwt)
4. [Các Tuyên bố tiêu chuẩn trong Payload (Claims)](#4-các-tuyên-bố-tiêu-chuẩn-trong-payload-claims)
5. [Tổng kết](#5-tổng-kết)

---

## 1. Giới thiệu về OpenID Connect

Mặc dù đặc tả gốc OAuth 2.0 giải quyết xuất sắc bài toán phân quyền truy cập API (Access Token), nó hoàn toàn bỏ trống mảnh ghép **Xác thực Danh tính (Authentication)**. Nhiều nhà phát triển trước đây đã cố tình lạm dụng Access Token để làm tính năng đăng nhập, dẫn đến các lỗ hổng bảo mật nghiêm trọng.

**OpenID Connect (OIDC)** ra đời năm 2014 như một lớp mở rộng (Identity Layer) được xây dựng trực tiếp trên nền tảng OAuth 2.0 nhằm:
*   Chuẩn hóa giao thức xác thực danh tính người dùng.
*   Cung cấp thông tin nhận dạng người dùng cho các ứng dụng khách một cách an toàn và nhất quán.

---

## 2. Bản chất của ID Token

> [!NOTE]
> **Quy định bắt buộc của OIDC:**
> Trong khi `Access Token` của OAuth không được đặc tả quy định bất kỳ định dạng cụ thể nào (có thể là chuỗi ngẫu nhiên opaque string hoặc định dạng JWT tùy thuộc vào cài đặt của server), thì **ID Token của OpenID Connect bắt buộc phải là JSON Web Token (JWT)** được ký số bảo mật.

ID Token hoạt động giống như một chiếc **Chứng minh nhân dân / Hộ chiếu** kỹ thuật số được phát hành bởi máy chủ Authorization Server. Ứng dụng khách (Client) nhận được ID Token có thể trực tiếp giải mã và đọc thông tin để hiển thị tên, email, avatar của người dùng lên giao diện ngay lập tức mà không cần thực hiện thêm bất kỳ lệnh gọi API nào khác.

---

## 3. Cấu trúc của ID Token (JWT)

Do bắt buộc là một JSON Web Token (JWT), ID Token được chia thành 3 phần ngăn cách bởi dấu chấm (`.`): `Header.Payload.Signature`.

*   **Header (Phần đầu):** JSON mã hóa Base64URL chứa siêu dữ liệu về thuật toán ký (ví dụ: RS256, HS256) và định danh của khóa công khai (`kid`) dùng để ký token.
*   **Payload (Thân token):** JSON mã hóa Base64URL chứa các thông tin nhận dạng người dùng và các tham số kiểm soát thời hạn của token.
*   **Signature (Chữ ký số):** Chữ ký mật mã được tạo ra bằng cách ký kết hợp `Header` và `Payload` bằng khóa riêng tư (Private Key) của Auth Server, giúp Client xác minh tính toàn vẹn của token (chống giả mạo dữ liệu).

---

## 4. Các Tuyên bố tiêu chuẩn trong Payload (Claims)

Các thuộc tính bên trong Payload của JWT được gọi là **Claims (Tuyên bố)**. Đặc tả OIDC định nghĩa rõ ràng các Claims tiêu chuẩn bắt buộc phải có để đảm bảo tính đồng bộ toàn cầu:

| Claim | Tên đầy đủ | Ý nghĩa kỹ thuật |
| :--- | :--- | :--- |
| `**sub**` | Subject | **Định danh duy nhất** của người dùng trong hệ thống Auth Server (ví dụ: ID tài khoản, username). Không bao giờ trùng lặp giữa hai người dùng khác nhau. |
| `**iss**` | Issuer | Định danh của máy chủ đã phát hành ra token này (thường là một URL HTTPS). |
| `**aud**` | Audience | Đối tượng nhận token này, bắt buộc phải trùng khớp với `client_id` của ứng dụng khách của bạn. |
| `**iat**` | Issued At | Thời điểm phát hành token (dưới dạng mốc thời gian Unix timestamp). |
| `**exp**` | Expiration Time | Thời điểm token hết hạn. Client phải từ chối sử dụng token nếu thời gian hiện tại vượt quá mốc này. |

Ngoài các claims hệ thống trên, tùy thuộc vào phạm vi quyền (`scope`) được người dùng phê duyệt, payload của ID Token có thể chứa thêm các thông tin cá nhân bổ sung:
*   `name`: Tên đầy đủ của người dùng (ví dụ: `"Mai Thế Hào"`).
*   `email`: Địa chỉ email.
*   `email_verified`: Boolean xác nhận email đã được xác minh hay chưa.
*   `picture`: Đường dẫn URL ảnh đại diện (avatar).

---

## 5. Tổng kết

*   **OIDC** là tiêu chuẩn hóa quốc tế về xác thực danh tính xây dựng trên OAuth 2.0.
*   **ID Token** là một JWT chứa các claims nhận diện người dùng (`sub`, `name`, `email`) được ký số bảo mật tuyệt đối chống giả mạo.
*   **Chuyên đề tiếp theo:** Chúng ta sẽ phân tích sự khác biệt sâu sắc giữa *ID Token* và *Access Token* để tránh các lỗi thiết kế kiến trúc bảo mật tai hại thường gặp trong thực tế.

---
[← Quay lại mục lục](../README.md)
