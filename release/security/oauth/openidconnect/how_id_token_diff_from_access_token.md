# Phân biệt ID Token và Access Token

Tài liệu này phân tích so sánh chuyên sâu sự khác biệt bản chất giữa **ID Token** và **Access Token** về mặt mục tiêu thiết kế, đối tượng thụ hưởng (Audience), tính trong suốt đọc ghi (Opaque), và bảng so sánh tổng hợp chi tiết nhằm giúp kiến trúc sư phần mềm tránh các lỗi thiết kế bảo mật tai hại.

## Mục lục

1. [Mục tiêu và Bản chất của Access Token](#1-mục-tiêu-và-bản-chất-của-access-token)
2. [Mục tiêu và Bản chất của ID Token](#2-mục-tiêu-và-bản-chất-của-id-token)
3. [Khác biệt cốt lõi về Đối tượng thụ hưởng (Audience)](#3-khác-biệt-cốt-lõi-về-đối-tượng-thụ-hưởng-audience)
4. [Định dạng và Tính Opaque (Black Box)](#4-định-dạng-và-tính-opaque-black-box)
5. [Bảng So sánh Tổng hợp chi tiết](#5-bảng-so-sánh-tổng-hợp-chi-tiết)
6. [Tổng kết](#6-tổng-kết)

---

## 1. Mục tiêu và Bản chất của Access Token

**Access Token** là một chiếc **Thẻ thông hành / Thẻ khóa (Keycard)** được cấp cho ứng dụng khách (Client) để nó có quyền gọi các API bảo mật tại Resource Server thay mặt cho người dùng.

*   **Chức năng phân quyền:** Trả lời cho câu hỏi: *"Ứng dụng này có quyền thực hiện hành động X (đọc/ghi) trên tài nguyên Y hay không?"*
*   **Nguyên tắc thiết kế Opaque:** Đối với ứng dụng khách, Access Token bắt buộc phải được đối xử như một **chuỗi ký tự mờ đục (Opaque String / Black Box)**. Ứng dụng khách **không cần và tuyệt đối không được phép** cố gắng giải mã, phân tích hoặc đọc nội dung bên trong Access Token. Ứng dụng chỉ có duy nhất một nhiệm vụ: đính kèm token này vào Authorization Header khi gọi API.

---

## 2. Mục tiêu và Bản chất của ID Token

**ID Token** là một chiếc **Hộ chiếu / Chứng minh nhân dân** kỹ thuật số được cấp cho ứng dụng khách (Client) để xác thực và cung cấp thông tin nhận dạng của người dùng vừa đăng nhập.

*   **Chức năng xác thực:** Trả lời cho câu hỏi: *"Người đang sử dụng ứng dụng này là ai? Tên, email, avatar của họ là gì?"*
*   **Thiết kế trong suốt:** ID Token được thiết kế đặc thù để **ứng dụng khách trực tiếp giải mã, xác thực chữ ký và đọc thông tin** bên trong Payload (như claims `sub`, `name`, `email`) nhằm phục vụ việc kết xuất giao diện và tạo phiên làm việc cục bộ.

---

## 3. Khác biệt cốt lõi về Đối tượng thụ hưởng (Audience)

Khác biệt mật mã học sâu sắc nhất giữa hai loại token nằm ở thuộc tính **Audience (`aud` claim)** - xác định đối tượng hợp pháp có quyền đọc và kiểm tra token:

*   **Audience của ID Token là Ứng dụng Khách (Client):** Auth Server ký ID Token và chỉ định đích danh `aud` chính là `client_id` của ứng dụng của bạn. Ứng dụng khách là người trực tiếp giải mã và tiêu thụ token này.
*   **Audience của Access Token là Máy chủ Tài nguyên (Resource Server / API):** Access Token được phát ra để gửi tới API Server. Chỉ có API Server mới có quyền giải mã và kiểm tra tính hợp lệ của token này.

> [!WARNING]
> **Lỗ hổng bảo mật nghiêm trọng do nhầm lẫn vai trò Token:**
> Nhiều nhà phát triển mắc sai lầm chí mạng khi lấy **ID Token gửi lên API Server** để xác thực quyền gọi API, hoặc lấy **Access Token giải mã để đọc danh tính** người dùng cục bộ. 
> Việc sử dụng sai vai trò token sẽ phá vỡ các rào cản phân quyền, dẫn đến lỗ hổng leo thang đặc quyền hoặc mạo danh tài khoản cực kỳ nguy hiểm.

---

## 4. Định dạng và Tính Opaque (Black Box)

*   **ID Token:** Bắt buộc 100% phải tuân thủ định dạng **JSON Web Token (JWT)** đã được ký số bảo mật theo đặc tả OIDC.
*   **Access Token:** Đặc tả OAuth 2.0 **hoàn toàn không quy định bất kỳ định dạng cụ thể nào** cho Access Token.
    *   Auth Server có thể cấp phát Access Token dưới dạng một chuỗi ngẫu nhiên vô nghĩa (Opaque Token / Reference Token). API sẽ phải gọi ngầm về Auth Server để kiểm tra hiệu lực.
    *   Auth Server cũng có thể cấp phát Access Token dưới dạng JWT chứa chữ ký số (Self-contained Token) để API tự giải mã offline.
    *   **Nguyên tắc vàng:** Cho dù Access Token có là JWT đi chăng nữa, ứng dụng khách vẫn phải coi nó là opaque và tuyệt đối không được đọc nội dung bên trong nó.

---

## 5. Bảng So sánh Tổng hợp chi tiết

Dưới đây là bảng đối chiếu toàn diện giúp bạn phân biệt rõ ràng hai loại token này:

| Tiêu chí So sánh | **ID Token (OIDC)** | **Access Token (OAuth 2.0)** |
| :--- | :--- | :--- |
| **Mục đích sử dụng** | Xác thực danh tính (Authentication) - *"Bạn là ai?"* | Ủy quyền truy cập API (Authorization) - *"Bạn có quyền làm gì?"* |
| **Đối tượng tiêu thụ (`aud`)** | **Ứng dụng Khách (Client)**. | **Máy chủ Tài nguyên (Resource Server / API)**. |
| **Client có được đọc?** | **Có**. Client bắt buộc phải giải mã và đọc thông tin. | **Không**. Client phải đối xử như một hộp đen (Opaque string). |
| **Định dạng bắt buộc** | Bắt buộc là **JWT**. | Tùy chọn (Opaque String hoặc JWT). |
| **Ví dụ đời thực** | Hộ chiếu / Chứng minh nhân dân cá nhân. | Thẻ từ mở cửa phòng khách sạn. |
| **Các Claim đặc trưng** | `sub`, `name`, `email`, `picture`. | `scopes` (phạm vi quyền như `read`, `write`). |

---

## 6. Tổng kết

*   **Không nhầm lẫn:** Access Token dành cho API; ID Token dành cho Client.
*   **Opaque Access Token:** Giữ nguyên tắc hộp đen đối với Access Token trên Client để tránh các ràng buộc logic mã nguồn lỗi thời khi định dạng Access Token thay đổi trên server.
*   **Nhiệm vụ tiếp theo:** Trong bài học kế tiếp, chúng ta sẽ hướng dẫn cách thức Client cấu hình request để xin cấp phát đồng thời cả hai loại token này từ Authorization Server.

---
[← Quay lại mục lục](../README.md)
