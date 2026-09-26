# Single Responsibility Principle (SRP)

**Một lớp chỉ nên có một lý do để thay đổi, tức là nó chỉ nên có một trách nhiệm duy nhất.**

---

## Ví dụ

Cho class `UserManager`:

### Trường hợp sai

```java
public class UserManager {

    // 1. Quản lý thông tin người dùng trong database
    public void saveUserToDatabase(User user){...}

    // 2. Gửi email thông báo
    public void sendWelcomeEmail(User user){...}

    // 3. Ghi log hoạt động
    public void logActivity(String activity){...}

    // 4. Validate thông tin đầu vào
    public boolean validateUser(User user){...}
}
```

Với thiết kế như vầy, `UserManager` có **nhiều lý do để thay đổi**:

-   Sửa cách lưu user &rarr; Sửa `UserManager`.
-   Thay đổi dịch vụ mail &rarr; Sửa `UserManager`.
-   Sửa định dạng log &rarr; Sửa `UserManager`.
-   Sửa quy tắc validate &rarr; Sửa `UserManager`.

### Trường hợp đúng

Bằng cách tạo ra:

-   `UserRepository` loại bỏ `saveUserToDatabase`.
-   `EmailService` loại bỏ `sendWelcomeEmail`.
-   `LoggerService` loại bỏ `logActivity`.
-   `UserValidator` loại bỏ `validateUser`.

```java
public class UserManager {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final LoggerService loggerService;
    private final UserValidator userValidator;

    // Dependency Injection thông qua constructor
    public UserManager(UserRepository userRepository, 
                       EmailService emailService, 
                       LoggerService loggerService, 
                       UserValidator userValidator) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.loggerService = loggerService;
        this.userValidator = userValidator;
    }

    public void registerUser(User user) {...}
}
```

---

## Lợi ích

-   **Dễ bảo trì và thay đổi**: Nếu muốn đổi cách gửi email, chỉ cần sửa lớp EmailService mà không ảnh hưởng đến các lớp khác.
-   **Dễ kiểm thử**: Có thể kiểm thử từng chức năng một cách độc lập.
-   **Dễ tái sử dụng**: Có thể dùng lại lớp EmailService hay LoggerService ở những nơi khác trong ứng dụng.
-   **Code rõ ràng, dễ hiểu**: Mỗi lớp có một mục đích duy nhất, giúp lập trình viên mới dễ dàng nắm bắt luồng hoạt động của chương trình.

---

## Liên quan

*   [Builder Pattern](../creational/builder.md) — Builder là ví dụ điển hình của **Single Responsibility** ở tầng tạo đối tượng: tách trách nhiệm "biết cách lắp ghép các bước" (Builder/Director) ra khỏi chính đối tượng kết quả (Product).

---
[← Quay lại mục lục SOLID](README.md)
