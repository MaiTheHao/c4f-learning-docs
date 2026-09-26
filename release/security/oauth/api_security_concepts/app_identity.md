# Định danh Ứng dụng (Application Identity) trong OAuth 2.0

Tài liệu này phân tích sâu khái niệm định danh ứng dụng (**Application Identity** / **Client Identity**), cách thức xác thực danh tính ứng dụng thông qua Client Secret, giải pháp bảo vệ luồng cho Public Client bằng PKCE, và vai trò tối mật của Redirect URIs.

## Mục lục

1. [Khái niệm về Định danh Ứng dụng](#1-khái-niệm-về-định-danh-ứng-dụng)
2. [Cơ chế Định danh trong Authorization Code Flow](#2-cơ-chế-định-danh-trong-authorization-code-flow)
3. [Giải pháp cho Public Client: PKCE](#3-giải-pháp-cho-public-client-pkce)
4. [Vai trò bảo mật tối mật của Redirect URI](#4-vai-trò-bảo-mật-tối-mật-của-redirect-uri)
5. [Tổng kết](#5-tổng-kết)

---

## 1. Khái niệm về Định danh Ứng dụng

Trong đặc tả tiêu chuẩn OAuth 2.0, mỗi ứng dụng khách (**OAuth Client**) đăng ký vào hệ thống là một thực thể riêng biệt. Định danh này giúp người dùng nhìn thấy rõ ràng trên màn hình Consent Screen: *"Ứng dụng X muốn truy cập vào tài khoản của bạn"*.

Mỗi ứng dụng sau khi đăng ký sẽ được cấp một cặp thông tin mật mã:
*   `**client_id**` (Định danh Client): Là một chuỗi công khai (Public String) được sử dụng để xác định ứng dụng trong suốt các luồng đi qua mạng.
*   `**client_secret**` (Khóa bí mật Client): Hoạt động như mật khẩu của ứng dụng. Nó được sử dụng để chứng thực danh tính thực sự của Client với máy chủ Authorization Server.

> [!IMPORTANT]
> Nếu một ứng dụng là **Public Client** (như ReactJS SPA, iOS/Android App) và không thể bảo vệ được `client_secret` (không có secret), thì về mặt mật mã học, **hệ thống hoàn toàn không có cách nào xác thực chắc chắn danh tính thực sự của ứng dụng đó** chỉ thông qua `client_id` (vì `client_id` là công khai, bất kỳ ai cũng có thể copy để tạo request giả mạo).

---

## 2. Cơ chế Định danh trong Authorization Code Flow

Hãy phân tích cách thức Client Secret bảo vệ danh tính ứng dụng trong luồng Authorization Code Flow tiêu chuẩn (dành cho Confidential Client):

1.  **Giai đoạn 1 (Front Channel):** Ứng dụng gửi `client_id` cùng redirect URI qua trình duyệt của người dùng đến Auth Server. Người dùng đăng nhập và Auth Server trả về một **Authorization Code** tạm thời (hiệu lực dưới 1 phút) qua thanh địa chỉ trình duyệt.
2.  **Giai đoạn 2 (Back Channel):** Ứng dụng lấy Authorization Code nhận được, thực hiện gửi POST request trực tiếp từ Backend Server của mình đến Auth Server để đổi lấy Access Token. Lúc này, ứng dụng gửi kèm `client_secret` để xác thực danh tính.

> [!NOTE]
> **Vai trò của Client Secret tại Giai đoạn 2:**
> Nếu kẻ tấn công bằng cách nào đó đã nghe lén và đánh cắp được Authorization Code ở Giai đoạn 1 (Front Channel), hắn vẫn hoàn toàn **thất bại** ở Giai đoạn 2 vì hắn không thể có `client_secret` của ứng dụng thật để vượt qua bước xác thực đối khớp trên Auth Server.

---

## 3. Giải pháp cho Public Client: PKCE

Đối với các ứng dụng công khai (Public Client) như Mobile App hay SPA, do hoàn toàn không có `client_secret`, nếu chúng ta áp dụng luồng Authorization Code Flow truyền thống, kẻ tấn công đánh cắp được Authorization Code sẽ lập tức đổi được Access Token mà không gặp bất kỳ chốt chặn nào.

Để giải quyết triệt để lỗ hổng này, đặc tả **PKCE (Proof Key for Code Exchange - RFC 7636)** ra đời:

*   **Cơ chế:** Trước khi bắt đầu luồng, Client tự tạo một khóa bí mật ngẫu nhiên dùng một lần gọi là `Code Verifier` và tính hash SHA256 của nó gọi là `Code Challenge`.
*   **Giai đoạn 1:** Client gửi `Code Challenge` kèm theo request ban đầu qua Front Channel.
*   **Giai đoạn 2:** Khi đổi Authorization Code lấy Access Token qua Back Channel, Client gửi kèm chuỗi gốc `Code Verifier`. Auth Server tự thực hiện băm SHA256 của `Code Verifier` này và đối chiếu với `Code Challenge` nhận được ở Giai đoạn 1.

> [!IMPORTANT]
> **Vai trò thực sự của PKCE:**
> PKCE không giúp xác thực danh tính thực của ứng dụng (nó không ngăn chặn kẻ tấn công tạo ra một ứng dụng giả mạo sử dụng cùng `client_id`). Tuy nhiên, PKCE đảm bảo tuyệt đối rằng **chỉ có ứng dụng khách đã bắt đầu gửi yêu cầu (đã sinh ra Code Verifier) mới có quyền đổi Authorization Code lấy Access Token**, từ đó chặn đứng hoàn toàn cuộc tấn công đánh cắp mã ủy quyền (Authorization Code Interception Attack).

---

## 4. Vai trò bảo mật tối mật của Redirect URI

Khi không có `client_secret`, **Redirect URI (Đường dẫn chuyển hướng)** chính là chốt chặn định danh duy nhất còn lại để Authorization Server dựa vào nhằm xác minh tính chính danh của ứng dụng.

### 4.1. Sự khác biệt giữa Web Domain và Custom URL Schemes
*   **HTTPS Web Domain (SPA/Web App):** Có tính duy nhất toàn cầu. Chỉ có bạn (người sở hữu tên miền `https://example-app.com`) mới có thể cấu hình DNS và triển khai mã nguồn trên tên miền đó. Kẻ tấn công không thể chiếm quyền nhận Redirect URI HTTPS hợp pháp của bạn (trừ khi hệ thống DNS bị hack).
*   **Custom URL Schemes (Mobile Apps):** Hoàn toàn **không duy nhất**. Nếu ứng dụng của bạn đăng ký scheme `myapp://redirect`, kẻ tấn công có thể phát hành một ứng dụng độc hại trên cùng điện thoại của người dùng và đăng ký cùng scheme `myapp://` để đánh chặn Authorization Code.

### 4.2. Giải pháp kỹ thuật bảo mật hiện đại cho App di động
Nhóm làm việc OAuth khuyến cáo các nhà phát triển ứng dụng di động chuyển đổi từ *Custom URL Schemes* sang:
*   **Universal Links** (trên iOS)
*   **App Links** (trên Android)

Cơ chế này bắt buộc hệ điều hành di động phải kiểm tra tệp tin chứng thực số (được lưu tại `.well-known/apple-app-site-association` hoặc `.well-known/assetlinks.json`) trên tên miền HTTPS thực tế của nhà phát triển trước khi cho phép ứng dụng di động tiếp nhận đường dẫn chuyển hướng, từ đó biến Redirect URI của Mobile App thành định danh an toàn duy nhất toàn cầu.

> [!WARNING]
> **Ràng buộc đăng ký Redirect URI nghiêm ngặt:**
> Authorization Server bắt buộc phải kiểm tra đối khớp tuyệt đối 100% (Exact Match) giữa Redirect URI do Client truyền lên và danh sách Redirect URIs đã được khai báo cứng lúc đăng ký ứng dụng. Tuyệt đối không cho phép sử dụng ký tự đại diện (Wildcards như `*`) để tránh lỗ hổng Open Redirect cho phép kẻ tấn công chuyển hướng mã ủy quyền về server của hắn.

---

## 5. Tổng kết

*   `**Client Secret**` là mật khẩu định danh tối cao của Confidential Client, bắt buộc phải bảo vệ tuyệt mật trên môi trường Server-side.
*   **Public Client** không thể có danh tính mật mã đáng tin cậy. Do đó, việc triển khai **PKCE** và bảo mật nghiêm ngặt cấu hình **Redirect URIs** (sử dụng HTTPS Web Domain hoặc Universal/App Links) là ranh giới phòng thủ cuối cùng để bảo vệ hệ thống của bạn.

---
[← Quay lại mục lục](../README.md)
