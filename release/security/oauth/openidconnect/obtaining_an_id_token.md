# Quy trình Thu nhận ID Token (Obtaining ID Token)

Tài liệu này hướng dẫn chi tiết các phương thức cấu hình yêu cầu thu nhận **ID Token** từ Authorization Server, phân tích vai trò của scope `openid` bắt buộc, cơ chế tối ưu hóa xác thực ở Kênh sau (Back Channel), và danh sách các OIDC scopes chuẩn hóa.

## Mục lục

1. [Thu nhận ID Token cùng Access Token](#1-thu-nhận-id-token-cùng-access-token)
2. [Vai trò bắt buộc của Scope "openid"](#2-vai-trò-bắt-buộc-của-scope-openid)
3. [Thu nhận ID Token qua Kênh sau (Back Channel)](#3-thu-nhận-id-token-qua-kênh-sau-back-channel)
4. [Thu nhận ID Token qua Kênh trước (Implicit Flow) & Rủi ro](#4-thu-nhận-id-token-qua-kênh-trước-implicit-flow--rủi-ro)
5. [Các Scopes chuẩn hóa mở rộng để lấy thông tin người dùng](#5-các-scopes-chuẩn-hóa-mở-rộng-để-lấy-thông-tin-người-dùng)
6. [Lưu ý Bảo mật Quan trọng](#6-lưu-ý-bảo-mật-quan-trọng)
7. [Tổng kết](#7-tổng-kết)

---

## 1. Thu nhận ID Token cùng Access Token

Trong phần lớn các kịch bản thực tế, ứng dụng khách (Client) muốn thu nhận đồng thời cả hai loại token trong cùng một phiên đăng nhập:
1.  **Access Token:** Để đính kèm gửi lên API Server thực hiện các tác vụ tài nguyên.
2.  **ID Token:** Để trực tiếp giải mã lấy thông tin cá nhân hiển thị lên giao diện người dùng cục bộ.

Phương thức tối ưu và an toàn nhất hiện nay là thực thi **Authorization Code Flow kết hợp PKCE** và đính kèm scope nhận diện.

---

## 2. Vai trò bắt buộc của Scope "openid"

Để báo cho Authorization Server biết rằng ứng dụng khách của bạn muốn kích hoạt giao thức **OpenID Connect (OIDC)** để nhận về ID Token chứ không chỉ đơn thuần là phân quyền OAuth 2.0:

> [!IMPORTANT]
> **Scope "openid" là bắt buộc và duy nhất:**
> Bạn bắt buộc phải khai báo scope mang tên chính xác là `openid` bên trong danh sách tham số `scope` của GET request ban đầu gửi lên Authorization Endpoint. 
> Nếu thiếu scope `openid`, Auth Server sẽ chỉ đối xử request như một luồng OAuth 2.0 thông thường và **tuyệt đối không trả về ID Token**.

---

## 3. Thu nhận ID Token qua Kênh sau (Back Channel)

Khi trình duyệt của người dùng được chuyển hướng quay trở lại SPA hoặc Web Server kèm theo Authorization Code:
*   Ứng dụng gửi POST request trực tiếp (**Back Channel**) đổi Code lấy token.
*   Auth Server sẽ trả về một gói JSON chứa đồng thời cả hai token:
```json
{
  "access_token": "yT98s...OpaqueAccessToken",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOiJSUzI1Ni...AnIDTokenJWT"
}
```

> [!TIP]
> **Tối giản hóa bước xác thực chữ ký (Signature Validation) ở Kênh sau:**
> Khi ứng dụng của bạn nhận ID Token trực tiếp từ **Back Channel** (gửi request HTTPS từ backend trực tiếp tới Token Endpoint), bạn có thể **bỏ qua bước xác thực chữ ký số** của ID Token.
> Vì kết nối HTTPS trực tiếp bảo đảm dữ liệu đến từ nguồn tin cậy 100%, bạn chỉ cần giải mã Base64URL phần Payload và đọc thông tin trực tiếp, giúp tối giản hóa mã nguồn và loại bỏ sự phụ thuộc vào các thư viện giải mã JWT phức tạp trên server backend.

---

## 4. Thu nhận ID Token qua Kênh trước (Implicit Flow) & Rủi ro

Một phương thức thay thế cũ là gọi trực tiếp qua Kênh trước bằng cách cấu hình tham số `response_type=id_token` hoặc `response_type=id_token token` (Implicit Flow).
*   **Cơ chế:** Auth Server trả thẳng ID Token về trình duyệt của người dùng trên thanh địa chỉ URL Redirect mà không qua bước đổi code trung gian.

> [!WARNING]
> **Nguy hiểm chí mạng của Implicit Flow:**
> Việc truyền tải ID Token trực tiếp qua Front Channel URL khiến token dễ dàng bị lộ lọt trong lịch sử duyệt web hoặc bị extensions đánh cắp. 
> Khác với Back Channel, nếu bạn nhận ID Token qua Front Channel, **bước xác thực chữ ký số JWT bắt buộc phải thực hiện cực kỳ nghiêm ngặt** để chống lại cuộc tấn công mạo danh (IdP Spoofing). Luồng Implicit này hiện đã bị khuyến nghị loại bỏ hoàn toàn.

---

## 5. Các Scopes chuẩn hóa mở rộng để lấy thông tin người dùng

Bên cạnh scope `openid` bắt buộc để phát hành ID Token cơ bản (chỉ chứa metadata và ID người dùng `sub`), đặc tả OIDC định nghĩa sẵn 4 scopes chuẩn hóa quốc tế giúp bạn xin thêm các thông tin chi tiết của người dùng:

| OIDC Scope | Các Claim tương ứng được thêm vào ID Token | Ý nghĩa dữ liệu |
| :--- | :--- | :--- |
| `**profile**` | `name`, `family_name`, `given_name`, `picture`, `preferred_username` | Thông tin hồ sơ cá nhân hiển thị công khai (tên, avatar). |
| `**email**` | `email`, `email_verified` | Địa chỉ email và trạng thái xác thực. |
| `**address**` | `address` | Địa chỉ thực tế của người dùng. |
| `**phone**` | `phone_number`, `phone_number_verified` | Số điện thoại liên lạc. |

---

## 6. Lưu ý Bảo mật Quan trọng

> [!CAUTION]
> **Rò rỉ thông tin cá nhân (PII):**
> Nhiều Auth Servers cấu hình mặc định sẽ **không đưa các thông tin nhạy cảm** (như địa chỉ, số điện thoại) trực tiếp vào ID Token để tránh phơi bày thông tin cá nhân trên trình duyệt. 
> Thay vào đó, Client bắt buộc phải lấy Access Token gửi POST lên một API endpoint bảo mật của Auth Server gọi là **UserInfo Endpoint** để nhận về thông tin cá nhân dạng JSON sạch qua Back Channel.

---

## 7. Tổng kết

*   Luôn yêu cầu scope `openid` trong luồng **Authorization Code Flow kết hợp PKCE** để nhận ID Token an toàn qua Kênh sau.
*   Sử dụng các scope mở rộng (`profile`, `email`) một cách tinh gọn để lấy đúng và đủ thông tin cần thiết.
*   **Chuyên đề tiếp theo:** Chúng ta sẽ tìm hiểu luồng nâng cao phối hợp song song cả kênh trước và kênh sau trong OIDC, được gọi là **Hybrid OpenID Connect Flow**.

---
[← Quay lại mục lục](../README.md)
