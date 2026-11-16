# Thuật toán đối xứng

Chương này đi vào họ thuật toán dùng một khóa cho cả hai chiều, giữ phần toán ở mức tối thiểu: mục tiêu là nắm **tính chất** của thuật toán, biết nó phù hợp với loại dữ liệu nào, và nhận ra các lỗi triển khai đi kèm. Nội dung tách thành hai bài vì bản thân **AES** chỉ biến đổi một khối, còn phần lớn sự cố thực tế nằm ở tầng bọc ngoài nó.

---

## Nội dung

Bài về **AES** trình bày tính chất của một block cipher (khối `128 bit`, ba cỡ khóa, số vòng tương ứng), hệ quả của việc khối cố định và tính xác định, các ưu nhược điểm, rồi đi vào nhóm lỗi triển khai còn lại: side-channel và quản lý khóa. [Xem Chi tiết thuật toán AES](./aes.md).

Bài về **mode** và **AEAD** trình bày cách dùng AES cho thông điệp dài tùy ý: **ECB**, **CBC**, **CTR**, **GCM**, **XTS** cùng đánh đổi của từng mode, cơ chế xác thực toàn vẹn, các lỗi tái sử dụng IV/nonce và rò rỉ padding, và cách chọn mode theo bối cảnh. [Xem Mode of Operation và AEAD](./aes_modes_aead.md).

---

[← Back to README](../README.md)
