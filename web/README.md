# Markdown Docs Reviewer - Hệ thống Web Static Review Tài liệu

Hệ thống web tĩnh `web/` được thiết kế nhằm phục vụ nhu cầu đọc, rà soát và điều hướng trực quan toàn bộ kho tài liệu Markdown trong ba phân vùng `release/`, `temporary/`, và `interesting/`. Ứng dụng tuân thủ triết lý web static thế hệ cổ điển với kiến trúc zero-build tools (không dùng Node bundler, Webpack hay Vite), 100% tài nguyên và thư viện bên thứ ba được lưu trữ cục bộ để hoạt động độc lập ngay cả khi không có kết nối internet, đồng thời tương thích tối đa với nền tảng Vercel thông qua các lệnh triển khai tĩnh đơn giản.

---

## Table of Contents

- [1. Cấu trúc Thư mục và Vai trò Từng File](#1-cấu-trúc-thư-mục-và-vai-trò-từng-file)
- [2. Cơ chế Kỹ thuật Cốt lõi](#2-cơ-chế-kỹ-thuật-cốt-lõi)
- [3. Quy trình Quản trị và Cập nhật Khi Thêm Tài liệu](#3-quy-trình-quản-trị-và-cập-nhật-khi-thêm-tài-liệu)
- [4. Hướng dẫn Vận hành Local và Triển khai Vercel](#4-hướng-dẫn-vận-hành-local-và-triển-khai-vercel)
- [5. Chính sách Bảo mật và Định tuyến Routing](#5-chính-sách-bảo-mật-và-định-tuyến-routing)

---

## 1. Cấu trúc Thư mục và Vai trò Từng File

Thư mục `web/` được tổ chức tinh gọn, phân tách rõ ràng giữa mã nguồn giao diện, dữ liệu danh mục và các thư viện bên thứ ba.

| Đường dẫn file / thư mục | Vai trò kỹ thuật | Trách nhiệm chi tiết |
| :--- | :--- | :--- |
| `web/index.html` | Entry point giao diện | Khung layout 3 cột responsive, import toàn bộ CSS/JS local từ `lib/`. |
| `web/index.css` | Stylesheet giao diện | Dark/Light mode, typography, GitHub callouts, code block copy button, floating TOC. |
| `web/index.js` | Ứng dụng trung tâm | Router hash, engine chuẩn hóa đường dẫn ảnh/link, parser Markdown, Mermaid & Prism runner. |
| `web/manifest.json` | Danh mục tài liệu JSON | Dữ liệu flat list 167+ file Markdown kèm tiêu đề bài viết và phân vùng. |
| `web/manifest.js` | Danh mục gán biến global | Cung cấp `window.DOCS_MANIFEST` để load tức thì không bị lỗi CORS khi mở dạng file. |
| `web/generate_manifest.py` | Script bảo trì tự động | Quét toàn bộ `release/`, `temporary/`, `interesting/` và cập nhật lại `manifest.*`. |
| `web/lib/` | Thư viện vendor cục bộ | Chứa `marked.min.js`, `prism.min.js`, `mermaid.min.js`, `github-markdown.min.css`. |
| `web/lib/prism-components/` | Ngữ pháp code Prism | Cung cấp tô màu cú pháp cho Java, Python, Bash, C, C++, Docker, Go, JSON, SQL, v.v. |
| `vercel.json` | Cấu hình Vercel (root) | Thiết lập rewrite URL và chặn các thư mục nhạy cảm (`.agents`, `.git`, `local`). |

---

## 2. Cơ chế Kỹ thuật Cốt lõi

Hệ thống xử lý mượt mà việc hiển thị tài liệu thông qua ba thuật toán cốt lõi trong `web/index.js`.

### Chuẩn hóa Đường dẫn Tương đối (Path Resolution Engine)
Mỗi tài liệu Markdown có một đường dẫn cha tương đối (ví dụ `release/computer_networking/00_osi_model/`). Khi nội dung Markdown chứa các đường dẫn tương đối:
- **Đường dẫn ảnh (`<img>`)**: Nếu Markdown có `![OSI](../assets/OSI.png)`, hệ thống bóc tách `baseDir` để tính toán ra đường dẫn tĩnh chính xác `/release/computer_networking/assets/OSI.png` giúp trình duyệt tải ảnh chuẩn xác.
- **Liên kết Markdown (`<a>`)**: Nếu Markdown có link trỏ sang file khác như `[TCP/IP](./tcp_ip_vs_osi.md)` hoặc `[Root](../README.md)`, trình duyệt chặn hành vi reload trang mặc định (`e.preventDefault()`), resolve đường dẫn sang định dạng Hash (`#release/computer_networking/00_osi_model/tcp_ip_vs_osi.md`), nạp file mới vào bộ nhớ cache và render ngay lập tức.
- **Anchor Links**: Tự động chuyển đổi các thẻ Heading thành slug ID để phục vụ mục lục TOC và liên kết nội bộ bài viết.

### Bộ điều hướng Hash Routing & History
Hệ thống sử dụng Hash URL (`window.location.hash`) để lưu trạng thái tài liệu đang đọc:
- Cho phép chia sẻ liên kết trực tiếp tới đúng bài viết hoặc đúng tiêu đề con (ví dụ: `#release/security/jwt/introduce.md#cau-truc-jwt`).
- Tương thích 100% với các thao tác Back/Forward trên trình duyệt mà không cần can thiệp server-side routing phức tạp.

### Bộ biến đổi GitHub Alerts & Sơ đồ Mermaid
- Tự động nhận diện cú pháp `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` và render thành khối thẻ Callout đẹp mắt với icon và màu viền tương ứng.
- Tự động bắt các khối mã ````mermaid``` và khởi chạy thư viện Mermaid local để xuất ra sơ đồ vector SVG tương tác trực tiếp.

---

## 3. Quy trình Quản trị và Cập nhật Khi Thêm Tài liệu

Khi tác giả thêm mới hoặc đổi tên bất kỳ file Markdown nào trong `release/`, `temporary/` hoặc `interesting/`, chỉ cần thực hiện 1 thao tác duy nhất để cập nhật cây danh mục:

Chạy script Python sinh lại manifest từ thư mục gốc của repository:
```bash
python3 web/generate_manifest.py
```

Script sẽ tự động:
1. Quét đệ quy toàn bộ các file `.md` trong 3 thư mục nội dung.
2. Đọc dòng tiêu đề `# ` đầu tiên của mỗi bài viết để gán tên hiển thị thân thiện trên thanh Sidebar.
3. Ghi đè đồng thời vào `web/manifest.json` và `web/manifest.js`.

---

## 4. Hướng dẫn Vận hành Local và Triển khai Vercel

Dự án không có `package.json`, không cần chạy `npm install` hay `npm run build`.

### Chạy kiểm thử ở môi trường Local
Từ thư mục gốc của dự án, khởi chạy bằng bất kỳ HTTP server tĩnh nào:
```bash
# Sử dụng Python (có sẵn trên Linux/macOS)
python3 -m http.server 8000

# Hoặc sử dụng Vercel CLI
vercel dev
```
Sau đó mở trình duyệt tại: `http://localhost:8000/web/` hoặc `http://localhost:3000/`.

### Triển khai lên Vercel Production
Đảm bảo bạn đang đứng ở thư mục gốc chứa file `vercel.json`, thực hiện lệnh:
```bash
# Triển khai bản preview
vercel deploy

# Triển khai bản chính thức (Production)
vercel --prod
```
Vercel sẽ nhận diện toàn bộ dự án dưới dạng Static Assets và hoàn tất triển khai trong vòng 2-5 giây.

---

## 5. Chính sách Bảo mật và Định tuyến Routing

File `vercel.json` ở thư mục gốc đóng vai trò tường lửa định tuyến, phân định ranh giới giữa tài nguyên công khai và tài nguyên nội bộ:

### Danh mục bị chặn tuyệt đối (Trả về HTTP 404 Not Found)
- `/.agents`: Thư mục chứa cấu hình và các skill tác nhân AI nội bộ.
- `/.git` và `/.gitignore`: Toàn bộ dữ liệu quản lý phiên bản mã nguồn.
- `/LICENSE.txt`: Các tệp meta cấp phép gốc.
- `/local`: Thư mục nháp cá nhân và các log tác nhân.
- `/docs`: Tài liệu nghiên cứu & brainstorming nội bộ.
- `/web/req.txt` & `/web/generate_manifest.py`: Tệp đặc tả yêu cầu và script sinh manifest phía máy chủ.

### Danh mục được công khai hợp lệ
- `/release/**`: Toàn bộ bài viết và hình ảnh tài liệu đã rà soát.
- `/temporary/**`: Các bài viết và hình ảnh tài liệu đang hoàn thiện.
- `/interesting/**`: Các bài viết chuyên sâu đặc biệt.
- `/web/**`: Giao diện ứng dụng và các thư viện tĩnh local.
- Truy cập vào root `/` hoặc `/web` sẽ tự động phục vụ `web/index.html`.

---

[← Quay lại trang chủ](../README.md)
