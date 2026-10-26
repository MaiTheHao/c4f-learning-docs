# Docker SBX: Mô hình cô lập và so sánh với Docker thường

## Table of Contents

- [1. Mô hình Docker SBX](#1-mô-hình-docker-sbx)
- [2. So sánh với Docker thường](#2-so-sánh-với-docker-thường)
- [Related](#related)

---

## 1. Mô hình Docker SBX

Để thỏa đồng thời yêu cầu cô lập mạnh, môi trường Docker đầy đủ và khởi động nhanh (xem [Bối cảnh và lý do ra đời](./01_docker_sbx_boi_canh.md)), nguyên tắc cốt lõi của **Docker SBX** là: **mỗi phiên Agent chạy trong một microVM riêng**, bên trong có Docker Engine riêng và không có đường quay về host. Mọi quy tắc về file, mạng và secret được xác định trước khi Agent chạy, do hạ tầng thực thi chứ không do Agent tự giữ.

| Lớp bảo vệ | Cách hoạt động |
| :--- | :--- |
| **Cô lập Kernel** | Mỗi sandbox có Kernel riêng, ranh giới là hypervisor. Không chia sẻ bộ nhớ hay tiến trình với host |
| **Docker Engine riêng** | Agent tự `build` và `run` container bên trong VM, không cần mount socket, không với tới Docker của host |
| **Cô lập file** | Chỉ **Workspace** được mount vào mới nhìn thấy được. Phần còn lại của host nằm ngoài VM |
| **Cô lập mạng** | Mọi request HTTP/HTTPS đi qua **Proxy** trên host, chỉ domain nằm trong allow-list mới được ra ngoài |
| **Cô lập credential** | API key nằm ngoài VM. Proxy gắn header xác thực vào request đi ra, Agent chỉ thấy giá trị giữ chỗ |

Luồng gọi một API có xác thực diễn ra như sau: Agent gửi request không kèm key, Proxy trên host chặn lại, kiểm tra domain có được phép không, tra credential tương ứng rồi gắn header xác thực và chuyển tiếp. Vì key chưa từng vào VM nên Agent bị xâm phạm cũng không đọc hay gửi trộm được giá trị thô.

> [!WARNING]
> Cô lập không có nghĩa là vô hại. Workspace được mount vẫn ghi được, nên Agent vẫn có thể sửa hoặc xóa code trong đó (hãy dùng Git để có đường lui). Proxy ngăn việc đánh cắp key nhưng không ngăn Agent dùng key đó qua các domain được phép. SBX giới hạn Blast Radius, không kiểm soát nội dung Agent làm trong phạm vi được cấp.

---

## 2. So sánh với Docker thường

Docker thường cô lập ở **cấp tiến trình** bằng namespace và cgroups của Kernel Linux, nên mọi container dùng chung Kernel với host. Docker SBX cô lập ở **cấp máy ảo**, mỗi sandbox một Kernel riêng. Sự khác biệt này kéo theo mọi khác biệt còn lại.

| Chiều so sánh | Docker thường | Docker SBX |
| :--- | :--- | :--- |
| **Ranh giới cô lập** | Namespace + cgroups (cấp tiến trình) | microVM + hypervisor (cấp phần cứng ảo hóa) |
| **Kernel** | Chia sẻ với host. Lỗ hổng Kernel có thể giúp thoát container | Riêng cho từng sandbox. Kernel bên trong bị xâm phạm vẫn nằm trong VM |
| **Docker bên trong** | Phải cấp quyền nâng cao hoặc mount socket host, phá cô lập | Engine riêng trong VM, không cần đặc quyền host |
| **Xử lý credential** | Biến môi trường hoặc file, nhìn thấy được bên trong container | Proxy trên host gắn header, giá trị thô không vào sandbox |
| **Phạm vi truy cập** | Phụ thuộc cách cấu hình mount và network | Chỉ Workspace, domain trong allow-list và secret được khai báo trước khi chạy |
| **Mục đích thiết kế** | Đóng gói và chạy ứng dụng, **Microservices** | Chạy Agent tự trị, không tin cậy hoàn toàn |

SBX không thay thế Docker thường mà chạy Docker bên trong một lớp cô lập mạnh hơn. Với ứng dụng bạn viết và tin tưởng, container thường vẫn là lựa chọn nhẹ và đúng. Với một Agent tự quyết định lệnh nào sẽ chạy, câu hỏi cần trả lời đổi từ "làm sao đóng gói ứng dụng" sang "làm sao để Agent làm việc với quyền cao mà không đặt máy của developer vào rủi ro". SBX sinh ra cho câu hỏi thứ hai.

---

## Related

- [Bối cảnh và lý do ra đời](./01_docker_sbx_boi_canh.md) — cùng bài toán ranh giới cô lập, nhưng nhìn từ phía các giải pháp bị loại và lý do chúng không thoả đồng thời ba yêu cầu.

---
[← Back to README](README.md)