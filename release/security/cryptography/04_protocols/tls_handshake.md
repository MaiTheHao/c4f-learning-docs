# TLS: Bắt tay, Forward Secrecy và Vai trò của Chứng chỉ

## Table of Contents

- [TLS 1.2: trao đổi khóa bằng RSA](#tls-12-trao-đổi-khóa-bằng-rsa)
- [TLS 1.3: trao đổi khóa tạm thời và forward secrecy](#tls-13-trao-đổi-khóa-tạm-thời-và-forward-secrecy)
- [Vai trò thật của chứng chỉ](#vai-trò-thật-của-chứng-chỉ)
- [Giới hạn](#giới-hạn)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Bài này nhìn mô hình mã hóa lai từ góc độ giao thức: cùng hai tầng thuật toán như ở bài [Mã hóa lai](../01_foundations/hybrid_encryption.md), nhưng câu hỏi là hai bên thiết lập khóa và xác thực danh tính theo trình tự nào. Trọng tâm là thay đổi cấu trúc giữa TLS 1.2 và TLS 1.3, và lý do **forward secrecy** khiến mô hình cũ bị loại bỏ.

---

## TLS 1.2: trao đổi khóa bằng RSA

Trong phiên bản cũ, một luồng phổ biến hoạt động như sau. Cần lưu ý TLS 1.2 cũng hỗ trợ trao đổi khóa tạm thời; đây chỉ là luồng phổ biến nhất trong các hệ thống cũ.

1. Client gửi lời chào kèm danh sách thuật toán hỗ trợ.
2. Server trả lời, chọn thuật toán, gửi **chứng chỉ** chứa khóa công khai.
3. Client kiểm tra chứng chỉ, sinh một bí mật ngẫu nhiên, mã hóa nó bằng khóa công khai của server và gửi đi.
4. Chỉ server có khóa bí mật mới giải mã được bí mật đó.
5. Hai bên dẫn xuất khóa phiên và chuyển sang mã hóa đối xứng.

Cách này giải đúng bài toán phân phối khóa, nhưng có một nhược điểm cấu trúc: **bí mật phiên được bảo vệ bởi khóa dài hạn của server**. Nếu khóa bí mật của server bị lộ trong tương lai, kẻ tấn công có thể giải mã mọi bản ghi đã thu thập trước đó. Đây là lý do mô hình này bị loại bỏ dần.

---

## TLS 1.3: trao đổi khóa tạm thời và forward secrecy

TLS 1.3 thay đổi vai trò của hai họ thuật toán:

| Thành phần | TLS 1.2 với RSA key transport | TLS 1.3 |
| :--- | :--- | :--- |
| **Trao đổi khóa** | Client mã hóa bí mật bằng khóa công khai của server | Hai bên trao đổi giá trị tạm thời và tính bí mật chung |
| **Vai trò của RSA/ECC** | Mã hóa khóa phiên | Ký xác thực handshake |
| **Forward secrecy** | Không có | Có |
| **Số vòng bắt tay** | Nhiều hơn | Một vòng cho handshake đầy đủ |
| **Dữ liệu nào được mã hóa** | Sau khi thống nhất khóa | Từ sau lời chào của server |

Cơ chế cốt lõi là **trao đổi khóa tạm thời**: mỗi phiên sinh cặp khóa mới, dùng một lần, rồi hủy. Khóa dài hạn trong chứng chỉ không còn dùng để mã hóa bí mật phiên mà chỉ để **ký** handshake, chứng minh server đang giữ khóa bí mật tương ứng.

**Forward secrecy** là tính chất quan trọng nhất ở đây: nếu khóa dài hạn bị lộ sau này, các phiên đã kết thúc vẫn an toàn, vì bí mật của từng phiên đã bị hủy và không thể tái tạo từ khóa dài hạn.

> [!IMPORTANT]
> Trong TLS 1.3, RSA không còn tham gia trao đổi khóa. Nếu một tài liệu nói "TLS dùng RSA để trao đổi khóa phiên", tài liệu đó đang mô tả TLS 1.2 hoặc cũ hơn.

> [!NOTE]
> Tính đến cuối 2026, TLS 1.3 được định nghĩa trong RFC 9846 (thay thế RFC 8446), và RFC 10015 loại bỏ các bộ mã dùng RSA key transport trong TLS 1.2. Số hiệu văn bản có thể tiếp tục thay đổi; điều cố định là hướng thiết kế: trao đổi khóa tạm thời và forward secrecy.

---

## Vai trò thật của chứng chỉ

Sau khi bỏ RSA key transport, nhiều người hiểu nhầm rằng chứng chỉ không còn cần thiết. Thực tế vai trò của nó rõ hơn bao giờ hết: chứng chỉ **ràng buộc một khóa công khai với một danh tính**, để client biết khóa dùng để kiểm tra chữ ký handshake thuộc về đúng server.

Một handshake TLS 1.3 điển hình gồm:

1. **Client Hello**: client gửi thuật toán hỗ trợ và một phần trao đổi khóa tạm thời.
2. **Server Hello**: server chọn tham số, gửi phần trao đổi khóa của mình.
3. **Certificate**: server gửi chuỗi chứng chỉ.
4. **Certificate Verify**: server ký một bản tóm tắt handshake bằng khóa bí mật, chứng minh quyền sở hữu khóa công khai trong chứng chỉ.
5. **Finished**: hai bên xác nhận handshake bằng MAC trên toàn bộ transcript.

Bỏ bước kiểm tra chứng chỉ làm bước 4 mất ý nghĩa: kẻ tấn công có thể dùng khóa của chính mình và tự ký. Đây là lỗi triển khai phổ biến ở client tự viết.

---

## Giới hạn

- Phụ thuộc hạ tầng chứng chỉ, vốn là mắt xích yếu và khó thay đổi.
- Cấu hình sai vẫn có thể vô hiệu hóa forward secrecy hoặc chấp nhận thuật toán yếu.

---

## Tổng kết

- TLS 1.2 dùng RSA để trao đổi khóa phiên; TLS 1.3 bỏ cách này, dùng trao đổi khóa tạm thời và chỉ dùng chữ ký để xác thực.
- **Forward secrecy** là lý do cấu trúc khiến mô hình cũ bị loại bỏ, không phải vấn đề tốc độ.
- Chứng chỉ vẫn thiết yếu: nó ràng buộc khóa công khai với danh tính, còn chữ ký handshake chứng minh quyền sở hữu khóa.

---

## Related

* [Mã hóa lai](../01_foundations/hybrid_encryption.md) — khái niệm mô hình mà TLS hiện thực hóa: tầng bất đối xứng thiết lập khóa, tầng đối xứng bảo vệ dữ liệu.
* [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md) — vai trò cụ thể của RSA trong TLS 1.2 và lý do nó chuyển sang chữ ký trong TLS 1.3.
* [Giao thức TLS (Transport Layer Security)](../../../computer_networking/06_overview_of_popular_networking_protocols/tls.md) — cùng một **TLS handshake** nhìn từ phía mạng máy tính: vị trí phân tầng và luồng triển khai thực tế của giao thức mà bài này phân tích ở góc độ mật mã.

---
[← Back to README](README.md)
