# Quy trình Xác thực và Sử dụng ID Token

Tài liệu này hướng dẫn chi tiết quy trình 5 bước xác thực **ID Token** chuẩn OIDC, giải pháp bảo mật chống tấn công Replay Attack bằng claim `nonce`, so sánh sự khác biệt về trách nhiệm kiểm tra giữa Front Channel và Back Channel, và cách tiêu thụ thông tin Claims an toàn.

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Tại sao Quy trình Xác thực là Bắt buộc?](#2-tại-sao-quy-trình-xác-thực-là-bắt-buộc)
3. [Quy trình 5 Bước Xác thực ID Token chuẩn OIDC](#3-quy-trình-5-bước-xác-thực-id-token-chuẩn-oidc)
4. [Trích xuất và Tiêu thụ Thông tin ID Token](#4-trích-xuất-và-tiêu-thụ-thông-tin-id-token)
5. [Sự khác biệt về trách nhiệm xác thực: Front vs Back Channel](#5-sự-khác-biệt-về-trách-nhiệm-xác-thực-front-vs-back-channel)
6. [Kịch bản Cần Xác thực lại Token (Re-validation)](#6-kịch-bản-cần-xác-thực-lại-token-re-validation)
7. [Tổng kết](#7-tổng-kết)

---

## 1. Giới thiệu

Sau khi ứng dụng khách (Client) hoàn thành các bước yêu cầu và nhận được **ID Token** (JSON Web Token), công việc tiếp theo cực kỳ quan trọng là phải kiểm tra tính hợp lệ mật mã của token này trước khi tin tưởng các thông tin định danh bên trong nó để cho phép người dùng đăng nhập hệ thống.

---

## 2. Tại sao Quy trình Xác thực là Bắt buộc?

ID Token là tấm hộ chiếu định danh người dùng. Nếu ứng dụng khách bỏ qua bước xác thực mà trực tiếp giải mã đọc email/ID bên trong payload để cấp quyền đăng nhập cục bộ:
*   Kẻ tấn công có thể tự tạo ra một tệp tin JWT giả mạo (tự ký bằng key của hắn, hoặc sửa email của nạn nhân trong payload) và gửi trực tiếp lên endpoint đăng nhập của ứng dụng của bạn.
*   **Hậu quả:** Kẻ tấn công có thể đăng nhập vào bất kỳ tài khoản người dùng nào trong hệ thống một cách dễ dàng (lỗ hổng Mạo danh tài khoản).

---

## 3. Quy trình 5 Bước Xác thực ID Token chuẩn OIDC

Để đảm bảo tuyệt đối tính chính danh của ID Token, Client bắt buộc phải thực thi nghiêm ngặt quy trình kiểm tra gồm 5 bước sau:

### 3.1. Xác thực Chữ ký số mật mã (Signature Validation)
*   **Mục tiêu:** Đảm bảo token được phát hành từ đúng Authorization Server hợp pháp và nội dung payload không bị tráo đổi, chỉnh sửa trên đường truyền.
*   **Cách làm:** Giải mã Header của JWT lấy tham số `kid` (Key ID), truy vấn danh sách khóa công khai hợp pháp của Auth Server (qua cổng JWKS Endpoint công khai của họ), sử dụng khóa công khai đó kết hợp thư viện bảo mật tiêu chuẩn để xác minh chữ ký của JWT.

> [!CAUTION]
> **Không tự viết code giải mã mật mã:**
> Luôn luôn sử dụng các thư viện giải mã và xác thực JWT tiêu chuẩn công nghiệp (như `jsonwebtoken`, `jose`). Tuyệt đối không tự viết code regex hoặc giải mã thủ công bước đối khớp chữ ký mật mã để tránh các lỗi logic mật mã sơ đẳng nhưng chí mạng.

### 3.2. Kiểm tra Logic các Claims hệ thống
Sau khi chữ ký số được xác minh thành công, Client tiến hành đối chiếu 4 Claims logic bắt buộc trong Payload:

| Thứ tự | Claim cần check | Ràng buộc kiểm tra bắt buộc | Ý nghĩa bảo mật |
| :--- | :--- | :--- | :--- |
| **Bước 2** | `**iss**` (Issuer) | Phải **khớp 100%** với URL HTTPS định danh của máy chủ Authorization Server của bạn. | Chặn đứng kẻ tấn công tự phát hành token từ một máy chủ giả mạo. |
| **Bước 3** | `**aud**` (Audience) | Phải **khớp 100%** với `client_id` ứng dụng khách của bạn. | Chặn đứng việc lấy token hợp lệ của ứng dụng này để đăng nhập trái phép vào ứng dụng khác. |
| **Bước 4** | `**exp**` (Expiration) | Thời gian hệ thống hiện tại **bắt buộc phải nhỏ hơn** mốc thời gian `exp`. | Chặn đứng việc sử dụng lại các token cũ đã hết hạn. |
| **Bước 5** | `**nonce**` | Giá trị claim `nonce` trong payload **phải khớp 100%** với giá trị ngẫu nhiên đã lưu trữ tại Session Client trước khi gửi request. | Chặn đứng hoàn toàn cuộc tấn công phát lại (Replay Attack). |

> [!IMPORTANT]
> **Chống tấn công phát lại (Replay Attack) bằng Nonce:**
> Khi ứng dụng gửi yêu cầu đăng nhập qua Front Channel, nó bắt buộc phải tự sinh một chuỗi ngẫu nhiên cryptographically secure gọi là `nonce` lưu vào bộ nhớ session client, và gửi lên Auth Server. 
> Khi xác thực ID Token nhận được, Client phải đối khớp 100% claim `nonce` trong payload với giá trị đã lưu. Nếu không có bước này, hacker có thể đánh cắp một ID Token cũ hợp lệ và gửi lại (replay) để giả mạo phiên làm việc của người dùng.

---

## 4. Trích xuất và Tiêu thụ Thông tin ID Token

Khi cả 5 bước xác thực trên đều vượt qua hoàn hảo, ứng dụng khách hoàn toàn có thể tin tưởng 100% vào dữ liệu định danh bên trong ID Token:
*   Sử dụng định danh duy nhất `sub` để làm khóa chính tạo liên kết tài khoản cục bộ.
*   Đọc claim `amr` (Authentication Method Reference) để kiểm tra xem người dùng đã đăng nhập bằng MFA (xác thực hai yếu tố) hay chưa để đưa ra quyết định nâng cao quyền truy cập của phiên làm việc.

---

## 5. Sự khác biệt về trách nhiệm xác thực: Front vs Back Channel

Trách nhiệm xác thực ID Token thay đổi hoàn toàn tùy thuộc vào kênh truyền tải bạn nhận được token:

*   **Nếu nhận qua Kênh trước (Implicit / Hybrid Flow):** **Bắt buộc 100%** phải thực thi đầy đủ quy trình 5 bước trên (đặc biệt là xác thực chữ ký số mật mã JWKS) do môi trường trình duyệt công khai không đáng tin cậy.
*   **Nếu nhận qua Kênh sau (Authorization Code Flow):** Bạn nhận token trực tiếp qua kết nối HTTPS bảo mật từ máy chủ backend của mình đến Auth Server. Do kết nối HTTPS đã xác thực chứng chỉ đích của Auth Server, bạn **có thể bỏ qua bước xác thực chữ ký số** và chỉ cần giải mã Base64URL payload để đọc trực tiếp thông tin, giúp giảm tải tài nguyên hệ thống đáng kể.

---

## 6. Kịch bản Cần Xác thực lại Token (Re-validation)

*   **Không cần xác thực lại:** Nếu ID Token được tiêu thụ ngay một lần sau khi đổi code để tạo session cookie cục bộ, sau đó bị hủy bỏ.
*   **Bắt buộc xác thực lại:** Nếu ứng dụng của bạn lưu trữ ID Token ở bộ nhớ ngoài (như lưu ở LocalStorage, hoặc truyền gửi ID Token giữa các Microservices nội bộ ở Backend), **bắt buộc phải thực hiện xác thực lại chữ ký số và thời hạn `exp` của token ở mỗi đầu nhận** trước khi thực thi xử lý logic.

---

## 7. Tổng kết

*   **Quy trình 5 bước** xác thực ID Token (`Signature`, `iss`, `aud`, `exp`, `nonce`) là bức tường phòng thủ tối cao bảo vệ danh tính người dùng trong hệ thống OIDC.
*   **Tận dụng Back Channel:** Sử dụng luồng Authorization Code Flow để nhận ID Token qua Kênh sau giúp đơn giản hóa tối đa logic xác thực mật mã trên Client.
*   Chúc mừng bạn! Chúng ta đã hoàn thành việc chuẩn hóa và nâng cấp toàn diện 19 bài học cốt lõi của chuyên đề **OAuth 2.0 & OpenID Connect**.

---
[← Quay lại mục lục](../README.md)
