# Về Các Đại Lượng Đo Lường Modularity

## Table of Contents

- [Tổng quan Khung Đo lường](#tổng-quan-khung-đo-lường)
- [Cohesion](#cohesion)
- [Coupling](#coupling)
- [Connascence](#connascence)
- [Bảng Đối chiếu và Ma trận Đánh đổi](#bảng-đối-chiếu-và-ma-trận-đánh-đổi)

---

## Tổng quan Khung Đo lường

Việc đánh giá tính mô-đun hóa (**Modularity**) thường gặp khó khăn do tính trừu tượng và sự phụ thuộc vào ngữ cảnh. Để chuyển đổi các nhận định cảm tính thành quyết định kỹ thuật định lượng, tài liệu này diễn giải cơ chế hoạt động, công thức toán học và các quy tắc quản trị của ba đại lượng đo lường: **Cohesion**, **Coupling**, và **Connascence**.

---

## Cohesion

**Cohesion** phản ánh mức độ tập trung trách nhiệm chức năng (**functional responsibility**) của một mô-đun.

Nhà nghiên cứu Larry Constantine từng nhận định:

> "Việc cố tình chia nhỏ một mô-đun vốn đã gắn kết chặt chẽ sẽ chỉ làm gia tăng Coupling bên ngoài và làm suy giảm nghiêm trọng khả năng đọc hiểu mã nguồn."

### 1. Phân loại Thang đo Cohesion

Thang đo phân loại Cohesion từ tốt nhất đến kém nhất:

| Cấp độ Cohesion | Đánh giá | Đặc điểm Kỹ thuật |
| :--- | :--- | :--- |
| **Functional** | Tốt nhất | Mọi phần tử đều phục vụ duy nhất một chức năng thiết yếu, không thể phân rã thêm. |
| **Sequential** | Rất tốt | Đầu ra của phần tử này là đầu vào trực tiếp của phần tử kế tiếp trong chuỗi xử lý. |
| **Communicational**| Khá | Các phần tử cùng thao tác trên một tập dữ liệu hoặc cùng đóng góp vào một kết quả đầu ra. |
| **Procedural** | Trung bình | Các phần tử phải được thực thi theo một trình tự thủ tục bắt buộc nhưng không chia sẻ dữ liệu trực tiếp. |
| **Temporal** | Kém | Các phần tử gom chung chỉ vì được kích hoạt tại cùng một thời điểm thực thi. |
| **Logical** | Rất kém | Các phần tử liên quan về mặt hình thức hoặc logic trừu tượng nhưng độc lập hoàn toàn về mặt chức năng thực thi. |
| **Coincidental** | Tệ nhất | Các phần tử ngẫu nhiên nằm chung một tệp nguồn, không có bất kỳ mối quan hệ nghiệp vụ hay logic nào. |

### 2. Chỉ số LCOM

Chỉ số **LCOM (Lack of Cohesion in Methods)** thuộc bộ đo Chidamber & Kemerer, cùng biến thể chuẩn hóa **LCOM96B**, cung cấp phương pháp toán học để đo lường độ thiếu gắn kết trong một lớp:

- Xét một lớp $C$ có $m$ phương thức $M = \{M_1, M_2, ..., M_m\}$ và tập thuộc tính $A$.
- Gọi $P$ là tập hợp các cặp phương thức không chia sẻ bất kỳ thuộc tính nào: 
  $$P = \{(M_i, M_j) \mid A_i \cap A_j = \emptyset\}$$
- Gọi $Q$ là tập hợp các cặp phương thức có chia sẻ ít nhất một thuộc tính:
  $$Q = \{(M_i, M_j) \mid A_i \cap A_j \neq \emptyset\}$$
- Giá trị LCOM nguyên bản được xác định:
  $$\text{LCOM} = \begin{cases} |P| - |Q| & \text{nếu } |P| > |Q| \\ 0 & \text{ngược lại} \end{cases}$$

> [!NOTE]
> Giá trị **LCOM** cao cảnh báo một lớp đang ôm đồm nhiều trách nhiệm không gắn kết, là tín hiệu chỉ báo rõ ràng cần tách lớp hoặc tái cấu trúc ranh giới mô-đun.

---

## Coupling

Dựa trên lý thuyết đồ thị gọi hàm, độ phụ thuộc được chia tách thành hai hướng kết nối:

- **Afferent Coupling ($C_a$)**: Số lượng kết nối hướng vào mô-đun (thước đo mức độ được phụ thuộc).
- **Efferent Coupling ($C_e$)**: Số lượng kết nối hướng ra bên ngoài mô-đun (thước đo mức độ phụ thuộc ra ngoài).

### 1. Bộ Chỉ số Robert C. Martin

| Chỉ số | Ký hiệu & Công thức | Miền giá trị | Diễn giải Kiến trúc |
| :--- | :--- | :--- | :--- |
| **Abstractness** | $A = \frac{N_a}{N_c}$ | $[0, 1]$ | Tỷ lệ giữa số lượng abstract class/interface ($N_a$) trên tổng số class ($N_c$). $A=0$: hoàn toàn cụ thể; $A=1$: hoàn toàn trừu tượng. |
| **Instability** | $I = \frac{C_e}{C_a + C_e}$ | $[0, 1]$ | Đo lường độ không ổn định. $I=0$: ổn định tối đa (nhiều thành phần phụ thuộc vào, không phụ thuộc ra ngoài); $I=1$: không ổn định (chỉ phụ thuộc ra ngoài). |
| **Distance** | $D = \|A + I - 1\|$ | $[0, 1]$ | Khoảng cách chuẩn hóa tới đường cân bằng lý tưởng Main Sequence ($A + I = 1$). |

### 2. Hai Vùng Nguy hiểm (Zones of Hazard)

- **Zone of Pain ($A \to 0, I \to 0 \implies D \to 1$)**: Mô-đun cực kỳ ổn định (nhiều nơi phụ thuộc vào) nhưng lại hoàn toàn cụ thể (không có abstraction). Mọi thay đổi tại đây đều tiềm ẩn nguy cơ phá vỡ hệ thống và rất tốn kém chi phí kiểm thử.
- **Zone of Uselessness ($A \to 1, I \to 1 \implies D \to 1$)**: Mô-đun hoàn toàn trừu tượng nhưng không có bất kỳ thành phần nào khác phụ thuộc vào. Đây là biểu hiện của sự thiết kế dư thừa (**Over-engineering**).

---

## Connascence

**Connascence** do Meilir Page-Jones đề xuất nhằm mô tả bản chất mối liên kết giữa các thành phần phần mềm: hai thành phần có connascence khi thay đổi ở thành phần này đòi hỏi thành phần kia phải thay đổi theo để duy trì tính đúng đắn.

### 1. Phân loại Cấp độ Liên kết

| Phân nhóm | Dạng Connascence | Ký hiệu | Bản chất Ràng buộc |
| :--- | :--- | :--- | :--- |
| **Static** (Compile-time) | **Name** | `CoN` | Thống nhất về tên gọi của một thực thể. |
| **Static** (Compile-time) | **Type** | `CoT` | Thống nhất về kiểu dữ liệu của thuộc tính hoặc tham số. |
| **Static** (Compile-time) | **Meaning** | `CoM` | Thống nhất về ý nghĩa quy ước ngầm của dữ liệu. |
| **Static** (Compile-time) | **Position** | `CoP` | Thống nhất về thứ tự vị trí truyền tham số. |
| **Static** (Compile-time) | **Algorithm**| `CoA` | Chia sẻ cùng một thuật toán triển khai đồng nhất. |
| **Dynamic** (Runtime) | **Execution** | `CoE` | Ràng buộc thứ tự thực thi giữa các phương thức hoặc tác vụ. |
| **Dynamic** (Runtime) | **Timing** | `CoTi`| Ràng buộc về thời điểm thực thi tác vụ. |
| **Dynamic** (Runtime) | **Value** | `CoV` | Giá trị giữa nhiều biến ràng buộc lẫn nhau. |
| **Dynamic** (Runtime) | **Identity** | `CoI` | Bắt buộc tham chiếu chính xác đến cùng một thực thể duy nhất trong bộ nhớ. |

### 2. Ba Thuộc tính Quản trị

- **Strength (Độ mạnh)**: Mức độ dễ hay khó khi tái cấu trúc mối nối. Các dạng Static Connascence luôn có độ mạnh yếu hơn Dynamic Connascence.
- **Locality (Tính vị trí)**: Khoảng cách giữa các thành phần. Khoảng cách càng xa (khác file, khác module, khác service), chi phí duy trì ràng buộc càng tăng vọt.
- **Degree (Mức độ tác động)**: Quy mô ảnh hưởng, đo lường số lượng thực thể bị tác động khi một thay đổi diễn ra.

### 3. Nguyên lý Jim Weirich

1. **Rule of Degree**: Chuyển đổi các dạng connascence có độ mạnh cao sang các dạng connascence yếu hơn bất cứ khi nào khả thi.
2. **Rule of Locality**: Khi khoảng cách giữa các phần tử tăng lên, bắt buộc phải hạ thấp độ mạnh của connascence tương ứng.

---

## Bảng Đối chiếu và Ma trận Đánh đổi

| Tiêu chí | Cohesion | Coupling | Connascence |
| :--- | :--- | :--- | :--- |
| **Phạm vi Đo lường** | Nội bộ một mô-đun (**Intra-module**) | Giữa các mô-đun (**Inter-module**) | Cả nội bộ và xuyên suốt ranh giới hệ thống |
| **Mục tiêu Tối ưu** | **High Cohesion** (Tối đa hóa mức độ gắn kết) | **Loose Coupling** (Giảm thiểu tối đa sự phụ thuộc) | Giảm thiểu **Strength** và **Degree**, tối ưu hóa **Locality** |
| **Công cụ Đo đạc** | LCOM, LCOM96B | $C_a$, $C_e$, Abstractness, Instability, Distance ($D$) | Phân tích mã tĩnh và kiểm soát cấu trúc phụ thuộc |
| **Tác động Kiến trúc** | Giúp mô-đun dễ hiểu, dễ kiểm thử và bảo trì độc lập. | Giúp hệ thống dễ thích ứng với thay đổi mà không lan truyền lỗi. | Cung cấp từ vựng phân loại chi tiết từng dạng liên kết cụ thể. |

---

[← Back to README](README.md)
