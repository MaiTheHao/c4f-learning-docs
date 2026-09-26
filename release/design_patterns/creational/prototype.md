# Prototype Pattern

Prototype là mẫu thiết kế cho phép tạo đối tượng mới bằng cách **sao chép (clone)** từ một đối tượng mẫu (prototype) thay vì khởi tạo trực tiếp.

## Phân tích cấu trúc

-   **Prototype**: Interface hoặc abstract class khai báo phương thức clone.
-   **Concrete Prototype**: Các lớp triển khai phương thức clone để tạo bản sao của chính nó.
-   **Client**: Sử dụng prototype để tạo đối tượng mới mà không cần biết chi tiết khởi tạo.

## Ví dụ code

```java
// Prototype
public abstract class Animal implements Cloneable {
    public abstract Animal clone();
}

// Concrete Prototype
public class Dog extends Animal {
    private String name;
    public Dog(String name) { this.name = name; }

    @Override
    public Dog clone() {
        return new Dog(this.name);
    }

    public void bark() {... }
}
```

## Ưu và nhược điểm

### Ưu điểm

-   Tạo đối tượng phức tạp nhanh chóng và tiết kiệm chi phí.
-   Giảm phụ thuộc vào class khởi tạo.

### Nhược điểm

-   Cần đảm bảo clone đúng (deep/shallow copy).
-   Có thể phức tạp khi đối tượng có nhiều tham chiếu lồng nhau.

---
[← Quay lại mục lục Creational](README.md)
