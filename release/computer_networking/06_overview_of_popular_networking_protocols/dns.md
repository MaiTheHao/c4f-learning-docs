# Giao thức DNS (Domain Name System)

Mỗi khi bạn gõ một URL vào trình duyệt, hành động _đầu tiên_ xảy ra là một truy vấn DNS — để tìm ra **địa chỉ IP** khớp với tên miền đó. Bài viết này giải thích tại sao DNS ra đời, bản đồ ánh xạ mà nó tạo ra, kiến trúc phân cấp bao gồm Root Server, TLD Server và Authoritative Name Server, và kéo bạn "làm bẩn tay" trực tiếp bằng công cụ `nslookup`.

## Table of Contents

-   [1. Tại sao chúng ta cần DNS?](#1-tại-sao-chúng-ta-cần-dns)
-   [2. Sự kỳ diệu của lớp trừu tượng](#2-sự-kỳ-diệu-của-lớp-trừu-tượng)
-   [3. DNS là một bản đồ ánh xạ (Giống như ARP)](#3-dns-là-một-bản-đồ-ánh-xạ-giống-như-arp)
-   [4. Thông số kỹ thuật của DNS](#4-thông-số-kỹ-thuật-của-dns)
-   [5. DNS hoạt động như thế nào (Kiến trúc phân cấp)](#5-dns-hoạt-động-như-thế-nào-kiến-trúc-phân-cấp)
-   [6. Luồng truy vấn DNS đầy đủ (The Full Flow)](#6-luồng-truy-vấn-dns-đầy-đủ-the-full-flow)
-   [7. Gói tin DNS (Sơ lược)](#7-gói-tin-dns-sơ-lược)
-   [8. Lưu ý quan trọng và Bảo mật](#8-lưu-ý-quan-trọng-và-bảo-mật)
-   [9. Thực hành: "Làm bẩn tay" với `nslookup`](#9-thực-hành-làm-bẩn-tay-với-nslookup)

---

Chào bạn!

Ở bài tổng quan trước, chúng ta đã lướt qua vai trò của DNS như một "cuốn danh bạ". Giờ là lúc chúng ta đào sâu thực sự vào một trong những giao thức nền tảng và được sử dụng _liên tục_ trong ngày của chúng ta: **DNS (Domain Name System)**.

Tại sao? Để tìm ra **địa chỉ IP** khớp với tên miền đó. Lý do đơn giản là vì Giao thức Internet (IP) hoạt động với địa chỉ IP. Giao thức IP có hệ thống địa chỉ riêng của nó (như chúng ta đã nói), và nó không hiểu `google.com`.

Vấn đề là, con người chúng ta không thể nhớ các con số. Đây là lý do chính mà DNS ra đời.

Chúng ta hãy nhảy vào và thảo luận xem DNS hoạt động như thế nào, tại sao nó lại ở đó, và sau đó thử "làm bẩn tay" một chút bằng cách tự truy vấn một số bản ghi DNS nhé.

---

## 1. Tại sao chúng ta cần DNS?

Lý do đầu tiên thì quá rõ ràng rồi:

-   **Con người không thể nhớ IP:** Chúng ta rất tệ trong việc nhớ các con số. Hãy tưởng tượng bạn phải nhớ địa chỉ IP của mọi trang web bạn truy cập.
-   **IP liên tục thay đổi:** Địa chỉ IP có thể thay đổi bất cứ lúc nào.
-   **Load Balancing:** Điều gì xảy ra nếu tôi muốn thực hiện cân bằng tải? Giả sử tôi có 7 máy chủ và 7 địa chỉ IP cho website của mình. Bạn có mong đợi người dùng nhớ cả 7 địa chỉ IP đó không? Điều đó thật phi lý.

Vì vậy, mọi người đã phát minh ra khái niệm **domain** (tên miền).

Đó là một chuỗi (**string**) mà bạn gõ vào, và nó có **cấu trúc 3 phần**: `subdomain` (tên miền phụ) → `domain` (tên miền chính) → `top-level-domain` (tên miền cấp cao nhất).

Ví dụ: `www.husseinnasser.com`

Cấu trúc 3 phần này là **cực kỳ quan trọng** vì nó liên quan trực tiếp đến cách DNS được _xây dựng_ và _phân cấp_.

---

## 2. Sự kỳ diệu của lớp trừu tượng

DNS về cơ bản là một **lớp trừu tượng** (layer of abstraction), và sự trừu tượng này mang lại sức mạnh đáng kinh ngạc.

### 1. Đối phó với IP thay đổi

Tên miền (`husseinnasser.com`) sẽ luôn giữ nguyên, nhưng địa chỉ IP mà nó trỏ đến có thể thay đổi. Chúng tôi (với tư cách là chủ sở hữu máy chủ) có thể "lật qua lật lại" (**swizzle**) các địa chỉ IP này ở phía **backend**, và người dùng không bao giờ cần phải biết.

### 2. Client-Side Load Balancing

Đây là một ý tưởng rất hay. Khi tôi truy vấn `husseinnasser.com`, máy chủ DNS có thể trả về **năm** địa chỉ IP. Tất cả chúng đều trỏ đến trang web của tôi.

Bây giờ, **client** (trình duyệt của bạn) sẽ tự chọn một trong các IP đó để kết nối (ví dụ: chọn cái đầu tiên, hoặc chọn ngẫu nhiên - round robin). Bằng cách này, client có thể kết nối với máy chủ đầu tiên, một client khác kết nối với máy chủ thứ hai, v.v. Điều này giúp cân bằng tải giữa nhiều máy chủ.

> **Một sự thật thú vị:** Netflix đã phụ thuộc rất nhiều vào khái niệm này trong kiến trúc ban đầu của họ. Họ dựa vào DNS để cung cấp nhiều IP và để client tự thực hiện **client-side load balancing**.

### 3. GeoDNS và CDNs

Đây là một khái niệm "thiên tài". Các **CDN** (Content Delivery Network - Mạng phân phối nội dung) như Cloudflare hay Fastly có máy chủ trên _toàn thế giới_ (Ấn Độ, Úc, Mỹ, Bahrain, Nga...). Họ sao chép nội dung của bạn ở khắp mọi nơi.

Bây giờ, hãy xem điều gì xảy ra:

1.  Một client ở **Ấn Độ** truy cập `husseinnasser.com`.
2.  Truy vấn DNS được thực hiện _tại Ấn Độ_.
3.  Máy chủ DNS ở Ấn Độ _sẽ_ trả về một địa chỉ IP của một máy chủ cũng ở **Ấn Độ**.

Bằng cách này, bạn ngay lập tức được kết nối với máy chủ **gần nhất** với mình.

**Tại sao điều này quan trọng?** Vì khoảng cách thực sự quan trọng. Nó có nghĩa là **latency (độ trễ) thấp hơn**.

Toàn bộ quá trình bắt tay TCP (SYN, SYN-ACK, ACK), rồi bắt tay TLS, rồi các thuật toán chống tắc nghẽn... tất cả những thứ đó sẽ tốt hơn _rất nhiều_ nếu máy chủ ở gần bạn.

Sẽ tốt hơn nhiều nếu độ trễ là **5 mili giây** so với việc tôi ở Ấn Độ và máy chủ của tôi ở California với độ trễ là **70 mili giây**. Độ trễ đó sẽ _cộng dồn_ lại.

> **Ghi nhớ:** Máy chủ DNS (Resolver) đủ thông minh để làm điều này. Nó biết địa chỉ IP của bạn (từ đâu bạn gửi truy vấn) và do đó, nó sẽ phục vụ bạn địa chỉ IP của máy chủ gần bạn nhất.

---

## 3. DNS là một bản đồ ánh xạ (Giống như ARP)

Mỗi khi chúng ta giới thiệu một hệ thống địa chỉ mới, chúng ta cần một **cơ chế ánh xạ** (**mapping**).

Chúng ta đã thấy điều này với **ARP (Address Resolution Protocol)**:

1.  Ban đầu, chúng ta phát minh ra địa chỉ **MAC**. Nó là duy nhất trên toàn cầu. Chúng ta nghĩ rằng mọi máy tính sẽ ở gần nhau (mạng LAN).
2.  Vấn đề: Chúng ta không thể định tuyến (**routing**) qua các mạng bằng địa chỉ MAC.
3.  Giải pháp: Chúng ta phát minh ra địa chỉ **IP**.
4.  Vấn đề mới: Khi ở trong mạng cục bộ, chúng ta vẫn cần địa chỉ MAC để giao tiếp.
5.  Giải pháp: **ARP**. "Này, tôi biết địa chỉ IP của bạn, nhưng tôi cần địa chỉ MAC của bạn."

Với DNS, vấn đề là **hoàn toàn giống hệt**:

1.  Chúng ta (khách hàng) có **tên** (ví dụ: `Facebook.com`).
2.  Chúng ta cần địa chỉ **IP**.
3.  Giải pháp: **DNS** là bản đồ ánh xạ từ Tên -> IP.

(Và sau đó, nếu ở mạng cục bộ, chúng ta lại dùng **ARP** để ánh xạ từ IP -> MAC).

---

## 4. Thông số kỹ thuật của DNS

-   **Giao thức (Protocol):** Nó được xây dựng trên **UDP**. Đây là lý do tại sao hiểu về TCP và UDP là rất quan trọng. Mọi thứ chúng ta nói đến đều được xây dựng trên TCP hoặc UDP (đôi khi là trực tiếp trên IP, như ICMP).
-   **Cổng (Port):** DNS sử dụng cổng **53**. Đây là cổng **well-known** và được dành riêng cho DNS.
-   **Record Types (Các loại bản ghi):** DNS không chỉ lưu địa chỉ IP. Nó có thể lưu trữ rất nhiều thông tin giá trị.

| Loại Bản ghi | Tên đầy đủ     | Mục đích                                                     | Ví dụ                                                    |
| :----------- | :------------- | :----------------------------------------------------------- | :------------------------------------------------------- |
| **A**        | Address        | Trả về địa chỉ IP (IPv4) của một tên miền.                   | `google.com` -> `142.250.199.14`                         |
| **CNAME**    | Canonical Name | Trả về một **alias** (bí danh), trỏ đến một tên miền khác.   | `network.husseinnasser.com` trỏ đến một máy chủ Netlify. |
| **MX**       | Mail Exchange  | Chỉ định máy chủ email cho tên miền.                         | Dùng để nhận email.                                      |
| **TXT**      | Text           | Cho phép lưu trữ bất kỳ thông tin văn bản nào.               | Thường dùng để xác thực quyền sở hữu tên miền.           |
| **SRV**      | Service        | Chỉ định **port** nào cần kết nối cho một dịch vụ cụ thể.    | `_minecraft._tcp.example.com`                            |

---

## 5. DNS hoạt động như thế nào (Kiến trúc phân cấp)

Nó không đơn giản là truy vấn một cơ sở dữ liệu và lấy lại một địa chỉ IP.

Là kỹ sư, chúng ta có thể nghĩ: "Cứ xây dựng một cái **bảng (table)** khổng lồ, tạo một cái **index**." Nhưng bạn có thể tưởng tượng cái bảng đó sẽ _lớn_ đến mức nào không? Nó sẽ là một bảng _khổng lồ_ với hàng tỷ bản ghi.

Trong các khóa học về cơ sở dữ liệu, chúng ta học kỹ thuật để giải quyết việc này: **Partitioning**. Bạn chia cơ sở dữ liệu thành các tập dữ liệu nhỏ hơn để có thể tìm kiếm nhanh hơn.

**Đây chính xác là cách DNS hoạt động.** Nó được phân cấp:

1.  **Root Servers (Máy chủ Gốc - `.`):** Đứng đầu hệ thống.
2.  **TLD Servers (Máy chủ Tên miền Cấp cao):** Đây là các máy chủ `.com`, `.org`, `.engineering`, `.io`...
3.  **Authoritative Name Servers (Máy chủ Tên miền Ủy quyền):** Đây là những máy chủ _thực sự_ chứa các địa chỉ IP mà bạn muốn.

Và **DNS Resolver** là kẻ đi hỏi tất cả các câu hỏi này.

---

## 6. Luồng truy vấn DNS đầy đủ (The Full Flow)

Hãy xem điều gì xảy ra khi bạn truy cập `https://google.com`.

-   **Bối cảnh:** Máy tính của bạn được cấu hình với một **DNS Resolver**. Khi bạn kết nối mạng, bạn sẽ nhận được một địa chỉ IP cho DNS Resolver (thường là router của bạn, hoặc các dịch vụ công cộng như `1.1.1.1` của Cloudflare hay `8.8.8.8` của Google).
-   **Lưu ý:** Địa chỉ Resolver _phải_ là một IP. Nếu nó là một tên miền, bạn sẽ bị lặp vô tận (làm sao tôi tìm IP của bạn?).

Đây là luồng hoạt động (giả sử Resolver chưa có gì trong cache):

1.  **Bước 1: Client bị "block"**

    -   Bạn gõ `google.com`. Trình duyệt của bạn thực hiện một cuộc gọi (**call**) đến Resolver. Đây là một cuộc gọi **synchronous** (đồng bộ). Bạn đang _chờ đợi_.

2.  **Bước 2: Resolver hỏi Root Server**

    -   Resolver (ví dụ: `8.8.8.8`) gửi một gói tin UDP đến một trong các **Root Server** (IP của các máy chủ này được hard-coded và ai cũng biết).
    -   _Câu hỏi:_ "Này Root, `.com` ở đâu?"

3.  **Bước 3: Root Server trả lời**

    -   Root Server không biết `google.com` ở đâu.
    -   _Trả lời:_ "Tôi không biết, nhưng đây là IP của một **máy chủ TLD** xử lý `.com`."

4.  **Bước 4: Resolver hỏi TLD Server**

    -   Resolver gửi gói tin UDP đến máy chủ TLD (`.com`) vừa nhận được.
    -   _Câu hỏi:_ "Này TLD `.com`, ai là **Authoritative Name Server** (máy chủ ủy quyền) cho `google.com`?"

    > **Tại sao không hỏi IP luôn?**
    > Nếu các máy chủ TLD lưu trữ IP của _mọi_ trang web `.com`, chúng sẽ phải sao chép một lượng dữ liệu khổng lồ. Thay vào đó, chúng chỉ lưu _một_ bản ghi: địa chỉ IP của máy chủ _biết_ câu trả lời (máy chủ ủy quyền).

5.  **Bước 5: TLD Server trả lời**

    -   TLD Server (thường là nhà đăng ký tên miền của bạn) trả lời:
    -   _Trả lời:_ "À, đây là IP của máy chủ ủy quyền cho `google.com`."

6.  **Bước 6: Resolver hỏi Authoritative Server**

    -   Resolver gửi gói tin UDP đến máy chủ **Authoritative** vừa nhận được.
    -   _Câu hỏi:_ "Này máy chủ ủy quyền, **địa chỉ IP** của `google.com` là gì?"

7.  **Bước 7: Authoritative Server trả lời**

    -   Máy chủ này (chỉ chịu trách nhiệm cho `google.com`) có một cơ sở dữ liệu _rất nhỏ_. Nó tìm kiếm và trả lời:
    -   _Trả lời:_ "Đây, IP là `142.250.199.14`."

8.  **Bước 8: Resolver trả lời Client**

    -   Resolver nhận được IP, lưu nó vào **cache** (để lần sau ai hỏi `google.com` thì trả lời ngay), và gửi IP đó cho client (trình duyệt của bạn).

9.  **Bước 9: Kết nối TCP**

    -   Client (trình duyệt) của bạn cuối cùng đã có IP. Giờ nó bắt đầu thiết lập bắt tay TCP với `142.250.199.14`.

> **Một câu hỏi hay: UDP là "stateless", làm sao Resolver biết được?**
> UDP không có trạng thái, vậy làm thế nào Resolver (đang hỏi hàng nghìn câu hỏi song song) biết được câu trả lời này là dành cho yêu cầu nào?
>
> Câu trả lời nằm ở phần header của DNS (bên trong gói UDP): có một trường gọi là **Transaction ID** (hoặc Query ID). Resolver tạo một ID duy nhất cho mỗi yêu cầu, và máy chủ sẽ sao chép ID đó vào phản hồi. Bằng cách đó, Resolver có thể ánh xạ các câu trả lời với các yêu cầu.

> **Hiệu suất (Performance):**
> Như bạn thấy, đây là _rất nhiều việc_. Đó là lý do tại sao truy vấn DNS có thể tốn kém (**expensive**). Trong Node.js, các cuộc gọi DNS được thực hiện **asynchronously** (bất đồng bộ) (sử dụng thư viện LibUV) chính vì lý do này, để không làm "block" luồng chính trong khi chờ đợi 7-8 bước này xảy ra.

---

## 7. Gói tin DNS (Sơ lược)

Đây là cấu trúc của gói tin:

`[ IP Header ] [ UDP Header ] [ DNS Header + Data ]`

-   **IP Header:** Chứa IP nguồn (của bạn) và IP đích (của Resolver).
-   **UDP Header:** Chứa cổng nguồn (ngẫu nhiên) và cổng đích (luôn là **53**).
-   **DNS Header (Phần Data của UDP):**
    -   **Transaction ID:** Cái chúng ta vừa nói, để khớp yêu cầu và phản hồi.
    -   **Flags (Cờ):** Cho biết đây là câu hỏi hay câu trả lời? Đây có phải là câu trả lời **authoritative** (ủy quyền) không?
    -   Số lượng câu hỏi.
    -   Số lượng câu trả lời (có thể có nhiều IP).
    -   Phần dữ liệu (Data) thực tế chứa tên miền và các bản ghi được trả về.

---

## 8. Lưu ý quan trọng và Bảo mật

### 1. DNS có thật sự phân tán không?

Chúng ta thường nghe DNS là một thiết kế **distributed** (phân tán).

-   **Đúng:** Các máy chủ Root và TLD được phân tán và sao chép trên toàn thế giới.
-   **Nhưng (Rất quan trọng):** Các máy chủ **Authoritative** thì _hoàn toàn tập trung_.

Ví dụ: Microsoft, Google, Facebook đã từng bị sập toàn bộ dịch vụ. Tại sao? Vì các máy chủ Authoritative của họ (được host trong trung tâm dữ liệu của riêng họ) đã bị sập.

Nếu máy chủ Authoritative (người duy nhất biết câu trả lời) bị sập, thì không ai trên thế giới có thể lấy được IP cho tên miền đó. Về cơ bản, mọi thứ sẽ ngừng hoạt động.

### 2. Vấn đề bảo mật LỚN: DNS là Plaintext

Gói tin DNS (gửi qua UDP) **không được mã hóa**. Nó là **plaintext** (văn bản thuần túy).

Ai có thể thấy nó? **ISP (Nhà cung cấp dịch vụ Internet) của bạn.**

Tất cả các gói IP của bạn đều đi qua ISP. Vì các gói IP đó mang các gói UDP, và các gói UDP đó mang DNS (không mã hóa), nên ISP của bạn _thấy mọi tên miền bạn truy cập_.

> Họ không thấy _nội dung_ trang web của bạn (nếu đó là HTTPS), nhưng họ _tuyệt đối_ thấy mọi truy vấn DNS (trên cổng 53). Họ có thể ghi log, chặn bạn nếu họ muốn, một cách rất dễ dàng.

### 3. Các giải pháp (Tương lai của DNS)

Để giải quyết vấn đề **plaintext**, người ta đã phát minh ra:

-   **DoT (DNS over TLS):** Mã hóa các truy vấn DNS bằng TLS (giống như HTTPS) và gửi qua một cổng _cụ thể_ (thường là 853).
-   **DoH (DNS over HTTPS):** Đóng gói các truy vấn DNS thành các yêu cầu HTTPS thông thường và gửi qua cổng **443** (cổng HTTPS).

Hiện đang có một cuộc tranh luận lớn:

-   Các quản trị viên mạng _ghét_ **DoH**, vì họ không thể phân biệt được lưu lượng DNS với lưu lượng web thông thường (vì cả hai đều dùng cổng 443).
-   Họ _thích_ **DoT** hơn, vì nó vẫn sử dụng một cổng riêng biệt, cho phép họ quản lý firewall dễ dàng hơn.

Đây vẫn là một chủ đề đang được nghiên cứu và triển khai (mới chỉ khoảng 20% web hỗ trợ).

### 4. DNS Attacks (Tấn công DNS)

-   **DNS Hijacking:** Tấn công và tự nhận mình là một máy chủ Authoritative giả mạo, sau đó trả về các IP độc hại.
-   **DNS Cache Poisoning:** Đây là một cuộc tấn công "chạy đua".
    1.  Kẻ tấn công biết Resolver đang hỏi TLD (ví dụ).
    2.  Họ bắt đầu "spam" Resolver bằng hàng ngàn gói tin UDP giả mạo.
    3.  Họ phải đoán đúng: Cổng nguồn (ngẫu nhiên) _và_ Transaction ID (ngẫu nhiên).
    4.  Nếu gói tin giả mạo của họ (chứa IP độc hại) đến _trước_ câu trả lời thật từ TLD, Resolver sẽ chấp nhận nó và lưu vào cache.
    5.  Mọi người dùng sau đó sẽ bị chuyển hướng đến máy chủ độc hại.
        (Đây là một cuộc tấn công rất khó thực hiện, nhưng rất nguy hiểm).

---

## 9. Thực hành: "Làm bẩn tay" với `nslookup`

`nslookup` (viết tắt của **Name Server Lookup**) là một công cụ có sẵn trên mọi hệ điều hành (Mac, Windows, Linux).

#### 1. Truy vấn cơ bản

Hãy thử truy vấn một tên miền:

```bash
$ nslookup hosainnasser.com

Server:		192.168.1.1  (Đây là server đã trả lời, chính là router/resolver của tôi)
Address:	192.168.1.1#53

Non-authoritative answer: (***LƯU Ý QUAN TRỌNG***)
Name:	hosainnasser.com
Address: 104.21.57.14
Name:	hosainnasser.com
Address: 172.67.185.119
... (Tôi nhận được nhiều IP - đây là cân bằng tải!)
```

> **"Non-authoritative answer" (Câu trả lời không ủy quyền)**
> Dòng này có nghĩa là câu trả lời bạn nhận được đến từ **cache** của Resolver (`192.168.1.1`). Đây _không phải_ là câu trả lời gốc từ **Authoritative Server**.

#### 2. Truy vấn các loại bản ghi khác

Chúng ta có thể yêu cầu các bản ghi TXT:

```bash
$ nslookup -type=TXT hosainnasser.com

Non-authoritative answer:
hosainnasser.com	text = "google-site-verification=..."
hosainnasser.com	text = "v=spf1 include:_spf.google.com ~all"
```

#### 3. Lấy câu trả lời Authoritative (Gốc)

Nếu tôi không tin tưởng vào cache, tôi muốn câu trả lời _thực sự_.

**Bước A: Tìm **Authoritative Server** (NS - Name Server) là ai.**

```bash
$ nslookup -type=NS hosainnasser.com

Non-authoritative answer:
hosainnasser.com	nameserver = ns-123.awsdns-45.com.
hosainnasser.com	nameserver = ns-456.awsdns-02.org.
...
```

Aha! Tôi thấy các máy chủ ủy quyền của tên miền này là của Amazon (AWS DNS).

**Bước B: Hỏi _trực tiếp_ **Authoritative Server** đó.**
Bây giờ, tôi sử dụng tham số thứ ba của `nslookup` để chỉ định máy chủ tôi muốn hỏi.

```bash
$ nslookup hosainnasser.com ns-123.awsdns-45.com

Server:		ns-123.awsdns-45.com
Address:	205.251.197.147#53

Name:	hosainnasser.com
Address: 104.21.57.14
Name:	hosainnasser.com
Address: 172.67.185.119
```

Bạn thấy không? Dòng "Non-authoritative answer" đã **biến mất**. Chúng ta đã bỏ qua Resolver cục bộ và đi thẳng đến "nguồn" của sự thật. Đây là câu trả lời "ủy quyền" nhất mà bạn có thể nhận được.

#### 4. Hỏi một Resolver cụ thể

Bạn cũng có thể hỏi bất kỳ Resolver công cộng nào, ví dụ như Google:

```bash
$ nslookup hosainnasser.com 8.8.8.8

Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	hosainnasser.com
Address: 104.21.57.14
...
```

Tất nhiên, đây lại là "Non-authoritative" vì `8.8.8.8` cũng chỉ là một Resolver đang trả lời từ cache của nó.

Một công cụ mạnh mẽ khác tương tự là `dig` (Domain Information Groper), nó cung cấp nhiều chi tiết hơn, nhưng `nslookup` là đủ để bắt đầu.

---

Hy vọng bài đào sâu này giúp bạn hiểu rõ hơn về DNS! Nó phức tạp hơn nhiều so với một "cuốn danh bạ" đơn giản phải không?

---
[← Back to README](../README.md)
