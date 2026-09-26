# Interface Segregation Principle (ISP)

**Client không nên bị buộc phải phụ thuộc vào các interface mà nó không sử dụng.**

---

## Ví dụ

### Trường hợp sai

```java
public interface Worker {
    void work();
    void eat();
    void sleep();
}

public class HumanWorker implements Worker {
    public void work() {}
    public void eat() {}
    public void sleep() {}
}

public class RobotWorker implements Worker {
    public void work() {}
    public void eat() {} // không dùng
    public void sleep() {} // không dùng
}
```

### Trường hợp đúng

```java
public interface Workable { void work(); }
public interface Feedable { void eat(); }
public interface Sleepable { void sleep(); }

public class HumanWorker implements Workable, Feedable, Sleepable {
    public void work() {}
    public void eat() {}
    public void sleep() {}
}

public class RobotWorker implements Workable {
    public void work() {}
}
```

Ban đầu `Worker` định nghĩa `work()`, `eat()`, `sleep()`, và `HumanWorker` và `RobotWorker` triển khai. Nhưng `RobotWorker` lại không hề `eat()` hay `sleep()` dẫn đến việc thừa method không dùng tới (phụ thuộc không sử dụng).

Bằng cách tách từng action thành các interface, giờ đây `RobotWorker` chỉ cần implement action interface cụ thể, do đó không còn bị thừa các method (không phụ thuộc không sử dụng).

---

## Lợi ích

-   Tăng tính gắn kết.
-   Giảm phụ thuộc không cần thiết.
-   Dễ bảo trì và mở rộng.

---
[← Quay lại mục lục SOLID](README.md)
