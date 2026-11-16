# Truy vấn trên dữ liệu mã hóa

Chương này đặt câu hỏi ở tầng hệ thống: khi dữ liệu đã nằm trong database dưới dạng ciphertext, làm sao vẫn chạy được truy vấn mà không giải mã toàn bộ về phía ứng dụng. Nội dung xoay quanh cách một hệ mã hóa chấp nhận đánh đổi khả năng quan sát của database để đổi lấy năng lực truy vấn, và vì sao đánh đổi đó có giới hạn thực tế. Ba bài dưới đây đi theo đúng thứ tự đó: cơ chế mã hóa, cách tổ chức chúng, rồi cái giá phải trả.

---

## Nội dung

Bài đầu tiên giải thích vì sao database có thể chạy SQL trên dữ liệu đã mã hóa, và phân biệt từng cipher level **RND**, **DET**, **OPE**, **HOM** cùng các cơ chế chuyên biệt **SEARCH**, **JOIN**, **OPE-JOIN**: mỗi cơ chế phục vụ nhóm phép toán nào và đổi bằng dạng rò rỉ nào. [Xem Các Cipher Level trong CryptDB](./cryptdb_cipher_levels.md).

Bài thứ hai mô tả luồng bóc lớp **Onion Encryption** theo từng truy vấn: cách CryptDB tổ chức các lớp lồng nhau, trạng thái ban đầu của một cột, và cách proxy điều chỉnh lớp mã hóa khi truy vấn cần chức năng sâu hơn. [Xem Onion Encryption](./cryptdb_onion_encryption.md).

Bài thứ ba phân tích các dạng rò rỉ mà mô hình buộc phải chấp nhận, những tấn công đã được chứng minh, các hướng thay thế đang dùng trong thực tế, và lý do hướng tiếp cận này hiện chủ yếu có giá trị nghiên cứu. [Xem Rò rỉ và Hướng thay thế](./encrypted_query_leakage_and_alternatives.md).

---

[← Back to README](../README.md)
