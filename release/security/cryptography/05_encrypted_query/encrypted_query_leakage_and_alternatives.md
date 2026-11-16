# Rò rỉ, Tấn công và Hướng thay thế cho CryptDB

## Table of Contents

- [Rò rỉ thực tế và các tấn công đã biết](#rò-rỉ-thực-tế-và-các-tấn-công-đã-biết)
- [Giới hạn của mô hình và trạng thái hiện nay](#giới-hạn-của-mô-hình-và-trạng-thái-hiện-nay)
- [Tổng kết](#tổng-kết)
- [Related](#related)

Hai bài trước đã trình bày cơ chế mã hóa và cách CryptDB bóc lớp chúng theo từng truy vấn. Bài này phân tích cái giá của mô hình đó: những gì database quan sát được, các tấn công đã chứng minh từ chính những quan sát ấy, và vì sao CryptDB không còn là lựa chọn mặc định cho hệ thống mới.

---

## Rò rỉ thực tế và các tấn công đã biết

Phần này là lý do chính khiến mô hình CryptDB không còn được xem là lựa chọn mặc định cho hệ thống mới.

| Dạng rò rỉ | Nguồn | Hệ quả |
| :--- | :--- | :--- |
| **Mẫu bằng nhau** | **DET**, **JOIN** | Biết hai bản ghi cùng giá trị; kết hợp tần suất với dữ liệu phụ trợ có thể đoán giá trị thật |
| **Thứ tự và phân bố** | **OPE** | Không chỉ biết thứ tự mà còn suy ra xấp xỉ giá trị gốc từ vị trí trong miền |
| **Mẫu truy cập** | Mọi lớp | Biết truy vấn nào được chạy, bao nhiêu lần, trên cột nào |
| **Mẫu tìm kiếm** | **SEARCH** | Biết từ khóa nào được tìm và bản ghi nào khớp |
| **Toàn bộ khi proxy bị chiếm** | Proxy giữ khóa | Mô hình không bảo vệ được nếu kẻ tấn công kiểm soát proxy hoặc ứng dụng |

Nghiên cứu tấn công đã chỉ ra rằng các dạng rò rỉ này không chỉ mang tính lý thuyết. Với mã hóa bảo toàn thứ tự và các biến thể, nhóm Naveed, Kamara và Wright đã dựng lại được phần lớn dữ liệu thật từ bản mã và phân bố thống kê. Đối tượng của nghiên cứu đó là các triển khai mô phỏng theo đúng lược đồ mà CryptDB dùng, không phải một instance CryptDB đang chạy. Grubbs và cộng sự đi xa hơn với chính lược đồ **OPE** mà CryptDB sử dụng: từ thứ tự và phân bố, nhóm này dựng lại được phần lớn tên và ngày sinh trong dữ liệu thử nghiệm. Với truy vấn phạm vi, Kellaris và cộng sự cho thấy chỉ cần biết vài truy vấn là đủ để thu hẹp mạnh không gian giá trị.

Cần nói rõ giới hạn của bằng chứng: chưa có tấn công chỉ dùng bản mã nào phá được một instance CryptDB nguyên bản. Các kết quả mạnh nhất nhắm vào lược đồ nền và vào triển khai mô phỏng; tấn công nhắm trực tiếp CryptDB cần khả năng can thiệp chủ động vào dữ liệu hoặc truy vấn. Điều này không làm mô hình an toàn hơn, nhưng đặt đúng mức độ của bằng chứng.

Một kết luận còn quan trọng hơn cả danh sách tấn công: **độ an toàn của một cột không phải thuộc tính của cơ chế, mà là thuộc tính của phân bố giá trị**. Cùng một cơ chế **DET**, trên cột ít giá trị khác nhau (ví dụ mức độ rủi ro bệnh lý) có thể bị dựng lại gần như toàn bộ, trong khi trên cột nhiều giá trị (ví dụ tuổi) tỷ lệ dựng lại thấp hơn nhiều. Ngược lại, **OPE** làm chính cột nhiều giá trị đó bị dựng lại phần lớn, vì thứ tự cộng với hiểu biết về miền dữ liệu là quá đủ. Vì vậy câu hỏi đúng khi thiết kế là "cột này có phân bố gì", không phải "cơ chế này có an toàn không".

Về lớp **HOM**, chưa có tấn công công bố nào nhắm vào Paillier trong bối cảnh CryptDB. Rủi ro của **HOM** nằm ở chi phí lưu trữ và phạm vi phép toán hẹp, không nằm ở rò rỉ giá trị.

Ba kết luận cần giữ:

1. **Rò rỉ có cấu trúc mạnh hơn rò rỉ ngẫu nhiên.** Một chút thông tin phụ trợ có thể đủ để dựng lại phần lớn dữ liệu.
2. **Tần suất truy vấn cũng là thông tin.** Onion bị bóc càng sâu và càng lâu thì database càng học được nhiều.
3. **Mô hình đe dọa hẹp.** CryptDB bảo vệ dữ liệu khi DBMS bị xâm nhập, nhưng không bảo vệ khi ứng dụng hoặc proxy bị chiếm, và không che được mẫu truy vấn.

---

## Giới hạn của mô hình và trạng thái hiện nay

CryptDB là **prototype nghiên cứu**, không phải sản phẩm. Mã nguồn công khai nhưng không còn được phát triển từ khoảng 2014, và chính tài liệu của dự án mô tả nó là công cụ nghiên cứu.

Các hướng thay thế trong thực tế đi theo bốn hướng chính:

| Hướng | Cách tiếp cận | Rò rỉ chấp nhận | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Mã hóa xác định ở cột** | Chỉ hỗ trợ so sánh bằng trên cột được chọn | Mẫu bằng nhau và tần suất | SQL Server Always Encrypted với cột deterministic |
| **Mã hóa ngẫu nhiên + vùng tính toán tin cậy** | Tính toán trong enclave phần cứng, dữ liệu vẫn mã hóa khi lưu | Phụ thuộc nhà cung cấp phần cứng; vẫn lộ thứ tự qua chỉ mục | SQL Server Always Encrypted với secure enclaves |
| **Searchable encryption có kiểm soát** | Xây chỉ mục mã hóa cho phép tìm kiếm và lọc phạm vi | Mẫu truy vấn và mẫu tìm kiếm được thiết kế trước | MongoDB Queryable Encryption |
| **Mã hóa phía ứng dụng + blind index** | Ứng dụng tự mã hóa, tự quản lý chỉ mục | Chỉ những gì ứng dụng cố ý lộ | Tự triển khai |

Điểm chung của các hướng này: **không có giải pháp nào cho phép SQL tùy ý trên dữ liệu mã hóa mà không rò rỉ**. Chúng chỉ giới hạn phạm vi rò rỉ ở mức được thiết kế và ghi nhận trước.

Nhận định hiện nay khá thống nhất về từng cơ chế:

- **DET** vẫn được các sản phẩm thương mại hỗ trợ cho so sánh bằng, nhưng chỉ nên dùng cho cột có entropy cao (token ngẫu nhiên, mã định danh không đoán được), nơi tần suất không tiết lộ gì thêm.
- **OPE** không còn vai trò biện minh được cho dữ liệu nhạy cảm, vì rò rỉ thứ tự kết hợp thông tin phụ trợ đủ để dựng lại giá trị; không có sản phẩm phổ biến nào cung cấp cột OPE cho người dùng cuối.
- **HOM** chỉ nên dùng cho phép cộng trên cột ít truy vấn và chấp nhận chi phí lưu trữ.
- **SEARCH** phù hợp khi mẫu tìm kiếm được chấp nhận lộ trước, không phù hợp cho truy vấn tự do.

> [!CAUTION]
> Nếu dữ liệu thật sự nhạy cảm và không cần truy vấn linh hoạt, hãy mã hóa ở ứng dụng và chấp nhận mất khả năng lọc phía database. Nếu buộc phải truy vấn trên dữ liệu mã hóa, hãy chọn đúng cột, ghi lại rò rỉ chấp nhận, và coi đó là quyết định kiến trúc có hệ quả lâu dài.

---

## Tổng kết

- **Trade-off** cốt lõi là khả năng SQL đổi bằng rò rỉ có cấu trúc: **DET** lộ mẫu bằng nhau, **OPE** lộ thứ tự và phân bố, **HOM** chỉ tính được phép cộng.
- Các tấn công dựa trên rò rỉ đã được chứng minh trong thực tế, nên mô hình này phù hợp cho nghiên cứu và cho các trường hợp rò rỉ được chấp nhận có ý thức, không phù hợp làm mặc định cho dữ liệu nhạy cảm.

---

## Related

* [Các Cipher Level trong CryptDB](./cryptdb_cipher_levels.md) — nguồn gốc của từng dạng rò rỉ: mỗi level sinh ra một mẫu quan sát được.
* [Onion Encryption trong CryptDB](./cryptdb_onion_encryption.md) — cơ chế bóc lớp khiến thông tin bị lộ dần theo thời gian.
* [Tổng quan Encryption](../01_foundations/encryption_overview.md) — cùng nguyên lý **Trade-off** giữa khả năng dùng dữ liệu và mức độ lộ thông tin.
* [Các hướng khác trong mã hóa](../06_emerging_directions/emerging_directions.md) — cùng bài toán tính toán trên dữ liệu mã hóa, nhưng ở những hướng nghiên cứu khác.

---
[← Back to README](README.md)
