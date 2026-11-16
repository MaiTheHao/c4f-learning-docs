# Chuyên đề Cryptography

Chuyên đề này đi từ nền tảng mật mã tới quyết định triển khai: mã hóa thực sự bảo vệ được gì, **Symmetric Encryption** và **Asymmetric Encryption** khác nhau ở đâu về cơ chế lẫn chi phí, và vì sao hệ thống thực tế luôn dùng mô hình **Hybrid Encryption** với tầng bất đối xứng thiết lập khóa còn tầng đối xứng bảo vệ dữ liệu. Trên nền tảng ấy, chuyên đề phân tích hai thuật toán tiêu biểu ở mức tính chất và vấn đề triển khai: **AES** với khối cố định, các mode, nhóm lỗi nonce/padding/side-channel, cùng **RSA** với giới hạn kích thước dữ liệu, sự bắt buộc của padding và vai trò chữ ký trong hệ thống hiện đại. Ba chương cuối mở rộng lên tầng giao thức và tầng hệ thống: luồng bắt tay TLS cùng lộ trình chuyển sang thuật toán kháng lượng tử, bài toán chạy SQL trên dữ liệu đã mã hóa với các cipher level **RND**, **DET**, **OPE**, **HOM**, **Onion Encryption** của CryptDB và mức rò rỉ đi kèm, và cuối cùng là những hướng còn đang nghiên cứu như **FHE** hay **Honey Encryption**. Mục tiêu xuyên suốt là biến trực giác "mã hóa là an toàn" thành các quyết định có căn cứ về thuật toán, tham số và **Trade-off** khi hệ thống buộc phải xử lý trên ciphertext.

---

## Lộ trình đọc

| Mức | Chương | Đọc trước |
| :--- | :--- | :--- |
| 1. Khái niệm | `01_foundations` - Ổn Định | Không |
| 2. Thuật toán | `02_symmetric`, `03_asymmetric` - Còn Sai Sót | Mức 1 |
| 3. Giao thức | `04_protocols` - Chưa Kiểm Tra Hết | Mức 1–2 |
| 4. Hệ thống và nghiên cứu | `05_encrypted_query`, `06_emerging_directions` - Chưa Kiểm Tra Hết | Mức 1–3 |

---

## Nền tảng mã hóa

Chương này phân biệt rõ mã hóa bảo vệ **confidentiality** còn integrity, authentication và non-repudiation cần cơ chế bổ sung; so sánh hai họ thuật toán theo chi phí và khả năng; giải thích vì sao bất đối xứng chậm hơn nhiều bậc; rồi đi vào khái niệm mô hình lai, nơi tầng bất đối xứng chỉ chạm vào khóa còn tầng đối xứng bảo vệ dữ liệu. Đi kèm là bài về các con số trong mật mã: `bit` nghĩa là gì, vì sao khối `128 bit` nhưng khóa có thể là `128`, `192` hoặc `256 bit`, và vì sao `AES-256` chỉ so sánh được với `RSA-2048` qua **security strength**. [Xem Nền tảng mã hóa](./01_foundations/README.md).

---

## Thuật toán đối xứng

Chương này đi vào họ thuật toán nhanh nhất và được dùng cho gần như toàn bộ dữ liệu thực tế: **AES** với khối cố định `128 bit`, ba cỡ khóa và những lỗi triển khai đi kèm. Nội dung tách thành hai bài: tính chất của bản thân thuật toán, và tầng bọc ngoài nó gồm **mode of operation**, **AEAD**, cùng nhóm lỗi nonce, IV và padding. [Xem Thuật toán đối xứng](./02_symmetric/README.md).

---

## Thuật toán bất đối xứng

Chương này đi vào họ thuật toán giải bài toán thiết lập niềm tin khi hai bên chưa có bí mật chung: **RSA** với quan hệ khóa, giới hạn kích thước bản rõ, sự bắt buộc của padding và các tấn công nhắm vào chỗ triển khai. Bài kết thúc bằng vai trò thực tế của RSA trong hệ thống hiện đại thay vì công thức. [Xem Thuật toán bất đối xứng](./03_asymmetric/README.md).

---

## Giao thức

Chương này đưa mô hình lai lên tầng giao thức: luồng bắt tay TLS 1.2 và 1.3, **forward secrecy**, vai trò thật của chứng chỉ, và lộ trình chuyển sang thuật toán kháng lượng tử cùng những mốc thời gian cần biết. Trọng tâm là vì sao cấu trúc giao thức quyết định mức bảo vệ, chứ không chỉ thuật toán bên trong. [Xem Giao thức](./04_protocols/README.md).

---

## Truy vấn trên dữ liệu mã hóa

Chương này chuyển sang bài toán hệ thống: database vẫn phải chạy SQL trên dữ liệu đã mã hóa, nên CryptDB dùng các cipher level **RND**, **DET**, **OPE**, **HOM** cùng các cơ chế **SEARCH** và **JOIN**, rồi bóc lớp **Onion Encryption** theo từng truy vấn. Trọng tâm là luồng dữ liệu, những gì database quan sát được, mức rò rỉ thực tế của từng lớp, và lý do hướng tiếp cận này hiện chủ yếu mang giá trị nghiên cứu. [Xem Truy vấn trên dữ liệu mã hóa](./05_encrypted_query/README.md).

---

## Các hướng đang nghiên cứu

Chương cuối tập hợp những hướng thường xuất hiện trong các bài về "tương lai của mã hóa" nhưng rất khác nhau về độ chín: **Fully Homomorphic Encryption**, mô hình quản lý khóa **BYOK**/**BYOE** và **Honey Encryption**. Nội dung giữ ở mức phân biệt cái gì đã dùng được, cái gì chỉ nên theo dõi. [Xem Các hướng đang nghiên cứu](./06_emerging_directions/README.md).

---

[← Quay lại trang chủ](../../README.md)
