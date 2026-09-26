# Các Loại Ứng Dụng (Client Types) trong OAuth 2.0

Tài liệu này phân loại chi tiết các loại ứng dụng khách (**Client Types**) trong đặc tả OAuth 2.0 dựa trên khả năng bảo mật thông tin xác thực, đồng thời phân tích sâu ý nghĩa của việc phân loại này đối với việc thiết kế cấu hình bảo mật trên máy chủ Authorization Server.

## Mục lục

1. [Định nghĩa loại Client](#1-định-nghĩa-loại-client)
2. [Sự khác biệt cơ bản](#2-sự-khác-biệt-cơ-bản)
3. [Ví dụ Ứng dụng thực tế](#3-ví-dụ-ứng-dụng-thực-tế)
4. [Ý nghĩa bảo mật đối với giao thức OAuth](#4-ý-nghĩa-bảo-mật-đối-với-giao-thức-oauth)
5. [Client Secret & Các cơ chế xác thực nâng cao](#5-client-secret--các-cơ-chế-xác-thực-nâng-cao)
6. [Tổng kết](#6-tổng-kết)

---

## 1. Định nghĩa loại Client

Trong đặc tả tiêu chuẩn OAuth 2.0 (RFC 6749 Section 2.1), **Client Type (Loại ứng dụng khách)** được phân loại duy nhất dựa trên khả năng duy trì tính bảo mật của thông tin xác thực (như `Client Secret`) trước người dùng và các tác nhân bên ngoài.

Hệ thống phân chia thành hai loại chính:

| Loại ứng dụng | Thuật ngữ gốc | Đặc điểm mật mã cốt lõi |
| :--- | :--- | :--- |
| **Ứng dụng bảo mật** | **Confidential Client** | Có khả năng lưu trữ và bảo vệ tuyệt mật các khóa bí mật mật mã (như Client Secret) mà không bị lộ ra bên ngoài. |
| **Ứng dụng công khai** | **Public Client** | Hoàn toàn không có khả năng bảo mật các khóa bí mật. Mọi thông tin nhúng trong ứng dụng đều có thể bị đọc hoặc đảo ngược mã nguồn. |

---

## 2. Sự khác biệt cơ bản

### 2.1. Confidential Clients (Ứng dụng Bảo mật)
*   **Môi trường chạy:** Chạy trên các máy chủ đóng (Server-side) được kiểm soát an toàn bởi quản trị viên hệ thống.
*   **Đặc điểm:** Người dùng đầu cuối chỉ có thể tương tác với giao diện hiển thị mà hoàn toàn không có quyền truy cập vào mã nguồn, tệp tin cấu hình, hay bộ nhớ RAM của máy chủ.
*   **Ví dụ:** Web Server (NodeJS backend, Java Spring Boot, ASP.NET, PHP Laravel), các dịch vụ Backend API ngầm.

### 2.2. Public Clients (Ứng dụng Công khai)
*   **Môi trường chạy:** Chạy trực tiếp trên thiết bị của người dùng đầu cuối hoặc các môi trường mở.
*   **Đặc điểm:** Người dùng đầu cuối nắm toàn quyền kiểm soát thiết bị, do đó họ hoặc kẻ tấn công có thể dễ dàng dịch ngược mã nguồn, xem log, phân tích bộ nhớ RAM hoặc chặn bắt các request HTTP/HTTPS nội bộ.
*   **Ví dụ:** Single Page Applications (SPA chạy trên trình duyệt bằng React, Angular, Vue), ứng dụng di động (Mobile Apps chạy trên iOS, Android), ứng dụng cài đặt trên Desktop, thiết bị IoT (Smart TV, Smart Home).

---

## 3. Ví dụ Ứng dụng thực tế

Dưới đây là bảng phân tích khả năng lưu trữ khóa bí mật của các nền tảng ứng dụng phổ biến:

| Nền tảng Ứng dụng | Phân loại Client | Khả năng giữ bí mật? | Nguyên nhân kỹ thuật |
| :--- | :--- | :---: | :--- |
| **Java Spring Boot / NodeJS Server** | Confidential | **Có** | Chạy trên máy chủ Cloud, mã nguồn và biến môi trường (`ENV`) được khóa kín sau lớp tường lửa. |
| **ReactJS / VueJS (SPA)** | Public | **Không** | Toàn bộ mã nguồn JavaScript và dữ liệu lưu trữ (LocalStorage) bắt buộc phải tải về trình duyệt của khách hàng để thực thi. |
| **Mobile App (iOS / Android)** | Public | **Không** | File nhị phân ứng dụng (`.apk`, `.ipa`) có thể dễ dàng bị dịch ngược (Decompile) để trích xuất các chuỗi string thô. |
| **IoT / Smart Device** | Public | **Không** | Thiết bị vật lý nằm trong tay người dùng, có thể bị can thiệp phần cứng hoặc đọc bộ nhớ Flash. |

---

## 4. Ý nghĩa bảo mật đối với giao thức OAuth

Sự phân chia Client Type quyết định trực tiếp đến **chính sách cấp phát và xác thực token** của máy chủ Authorization Server:

| Tiêu chí so sánh | **Confidential Clients** | **Public Clients** |
| :--- | :--- | :--- |
| **Xác thực Client** | **Bắt buộc**. Server yêu cầu gửi kèm Client Secret (hoặc chữ ký số) ở bước đổi code lấy token. | **Không thể xác thực**. Server không thể tin tưởng danh tính Client chỉ dựa vào Client ID. |
| **Rủi ro mạo danh** | **Rất thấp**. Chỉ có ứng dụng thật mới nắm giữ Client Secret để đổi token. | **Rất cao**. Kẻ tấn công có thể lấy Client ID công khai để giả mạo ứng dụng gửi request. |
| **Chính sách bảo mật** | Linh hoạt. Cho phép cấp phát Refresh Token dài hạn, cấu hình CORS rộng rãi hơn. | **Nghiêm ngặt**. Yêu cầu áp dụng PKCE bắt buộc, hạn chế hoặc cấm cấp Refresh Token dài hạn. |

---

## 5. Client Secret & Các cơ chế xác thực nâng cao

`Client Secret` hoạt động tương tự như một mật khẩu (Password) của ứng dụng. Tuy nhiên, đối với các hệ thống yêu cầu mức độ an toàn mật mã cao hơn, đặc tả OAuth 2.0 hỗ trợ các hình thức xác thực thay thế mạnh mẽ:

*   **Mutual TLS (mTLS) - RFC 8705:** Xác thực hai chiều giữa Client và Server thông qua các chứng chỉ số (X.509 Certificates) ở lớp truyền tải mạng.
*   **Private Key JWT - RFC 7523:** Client tự sinh một cặp khóa bất đối xứng. Khi xác thực, Client dùng **Private Key** của mình để ký một JWT chứa các tuyên bố danh tính rồi gửi lên Auth Server. Auth Server dùng **Public Key** đã đăng ký trước của Client để xác minh. Phương pháp này giúp loại bỏ hoàn toàn việc truyền khóa bí mật qua mạng.

---

## 6. Tổng kết

> [!WARNING]
> **Quy tắc bảo mật tối thượng:**
> Tuyệt đối không bao giờ nhúng `Client Secret` vào mã nguồn của Mobile App, Single Page App (SPA) hoặc bất kỳ ứng dụng Public Client nào khác. Bất kỳ ai cũng có thể dễ dàng đảo ngược mã nguồn (reverse engineer) hoặc dịch ngược tệp tin nhị phân để đánh cắp khóa bí mật này!

*   Việc phân loại chính xác **Confidential Client** và **Public Client** là nền tảng để bạn lựa chọn luồng ủy quyền (Grant Type) chuẩn xác.
*   Với **Confidential Client**, luồng tiêu chuẩn là *Authorization Code Flow* truyền thống sử dụng Client Secret.
*   Với **Public Client**, luồng bắt buộc hiện nay là *Authorization Code Flow kết hợp PKCE* nhằm loại bỏ sự phụ thuộc vào Client Secret.

---
[← Quay lại mục lục](../README.md)
