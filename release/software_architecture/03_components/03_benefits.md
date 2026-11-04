# Component Giải quyết Vấn đề gì

## Table of Contents

- [Cách ly Biến động](#cách-ly-biến-động)
- [Loại bỏ Morning After Syndrome](#loại-bỏ-morning-after-syndrome)
- [Giảm Ripple Effect](#giảm-ripple-effect)
- [Tối ưu Pipeline](#tối-ưu-pipeline)
- [Liên quan](#liên-quan)

---

## Cách ly Biến động

Phần giá trị nhất của một hệ thống thường là các chính sách nghiệp vụ cốt lõi, trong khi phần thay đổi nhanh nhất lại là giao diện người dùng, cơ sở dữ liệu và các framework phụ thuộc. Component hóa tạo ra ranh giới để những phần biến động không kéo theo phần ổn định.

Khi lựa chọn công nghệ giao diện, thay đổi nhà cung cấp cơ sở dữ liệu hay nâng cấp framework, phạm vi ảnh hưởng bị giữ trong component tương ứng. Logic nghiệp vụ cốt lõi không phải viết lại chỉ vì một chi tiết hạ tầng thay đổi.

---

## Loại bỏ Morning After Syndrome

**Morning After Syndrome** mô tả tình trạng nhiều lập trình viên cùng sửa một khối mã nguồn lớn, mỗi người làm việc trên bản sao riêng, và đến sáng hôm sau khi tích hợp thì phát hiện thay đổi của người này phá vỡ thay đổi của người kia.

Khi hệ thống được chia thành các component độc lập, mỗi nhóm có thể làm việc trên component của mình mà không tranh chấp mã nguồn với nhóm khác. Việc tích hợp diễn ra qua interface đã thỏa thuận thay vì qua những chỉnh sửa chồng chéo trong cùng một tệp.

---

## Giảm Ripple Effect

**Ripple Effect (hiệu ứng gợn sóng)** là hiện tượng một thay đổi nhỏ lan ra toàn hệ thống, buộc đội ngũ phải kiểm thử và triển khai lại mọi thứ. Ranh giới component chặn hiệu ứng này bằng cách giới hạn phạm vi ảnh hưởng bên trong một đơn vị.

Khi thay đổi chỉ chạm đến một component, đội ngũ chỉ cần kiểm thử và phát hành component đó. Chi phí thay đổi giảm từ "toàn hệ thống" xuống "một phần của hệ thống", và đây là lợi ích kinh tế lớn nhất của component hóa trong dài hạn.

---

## Tối ưu Pipeline

Component hóa cho phép thiết lập **component pipeline** riêng để biên dịch và kiểm thử từng thành phần. Thay vì chạy toàn bộ bộ kiểm thử của hệ thống sau mỗi commit, pipeline chỉ chạy phần liên quan, nhờ đó **fast feedback** đến lập trình viên nhanh hơn nhiều.

> [!NOTE]
> Lợi ích pipeline chỉ xuất hiện khi ranh giới component đủ rõ để xác định chính xác phần nào bị ảnh hưởng. Nếu phụ thuộc chéo còn dày đặc, mọi commit vẫn kích hoạt gần như toàn bộ pipeline và lợi ích biến mất.

---

## Liên quan

*   [Lối tư duy Component](02_component_based_thinking.md) — cùng trục **từ nguyên tắc đến giá trị**: các nguyên tắc về ranh giới và độ ổn định là điều kiện để những lợi ích này xuất hiện.
*   [Vấn đề và Thách thức khi làm việc với Component](04_challenges.md) — mặt trái của những lợi ích trên: **chi phí quản lý, độ mịn sai và phụ thuộc vòng** có thể biến component hóa thành gánh nặng.

---
[← Back to README](README.md)
