# Fault Tolerance

## Table of Contents

- [Khái niệm](#khái-niệm)
- [Ảnh hưởng đến Quyết định Kiến trúc](#ảnh-hưởng-đến-quyết-định-kiến-trúc)
- [Trade-off](#trade-off)
- [Liên quan](#liên-quan)

---

## Khái niệm

**Fault Tolerance** (khả năng chịu lỗi) là khả năng một hệ thống vẫn vận hành đúng chức năng như mong đợi ngay cả khi có vấn đề về phần cứng hoặc phần mềm trong quá trình hoạt động.

Đây là một trong những cơ chế kỹ thuật phổ biến nhất để đạt được **Reliability** của kiến trúc. Theo *Fundamentals of Software Architecture*:

> [!NOTE]
> *Reliability*: Whether the system needs to be fail-safe, or if it is mission critical in a way that affects lives. If it fails, will it cost the company large sums of money? This is often a spectrum rather than a binary.
>
> Mark Richards & Neal Ford

---

## Ảnh hưởng đến Quyết định Kiến trúc

Fault Tolerance ảnh hưởng mạnh đến quyết định kiến trúc: dựa trên yêu cầu về Fault Tolerance và Reliability, ta chọn **Monolith** hay **Distributed**.

- **Monolith**: một service hoặc module trong khối bị out of memory, mất điện hay mất internet thì cả khối cùng chết theo → khả năng chịu lỗi cực thấp, được Mark Richards và Neal Ford đánh giá 1 sao, thấp nhất trong các style.
- **Distributed**: một service gặp lỗi tương tự thì chỉ service đó chết, các khối còn lại vẫn vận hành bình thường → khả năng chịu lỗi cao nhất trong toàn bộ các style, nhóm Service-Based, Event-Driven và Microservices đều ở mức 4 đến 5 sao.

---

## Trade-off

Không phải cứ áp dụng Distributed là có Fault Tolerance cao. Muốn Fault Tolerance cao thì vẫn phải tư duy theo **First Law of Software Architecture**: *everything in software architecture is a trade-off*.

- Nếu giữa các service còn phụ thuộc chặt chẽ về dữ liệu hoặc nghiệp vụ (**Cross-Cutting Concerns**, hay **Kitty Problem**) thì một sự cố ở một service vẫn kéo cả hệ thống sụp đổ.
- Cô lập dữ liệu tuyệt đối (**Database-per-Service**) đẩy Fault Tolerance lên tối đa → tổng số service phải xử lý tăng cao, bề mặt lỗi mở rộng và chi phí vận hành lớn hơn.
- Fault Tolerance cao thường phải đánh đổi bằng **Performance** và **Latency**: Event-Driven giữ được sự kiện để phát lại sau sự cố, nhưng phản hồi chậm hơn và tốn tài nguyên hơn một monolith tương đương.

---

## Liên quan

*   [Phân loại Đặc tính Kiến trúc](../02_classification.md) — cùng trục **phân biệt đặc tính vận hành**: bảng phân loại đặt Fault Tolerance cạnh Availability và Reliability, còn bài này đi sâu vào cơ chế phía sau.
*   [Ma trận Đối chiếu Architecture Styles](../../04_architecture_styles/04_comparison.md) — cùng trục **chọn style theo đặc tính**: mức hỗ trợ Fault Tolerance là một tiêu chí trong ma trận đối chiếu chín style.

---
[← Back to README](../README.md)
