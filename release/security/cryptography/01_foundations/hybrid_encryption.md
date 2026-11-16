# Mã hóa lai: Vì sao hệ thống dùng cả hai họ thuật toán

## Table of Contents

- [Vấn đề: mỗi họ thuật toán chỉ giỏi một việc](#vấn-đề-mỗi-họ-thuật-toán-chỉ-giỏi-một-việc)
- [Mô hình mã hóa lai](#mô-hình-mã-hóa-lai)
- [Mã hóa lai ngoài TLS](#mã-hóa-lai-ngoài-tls)
- [Ưu điểm và giới hạn của mô hình lai](#ưu-điểm-và-giới-hạn-của-mô-hình-lai)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Mã hóa đối xứng nhanh nhưng cần khóa chung trước. Mã hóa bất đối xứng giải được bài toán khóa nhưng chậm và chỉ chứa được dữ liệu nhỏ. Bài này giải thích mô hình **mã hóa lai** sinh ra từ chính điểm yếu đó: hai họ bổ sung cho nhau thay vì cạnh tranh, và mỗi họ giữ đúng phần việc mình làm tốt nhất.

---

## Vấn đề: mỗi họ thuật toán chỉ giỏi một việc

| Yêu cầu của một kết nối thực tế | Mã hóa đối xứng | Mã hóa bất đối xứng |
| :--- | :--- | :--- |
| Tốc độ đủ cho toàn bộ lưu lượng | Có | Không |
| Không cần bí mật chung trước | Không | Có |
| Dữ liệu lớn tùy ý | Có, qua mode | Không, giới hạn bởi modulus |
| Chống chối bỏ, xác thực nguồn gốc | Không | Có, qua chữ ký |
| Chi phí CPU thấp | Thấp | Cao |

Bảng này cho thấy hai họ bổ sung cho nhau chứ không cạnh tranh. Một kết nối cần **thiết lập khóa an toàn** ở đầu và **truyền dữ liệu nhanh** ở phần còn lại. Đó chính là hình dạng của mọi giao thức lai.

---

## Mô hình mã hóa lai

**Mã hóa lai** dùng một cơ chế bất đối xứng để thiết lập hoặc trao đổi một **khóa phiên** ngắn hạn, sau đó dùng khóa đó với thuật toán đối xứng để mã hóa toàn bộ dữ liệu.

Luồng khái quát:

1. Hai bên xác thực danh tính và thống nhất thuật toán.
2. Hai bên thiết lập một bí mật chung, chỉ tồn tại trong phiên.
3. Từ bí mật chung, mỗi bên dẫn xuất khóa phiên đối xứng.
4. Toàn bộ dữ liệu ứng dụng được mã hóa và xác thực bằng khóa phiên.

Điểm cần phân biệt là **hai nghĩa của "lai"** trong tài liệu:

| Cách hiểu | Cơ chế | Ví dụ |
| :--- | :--- | :--- |
| **Hybrid encryption** | Kết hợp asymmetric để bọc khóa và symmetric để mã hóa dữ liệu | Mã hóa file, mã hóa tin nhắn |
| **Hybrid key exchange** | Kết hợp hai cơ chế trao đổi khóa, thường một cổ điển và một kháng lượng tử | Bắt tay TLS hiện đại |

Hai nghĩa này thường bị gộp làm một. Trong TLS hiện đại, phần trao đổi khóa là lai theo nghĩa thứ hai, còn việc mã hóa bản ghi là lai theo nghĩa thứ nhất.

Luồng bắt tay cụ thể của mô hình này trong TLS ở bài [TLS: Bắt tay, Forward Secrecy và Vai trò của Chứng chỉ](../04_protocols/tls_handshake.md).

---

## Mã hóa lai ngoài TLS

Cùng mô hình được dùng ở nhiều nơi khác:

| Ngữ cảnh | Phần bất đối xứng | Phần đối xứng |
| :--- | :--- | :--- |
| **Mã hóa file** | Bọc khóa dữ liệu bằng khóa công khai người nhận | Mã hóa nội dung file bằng khóa dữ liệu |
| **Tin nhắn đầu cuối** | Trao đổi khóa theo phiên, xác thực bằng chữ ký | Mã hóa từng tin nhắn |
| **Lưu trữ đám mây** | Khóa chủ bọc khóa dữ liệu | Mã hóa từng đối tượng |
| **Thiết bị di động** | Khóa trong phần cứng bảo vệ | Mã hóa dữ liệu người dùng |

Điểm chung: phần bất đối xứng **chỉ chạm vào khóa**, không chạm vào dữ liệu lớn. Mọi thiết kế làm ngược lại đều gặp vấn đề hiệu năng hoặc giới hạn kích thước.

---

## Ưu điểm và giới hạn của mô hình lai

**Ưu điểm**

- Kết hợp được tốc độ của mã hóa đối xứng với khả năng thiết lập khóa của mã hóa bất đối xứng.
- Forward secrecy bảo vệ dữ liệu đã truyền khi khóa dài hạn bị lộ.

**Giới hạn**

- Phức tạp hơn: nhiều thuật toán, nhiều tham số, nhiều cách thương lượng.
- Chi phí bắt tay cao hơn thuần đối xứng, dù không đáng kể so với truyền dữ liệu.
- Cấu hình sai vẫn có thể vô hiệu hóa forward secrecy hoặc chấp nhận thuật toán yếu.

---

## Tổng kết

- Mã hóa lai tồn tại vì mã hóa đối xứng và bất đối xứng có điểm mạnh bù trừ nhau.
- Cần phân biệt hai nghĩa của "lai": **hybrid encryption** bọc khóa rồi mã hóa dữ liệu, còn **hybrid key exchange** phối hợp hai cơ chế trao đổi khóa.
- Nguyên tắc chung của mọi thiết kế lai: phần bất đối xứng chỉ chạm vào khóa, toàn bộ dữ liệu lớn do tầng đối xứng bảo vệ.

---

## Related

* [Tổng quan Encryption](./encryption_overview.md) — cùng trục phân loại **symmetric** và **asymmetric**, nơi mô hình lai là điểm hội tụ của hai họ.
* [TLS: Bắt tay, Forward Secrecy và Vai trò của Chứng chỉ](../04_protocols/tls_handshake.md) — cùng mô hình lai nhưng nhìn từ góc độ giao thức: thiết lập khóa, xác thực và forward secrecy.
* [Mode of Operation và AEAD cho AES](../02_symmetric/aes_modes_aead.md) — tầng đối xứng thực sự bảo vệ dữ liệu trong mô hình lai.

---
[← Back to README](README.md)
