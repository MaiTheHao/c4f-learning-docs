# Mật mã kháng lượng tử: Mối đe dọa và Lộ trình chuyển đổi

## Table of Contents

- [Vì sao phải tính đến máy tính lượng tử](#vì-sao-phải-tính-đến-máy-tính-lượng-tử)
- [Mốc chuyển đổi cần biết](#mốc-chuyển-đổi-cần-biết)
- [Trao đổi khóa lai trong giai đoạn chuyển đổi](#trao-đổi-khóa-lai-trong-giai-đoạn-chuyển-đổi)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Thuật toán Shor phá được cả phân tích thừa số của RSA lẫn logarit rời rạc trên đường cong elliptic, tức là phá toàn bộ tầng bất đối xứng đang dùng. Mã hóa đối xứng chịu ảnh hưởng nhẹ hơn nhiều: tấn công Grover chỉ làm giảm biên an toàn. Bài này phân tích sự bất đối xứng đó, các mốc chuyển đổi cần biết, và cách triển khai thực tế trong giai đoạn hiện tại.

---

## Vì sao phải tính đến máy tính lượng tử

Thuật toán Shor phá được cả phân tích thừa số của RSA và logarit rời rạc trên đường cong elliptic, tức là phá toàn bộ tầng bất đối xứng đang dùng. Mã hóa đối xứng như AES bị ảnh hưởng nhẹ hơn: tấn công Grover chỉ làm giảm biên an toàn, không phá cấu trúc.

Hệ quả là mối đe dọa không đối xứng giữa hai tầng:

- **Tầng bất đối xứng** phải thay thuật toán, không thể chỉ tăng kích thước khóa.
- **Tầng đối xứng** có thể dự phòng bằng cách tăng kích thước khóa.

Với dữ liệu có thời hạn bảo mật dài, còn một rủi ro thời gian: kẻ tấn công có thể **thu thập bản mã hôm nay và giải mã khi có máy lượng tử**. Đây là lý do việc chuyển đổi không thể chờ đến khi máy lượng tử xuất hiện.

---

## Mốc chuyển đổi cần biết

| Mốc | Nội dung | Ý nghĩa thực tế |
| :--- | :--- | :--- |
| **2024** | Bộ chuẩn **PQC** đầu tiên của NIST được công bố, gồm chuẩn trao đổi khóa và hai chuẩn chữ ký | Có thuật toán chính thức để triển khai, không còn là thử nghiệm |
| **2025–2026** | Trao đổi khóa lai cổ điển + kháng lượng tử được triển khai rộng ở trình duyệt và CDN | Người dùng phổ thông đã đi qua kênh lai mà không cần thay đổi gì |
| **2026** | NIST công bố hướng dẫn chuyển đổi chính thức, kèm mốc ngừng dùng thuật toán cổ điển | Có căn cứ để lập kế hoạch nhiều năm |
| **2030–2035** | Lộ trình ngừng dùng RSA/ECC theo từng loại hệ thống | Thời hạn khác nhau giữa hệ thống chính phủ, hạ tầng và ứng dụng |

> [!NOTE]
> Các mốc trên thay đổi theo phiên bản tài liệu và theo loại hệ thống. Khi lập kế hoạch, hãy đọc bản gốc mới nhất thay vì dựa vào bảng tóm tắt. Điều không thay đổi là hướng đi: chuyển khỏi RSA và ECC sang thuật toán kháng lượng tử.

Một điểm cần thận trọng: **trao đổi khóa kháng lượng tử đã triển khai được, nhưng chứng chỉ kháng lượng tử thì chưa phổ biến**. Các trình duyệt lớn chưa đưa chứng chỉ PQC truyền thống vào kho tin cậy công khai, và đang thử hướng khác cho vấn đề kích thước chứng chỉ. Vì vậy trong giai đoạn hiện tại, mô hình lai là cách tiếp cận thực tế: giữ xác thực cổ điển, thêm trao đổi khóa kháng lượng tử.

---

## Trao đổi khóa lai trong giai đoạn chuyển đổi

Trong giai đoạn hiện tại, cách triển khai thực tế là một kênh lai: xác thực vẫn dùng hạ tầng cổ điển, còn trao đổi khóa bổ sung thuật toán kháng lượng tử.

**Ưu điểm**

- Trao đổi khóa lai giữ được an toàn ngay cả khi một trong hai thuật toán bị phá, miễn thuật toán còn lại còn an toàn.
- Triển khai được từng bước: thêm thuật toán mới vào danh sách thương lượng mà không phá client cũ.

**Giới hạn**

- Kích thước khóa và chứng chỉ PQC lớn hơn đáng kể, gây áp lực lên băng thông và bộ nhớ.

Một mảng còn lại là chữ ký kháng lượng tử: chuẩn đã có nhưng chưa vào hạ tầng chứng chỉ công khai, chưa có trình duyệt bật mặc định, nên chỉ theo dõi chứ chưa triển khai đại trà.

---

## Tổng kết

- Mối đe dọa lượng tử không đối xứng giữa hai tầng: bất đối xứng buộc phải thay thuật toán, còn đối xứng chỉ cần tăng cỡ khóa.
- Chuyển đổi kháng lượng tử đang diễn ra ở tầng trao đổi khóa trước, trong khi chứng chỉ PQC vẫn là bài toán mở.

---

## Related

* [Chi tiết thuật toán RSA](../03_asymmetric/rsa.md) — thuật toán bị tấn công Shor phá, và lý do tăng cỡ khóa không phải giải pháp.
* [Chi tiết thuật toán AES](../02_symmetric/aes.md) — phía đối xứng, nơi tấn công Grover chỉ làm giảm biên an toàn.
* [Các hướng khác trong mã hóa](../06_emerging_directions/emerging_directions.md) — những hướng thường bị gộp chung với kháng lượng tử nhưng có độ chín rất khác.

---
[← Back to README](README.md)
