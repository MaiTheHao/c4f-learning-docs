# System Design & DevOps Learning Checklist

## 1. Software Architecture

### 1.1. Architecture Styles
Chủ đề	Nội dung cần hiểu
Architectural Drivers	Những yếu tố thúc đẩy lựa chọn kiến trúc
Quality Attributes	Các thuộc tính chất lượng
Architectural Constraints	Ràng buộc kỹ thuật, nghiệp vụ
Trade-off Analysis	Đánh đổi giữa các lựa chọn
Architectural Decisions	Quyết định kiến trúc và lý do
Architecture Evaluation	Đánh giá chất lượng kiến trúc
- Monolithic
- Modular Monolith
- Microservices

### 1.2. Architecture Patterns

- Layered Architecture
  - Presentation
  - Application
  - Domain
  - Infrastructure
- Clean Architecture
  - Dependency Rule
  - Ports & Adapters
- Hexagonal Architecture
  - Ports
  - Adapters

### 1.3. Architecture Documentation

- C4 Model
  - Context
  - Container
  - Component
  - Code

### 1.4. Communication Architecture

- Synchronous Communication
- Asynchronous Communication

## 2. Database Architecture

### 2.1. Database Paradigms

- Relational Database
- Non-relational Database

### 2.2. Database Architecture

- Database per Service
- Shared Database
- Cache Architecture
- Data Replication
- Read/Write Separation
- Data Partitioning

### 2.3. Data Consistency

- Data Consistency
- Eventual Consistency

### 2.4. Transaction & Concurrency Control

- ACID
- Isolation Levels
- Locking
- MVCC
- Deadlocks

## 3. Distributed Data Systems

### 3.1. Distributed Data Management

- Partitioning
- Sharding
- Replication
- Consistency
- CDC (Change Data Capture)

## 4. Security Architecture

### 4.1. Identity & Access Management

- Authentication
- Authorization
- OAuth 2.0
- OpenID Connect
- RBAC
- ABAC

### 4.2. Security Management

- Secret Management
- Encryption in Transit
- Encryption at Rest

### 4.3. API Security

- Rate Limiting
- API Security

## 5. DevOps & Infrastructure

### 5.1. CI/CD

- CI/CD

### 5.2. Infrastructure Management

- Infrastructure as Code (IaC)
- Configuration Management

### 5.3. Cloud Infrastructure

- Cloud Computing

### 5.4. Container Orchestration

- Kubernetes

### 5.5. Observability

- Observability
- Monitoring

Nghiên cứu thêm security gồm
HMAC

Nghiên cứu sâu hơn về các tính chất:

Tính bí mật | Confidentiality | Ngăn người không có quyền đọc dữ liệu
Tính toàn vẹn | Integrity | Phát hiện dữ liệu bị sửa đổi trái phép
Tính xác thực | Authentication | Xác minh nguồn gốc hoặc danh tính theo cơ chế xác thực
Tính không thể chối bỏ | Non-repudiation | Cung cấp bằng chứng để người thực hiện khó phủ nhận hành động
Tính sẵn sàng | Availability | Đảm bảo hệ thống và dữ liệu có thể truy cập khi cần
Tính mới | Freshness | Phát hiện thông điệp cũ bị phát lại hoặc sử dụng lại
Tính bí mật chuyển tiếp | Forward Secrecy | Lộ khóa dài hạn không làm lộ các phiên liên lạc trước đó
Tính ẩn danh | Anonymity | Che giấu danh tính của chủ thể
Tính không liên kết | Unlinkability | Ngăn liên kết nhiều hoạt động để xác định cùng một chủ thể
