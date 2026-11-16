# Các hướng khác trong mã hóa: FHE, BYOK/BYOE và Honey Encryption

## Table of Contents

- [Các hướng và độ chín thực tế](#các-hướng-và-độ-chín-thực-tế)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Ngoài chuyển đổi kháng lượng tử, ba hướng sau thường xuất hiện trong các bài về "tương lai của mã hóa". Chúng rất khác nhau về độ chín: có hướng đã có sản phẩm nhưng chi phí còn cao, có hướng chỉ là mô hình quản lý khóa chứ không phải thuật toán, và có hướng vẫn nằm trong nghiên cứu.

---

## Các hướng và độ chín thực tế

| Hướng | Trạng thái thực tế | Có nên dùng ngay |
| :--- | :--- | :--- |
| **Fully Homomorphic Encryption** | Tính toán được trên bản mã nhưng chậm hơn tính toán thường nhiều bậc; triển khai thật còn hẹp, chủ yếu ở bài toán tra cứu riêng tư và thử nghiệm tài chính | Chỉ khi giá trị bài toán đủ lớn để trả chi phí hiệu năng |
| **BYOK / BYOE** | Là mô hình quản lý khóa (nhập vật liệu khóa vào dịch vụ cloud, hoặc giữ khóa bên ngoài), không phải một thuật toán mật mã | Dùng khi có yêu cầu tuân thủ về kiểm soát khóa |
| **Honey Encryption** | Chỉ tồn tại trong nghiên cứu; các thiết kế honey-vault từng bị phân biệt được với xác suất cao | Không dùng trong sản phẩm |

> [!NOTE]
> "BYOE" không phải thuật ngữ có định nghĩa của cơ quan chuẩn hóa. Khi gặp trong tài liệu bán hàng, nên đọc nó như một mô hình quản lý khóa của nhà cung cấp, không phải một bước tiến của mật mã.

---

## Tổng kết

- **Fully Homomorphic Encryption** cho phép tính toán trên bản mã nhưng chậm hơn nhiều bậc và triển khai còn hẹp; chỉ đáng dùng khi giá trị bài toán đủ lớn để trả chi phí hiệu năng.
- **BYOK**/**BYOE** không phải thuật toán mà là mô hình quản lý khóa, phù hợp khi có yêu cầu tuân thủ về kiểm soát khóa.
- **Honey Encryption** vẫn chỉ tồn tại trong nghiên cứu và không nên dùng trong sản phẩm.

---

## Related

* [Mật mã kháng lượng tử](../04_protocols/post_quantum_transition.md) — hướng chuyển đổi đã có chuẩn và đang triển khai, khác với các hướng còn thử nghiệm ở đây.
* [Rò rỉ, Tấn công và Hướng thay thế cho CryptDB](../05_encrypted_query/encrypted_query_leakage_and_alternatives.md) — cùng bài toán tính toán trên dữ liệu mã hóa, nhưng ở hướng tiếp cận hệ thống thay vì thuật toán.

---
[← Back to README](README.md)
