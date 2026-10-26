# Docker SBX: Bối cảnh và lý do ra đời

## Table of Contents

- [1. Thực trạng hiện nay](#1-thực-trạng-hiện-nay)
- [2. Tại sao SBX ra đời](#2-tại-sao-sbx-ra-đời)
- [3. Các giải pháp trước đó](#3-các-giải-pháp-trước-đó)
- [Related](#related)

---

## 1. Thực trạng hiện nay

**AI Coding Agent** (như Claude Code, Codex, Gemini CLI) không còn dừng ở việc gợi ý code. Agent tự đọc repo, chạy lệnh shell, cài package, build container và gọi mạng. Giá trị của nó tăng theo mức tự chủ: càng ít phải xin duyệt từng bước, càng hoàn thành được nhiều việc.

Rủi ro nằm ngay ở đây. Khi chạy trực tiếp trên laptop, Agent chạy với quyền của chính developer, nên nó với tới được mọi thứ developer với tới: thư mục home, **SSH key**, file `.env`, credential cloud, các project khác và cả **Docker daemon** của máy. Một lệnh xóa sai, một file `.env` bị lộ hoặc một request mạng bất thường (ví dụ do **Prompt Injection** từ nội dung độc hại trong repo hay trang web) là đủ để **Blast Radius** lan ra toàn bộ máy.

> [!IMPORTANT]
> Theo Docker, để chính LLM tự quyết định ranh giới bảo mật thì không phải là một mô hình bảo mật. Ranh giới phải do hạ tầng áp đặt, không phải do system prompt.

---

## 2. Tại sao SBX ra đời

Vấn đề không chỉ là "cô lập Agent", vì Agent còn cần một môi trường phát triển thật. Một coding Agent điển hình phải chạy được shell tùy ý, cài system package và đặc biệt là `docker build`, `docker run`, `docker compose` để hoàn tất công việc end to end.

Từ đó có ba yêu cầu phải thỏa cùng lúc:

| Yêu cầu | Lý do |
| :--- | :--- |
| **Cô lập mạnh** | Giới hạn Blast Radius khi Agent chạy sai hoặc bị lợi dụng |
| **Môi trường Docker đầy đủ** | Agent cần build và chạy container như một developer |
| **Khởi động đủ nhanh** | Nếu sandbox chậm hoặc vướng, developer sẽ bỏ qua và chạy Agent thẳng trên host |

Yêu cầu thứ ba hay bị xem nhẹ nhưng mang tính quyết định: bảo mật mà tạo ma sát lớn thì thực tế sẽ không được dùng. **Docker SBX** (Docker Sandboxes) ra đời để đạt cả ba mà không phải **Trade-off** giữa chúng.

---

## 3. Các giải pháp trước đó

Mỗi hướng tiếp cận trước đây đều buộc phải bỏ đi một thứ.

| Giải pháp | Điểm mạnh | Giới hạn với coding Agent |
| :--- | :--- | :--- |
| **Không sandbox** | Nhanh, không ma sát | Blast Radius là toàn bộ máy |
| **Container** | Nhanh, quen thuộc | Chia sẻ **Kernel** với host. Agent cần chạy Docker bên trong nên rơi vào **Docker-in-Docker**, phải cấp quyền nâng cao hoặc mount `docker.sock` của host, tức tự phá cô lập vừa dựng |
| **Máy ảo truyền thống** | Cô lập mạnh | Cold start chậm, tốn tài nguyên, không hợp với các phiên Agent ngắn và dày đặc |
| **WASM / V8 isolate** | Khởi động rất nhanh | Chỉ chạy isolate, không phải hệ điều hành. Agent không cài được system package hay chạy shell tùy ý, và bề mặt tấn công nằm ở engine |

**microVM** (máy ảo tối giản, mỗi máy có Kernel riêng) là điểm cân bằng giữa cô lập kiểu máy ảo và độ nhẹ kiểu container. Tuy vậy, các VMM microVM phổ biến như **Firecracker** được thiết kế cho hạ tầng cloud Linux/KVM, không hỗ trợ native macOS và Windows, trong khi coding Agent chạy chủ yếu trên laptop của developer. Docker vì thế tự xây một **VMM** mới, chạy native trên cả ba hệ điều hành bằng hypervisor gốc của từng nền tảng, để một codebase phục vụ cả ba mà không cần lớp chuyển đổi.

Mô hình hoạt động của giải pháp này được trình bày ở [Mô hình Docker SBX và so sánh với Docker thường](./02_docker_sbx_mo_hinh.md).

---

## Related

- [Mô hình Docker SBX và so sánh với Docker thường](./02_docker_sbx_mo_hinh.md) — cùng một câu hỏi về ranh giới cô lập, nhưng nhìn từ phía mô hình thực thi và hệ quả của nó lên file, mạng, credential.

---
[← Back to README](README.md)