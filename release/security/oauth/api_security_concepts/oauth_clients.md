# Giới thiệu về Các loại OAuth Clients

Tài liệu này cung cấp cái nhìn tổng quan về **OAuth Clients** (Ứng dụng Khách) dưới góc nhìn của nhà phát triển phần mềm, phân loại các môi trường ứng dụng thực tế và chuẩn bị nền tảng kiến thức trước khi đi vào chi tiết các luồng mật mã.

## Mục lục

1. [Khái niệm OAuth Clients](#1-khái-niệm-oauth-clients)
2. [Các môi trường chạy của Ứng dụng Khách](#2-các-môi-trường-chạy-của-ứng-dụng-khách)
3. [Tư duy Phát triển Client vs Phát triển Server](#3-tư-duy-phát-triển-client-vs-phát-triển-server)
4. [Lộ trình các bài học tiếp theo](#4-lộ-trình-các-bài-học-tiếp-theo)
5. [Tổng kết](#5-tổng-kết)

---

## 1. Khái niệm OAuth Clients

Trong đặc tả OAuth 2.0, thuật ngữ `**Client**` (Ứng dụng Khách) chỉ bất kỳ ứng dụng phần mềm nào có nhiệm vụ:
1.  Khởi tạo yêu cầu xác thực và xin cấp quyền từ Người dùng.
2.  Nhận mã ủy quyền và đổi lấy **Access Token** từ Authorization Server.
3.  Sử dụng Access Token để gọi các API bảo mật tại Resource Server thay mặt cho người dùng đầu cuối.

---

## 2. Các môi trường chạy của Ứng dụng Khách

Mỗi môi trường chạy của ứng dụng khách đặt ra các thử thách bảo mật riêng biệt về khả năng lưu trữ thông tin nhạy cảm:

*   **Môi trường Server-Side Web Application:** Ứng dụng chạy trên Web Server (ví dụ: Spring Boot, NodeJS, Laravel). Có khả năng lưu trữ tuyệt mật Client Secret nhờ chạy đằng sau tường lửa của máy chủ.
*   **Môi trường Trình duyệt (SPA):** Ứng dụng Single Page Application chạy trực tiếp bằng JavaScript trên trình duyệt của người dùng (ví dụ: React, Angular, Vue). Hoàn toàn không thể giữ bí mật.
*   **Môi trường Thiết bị Di động & Native App:** Ứng dụng chạy trên iOS, Android, Desktop. Không thể bảo vệ Client Secret an toàn tuyệt đối.
*   **Thiết bị bị Giới hạn (Limited Input Devices):** Các thiết bị IoT, Smart TV, Apple TV - không có bàn phím đầy đủ hoặc không có trình duyệt tích hợp để thực hiện luồng redirect thông thường.

---

## 3. Tư duy Phát triển Client vs Phát triển Server

> [!NOTE]
> **Phân chia Trách nhiệm trong Dự án:**
> *   **Trách nhiệm của Authorization Server:** Quyết định thời gian sống của token (Token Lifetime), chính sách gia hạn (Refresh Token Rotation), phạm vi quyền hạn được duyệt (Approved Scopes). Là nhà phát triển Client, bạn chỉ nhận các tham số này và tuân thủ, hoàn toàn không có quyền can thiệp hay thay đổi chúng từ phía Client.
> *   **Trách nhiệm của OAuth Client:** Đảm bảo lưu trữ Access Token an toàn trên môi trường chạy của mình, tự động gửi yêu cầu gia hạn token khi hết hạn, bảo vệ an toàn Client Secret (nếu là Confidential Client) và làm sạch đầu vào Redirect URIs.

---

## 4. Lộ trình các bài học tiếp theo

Để chuẩn hóa và tối ưu hóa hệ thống bài học thực chiến, lộ trình sẽ được phân chia rõ ràng:

1.  **Chuyên đề Server-Side Web Application:** Tập trung hướng dẫn đăng ký Client bảo mật và thực thi chi tiết luồng *Authorization Code Flow* tiêu chuẩn có sử dụng Client Secret.
2.  **Chuyên đề Single Page Application (SPA):** Tập trung vào việc giải quyết bài toán lỗ hổng trình duyệt bằng cách áp dụng *Authorization Code Flow kết hợp PKCE* và so sánh các phương pháp lưu trữ token HttpOnly Cookie vs LocalStorage.
3.  **Chuyên đề OpenID Connect (OIDC):** Tìm hiểu sâu về ID Token, cách thu nhận và xác thực danh tính người dùng trên Client.

---

## 5. Tổng kết

*   Mỗi môi trường ứng dụng (Web, SPA, Mobile, IoT) bắt buộc phải sử dụng một luồng ủy quyền (Grant Type) chuyên biệt để đảm bảo an toàn tối đa.
*   Nắm vững sự phân tách trách nhiệm giữa Client và Auth Server giúp bạn viết code gọn gàng, chuẩn chỉ và tối ưu hóa hiệu năng hệ thống.

---
[← Quay lại mục lục](../README.md)
