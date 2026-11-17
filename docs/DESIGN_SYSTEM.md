# DESIGN_SYSTEM.md
Quy ước thiết kế và frontend cho hệ thống Web CRM Kết nối Sinh viên – Doanh nghiệp (Cổng Việc làm AGU).

- **Phiên bản:** 1.0 (bản đề xuất, chờ duyệt các mục đánh dấu **[Chờ duyệt]**)
- **Phạm vi:** toàn bộ giao diện React của 4 actor: Sinh viên, Doanh nghiệp, Cán bộ Career Center, Quản trị hệ thống.
- **Nguyên tắc:** file này là nguồn duy nhất cho màu sắc, font, khoảng cách, bo góc, responsive và quy ước code. Không hard-code giá trị ngoài các token định nghĩa ở đây.

---

## 1. Công nghệ nền tảng

| Hạng mục | Lựa chọn | Ghi chú |
| :-- | :-- | :-- |
| UI framework | React 18+ với TypeScript (strict) | |
| Styling | Tailwind CSS, màu lấy từ CSS variables | Xem mục 3.4 |
| Routing | React Router | Lazy load theo route |
| Dữ liệu từ server | TanStack Query | Mọi cache và trạng thái tải đi qua đây |
| Form | React Hook Form + Zod | Schema Zod dùng chung cho validate |
| Icon | Lucide React | **[Chờ duyệt]** |
| Gộp class | `clsx` + `tailwind-merge` | Hàm `cn()` trong `shared/lib/cn.ts` |
| Biến thể component | `class-variance-authority` (cva) | Dùng cho Button, Badge, Alert |

---

## 2. Font chữ

| Vai trò | Font | Nguồn | Lý do |
| :-- | :-- | :-- | :-- |
| Giao diện, tiêu đề, nội dung | **Be Vietnam Pro** | Google Fonts | Thiết kế cho tiếng Việt, đủ dấu, dễ nhìn ở cỡ nhỏ |
| Mã số, mã hash, số liệu bảng | **JetBrains Mono** | Google Fonts | Phân biệt rõ 0/O, 1/l/I trong MSSV và mã hash |

- Tải font bằng một thẻ `<link>` trong `index.html` với `display=swap`. Không tự host file font trừ khi có yêu cầu bảo mật riêng.
- Font fallback: `"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif`. Mono: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`.
- Trước khi chốt, kiểm tra hiển thị đủ dấu với chuỗi thử: `ắ ặ ẳ ẵ ấ ầ ẩ ẫ ậ ệ ể ễ ồ ổ ỗ ộ ớ ờ ở ỡ ợ ừ ử ữ ự đ Đ`.

### 2.1 Thang cỡ chữ

| Token | Cỡ / line-height | Trọng số | Dùng cho |
| :-- | :-- | :-- | :-- |
| `display` | 40 / 48 | 800 | Hero trang chủ |
| `h1` | 32 / 40 | 800 | Tiêu đề trang |
| `h2` | 26 / 34 | 700 | Tiêu đề khu vực |
| `h3` | 20 / 28 | 700 | Tiêu đề thẻ, panel |
| `body-lg` | 17 / 26 | 400 | Đoạn giới thiệu |
| `body` | 16 / 24 | 400 | Nội dung mặc định |
| `small` | 14 / 20 | 500 | Nhãn form, mô tả phụ |
| `caption` | 12 / 16 | 600 | Nhãn trạng thái, chú thích, uppercase có letter-spacing 0.04em |
| `mono` | 14 / 20 | 500 | MSSV, mã hash, số đếm trong bảng |

- Chỉ dùng đúng các cỡ trên. Không tự thêm cỡ mới.
- Số liệu trong bảng và KPI dùng `font-variant-numeric: tabular-nums`.
- Độ dài dòng đọc: khoảng 65 ký tự, dùng `max-w-prose` cho đoạn văn.
- Tiêu đề dùng `text-wrap: balance`.

---

## 3. Màu sắc

### 3.1 Bảng màu thương hiệu (theme sáng)

**Màu chủ đạo: `#1D4E5F`** (token `brand`). Các bậc còn lại là đề xuất cùng họ màu.

| Token | Mã | Dùng cho |
| :-- | :-- | :-- |
| `brand-50` | `#EEF5F6` | Nền nhấn nhẹ, hover của mục menu |
| `brand-100` | `#D5E5E9` | Nền badge thông tin, chọn trong danh sách |
| `brand-200` | `#B2CDD5` | Viền nhấn |
| `brand-300` | `#8FB5BF` | Icon phụ |
| `brand-400` | `#5C8E9C` | Viền focus phụ, biểu đồ |
| `brand-500` | `#3A7383` | Trạng thái hover của link |
| `brand-600` | `#1D4E5F` | **Màu chủ đạo**: nút chính, link, thanh điều hướng đang chọn |
| `brand-700` | `#163C4A` | Hover nút chính |
| `brand-800` | `#10303C` | Nhấn mạnh nền tối |
| `brand-900` | `#0F3340` | Footer, nền sidebar |

### 3.2 Màu phụ (nhóm đất nung, theo chủ đạo teal)

| Họ | Token | Mã | Vai trò |
| :-- | :-- | :-- | :-- |
| **Clay** (đất nung) | `clay-600` | `#A65A3E` | Nút phụ, điểm nhấn CTA thứ hai, nhãn "Quan trọng" |
| | `clay-100` | `#F2E0D6` | Nền badge, nền cảnh báo nhẹ |
| | `clay-ink` | `#7A3E27` | Chữ trên nền clay-100 |
| **Sand** (cát) | `sand` | `#D6A964` | Điểm nhấn nhỏ, huy hiệu nổi bật, đường kẻ trang trí |
| | `sand-100` | `#F4E8D2` | Nền cảnh báo, trạng thái "chờ" |
| | `sand-ink` | `#6B4A1C` | Chữ trên nền sand-100 |
| **Sage** (xanh sage) | `sage` | `#7FA58A` | Biểu tượng thành công, biểu đồ |
| | `sage-100` | `#DFEBE1` | Nền trạng thái thành công |
| | `sage-ink` | `#2F5E42` | Chữ trên nền sage-100 |
| **Mist** (xám xanh) | `mist-100` | `#DCE7ED` | Nền trạng thái thông tin, thẻ doanh nghiệp |
| | `mist-ink` | `#2F5870` | Chữ trên nền mist-100 |
| **Mauve** (tím xám) | `mauve-100` | `#E9E2E8` | Nền thẻ cán bộ, trạng thái phụ |
| | `mauve-ink` | `#5A4560` | Chữ trên nền mauve-100 |

Quy tắc dùng: mỗi màu phụ chỉ mang một nghĩa nhóm trong giao diện. Không dùng clay cho lỗi, vì clay là màu thương hiệu. Lỗi dùng màu `danger` riêng ở mục 5.

### 3.3 Trung tính (theme sáng)

| Token | Mã | Dùng cho |
| :-- | :-- | :-- |
| `canvas` | `#F6F5F1` | Nền trang |
| `surface` | `#FFFFFF` | Thẻ, modal, ô nhập |
| `subtle` | `#EFEDE6` | Nền bảng, nền thẻ phụ, skeleton |
| `line` | `#E4E0D6` | Viền mặc định |
| `line-strong` | `#CBC6B8` | Viền ô nhập, viền khi hover |
| `ink` | `#1E2321` | Chữ chính |
| `ink-2` | `#56605B` | Chữ phụ, mô tả |
| `ink-3` | `#7D867F` | Placeholder, chú thích (chỉ dùng cho nội dung không thiết yếu) |
| `focus` | `#2F7F95` | Viền focus, luôn hiển thị khi dùng bàn phím |

Độ tương phản: chữ `ink-3` trên `surface` đạt khoảng 4.0:1, nên chỉ dùng cho placeholder và chú thích. Nội dung cần đọc dùng `ink` hoặc `ink-2` (đạt từ 4.5:1 trở lên).

### 3.4 Gắn token vào Tailwind

Định nghĩa biến trên `:root` (theme sáng) trong `styles/tokens.css`, sau đó map trong `tailwind.config`:

```css
/* styles/tokens.css */
:root {
  --c-brand-600: #1D4E5F;
  --c-canvas: #F6F5F1;
  --c-surface: #FFFFFF;
  --c-ink: #1E2321;
  /* ... toàn bộ token của mục 3 */
  color-scheme: light;
}
```

```js
// tailwind.config.js (phần colors)
colors: {
  brand: {
    50: 'var(--c-brand-50)',
    600: 'var(--c-brand-600)',
    /* ... */
  },
  canvas: 'var(--c-canvas)',
  surface: 'var(--c-surface)',
  ink: { DEFAULT: 'var(--c-ink)', 2: 'var(--c-ink-2)', 3: 'var(--c-ink-3)' },
  // ...
}
```

Component chỉ dùng class ngữ nghĩa (`bg-surface`, `text-ink-2`, `border-line`). Không dùng `bg-[#...]` hay `text-blue-600` trong code nghiệp vụ.

### 3.5 Theme tối (đề xuất)

Theme tối áp dụng qua `data-theme="dark"` trên `<html>`, hoặc theo `prefers-color-scheme` khi người dùng chọn "theo hệ thống". Các token dưới đây giữ nguyên tên, chỉ đổi giá trị.

| Token | Sáng | Tối | Ghi chú |
| :-- | :-- | :-- | :-- |
| `canvas` | `#F6F5F1` | `#0C1619` | Nền xanh navy rất tối, khớp hướng teal |
| `surface` | `#FFFFFF` | `#14222A` | |
| `subtle` | `#EFEDE6` | `#1A2B33` | |
| `line` | `#E4E0D6` | `#263A43` | |
| `line-strong` | `#CBC6B8` | `#3A4F59` | |
| `ink` | `#1E2321` | `#E8EEEC` | |
| `ink-2` | `#56605B` | `#A9B8B4` | |
| `ink-3` | `#7D867F` | `#7F918D` | |
| `brand-600` (nút chính) | `#1D4E5F` | `#2F6F84` | Nền nút trên tối, chữ trắng đạt tương phản |
| `brand-text` (link) | `#1D4E5F` | `#8CC2D2` | Link trên nền tối cần sáng hơn |
| `focus` | `#2F7F95` | `#7CC4D9` | |
| `clay-600` / `clay-ink` | `#A65A3E` / `#7A3E27` | `#D98E6E` / `#F2E0D6` | Chữ dùng clay-ink tối, không dùng nền clay đậm |
| `clay-100` (nền) | `#F2E0D6` | `#3A2820` | |
| `sand` / `sand-ink` | `#D6A964` / `#6B4A1C` | `#E0B878` / `#F4E8D2` | |
| `sand-100` (nền) | `#F4E8D2` | `#3A2F1C` | |
| `sage` / `sage-ink` | `#7FA58A` / `#2F5E42` | `#9CC4A8` / `#DFEBE1` | |
| `sage-100` (nền) | `#DFEBE1` | `#1F3328` | |
| `mist-ink` / `mist-100` | `#2F5870` / `#DCE7ED` | `#8FB3C6` / `#1C2D36` | |
| `mauve-ink` / `mauve-100` | `#5A4560` / `#E9E2E8` | `#B9A3C0` / `#2E2632` | |

Quy tắc khi làm theme tối:
- Không đảo ngược màu một cách máy móc. Nền tối dùng bậc màu sáng hơn cho chữ và viền.
- Bóng đổ gần như không nhìn thấy trên nền tối. Thay bằng viền `line` và độ sáng khác nhau của `surface`.
- Ảnh logo và ảnh minh họa có nền trắng cần một nền `surface` riêng hoặc viền mỏng.
- Kiểm tra cả hai theme trước khi merge: mọi màu chữ trên nền phải đạt tối thiểu 4.5:1 với nội dung thường và 3:1 với chữ lớn.

### 3.6 Màu ngữ nghĩa (semantic)

| Trạng thái | Nền | Chữ / icon | Viền (tối) |
| :-- | :-- | :-- | :-- |
| `success` | `#DFEBE1` | `#2F5E42` | `#7FA58A` |
| `warning` | `#F4E8D2` | `#6B4A1C` | `#D6A964` |
| `danger` | `#FBE7E4` | `#A3281C` | `#D9574A` |
| `info` | `#DCE7ED` | `#2F5870` | `#5C8E9C` |
| `neutral` | `#EFEDE6` | `#56605B` | `#CBC6B8` |

Theme tối tương ứng: `danger` nền `#3A1F1C`, chữ `#F08A7E`. Các cặp còn lại lấy từ mục 3.5.

### 3.7 Màu trạng thái nghiệp vụ

Dùng cho badge, cột Kanban, timeline. Luôn kèm **chữ** hoặc **icon**, không chỉ dựa vào màu.

**Đơn ứng tuyển (`applications.current_status`):**

| Trạng thái | Màu | Nhãn tiếng Việt |
| :-- | :-- | :-- |
| `APPLIED` | info (mist) | Đã nộp |
| `REVIEWING` | warning (sand) | Đang xem xét |
| `SHORTLISTED` | brand (brand-100) | Vào vòng sàng lọc |
| `INTERVIEW` | brand-600 (chữ trắng) | Phỏng vấn |
| `OFFER` | clay (clay-600) | Nhận đề nghị |
| `HIRED` | success | Trúng tuyển |
| `REJECTED` | danger | Không đạt |
| `WITHDRAWN` | neutral | Đã rút |

**Doanh nghiệp (`companies.verification_status`):** `PENDING` → warning "Chờ thẩm định"; `APPROVED` → success "Đã xác thực"; `REJECTED` → danger "Bị từ chối"; `SUSPENDED` → neutral "Tạm ngừng".

**Tin tuyển dụng (`jobs.status`):** `DRAFT` → neutral "Bản nháp"; `PENDING_APPROVAL` → warning "Chờ duyệt"; `PUBLISHED` → success "Đang tuyển"; `REJECTED` → danger "Bị từ chối"; `CLOSED` → neutral "Đã đóng".

**Nhiệm vụ CRM (`crm_follow_ups.status`):** `TODO` → info; `IN_PROGRESS` → brand; `DONE` → success; `CANCELLED` → neutral; `OVERDUE` (tính động) → danger, có icon cảnh báo.

**Tài khoản (`users.status`):** `ACTIVE` → không hiển thị badge; `LOCKED` → danger "Đã khóa"; `INACTIVE` → neutral "Ngừng hoạt động".

---

## 4. Khoảng cách, bo góc, bóng, chuyển động

### 4.1 Khoảng cách
Lưới cơ sở 4px. Các bậc dùng: `1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `10=40`, `12=48`, `16=64`, `20=80` (px).

- Khoảng giữa các phần tử cùng nhóm: `2` hoặc `3`.
- Khoảng giữa các khối trong một trang: `6` (mobile) đến `8` (desktop).
- Khoảng giữa các section lớn: `12` đến `16`.
- Dùng `gap` của flex và grid thay cho `margin` giữa các phần tử anh em.

### 4.2 Bo góc
Chọn mức bo "hơi tròn": đủ mềm để không khô cứng, nhưng không quá tròn đến mức làm các khối trông bánh bèo.

| Token | Giá trị | Dùng cho |
| :-- | :-- | :-- |
| `radius-xs` | 6px | Chip nhỏ, checkbox |
| `radius-input` | 12px | Ô nhập, select, textarea |
| `radius-button` | 14px | Nút (tất cả biến thể) |
| `radius-card` | 18px | Thẻ, hàng trong danh sách lớn |
| `radius-panel` | 24px | Modal, panel, khung trang đăng nhập |
| `radius-pill` | 999px | Chỉ dùng cho badge trạng thái và avatar |

Quy tắc: thẻ lồng trong thẻ dùng bo nhỏ hơn một bậc so với thẻ ngoài. Không bo góc khác nhau trong cùng một cụm.

### 4.3 Bóng đổ (theme sáng)

| Token | Giá trị | Dùng cho |
| :-- | :-- | :-- |
| `shadow-sm` | `0 1px 2px rgba(15,51,64,0.06)` | Thẻ tĩnh |
| `shadow-md` | `0 8px 20px -12px rgba(15,51,64,0.35)` | Thẻ khi hover, dropdown |
| `shadow-lg` | `0 24px 48px -24px rgba(15,51,64,0.45)` | Modal, toast |

Theme tối: thay bằng viền `line`, không dùng bóng.

### 4.4 Chuyển động
- Thời lượng: `150ms` cho hover và focus, `200–250ms` cho mở đóng dropdown, `300ms` cho modal và drawer.
- Easing: `cubic-bezier(0.2, 0.7, 0.2, 1)` cho mọi chuyển động.
- Chỉ animate `transform` và `opacity`. Không animate `width`, `height`, `top`, `left`.
- Bắt buộc có `@media (prefers-reduced-motion: reduce)` để tắt chuyển động.

---

## 5. Responsive

### 5.1 Điểm ngắt

| Thiết bị | Điều kiện | Tailwind |
| :-- | :-- | :-- |
| Mobile | `< 768px` | mặc định (không prefix) |
| Tablet | `768px – 1024px` | `md:` (768px) và `max-desktop:` |
| Desktop | `> 1024px` | `desktop:` (từ 1025px) |

Cấu hình trong Tailwind:

```js
screens: {
  md: '768px',        // tablet trở lên
  desktop: '1025px',  // desktop: lớn hơn 1024px
}
```

Lưu ý: không dùng `lg:` mặc định của Tailwind (1024px), vì nó bao gồm cả 1024px và làm lệch quy ước của dự án.

Thiết kế theo thứ tự **mobile trước**: viết style cơ bản cho mobile, sau đó thêm `md:` cho tablet và `desktop:` cho desktop.

### 5.2 Lưới và container

| Thiết bị | Cột | Lề hai bên | Max-width nội dung |
| :-- | :-- | :-- | :-- |
| Mobile | 4 cột | 16px | 100% |
| Tablet | 8 cột | 24px | 100% (sidebar dạng rail) |
| Desktop | 12 cột | 32px | 1200px, căn giữa |

Lề phải dùng `padding-inline: max(16px, env(safe-area-inset-left, 0px))` và tương tự bên phải, đúng quy ước safe-area của nền tảng hiển thị.

### 5.3 Bố cục theo thiết bị

**Mobile (`< 768px`)**
- Điều hướng: thanh dưới cố định với tối đa 4 mục chính theo vai trò. Mục còn lại vào menu "Thêm".
- Header: chỉ có tiêu đề trang, nút quay lại và một hành động chính.
- Sidebar: không hiển thị. Mở bằng drawer từ trái khi cần.
- Modal: chuyển thành sheet toàn màn hình, nút đóng ở góc trên bên phải.
- Bảng: chuyển thành danh sách thẻ. Mỗi thẻ hiển thị 2–3 trường quan trọng nhất và nút "Xem chi tiết".
- Form nhiều cột: một cột. Nút chính đặt cố định ở đáy màn hình khi cần.
- Kanban: một cột mỗi lần, vuốt ngang để đổi cột, hoặc dùng danh sách có nút "Chuyển bước" (đã ghi trong danh sách việc cần làm của FR).

**Tablet (`768px – 1024px`)**
- Điều hướng: rail icon bên trái rộng 72px, hover hoặc chạm để hiện nhãn.
- Bảng: hiển thị đủ cột nhưng ẩn cột phụ. Cột phụ đưa vào trang chi tiết.
- Modal: hộp căn giữa, rộng 560px.
- Kanban: hiển thị 3–4 cột cùng lúc, cuộn ngang với `scroll-snap`.
- Lưới thẻ: 2 cột.

**Desktop (`> 1024px`)**
- Sidebar cố định rộng 256px, có thể thu về 72px.
- Bảng: đầy đủ cột, có sắp xếp và lọc.
- Modal: hộp căn giữa, rộng tối đa 640px.
- Kanban: hiển thị đủ 6 cột phễu, mỗi cột cuộn độc lập.
- Lưới thẻ: 3–4 cột tùy chiều rộng.
- Màn Company 360°: bố cục 2 cột, cột trái thông tin định danh và trạng thái, cột phải dòng thời gian và nhiệm vụ.

### 5.4 Quy tắc chung
- Trang không được cuộn ngang, trừ bảng và Kanban (bọc trong container có `overflow-x: auto`).
- Mọi vùng chạm tối thiểu 44×44px trên mobile và tablet.
- Ảnh và media dùng `max-width: 100%`.
- Test ở tối thiểu các chiều rộng: 375px, 768px, 1024px, 1280px, 1440px.

---

## 6. Component chuẩn

Mọi component nằm trong `src/components/ui/` và chỉ dùng token của mục 3–5.

### 6.1 Button

| Biến thể | Nền | Chữ | Dùng cho |
| :-- | :-- | :-- | :-- |
| `primary` | `brand-600` | trắng | Hành động chính của trang (1 cái mỗi khối) |
| `secondary` | `clay-600` | trắng | Hành động quan trọng thứ hai |
| `outline` | trong suốt, viền `line-strong` | `ink` | Hành động phụ |
| `ghost` | trong suốt | `brand-600` | Hành động trong bảng, toolbar |
| `danger` | `danger` đậm | trắng | Xóa, đóng, từ chối |

- Chiều cao: `sm` 36px, `md` 44px (mặc định), `lg` 52px.
- Bo góc: `radius-button` (14px).
- Trạng thái loading: giữ nguyên kích thước, thay nhãn bằng spinner nhỏ, vô hiệu hóa click.
- Mỗi trang chỉ có một nút `primary` nổi bật. Nếu có nhiều, các nút còn lại dùng `outline` hoặc `ghost`.

### 6.2 Input, Select, Textarea
- Chiều cao: 44px. Bo góc: `radius-input` (12px). Viền: `line-strong`.
- Hover: viền `brand-400`. Focus: viền `brand-600` và vòng focus 4px màu `brand-100`.
- Lỗi: viền `danger`, thông báo lỗi bên dưới bằng `danger`, có icon. Thông báo phải nói cách sửa.
- Label luôn hiển thị phía trên ô nhập. Không dùng placeholder thay cho label.
- Ô tìm kiếm có icon kính lúp bên trái, nút xóa bên phải khi có nội dung.
- Select dùng component riêng (không dùng `<select>` gốc của trình duyệt) để đồng bộ màu và bo góc.

### 6.3 Badge và Chip
- Badge trạng thái: `radius-pill`, `caption`, nền semantic nhạt, chữ đậm. Có icon nhỏ kèm chữ.
- Chip lọc: viền `line-strong`, `radius-pill`, khi chọn nền `brand-600`, chữ trắng.

### 6.4 Card
- Nền `surface`, viền `line`, bo góc `radius-card`, bóng `shadow-sm`.
- Hover (nếu có điều hướng): bóng `shadow-md`, dịch lên 2px.
- Không lồng quá 2 cấp thẻ.

### 6.5 Table
- Tiêu đề cột: `caption`, uppercase, nền `subtle`, sticky khi cuộn.
- Hàng: chiều cao tối thiểu 52px, hover nền `brand-50`.
- Số và mã (MSSV, mã hash): dùng `mono`, căn phải với số.
- Mobile: chuyển sang danh sách thẻ (xem mục 5.3).

### 6.6 Kanban card
- Nền `surface`, bo góc `radius-card`, viền trái 4px theo trạng thái (không dùng cho thẻ trên mobile).
- Trạng thái luôn có chữ hoặc icon kèm màu.

### 6.7 Modal, Drawer, Sheet
- Có overlay `rgba(12,22,25,0.5)`, khóa cuộn nền.
- Đóng bằng nút X, phím `Esc`, và click overlay (trừ khi là hành động quan trọng cần xác nhận).
- Hành động xác nhận xóa phải có bước xác nhận trong chính modal, không dùng `window.confirm`.
- Focus trap và trả focus về nút đã mở khi đóng.

### 6.8 Toast và Alert
- Toast: góc dưới phải trên desktop, dưới giữa trên mobile, tự đóng sau 5 giây, có nút đóng.
- Alert trong trang: dùng màu semantic, có tiêu đề ngắn và nội dung cách xử lý.

### 6.9 Empty state
- Gồm icon, tiêu đề, một câu mô tả, và một nút hành động nếu người dùng có quyền.
- Nội dung luôn nói rõ vì sao trống và bước tiếp theo. Ví dụ: "Chưa có tin tuyển dụng nào đang mở. Đăng tin mới để sinh viên bắt đầu nộp hồ sơ."

### 6.10 Avatar và logo doanh nghiệp
- Avatar sinh viên: hình tròn, nếu không có ảnh hiển thị chữ cái đầu trên nền `brand-100`.
- Logo doanh nghiệp: ô vuông bo `radius-input`, nếu không có logo hiển thị 2 chữ cái viết tắt trên nền `mist-100`.

---

## 7. Layout và điều hướng

### 7.1 Các layout chính

| Layout | Dùng cho | Thành phần |
| :-- | :-- | :-- |
| `AuthLayout` | Đăng nhập, đổi mật khẩu lần đầu, đăng ký doanh nghiệp | Không có sidebar, form căn giữa, khung giới thiệu bên trái trên desktop |
| `AppLayout` | Các trang sau đăng nhập | Sidebar (desktop), rail (tablet), thanh dưới (mobile), header trang |
| `PublicLayout` | Cổng việc làm công khai, trang chủ | Header nổi, footer |
| `FocusLayout` | Đổi mật khẩu bắt buộc, chờ duyệt | Tối giản, một nút thoát |

### 7.2 Header trang
- Thành phần: tiêu đề `h1`, breadcrumb (nếu sâu hơn 2 cấp), khu hành động bên phải.
- Trên mobile: breadcrumb ẩn, chỉ còn nút quay lại.

### 7.3 Điều hướng theo vai trò
Xem mục 12.

---

## 8. Quy ước viết code React

### 8.1 Cấu trúc thư mục (theo tính năng)

```
src/
├─ app/                    # khởi tạo app, providers, router
│  ├─ router.tsx
│  └─ providers.tsx
├─ layouts/                # AuthLayout, AppLayout, PublicLayout, FocusLayout
├─ components/
│  └─ ui/                  # primitives: Button, Input, Badge, Card, Dialog...
├─ features/               # mỗi module nghiệp vụ một thư mục
│  ├─ auth/
│  ├─ students/
│  ├─ companies/
│  ├─ jobs/
│  ├─ applications/
│  ├─ pipeline/
│  ├─ interviews/
│  ├─ crm/
│  ├─ notifications/
│  ├─ events/
│  ├─ dashboard/
│  └─ audit/
│     ├─ api/                # hàm gọi API + query keys
│     ├─ components/         # component chỉ dùng trong feature
│     ├─ hooks/              # useX, dùng TanStack Query
│     ├─ pages/              # page gắn với route
│     ├─ schemas/            # Zod schema
│     └─ types.ts
├─ shared/
│  ├─ hooks/                 # useDebounce, useMediaQuery, usePermission
│  ├─ lib/                   # cn(), formatDate, formatCurrency
│  ├─ api/                   # client HTTP, interceptor, xử lý lỗi chung
│  └─ constants/             # enum trạng thái, nhãn tiếng Việt
├─ styles/
│  ├─ tokens.css             # toàn bộ CSS variables (light + dark)
│  └─ globals.css
└─ test/
```

Quy tắc phụ thuộc:
- `features/A` không import từ `features/B`. Nếu cần chia sẻ, đưa vào `shared/` hoặc `components/ui/`.
- `components/ui` không import từ `features`.
- Page chỉ ghép component và hook, không chứa logic gọi API trực tiếp.

### 8.2 Phân loại component

| Loại | Vị trí | Đặc điểm |
| :-- | :-- | :-- |
| Primitive | `components/ui/` | Không biết nghiệp vụ, chỉ nhận props giao diện |
| Composite | `components/` hoặc `features/*/components/` | Ghép primitive, có thể nhận dữ liệu |
| Container / Page | `features/*/pages/` | Lấy dữ liệu qua hook, quản lý route params, truyền xuống |
| Presentational | trong feature | Nhận props thuần, không gọi hook dữ liệu |

Tách container và presentational khi component có logic dữ liệu phức tạp, để dễ test và dễ làm skeleton.

### 8.3 Quy tắc đặt tên
- Component: `PascalCase`, file cùng tên: `JobCard.tsx`.
- Hook: `useCamelCase`, file `useJobList.ts`.
- Hàm tiện ích và file không phải component: `camelCase.ts`.
- Type và interface: `PascalCase`, không tiền tố `I`. Props đặt tên `XxxProps`.
- Hằng số enum trạng thái: `UPPER_SNAKE_CASE` theo đúng giá trị trong database.
- Query key: mảng có cấu trúc, ví dụ `['jobs', 'list', filters]`, tập trung trong `api/queryKeys.ts`.
- Biến CSS: `--c-<tên>` cho màu, `--space-<n>`, `--radius-<tên>`.

### 8.4 Quy tắc component
- Dùng function component và hooks. Không dùng class component.
- Export **named** cho component, trừ `page` và `router` có thể dùng default export nếu router yêu cầu.
- Props đã kiểu hóa đầy đủ với TypeScript. Không dùng `any`. Không dùng `React.FC` và tự khai báo kiểu trả về.
- Không định nghĩa component bên trong component khác.
- Tách component khi một phần có trách nhiệm riêng hoặc lặp lại từ 2 lần trở lên. Không tách chỉ vì file dài.
- Component nhận `className` để ghép từ ngoài, dùng `cn()` để gộp.
- Variant của component dùng `cva`, không viết điều kiện lồng nhau trong JSX.
- Không dùng `index` của mảng làm `key` cho danh sách có thể đổi thứ tự. Dùng `id` từ dữ liệu.
- Không gọi `setState` trực tiếp trong render.

### 8.5 Quy tắc Hooks và dữ liệu
- Mọi gọi API đi qua TanStack Query. Không dùng `useEffect` để fetch dữ liệu.
- Mutation dùng `useMutation` và invalidate đúng query key sau khi thành công.
- Cập nhật lạc quan (optimistic update) chỉ dùng cho thao tác có thể hoàn tác dễ dàng, ví dụ đổi cột Kanban. Phải có rollback khi lỗi.
- `useMemo` và `useCallback` chỉ dùng khi đo được lợi ích, không dùng mặc định cho mọi thứ.
- Form dùng React Hook Form với Zod. Schema Zod dùng chung cho frontend và được kiểm tra lại ở backend.

### 8.6 Quy tắc Form
- Validate khi rời ô (`onBlur`) và khi submit. Không báo lỗi khi người dùng chưa nhập gì.
- Nút submit vô hiệu hóa khi đang gửi, có trạng thái loading.
- Lỗi từ server hiển thị đúng ô liên quan nếu có, còn lại hiển thị ở đầu form.
- Không để mất dữ liệu khi lỗi mạng: giữ nguyên giá trị đã nhập.

### 8.7 Quy tắc xử lý lỗi
- Lỗi API có mã (`ACCOUNT_LOCKED`, `PASSWORD_CHANGE_REQUIRED`, `403`...) được ánh xạ sang thông báo tiếng Việt trong `shared/constants/errors.ts`.
- Lỗi không xác định hiển thị thông báo chung kèm mã tham chiếu, không hiển thị stack trace.
- Error boundary bọc từng layout và từng khu vực lớn để một phần lỗi không làm sập cả trang.

### 8.8 Quy tắc viết style
- Chỉ dùng Tailwind với class ngữ nghĩa đã map ở mục 3.4.
- Không dùng `style={{}}` cho màu, khoảng cách, bo góc. Chỉ dùng cho giá trị động như tọa độ kéo thả.
- Không dùng `!important`.
- Không dùng `@apply` ngoài file `globals.css`.
- Class dài trên 6 mục thì tách thành component hoặc cva variant.

---

## 9. Performance và trạng thái tải

### 9.1 Nguyên tắc chung
- Lazy load theo route bằng `React.lazy` và `Suspense` ở `AppLayout`.
- Mỗi trang có skeleton đúng bố cục thật, để không bị nhảy bố cục (CLS).
- Spinner chỉ dùng cho thao tác trên nút. Không dùng spinner toàn màn hình cho dữ liệu trang.
- Ảnh logo và ảnh hồ sơ có `loading="lazy"` và kích thước cố định.
- Tìm kiếm có debounce 300ms. Danh sách có phân trang hoặc cuộn vô hạn có giới hạn.
- Bảng trên 100 hàng dùng ảo hóa (virtualization).

### 9.2 Loại skeleton và khi dùng

| Loại | Dùng cho | Mô tả |
| :-- | :-- | :-- |
| `SkeletonList` | Danh sách việc làm, thông báo | Các hàng có khung avatar và 2 dòng chữ |
| `SkeletonCard` | Lưới thẻ | Khung đúng kích thước thẻ thật |
| `SkeletonTable` | Bảng | Hàng tiêu đề và 6–8 hàng |
| `SkeletonDetail` | Trang chi tiết tin, hồ sơ | Khối tiêu đề, nhãn, đoạn văn |
| `SkeletonKanban` | Phễu tuyển dụng | Các cột với 2–3 thẻ mờ |
| `SkeletonDashboard` | Trang tổng quan | Hàng KPI và hai khối biểu đồ |

- Skeleton dùng nền `subtle` và hiệu ứng shimmer chạy chậm. Tắt shimmer khi `prefers-reduced-motion`.
- Thời gian hiển thị tối thiểu 200ms để tránh nhấp nháy khi dữ liệu về nhanh.
- Khi có dữ liệu cache, hiển thị ngay dữ liệu cũ và tải lại âm thầm (stale-while-revalidate).

### 9.3 Trạng thái trang
Mỗi trang phải có đủ 5 trạng thái: **tải** (skeleton), **có dữ liệu**, **trống** (empty state), **lỗi** (kèm nút thử lại), **không có quyền** (thông báo rõ, không hiện dữ liệu).

### 9.4 Đo lường
- Ngân sách: JS ban đầu dưới 200KB đã nén, LCP dưới 2.5s trên 4G, CLS dưới 0.1.
- Dùng `vite-bundle-visualizer` hoặc công cụ tương đương khi có thay đổi lớn về thư viện.

---

## 10. Role-Based UI

### 10.1 Vai trò và không gian làm việc

| Vai trò | Không gian | Điều hướng chính (tối đa 4 trên mobile) |
| :-- | :-- | :-- |
| `STUDENT` | Sinh viên | Việc làm, Hồ sơ, Đơn của tôi, Lịch phỏng vấn |
| `EMPLOYER` | Doanh nghiệp | Tin tuyển dụng, Phễu ứng viên, Lịch phỏng vấn, Hồ sơ công ty |
| `CAREER_CENTER` | Cán bộ | Thẩm định, Duyệt tin, Quan hệ đối tác (CRM), Sự kiện, Báo cáo |
| `SYSTEM_ADMIN` | Quản trị | Người dùng, Phân quyền, Nhật ký kiểm toán |

Lưu ý: `SYSTEM_ADMIN` không có quyền truy cập màn CRM và ghi chú nội bộ của nhà trường (theo FR-CRM-05 và mục 2 của FR).

### 10.2 Nguyên tắc hiển thị theo quyền
1. **Frontend chỉ ẩn hoặc hiện giao diện.** Mọi kiểm tra quyền và sở hữu dữ liệu nằm ở backend. Không tin cờ quyền từ client để bảo mật.
2. Dùng hook `usePermission('JOB_APPROVE')` để kiểm tra quyền. Không so sánh chuỗi vai trò rải rác trong component.
3. Nếu người dùng không có quyền vào một trang, hiển thị trang "Không có quyền truy cập" có nút về trang chính, không chuyển hướng im lặng.
4. Nút không có quyền: ẩn đi nếu không có ý nghĩa đối với người dùng. Nếu cần giải thích, hiển thị ở trạng thái disabled kèm tooltip lý do.
5. Dữ liệu không thuộc quyền không được tải về client, không chỉ ẩn bằng CSS.

### 10.3 Trạng thái tài khoản đặc biệt

| Trạng thái | Giao diện |
| :-- | :-- |
| `must_change_password = TRUE` | Chỉ hiển thị `FocusLayout` với form đổi mật khẩu. Mọi điều hướng khác bị khóa. |
| `PASSWORD_CHANGE_REQUIRED` từ API | Chuyển sang màn đổi mật khẩu, không hiện thông báo lỗi. |
| `ACCOUNT_LOCKED` | Màn thông báo khóa, hướng dẫn liên hệ Career Center. Không có form đăng nhập. |
| Doanh nghiệp `PENDING` | Vào được trang, nhưng các mục đăng tin và xem ứng viên hiển thị ở trạng thái khóa kèm dải thông báo "Hồ sơ đang chờ thẩm định". |
| Doanh nghiệp `REJECTED` | Dải thông báo kèm lý do từ chối và nút "Gửi lại hồ sơ". |
| Sinh viên `GRADUATED` hoặc `SUSPENDED` | Thông báo trạng thái ở đầu trang. Quyền ứng tuyển theo chính sách từ backend. |

### 10.4 Dữ liệu hiển thị theo vai trò
- **Sinh viên**: không thấy số điện thoại, bảng điểm hay CCCD của người khác.
- **Doanh nghiệp**: chỉ thấy hồ sơ công khai, và CV chỉ khi sinh viên đã nộp vào tin của mình.
- **Cán bộ Career Center**: thấy ghi chú nội bộ. Các trường đó không xuất hiện trong response của Employer hay Student.
- **Quản trị**: không thấy nội dung CRM. Chỉ thấy nhật ký và tài khoản.
- Mã CCCD hiển thị dạng che, ví dụ `0123••••••89`. Mật khẩu và token không bao giờ hiển thị.

### 10.5 Dải thông báo đặc biệt
Dải thông báo đầu trang dùng component `Banner` với các biến thể `info`, `warning`, `danger`. Không dùng toast cho thông báo trạng thái tài khoản vì người dùng cần đọc và thao tác lâu hơn.

---

## 11. Accessibility

- Tương phản đạt tối thiểu WCAG AA (mục 3.3 và 3.5).
- Mọi thao tác dùng được bằng bàn phím. Thứ tự focus đúng với thứ tự thị giác.
- Focus luôn hiển thị bằng vòng `focus` 2–3px. Không xóa `outline` mà không thay thế.
- Icon không có chữ đi kèm phải có `aria-label`. Icon trang trí dùng `aria-hidden="true"`.
- Màu không phải là kênh duy nhất truyền nghĩa. Trạng thái luôn có chữ hoặc icon.
- Form: label gắn bằng `htmlFor`, lỗi gắn bằng `aria-describedby`, `aria-invalid` khi có lỗi.
- Thông báo động (toast, cập nhật trạng thái) dùng `role="status"` hoặc `aria-live="polite"`.
- Kanban có phương án thay thế bằng bàn phím (chọn thẻ và nút "Chuyển bước") và danh sách trên mobile.

---

## 12. Nội dung và ngôn ngữ giao diện

- Giao diện bằng tiếng Việt có dấu. Thuật ngữ kỹ thuật giữ đúng khi người dùng quen thuộc, ví dụ "CV", "Kanban".
- Nhãn gọi theo điều người dùng nhận ra, không theo tên bảng dữ liệu. Ví dụ "Đơn ứng tuyển", không phải "applications".
- Nút nói rõ hành động: "Gửi hồ sơ", "Lưu thay đổi", không dùng "OK" hay "Xác nhận" chung chung.
- Lỗi nói rõ điều gì sai và cách sửa, không xin lỗi chung chung.
- Ngày theo định dạng `dd/MM/yyyy`, giờ `HH:mm`. Tiền tệ `1.000.000 ₫`.
- Mọi chuỗi giao diện đặt trong `shared/constants/` hoặc file i18n, không viết thẳng trong JSX khi dùng lặp lại.

---

## 13. Checklist trước khi merge

- [ ] Không có màu, khoảng cách, bo góc hard-code ngoài token.
- [ ] Trang có đủ 5 trạng thái: tải, có dữ liệu, trống, lỗi, không có quyền.
- [ ] Đã kiểm tra ở 375px, 768px, 1024px, 1280px. Không cuộn ngang ngoài bảng và Kanban.
- [ ] Đã kiểm tra theme sáng và theme tối.
- [ ] Đã kiểm tra bàn phím và focus.
- [ ] Trạng thái có chữ hoặc icon kèm màu.
- [ ] Nút xóa và hành động không thể hoàn tác có bước xác nhận.
- [ ] Không gọi API trực tiếp trong component. Không dùng `any`.
- [ ] Không có dữ liệu ngoài quyền được tải về client.
- [ ] Không hiển thị mật khẩu, token, CCCD đầy đủ trong UI hay console.

---

## 14. Các mục cần chốt trước khi triển khai

1. **Breakpoint**: đã chốt theo mục 5.1. Xác nhận có dùng `desktop:` (từ 1025px) hay đổi thành `xl:` mặc định.
2. **Icon**: Lucide React hay thư viện khác.
3. **Theme tối**: bảng ở mục 3.5 là đề xuất, cần duyệt.
4. **Màu trạng thái và semantic**: đề xuất ở mục 3.6 và 3.7, cần duyệt.
5. **Tailwind**: phiên bản 3 (config JS, như ví dụ mục 3.4) hay 4 (cấu hình trong CSS). Ví dụ trong file theo phiên bản 3.
6. **Ngôn ngữ**: chỉ tiếng Việt hay chuẩn bị song ngữ.
7. **Bảng màu cuối**: phần "Bảng màu chi tiết" trong ảnh gốc có thể có thêm bậc màu. Khi anh gửi bản chính thức, mình sẽ đối chiếu lại các token.

---

## 15. Lịch sử thay đổi

| Phiên bản | Ngày | Nội dung |
| :-- | :-- | :-- |
| 1.0 | 17/11/2026 | Khởi tạo bản đề xuất: chủ đạo `#1D4E5F`, nhóm đất nung, font Be Vietnam Pro và JetBrains Mono, responsive 3 mốc, theme sáng và tối, quy ước React và Role-Based UI |
