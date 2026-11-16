# Markdown Docs Reviewer - Hệ thống Web Static Review Tài liệu

Hệ thống web tĩnh `web/` được thiết kế nhằm phục vụ nhu cầu đọc, rà soát và điều hướng trực quan toàn bộ kho tài liệu Markdown trong ba phân vùng `release/`, `temporary/`, và `interesting/`. Ứng dụng tuân thủ triết lý web static thế hệ cổ điển với kiến trúc zero-build tools (không dùng Node bundler, Webpack hay Vite), 100% tài nguyên và thư viện bên thứ ba được lưu trữ cục bộ để hoạt động độc lập ngay cả khi không có kết nối internet, đồng thời tương thích tối đa với nền tảng Vercel thông qua các lệnh triển khai tĩnh đơn giản.

> ⚠️ **Ràng buộc bắt buộc**: mã nguồn ứng dụng dùng **ES Modules gốc của trình duyệt** (`<script type="module">` + `import/export`). Trình duyệt chặn ES Modules khi mở file qua giao thức `file://`, nên ứng dụng **chỉ chạy được qua HTTP server** (`vercel dev` hoặc `python3 -m http.server`). Mở trực tiếp `web/index.html` bằng double-click sẽ không hoạt động.

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
| `web/index.html` | Entry point giao diện | Khung layout 3 cột responsive; chỉ khai báo `<link>` tới `css/main.css` và `<script type="module">` tới `js/main.js`. |
| `web/css/main.css` | Entry point CSS | `@import` 11 partial theo đúng thứ tự cascade (tokens → base → … → responsive). |
| `web/css/tokens.css` | Design tokens | Biến layout, transition, bảng màu light/dark. |
| `web/css/base.css` | Base & app shell | Reset, grid ứng dụng, top navigation bar. |
| `web/css/sidebar.css` | Sidebar | Panel trái, cây tài liệu, badge phân vùng. |
| `web/css/content.css` | Vùng nội dung | Cột giữa, doc header, trạng thái loading/error. |
| `web/css/markdown.css` | Markdown body | Override GitHub markdown, ảnh, bảng. |
| `web/css/code.css` | Code blocks | Khối code Prism và nút copy. |
| `web/css/mermaid.css` | Mermaid | Container sơ đồ. |
| `web/css/alerts.css` | GitHub Alerts | Callout NOTE/TIP/IMPORTANT/WARNING/CAUTION. |
| `web/css/toc.css` | TOC | Sidebar mục lục bên phải. |
| `web/css/overlays.css` | Overlays | Nút back-to-top và lightbox ảnh. |
| `web/css/error.css` | Error page | Card 404 / lỗi máy chủ / mất kết nối trong vùng đọc. |
| `web/css/responsive.css` | Responsive | Breakpoint 1100px và 768px (luôn nằm cuối cascade). |
| `web/js/main.js` | Composition root | Điểm khởi động duy nhất: khởi tạo theme/lightbox/shell/router, nạp manifest, điều phối `loadDocument`. |
| `web/js/core/state.js` | State container | Object state dùng chung (doc hiện tại, filter, cache, theme). |
| `web/js/core/dom.js` | DOM refs | Bản đồ tham chiếu element, resolve một lần khi import. |
| `web/js/core/paths.js` | Path resolution | `repoRootPrefix`, URL asset tĩnh, resolve đường dẫn tương đối. |
| `web/js/core/router.js` | Hash router | `parseHashRoute`, `navigateTo`, `pushDocAnchor`; loader được inject từ `main.js`. |
| `web/js/services/manifest.js` | Manifest loader | Ưu tiên `window.DOCS_MANIFEST`, fallback `manifest.json`. |
| `web/js/services/documents.js` | Document loader | Fetch Markdown + cache trong bộ nhớ. |
| `web/js/ui/theme.js` | Theme | Dark/light + persist localStorage, re-render Mermaid qua callback. |
| `web/js/ui/tree.js` | File tree | Render cây theo phân vùng, filter category, search, highlight doc đang mở. |
| `web/js/ui/toc.js` | TOC | Sinh heading id và render mục lục. |
| `web/js/ui/breadcrumb.js` | Header meta | Category pill, path, breadcrumb. |
| `web/js/ui/lightbox.js` | Lightbox | Modal phóng to ảnh. |
| `web/js/ui/error-view.js` | Error page | Ẩn header/nội dung/TOC cũ, hiện card lỗi theo `kind`, nút "Về trang chủ" và "Thử lại". |
| `web/js/ui/shell.js` | Shell | Toggle panel, category tabs, ô search, back-to-top, hotkey. |
| `web/js/markdown/renderer.js` | Render pipeline | Marked → chuỗi transformer → TOC → Mermaid. |
| `web/js/markdown/links.js` | Link/media | Viết lại đường dẫn ảnh và link `.md` tương đối. |
| `web/js/markdown/alerts.js` | Alerts | Chuyển blockquote `[!NOTE]` thành callout. |
| `web/js/markdown/code.js` | Code | Nút copy + Prism highlight. |
| `web/js/markdown/mermaid.js` | Mermaid | Đổi fenced block thành sơ đồ SVG. |
| `web/js/utils/` | Tiện ích | `html.js` (escape), `slug.js` (slugify), `anchor.js` (scroll tới anchor). |
| `web/manifest.json` | Danh mục tài liệu JSON | Dữ liệu flat list 167+ file Markdown kèm tiêu đề bài viết và phân vùng. |
| `web/manifest.js` | Danh mục gán biến global | Cung cấp `window.DOCS_MANIFEST` để load tức thì không cần round-trip. |
| `web/generate_manifest.py` | Script bảo trì tự động | Quét toàn bộ `release/`, `temporary/`, `interesting/` và cập nhật lại `manifest.*`. |
| `web/lib/` | Thư viện vendor cục bộ | Chứa `marked.min.js`, `prism.min.js`, `mermaid.min.js`, `github-markdown.min.css`. |
| `web/lib/prism-components/` | Ngữ pháp code Prism | Cung cấp tô màu cú pháp cho Java, Python, Bash, C, C++, Docker, Go, JSON, SQL, v.v. |
| `vercel.json` | Cấu hình Vercel (root) | Rewrite `/css/**`, `/js/**`, `/lib/**`, `/manifest.*` về `web/`; chặn thư mục nhạy cảm. |

### Quy ước phụ thuộc giữa các module JS

| Tầng | Được import từ | Không được import từ |
| :--- | :--- | :--- |
| `utils/`, `core/state.js`, `core/dom.js`, `core/paths.js` | — (leaf) | `ui/`, `markdown/`, `services/` |
| `core/router.js`, `services/` | `core/`, `utils/` | `ui/`, `markdown/` |
| `ui/`, `markdown/` | `core/`, `utils/`, và leaf widget `ui/toc.js` / `ui/lightbox.js` | module khác trong cùng tầng gây vòng lặp |
| `main.js` | tất cả | — |

Chỉ `main.js` được phép wire các module lại với nhau; `router.js` và `theme.js` nhận callback thay vì tự import tầng trên.

---

## 2. Cơ chế Kỹ thuật Cốt lõi

Hệ thống xử lý mượt mà việc hiển thị tài liệu thông qua ba thuật toán cốt lõi, mỗi thuật toán nằm trong module riêng dưới `web/js/`.

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
Từ thư mục gốc của dự án, khởi chạy một HTTP server tĩnh (bắt buộc — xem ràng buộc ES Modules ở đầu tài liệu):
```bash
# Sử dụng Python (có sẵn trên Linux/macOS)
python3 -m http.server 8000

# Hoặc sử dụng Vercel CLI (khớp với cấu hình rewrite trong vercel.json)
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

### Xử lý tài liệu không tồn tại
`services/documents.js` phân loại lỗi thành `not-found` / `server` / `network` / `unknown`; `ui/error-view.js` render card tương ứng. Có hai lớp bảo vệ:
1. Route `^/(release|temporary|interesting)/.*\.md$ → 404` (đặt **sau** `handle: filesystem`) trả đúng HTTP 404 cho file Markdown thiếu.
2. Guard phía client: response `200` nhưng `content-type` là `text/html` (dấu hiệu rơi vào fallback SPA) cũng bị coi là `not-found`.

Header có link tới mã nguồn: `https://github.com/MaiTheHao/c4f-learning-docs`.

### Bảng rewrite asset tĩnh (bắt buộc khi đổi cấu trúc `web/`)
| URL công khai | Rewrite tới | Ghi chú |
| :--- | :--- | :--- |
| `/lib/*` | `/web/lib/*` | Vendor libraries (marked, prism, mermaid). |
| `/css/*` | `/web/css/*` | Stylesheet entry và các partial. |
| `/js/*` | `/web/js/*` | ES Modules của ứng dụng. |
| `/manifest.js`, `/manifest.json` | `/web/manifest.*` | Danh mục tài liệu. |
| `/(release\|temporary\|interesting)/*.md` (không tồn tại) | status `404` | Chỉ áp dụng sau khi `filesystem` không tìm thấy file. |

> Nếu thiếu một dòng rewrite, request tương ứng sẽ rơi vào fallback `^/(.*)$ → /web/index.html`: trình duyệt nhận HTML thay vì CSS/JS và ứng dụng không khởi động. Kiểm tra nhanh bằng `curl -sI http://localhost:3000/js/main.js | head -1` và `curl -s http://localhost:3000/js/main.js | head -3` (phải thấy source module, không phải `<!DOCTYPE html>`).

---

[← Quay lại trang chủ](../README.md)
