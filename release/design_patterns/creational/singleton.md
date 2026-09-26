# Singleton Pattern

Singleton là mẫu thiết kế đảm bảo chỉ có một instance duy nhất của một class trong toàn bộ ứng dụng.

## Cách triển khai cơ bản

### 1. Lazy Singleton

Instance chỉ được tạo khi gọi `getInstance()`.

```java
public class App {
    private static App instance;
    private App() {}
    public static App getInstance() {
        if (instance == null) {
            instance = new App();
        }
        return instance;
    }
}
```

-   **Ưu điểm:** Tiết kiệm tài nguyên
-   **Nhược điểm:** Cần xử lý đồng bộ nếu dùng đa luồng.

### 2. Eager Singleton

Instance được tạo ngay khi class được load.

```java
public class App {
    private static final App instance = new App();
    private App() {}
    public static App getInstance() {
        return instance;
    }
}
```

-   **Ưu điểm:** Đơn giản, thread-safe
-   **Nhược điểm:** Có thể lãng phí tài nguyên nếu không dùng đến instance.

## Triển khai đa luồng

-   **Double Check Locking**: Đảm bảo chỉ tạo một instance trong môi trường đa luồng.

```java
public static App getInstance() {
    if (instance == null) {
        synchronized (App.class) {
            if (instance == null) {
                instance = new App();
            }
        }
    }
    return instance;
}
```

-   **Synchronized Method**: Đơn giản nhưng hiệu suất thấp.

```java
public static synchronized App getInstance() {
    if (instance == null) {
        instance = new App();
    }
    return instance;
}
```

## Ưu và nhược điểm

### Ưu điểm

-   Đảm bảo chỉ có một instance duy nhất, giúp tiết kiệm tài nguyên.
-   Cung cấp một điểm truy cập toàn cục cho instance.

### Nhược điểm

-   Khó kiểm thử (Unit Test) vì không thể mock instance.
-   Có thể gây tight coupling và giảm linh hoạt.
-   Phụ thuộc không rõ ràng: Các phần khác nhau của mã có thể phụ thuộc vào singleton mà không thể hiện rõ ràng trong cấu trúc code.
-   Vấn đề với biến tĩnh và bộ nạp lớp: Singleton có thể không thực sự duy nhất nếu ứng dụng sử dụng nhiều class loader (ví dụ: trong môi trường web).
-   Trạng thái toàn cục có thể thay đổi: Singleton có trạng thái toàn cục dễ bị thay đổi, dẫn đến lỗi khó kiểm soát và bảo trì.

---
[← Quay lại mục lục Creational](README.md)
