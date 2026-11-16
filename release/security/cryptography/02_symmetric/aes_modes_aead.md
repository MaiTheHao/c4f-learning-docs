# Mode of Operation và AEAD cho AES: Đánh đổi và Lỗi Triển khai

## Table of Contents

- [Các mode và đánh đổi](#các-mode-và-đánh-đổi)
- [AEAD: mã hóa kèm xác thực](#aead-mã-hóa-kèm-xác-thực)
- [Các vấn đề khi triển khai](#các-vấn-đề-khi-triển-khai)
- [Chọn mode và tham số](#chọn-mode-và-tham-số)
- [Tổng kết](#tổng-kết)
- [Related](#related)

**AES** nguyên bản chỉ định nghĩa phép biến đổi trên đúng một khối `16 byte`. Mọi thứ liên quan đến thông điệp dài, độ dài tùy ý và xác thực toàn vẹn đều do **mode of operation** quyết định, và đa số sự cố thực tế nằm ở tầng này chứ không nằm ở thuật toán. Bài này đi vào từng mode, cơ chế **AEAD** và nhóm lỗi triển khai đi kèm; tính chất của bản thân AES ở bài [Chi tiết thuật toán AES](./aes.md).

---

## Các mode và đánh đổi

| Mode | Cần tham số | Song song hóa | Padding | Rò rỉ hoặc rủi ro chính |
| :--- | :--- | :--- | :--- | :--- |
| **ECB** | Không | Có | Có | Lộ mẫu lặp nguyên khối; không dùng cho dữ liệu thực tế |
| **CBC** | IV ngẫu nhiên, không đoán được | Mã hóa tuần tự, giải mã song song | Có | Lộ độ dài; sai IV làm hỏng khối đầu; rủi ro padding oracle nếu thông báo lỗi chi tiết |
| **CTR** | Nonce và bộ đếm duy nhất | Có | Không | Tái sử dụng nonce làm lộ XOR của hai bản rõ |
| **GCM** | Nonce duy nhất | Có | Không | Tái sử dụng nonce phá cả tính bí mật lẫn xác thực |
| **XTS** | Tweaked key và số thứ tự khối | Có, theo sector | Không | Dành cho dữ liệu lưu trữ theo sector, không dùng cho truyền thông |

Ba kết luận thực dụng:

- **ECB không có chỗ đứng** cho dữ liệu có cấu trúc. Nó chỉ còn giá trị minh họa.
- **CBC** vẫn gặp trong hệ thống cũ. Nếu dùng, phải có MAC riêng hoặc dùng biến thể có xác thực, và phải xử lý lỗi padding theo cách không tiết lộ thông tin.
- **CTR** biến AES thành stream cipher. Nó nhanh và không cần padding, nhưng phụ thuộc hoàn toàn vào tính duy nhất của nonce.

---

## AEAD: mã hóa kèm xác thực

**AEAD** (Authenticated Encryption with Associated Data) là nhóm mode trả về đồng thời bản mã và một **tag** xác thực. Người nhận kiểm tra tag trước khi dùng dữ liệu, nên sửa một bit bản mã cũng bị phát hiện.

**GCM** là mode AEAD phổ biến nhất của AES và là mặc định trong nhiều giao thức. Hai tham số cần nhớ:

| Tham số | Giá trị thường dùng | Ghi chú |
| :--- | :--- | :--- |
| **Nonce** | `96 bit` | Phải duy nhất cho mỗi lần mã hóa dưới cùng khóa |
| **Tag** | `128 bit` | Có thể ngắn hơn trong giới hạn cho phép, nhưng tag ngắn làm giảm biên an toàn |

GCM cho phép gắn thêm dữ liệu không mã hóa nhưng vẫn được xác thực (header, metadata). Đây là lý do AEAD phù hợp cho giao thức mạng: header cần đọc được nhưng không được phép sửa.

> [!WARNING]
> Tái sử dụng nonce trong GCM không chỉ làm lộ quan hệ giữa hai bản rõ. Nó còn cho phép khôi phục khóa xác thực và từ đó tạo tag hợp lệ cho dữ liệu tùy ý (lớp tấn công thường gọi là **forbidden attack**). Đây là lỗi thảm họa, không phải lỗi "giảm nhẹ bảo mật", và cách xử lý duy nhất là thay khóa.

Với dữ liệu lưu trữ, nơi không có khái niệm "một thông điệp", **AES-GCM** không phải lựa chọn mặc định. Các hệ thống đĩa dùng mode chuyên biệt như **XTS**, chấp nhận rằng mỗi sector được mã hóa độc lập.

---

## Các vấn đề khi triển khai

**1. Dùng ECB cho dữ liệu có cấu trúc.** Bản mã giữ nguyên mẫu lặp của bản rõ. Đây là lỗi kinh điển nhưng vẫn xuất hiện trong hệ thống tự viết.

**2. Tái sử dụng IV hoặc nonce.** Với CTR và GCM, hậu quả không dừng ở mất bí mật mà còn mất luôn khả năng xác thực. Nguyên nhân thường gặp là dùng số ngẫu nhiên chất lượng thấp, hoặc dùng lại nonce sau khi khởi động lại tiến trình.

**3. Chọn IV theo cách đoán được.** IV trong CBC phải ngẫu nhiên và không đoán trước. IV tăng dần hoặc lấy từ timestamp tạo điều kiện cho tấn công chọn bản rõ.

**4. Rò rỉ qua thông báo lỗi padding.** Nếu hệ thống phân biệt "sai padding" với "sai MAC", kẻ tấn công có thể dựng lại bản rõ từng byte. Cách phòng thủ là dùng AEAD, hoặc xử lý mọi lỗi giải mã như nhau.

---

## Chọn mode và tham số

Bảng dưới đây là mức tham chiếu triển khai, không phải hướng dẫn thay thế tài liệu của thư viện đang dùng.

| Bối cảnh | Mode | Yêu cầu tham số | Cỡ khóa |
| :--- | :--- | :--- | :--- |
| Truyền thông có giao thức | **GCM** hoặc AEAD tương đương | Nonce duy nhất theo khóa; không tái sử dụng sau khởi động lại | `128` hoặc `256 bit` |
| Lưu trữ file hoặc đĩa | **XTS** hoặc mode chuyên cho storage | Khóa riêng cho từng vùng; số thứ tự khối không trùng | `256 bit` (hai nửa khóa) |
| Hệ thống cũ buộc dùng **CBC** | CBC + MAC theo cách đã được kiểm chứng | IV ngẫu nhiên; xử lý lỗi padding đồng nhất | `128` hoặc `256 bit` |

So sánh bằng hoặc tính toán trên bản mã không phải bối cảnh chọn mode thông thường, xem [Các Cipher Level trong CryptDB](../05_encrypted_query/cryptdb_cipher_levels.md).

> [!NOTE]
> Nếu phải chọn một cấu hình mặc định cho hệ thống mới và không có ràng buộc đặc biệt: AES-GCM với khóa `256 bit`, nonce ngẫu nhiên `96 bit` cho mỗi bản ghi, giới hạn số bản ghi dưới cùng một khóa theo khuyến nghị của chuẩn, và khóa được quản lý bởi KMS. Đây là điểm khởi đầu an toàn, không phải điểm kết thúc của thiết kế.

---

## Tổng kết

- Mọi thứ liên quan đến thông điệp dài, độ dài tùy ý và xác thực đều do **mode** quyết định, không do AES.
- **ECB** và tái sử dụng nonce là hai lỗi nghiêm trọng nhất; **AEAD** như GCM là mặc định nên dùng cho truyền thông.
- Không có mode tốt nhất nói chung: mode được chọn theo bối cảnh sử dụng (truyền thông, lưu trữ, hệ thống cũ, hay truy vấn trên bản mã), mỗi lựa chọn kèm một dạng rò rỉ tương ứng.

---

## Related

* [Chi tiết thuật toán AES](./aes.md) — cùng thuật toán nhưng ở tầng lõi: khối `128 bit`, ba cỡ khóa, tính xác định và side-channel.
* [Mã hóa lai](../01_foundations/hybrid_encryption.md) — cùng nguyên tắc chọn mode và tham số cho tầng đối xứng bảo vệ dữ liệu trong mô hình lai.
* [Các Cipher Level trong CryptDB](../05_encrypted_query/cryptdb_cipher_levels.md) — trường hợp đặc biệt phải chọn cơ chế mã hóa theo phép toán cần chạy trên bản mã.

---
[← Back to README](README.md)
