# Giao thức

Chương này đưa mô hình lai ở Mức 1 lên tầng giao thức, nơi câu hỏi không còn là "dùng thuật toán nào" mà là "thiết lập khóa, xác thực danh tính và duy trì bí mật phiên ra sao". Nội dung đi qua luồng bắt tay **TLS**, lý do **forward secrecy** khiến mô hình cũ bị loại bỏ, vai trò thật của chứng chỉ, và lộ trình chuyển sang thuật toán kháng lượng tử.

---

## Nội dung

Bài về **TLS** trình bày cách TLS 1.2 trao đổi khóa bằng **RSA**, cách TLS 1.3 thay bằng trao đổi khóa tạm thời để có **forward secrecy**, vai trò của chứng chỉ sau khi bỏ RSA key transport, và những giới hạn còn lại của mô hình. [Xem TLS: Bắt tay và Forward Secrecy](./tls_handshake.md).

Bài về **mật mã kháng lượng tử** giải thích vì sao thuật toán Shor phá tầng bất đối xứng còn tấn công Grover chỉ làm giảm biên an toàn của tầng đối xứng, các mốc chuyển đổi cần biết, và vì sao trao đổi khóa lai là cách triển khai thực tế trong giai đoạn hiện tại. [Xem Lộ trình chuyển đổi kháng lượng tử](./post_quantum_transition.md).

---

[← Back to README](../README.md)
