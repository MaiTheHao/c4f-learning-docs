# Java Generics

## Table of Contents

- [1. Động lực và Ý tưởng Cốt lõi](#1-động-lực-và-ý-tưởng-cốt-lõi)
- [2. Type Parameter và Type Argument](#2-type-parameter-và-type-argument)
- [3. Generic Class và Diamond Operator](#3-generic-class-và-diamond-operator)
- [4. Generic Method](#4-generic-method)
- [5. Bounded Type Parameter](#5-bounded-type-parameter)
- [6. Wildcard và Nguyên tắc PECS](#6-wildcard-và-nguyên-tắc-pecs)
- [7. Raw Type và Cảnh báo Unchecked](#7-raw-type-và-cảnh-báo-unchecked)
- [8. Type Erasure](#8-type-erasure)
- [9. Tổng kết và Trade-off](#9-tổng-kết-và-trade-off)

---

## 1. Động lực và Ý tưởng Cốt lõi

Trước khi generics ra đời, các **Collection** trong Java lưu trữ mọi phần tử dưới dạng `Object`. Lập trình viên buộc phải **cast** thủ công mỗi khi lấy dữ liệu ra, và vì kiểu thực sự chỉ được kiểm tra tại **runtime**, một sai lệch kiểu (ví dụ bỏ nhầm `String` vào danh sách vốn chỉ chứa số) chỉ lộ ra dưới dạng `ClassCastException` đúng vào lúc hệ thống đang chạy, chứ không phải lúc biên dịch.

Generics ra đời để kéo việc **type checking** từ runtime về **compile-time**. Thay vì để mọi collection dùng chung một kiểu `Object` mơ hồ, ta khai báo chính xác kiểu dữ liệu mà nó chứa ngay trong cú pháp: `List<String>` nói rõ danh sách này chỉ chứa `String`. Khi đó, thêm sai kiểu trở thành lỗi biên dịch, và lấy dữ liệu ra không còn cần cast thủ công.

Điểm mấu chốt: kiểu cụ thể được ghi thẳng vào khai báo, và compiler là bên kiểm tra thay ta ngay từ lúc build, chứ không đợi tới khi chương trình chạy.

> [!NOTE]
> Generics mang lại hai giá trị song hành: **type safety** giúp chặn lỗi kiểu ngay tại compile-time, còn **code reusability** cho phép dùng chung một class cho nhiều kiểu dữ liệu mà không cần viết lại.

---

## 2. Type Parameter và Type Argument

Hai khái niệm này thường bị dùng lẫn, nhưng khác nhau đúng như **tham số** và **đối số**:

- **Type parameter** là *tham số* kiểu (biến kiểu được khai báo). Trong `Foo<T>`, `T` là type parameter.
- **Type argument** là *đối số* kiểu (kiểu cụ thể được truyền vào khi sử dụng). Trong `Foo<String> f`, `String` là type argument.

Khi lập trình, ta cung cấp type argument để tạo ra một **parameterized type**.

Theo quy ước, type parameter dùng các chữ cái đơn, viết hoa. Bảng dưới đây liệt kê các ký hiệu phổ biến trong Java SE API:

| Ký hiệu | Ý nghĩa | Ngữ cảnh tiêu biểu |
| :--- | :--- | :--- |
| `T` | Type | Kiểu dữ liệu, không mang ngữ nghĩa đặc thù |
| `E` | Element | Phần tử, dùng nhiều trong Java Collections Framework |
| `K` | Key | Khóa của một map |
| `V` | Value | Giá trị của một map |
| `N` | Number | Kiểu số |
| `S`, `U`, `V` | 2nd, 3rd, 4th | Các kiểu bổ sung khi cần nhiều hơn một type parameter |

---

## 3. Generic Class và Diamond Operator

Một **generic class** khai báo type parameter ngay sau tên class. Dưới đây là một generic class đơn giản, có thể chứa bất kỳ kiểu nào:

```java
public class Box<T> {
    private T content;

    public void set(T content) {
        this.content = content;
    }

    public T get() {
        return content;
    }
}
```

`Box<T>` chỉ là khai báo generic; ta tạo ra kiểu cụ thể bằng cách cung cấp type argument như `Box<Integer>` hay `Box<String>`. Một generic class cũng có thể có nhiều type parameter, chẳng hạn `OrderedPair<K, V>` biểu diễn một cặp khóa và giá trị.

Khi type argument đã suy ra được từ ngữ cảnh, ta thay thế chúng bằng cặp ngoặc rỗng `<>`. Cú pháp này ra mắt từ Java 7 và được gọi là **diamond operator**:

```java
Box<Integer> integerBox = new Box<>();
```

Type argument còn có thể lồng nhau để tạo cấu trúc phức tạp. Ví dụ, một cặp mà khóa là `String` còn giá trị là một `Box` chứa `Integer` được viết là `OrderedPair<String, Box<Integer>>`.

---

## 4. Generic Method

Một **generic method** giới thiệu type parameter của riêng nó, tách biệt với type parameter của class chứa nó. Phạm vi của type parameter này chỉ giới hạn trong thân method. Generic method có thể là `static` hoặc instance, và cả constructor cũng có thể generic.

Cú pháp: danh sách type parameter nằm trong cặp ngoặc nhọn, đặt **trước** kiểu trả về. Ví dụ một method so sánh hai cặp bất kỳ:

```java
public class Util {
    public static <K, V> boolean compare(Pair<K, V> p1, Pair<K, V> p2) {
        return p1.getKey().equals(p2.getKey())
            && p1.getValue().equals(p2.getValue());
    }
}
```

Ở hầu hết trường hợp, compiler tự **type inference** (suy ra type argument từ tham số truyền vào) nên ta không cần viết tường minh:

```java
Pair<Integer, String> p1 = new Pair<>(1, "apple");
Pair<Integer, String> p2 = new Pair<>(2, "pear");
boolean same = Util.compare(p1, p2);
```

Khi cần chỉ định tường minh (gọi là **type witness**), ta đặt type argument ngay trước tên method: `Util.<Integer, String>compare(p1, p2)`.

---

## 5. Bounded Type Parameter

Đôi khi ta muốn giới hạn tập kiểu được phép truyền vào. Ví dụ, một method chỉ nên nhận các kiểu số để gọi được phép toán số học. **Bounded type parameter** giải quyết việc này bằng cách gắn một **bound** lên type parameter:

```java
public static <T extends Number> double sum(T a, T b) {
    return a.doubleValue() + b.doubleValue();
}
```

Từ khóa `extends` ở đây mang nghĩa tổng quát: nó bao gồm cả `extends` (với class) lẫn `implements` (với interface). Vì vậy `T extends Number` chấp nhận mọi kiểu là `Number` hoặc con của nó.

Khi một type parameter cần thỏa nhiều ràng buộc, ta nối chúng bằng `&` (đây gọi là **multiple bounds**). Lưu ý thứ tự bắt buộc: class phải đứng trước, interface theo sau.

```java
class D<T extends A & B & C> { /* ... */ }
```

---

## 6. Wildcard và Nguyên tắc PECS

**Wildcard** (ký hiệu `?`) đại diện cho một kiểu chưa biết. Nó dùng khi ta muốn viết code tổng quát cho cả một *họ* kiểu mà không cần biết kiểu cụ thể bên trong:

- **Upper bounded wildcard** `? extends T`: chấp nhận `T` hoặc bất kỳ subtype nào của `T`. Dùng để *đọc* dữ liệu ra khỏi cấu trúc.
- **Lower bounded wildcard** `? super T`: chấp nhận `T` hoặc bất kỳ supertype nào của `T`. Dùng để *ghi* dữ liệu vào cấu trúc.

Nguyên tắc **PECS** (**P**roducer **E**xtends, **C**onsumer **S**uper) tóm gọn quy tắc chọn wildcard dựa trên vai trò của tham số:

| Vai trò của tham số | Wildcard | Trực giác |
| :--- | :--- | :--- |
| **Producer** | `? extends T` | Bạn lấy dữ liệu *từ* cấu trúc để dùng |
| **Consumer** | `? super T` | Bạn bỏ dữ liệu *vào* cấu trúc |

Hai ví dụ dưới đây minh họa đúng vai trò của mỗi loại wildcard: một method chỉ đọc phần tử ra để tính tổng, và một method chỉ ghi phần tử vào.

```java
// Producer: chỉ đọc phần tử ra để tính tổng
double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}

// Consumer: chỉ ghi phần tử vào
void addIntegers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}
```

Một điểm tinh tế cần nhớ: wildcard không quyết định erasure của kiểu bao ngoài. Cụ thể, `List<? super Integer>` về bản chất vẫn là `List`; chi tiết này sẽ rõ hơn ở phần type erasure.

---

## 7. Raw Type và Cảnh báo Unchecked

**Raw type** là tên của một generic class hoặc interface được dùng *không kèm* type argument. Với `Box<T>`, kiểu raw chính là `Box`:

```java
Box rawBox = new Box(); // rawBox có raw type là Box
```

Raw type tồn tại chủ yếu vì lý do tương thích ngược với code viết trước khi generics ra đời. Khi dùng raw type, ta quay lại hành vi thời tiền-generics: `Box` chỉ đưa ra `Object`, và toàn bộ lợi ích type safety bị mất.

Từ đó phát sinh các cảnh báo **unchecked**. "Unchecked" nghĩa là compiler *không có đủ thông tin kiểu* để thực hiện mọi kiểm tra cần thiết nhằm bảo đảm type safety. Đoạn mã dưới đây minh họa hai tình huống thường gặp:

```java
Box<String> stringBox = new Box<>();
Box rawBox = stringBox;            // OK, gán từ kiểu có tham số sang raw type

Box<Integer> intBox = rawBox;      // warning: unchecked conversion
rawBox.set(8);                     // warning: unchecked invocation to set(T)
```

> [!WARNING]
> Raw type làm mất gần như toàn bộ giá trị của generics. Chỉ nên dùng khi buộc phải giao tiếp với API cũ chưa được generic hóa; trong mọi trường hợp còn lại, hãy luôn cung cấp type argument.

---

## 8. Type Erasure

Tại runtime, Java **không** giữ lại thông tin type argument. Để tương thích ngược và tránh sinh thêm class cho mỗi parameterized type, compiler áp dụng **type erasure**: nó xóa type parameter và thay bằng **erasure** của chúng (tức bound đầu tiên, hoặc `Object` nếu không có bound).

Erasure của generic class và interface được minh họa như sau:

| Trước erasure | Sau erasure |
| :--- | :--- |
| `class Box<T>` | `class Box` |
| `T value` | `Object value` |
| `T extends Number` | `Number` |
| `List<String>` | `List` |
| `List<? extends Number>` | `List` |
| `List<? super Integer>` | `List` |

Type parameter khai báo bởi method cũng bị xóa theo cùng cơ chế:

| Trước erasure | Sau erasure |
| :--- | :--- |
| `<T> void print(T x)` | `void print(Object x)` |
| `<T extends Number> void print(T x)` | `void print(Number x)` |
| `<T> T get(T x)` | `Object get(Object x)` |
| `<T extends Number> T get(T x)` | `Number get(Number x)` |

Toàn bộ quá trình gồm ba thao tác chính mà compiler thực hiện:

1. **Type erasure:** thay type parameter bằng bound đầu tiên, hoặc `Object` nếu unbounded.
2. **Type casts:** chèn cast ở những chỗ cần thiết để giữ type safety.
3. **Bridge methods:** sinh thêm method cầu nối khi cần, nhằm bảo toàn tính đa hình sau khi erasure.

Một vài phân biệt quan trọng dễ bị bỏ sót:

- `T extends Number` là type parameter với upper bound, nên erasure của nó là `Number`.
- `? super Integer` là lower-bounded wildcard; nó **không** quyết định erasure của kiểu bao ngoài. Vì vậy `List<? super Integer>` vẫn erases thành `List`.
- Các kiểu thông thường như `String`, `Number` hay `int` không hề biến thành `Object`.

> [!IMPORTANT]
> Generics là công cụ thuần **compile-time**. Thông tin kiểu bị xóa gần như hoàn toàn khỏi kiểu runtime, nhưng Java vẫn dùng nó để kiểm tra kiểu trước khi mã được chạy. Hệ quả là `List<String>` và `List<Integer>` thực chất là **cùng một class** tại runtime; không thể dùng primitive type trong generic (`List<int>` là lỗi, phải dùng `List<Integer>`), không tạo được instance của type parameter, và không kiểm tra được kiểu generic bằng `instanceof`.

---

## 9. Tổng kết và Trade-off

Bảng dưới đây tổng hợp các khía cạnh cốt lõi của generics cùng đánh đổi đi kèm:

| Khía cạnh | Lợi ích | Giới hạn |
| :--- | :--- | :--- |
| **Type safety** | Bắt lỗi sai kiểu ngay tại compile-time | Không kiểm tra được kiểu generic tại runtime |
| **Readability** | Loại bỏ cast thủ công; ý định kiểu hiện rõ trong chữ ký | Chữ ký method phức tạp hơn khi lạm dụng wildcard |
| **Reusability** | Dùng chung một class cho nhiều kiểu dữ liệu | Không dùng được với primitive type |
| **Runtime** | Tương thích ngược nhờ erasure | Mất thông tin kiểu; không tạo được instance của type parameter |

Generics là một công cụ thiên về compile-time: giá trị lớn nhất của nó là chuyển lỗi kiểu từ runtime về thời điểm biên dịch, đổi lại là những giới hạn nhất định tại runtime do cơ chế erasure. Nắm rõ ranh giới này giúp chọn đúng khi nào dùng bounded type parameter, khi nào dùng wildcard theo nguyên tắc PECS, và vì sao đôi khi buộc phải chấp nhận raw type để giao tiếp với API cũ.

---

[← Back to README](README.md)
