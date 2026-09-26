# Chuyên đề: JSON Web Token (JWT)

Chuyên đề này cung cấp hành trình toàn diện từ nền tảng đến thực chiến về **JSON Web Token (JWT)** — tiêu chuẩn mở [RFC 7519](https://tools.ietf.org/html/rfc7519) được sử dụng rộng rãi nhất hiện nay cho **Authentication** và **Authorization** trong các ứng dụng Web cũng như kiến trúc **Microservices**. Lộ trình được thiết kế theo ba tầng lồng tiến: bắt đầu từ khái niệm và cấu trúc token, đi sâu vào giải phẫu từng thành phần và cơ chế mật mã của các thuật toán ký, rồi khép lại bằng góc nhìn bảo mật thực chiến khi phân tích các lỗ hổng phổ biến và cách phòng thủ triệt để. Sau khi hoàn thành, bạn không chỉ nắm vững lý thuyết mật mã đằng sau token mà còn có khả năng rà soát cấu hình, phát hiện lỗi triển khai và thiết kế hệ thống xác thực an toàn bằng JWT trong dự án thực tế.

---

## Danh sách Bài học

Bài học đầu tiên đặt nền móng cho toàn bộ chuyên đề bằng cách trả lời câu hỏi JWT là gì và vận hành ra sao. Bạn sẽ làm quen với cấu trúc ba phần `Header.Payload.Signature`, hiểu vì sao **Base64URL** được chọn làm chuẩn encoding thay cho Base64 truyền thống, và phân biệt rõ ràng giữa encode và encrypt — điểm hiểu sai phổ biến nhất khiến dữ liệu nhạy cảm bị rò rỉ qua Payload. Bài học cũng mô tả luồng xác thực API tiêu chuẩn giữa Client, Authorization Server và Resource Server. [Xem chi tiết Tìm hiểu về JSON Web Token (JWT)](introduce.md).

Bài học thứ hai mổ xẻ từng thành phần của token ở tầng kỹ thuật. Bạn sẽ phân biệt **Custom Claims** với **Registered Claims** theo đặc tả RFC 7519, hiểu vai trò niêm phong mật mã của **Signature**, và so sánh sâu hai hướng tiếp cận ký token: thuật toán đối xứng `HS256` dùng **Shared Secret** duy nhất và thuật toán bất đối xứng `RS256` dùng cặp khóa **Private Key**/**Public Key**. Bài so sánh này là cơ sở quyết định kiến trúc khóa khi hệ thống mở rộng từ **Monolith** sang **Microservices**. [Xem chi tiết Phân tích Chuyên sâu về JWT](indepth.md).

Bài học cuối cùng chuyển sang góc nhìn tấn công và phòng thủ. Các lỗ hổng được vạch trần theo thứ tự từ kinh điển đến nâng cao: thuật toán `none`, **Signature Stripping**, bẻ khóa **Shared Secret** yếu bằng **Brute-force**, **Algorithm Confusion**, **JWKS Spoofing** và `kid` Path Traversal — mỗi kiểu tấn công đều đi kèm phân tích nguyên nhân gốc và cấu hình phòng thủ tương ứng. Thông điệp xuyên suốt: hầu hết sự cố bảo mật JWT không đến từ tiêu chuẩn mà từ lỗi cấu hình và lỗi logic phía server. [Xem chi tiết Tấn công và Phòng thủ trong JWT](attacks_and_defenses.md).

---
[← Back to README](../../README.md)
