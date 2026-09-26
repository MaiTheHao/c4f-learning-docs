# Chuyên đề: OAuth 2.0 & OpenID Connect (OIDC)

Chuyên đề này cung cấp một lộ trình học tập toàn diện, chuyên sâu và thực chiến về **OAuth 2.0** và **OpenID Connect (OIDC)**. Đây là hai trụ cột bảo mật tối quan trọng trong việc thiết kế kiến trúc hệ thống hiện đại, API bảo mật, Single Sign-On (SSO), và phân tán dịch vụ (Microservices).

---

## Danh sách Bài học & Chuyên đề

Dưới đây là sơ đồ lộ trình học tập được phân chia thành 5 phần trực quan khoa học:

### 🗺️ Phần 1: Tổng quan Chuyên đề (Overview)
| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 1: Phân biệt OAuth và OIDC** | So sánh sâu sự khác nhau về bản chất giữa phân quyền ("Quyền làm gì") và xác định danh tính ("Bạn là ai"). | [OAuth vs OpenID Connect – Tổng hợp →](./overview/oauth_vs_oidc.md) |

### 🔑 Phần 2: Khái niệm API Security cơ bản (API Security Concepts)
| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 2: Các vai trò (Roles & Permissions)** | Khảo sát 5 vai trò logic cốt lõi trong đặc tả OAuth 2.0 và quy trình hoạt động tổng quan. | [Roles & Permissions →](./api_security_concepts/roles_permissions.md) |
| **Bài 3: Các loại ứng dụng (App Types)** | Phân loại ứng dụng Client (Confidential Client vs Public Client) và mức độ bảo mật. | [Application Types →](./api_security_concepts/application_types.md) |
| **Bài 4: Sự đồng ý của người dùng (Consent)** | Tìm hiểu màn hình Consent Screen, cơ chế xin cấp quyền và giới hạn phạm vi truy cập (Scopes). | [User Consent →](./api_security_concepts/user_consent.md) |
| **Bài 5: Phân biệt Kênh Truyền dữ liệu** | Phân tích cơ chế bảo mật của Front Channel (trình duyệt) và Back Channel (gọi API trực tiếp). | [Front Channel & Back Channel →](./api_security_concepts/front_channel_%26_back_channel.md) |
| **Bài 6: Định danh ứng dụng (Identity)** | Tìm hiểu cách xác định danh tính của Client thông qua ID/Secret và các hình thức xác thực nâng cao. | [Application Identity →](./api_security_concepts/app_identity.md) |
| **Bài 7: Các loại Client trong thực tế** | Phân tích sâu các kịch bản sử dụng Client trong thực tế kiến trúc phần mềm. | [OAuth Clients →](./api_security_concepts/oauth_clients.md) |

### 🖥️ Phần 3: OAuth cho Server-Side Web Application
| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 8: Đăng ký Client** | Quy trình cấu hình tên, logo, Client ID, Client Secret, và đặc biệt là cơ chế bảo mật Redirect URIs. | [Đăng ký OAuth client →](./oauth_for_server_side_app/registering.md) |
| **Bài 9: Luồng Mã Ủy quyền** | Phân tích từng bước luồng Authorization Code Flow an toàn nhất dành cho các Web App truyền thống. | [Authorization Code Flow cho Web Application →](./oauth_for_server_side_app/authorization_code_flow_for_web_application.md) |

### 🌐 Phần 4: OAuth cho Single Page Application (SPA)
| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 10: Giới hạn môi trường Browser** | Vạch trần các lỗ hổng bảo mật cố hữu trên trình duyệt (XSS, rò rỉ mã nguồn, extension độc hại). | [Problem with Browser Environment →](./oauth_for_spa/problem_with_browser_env.md) |
| **Bài 11: Luồng Mã Ủy quyền cho SPA** | Hướng dẫn triển khai Authorization Code Flow kết hợp cơ chế mở rộng **PKCE** (Code Verifier / Challenge). | [Authorization Code Flow cho SPA →](./oauth_for_spa/authorization_code_flow_for_spa.md) |
| **Bài 12: Bảo mật Token trên trình duyệt** | So sánh việc lưu token ở Cookie (HttpOnly) vs LocalStorage vs SessionStorage trước tấn công XSS. | [Bảo vệ token trong trình duyệt →](./oauth_for_spa/protecting_token_in_browser.md) |
| **Bài 13: Bảo vệ trình duyệt bằng Backend** | Triển khai mô hình Backend-for-Frontend (BFF) để giữ token tuyệt mật ngoài phạm vi của JavaScript. | [Bảo vệ trình duyệt bằng Backend →](./oauth_for_spa/protecting_browser_with_backend.md) |

### 🆔 Phần 5: OpenID Connect (OIDC) - Xác thực Danh tính
| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 14: Giới thiệu ID Token** | Cấu trúc chuyên sâu của ID Token (JWT) mang thông tin định danh người dùng. | [ID Token là gì →](./openidconnect/what_is_id_token.md) |
| **Bài 15: ID Token vs Access Token** | Phân biệt rõ rệt chức năng sử dụng của hai loại token này để tránh lỗi thiết kế tai hại. | [ID Token và Access Token khác nhau điểm nào →](./openidconnect/how_id_token_diff_from_access_token.md) |
| **Bài 16: Phương thức lấy ID Token** | Cách cấu hình request scopes `openid` và xử lý response nhận ID Token mật mã từ server. | [Obtaining ID Token →](./openidconnect/obtaining_an_id_token.md) |
| **Bài 17: Luồng Hỗn hợp (Hybrid Flow)** | Phân tích cơ chế OIDC Hybrid Flow nâng cao kết hợp lấy token nhanh ở front-channel và an toàn ở back-channel. | [Hybrid Flow →](./openidconnect/hybrid_openid_connect_flow.md) |
| **Bài 18: Xác thực & Sử dụng ID Token** | Quy trình giải mã chữ ký số, kiểm tra thời gian hết hạn (`exp`), nhà phát hành (`iss`), và đối tượng nhận (`aud`). | [Xác thực và sử dụng ID Token →](./openidconnect/validating_and_using_an_id_token.md) |

---

## 🎯 Mục tiêu Học tập
1.  **Nắm vững Lý thuyết:** Hiểu tường tận sự khác biệt bản chất của Front Channel và Back Channel, cũng như vai trò mật mã học của PKCE.
2.  **Thiết kế Kiến trúc đúng chuẩn:** Biết cách lựa chọn Flow chính xác cho từng loại ứng dụng (Monolith Web App, SPA, Mobile Native App, Microservices).
3.  **Tư duy Phòng thủ Bảo mật:** Phát hiện nhanh các lỗi cấu hình Redirect URI, chống rò rỉ Client Secret trên trình duyệt và chặn đứng tấn công XSS/CSRF.

---
[← Quay lại trang chủ](../../README.md)
