# TÀI LIỆU CHỐT LUỒNG VÀ NGHIỆP VỤ HỆ THỐNG WEB CRM

## XÂY DỰNG HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC AN GIANG

| Thông tin | Giá trị chuẩn hóa |
| :--- | :--- |
| **Mã tài liệu** | `CRM-BUS-FLOW-v1.1` |
| **Phiên bản** | **Baseline Nghiệp vụ v1.1 — Implementation Ready** |
| **Dự án** | Web CRM Sinh viên – Doanh nghiệp trong Quy trình Tuyển dụng |
| **Phạm vi triển khai** | **Trường Đại học An Giang (ĐHQG-HCM / AGU)** |
| **Loại hệ thống** | Web CRM hỗ trợ tuyển dụng và quản lý quan hệ trường – doanh nghiệp – sinh viên |
| **Đối tượng chính** | Sinh viên AGU – Doanh nghiệp/Recruiter – Career Center AGU – System Admin |
| **Thời gian dự kiến** | Khoảng 4 tháng hoàn thành hệ thống lõi |
| **Căn cứ nghiệp vụ** | Scope Specification v1.2; Functional Requirements Specification v1.1; 15 Bộ SRS Module cốt lõi |
| **Trạng thái** | **Baseline nghiệp vụ chính thức để làm cơ sở phân tích, thiết kế và phát triển** |

---

## 1. MỤC ĐÍCH CỦA TÀI LIỆU

Tài liệu này là nguồn tham chiếu nghiệp vụ trung tâm và cao nhất trong suốt quá trình thực hiện khóa luận tốt nghiệp. Tài liệu được dùng làm cơ sở pháp lý và kỹ thuật cho:
* Phân tích luồng nghiệp vụ chi tiết (Business Flow Analysis).
* Xây dựng Use Case Specification (38 Use Cases).
* Xây dựng Activity Diagram và Sequence Diagram cho các tương tác liên module.
* Thiết kế Cơ sở dữ liệu quan hệ (ERD, DDL & Prisma Schema).
* Thiết kế Giao diện lập trình ứng dụng (REST API Contract & Swagger/OpenAPI).
* Thiết kế Giao diện người dùng (UI/UX Wireframes & Screen Specifications).
* Ma trận phân quyền (RBAC & Data Ownership Matrix).
* Kế hoạch phát triển nước rút theo chu kỳ 4 tháng.
* Viết Báo cáo Khóa luận tốt nghiệp.
* Thiết lập kịch bản kiểm thử (Test Cases & Test Suites).
* Chuẩn bị dữ liệu Seed Data phục vụ kịch bản Demo trực tiếp.
* Chuẩn bị câu hỏi và luận điểm phản biện bảo vệ trước Hội đồng chấm khóa luận.

### 1.1. Nguyên tắc chốt luồng bất biến
Trong quá trình lập trình và hoàn thiện, mọi chức năng mới phát sinh bắt buộc phải đối chiếu qua 4 câu hỏi chốt chặn:
1. Chức năng này có thuộc phạm vi đã chốt trong Scope v1.2 và FR v1.1 không?
2. Có thực sự cần thiết cho workflow cốt lõi của kỳ tuyển dụng và CRM quan hệ đối tác không?
3. Có làm tăng đột biến thời gian phát triển vượt khung 4 tháng không?
4. Có phá vỡ cấu trúc CSDL PostgreSQL, kiến trúc Modular Monolith NestJS hoặc làm sai lệch cơ chế phân quyền Backend Guards không?

> **Nguyên tắc vàng:** Tuyệt đối không tự ý mở rộng hệ thống chỉ vì trong quá trình phát triển nảy sinh thêm ý tưởng giao diện hoặc công nghệ mới.

---

## 2. ĐỊNH VỊ HỆ THỐNG

### 2.1. Tên chính thức của hệ thống đề tài
> **HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC AN GIANG**

### 2.2. Định vị sản phẩm
Hệ thống được định vị chính xác là: **University Recruitment CRM**
Hệ thống **không phải** là một sàn thương mại việc làm tự do (Job Portal như TopCV, VietnamWorks), cũng **không phải** là một mạng xã hội nghề nghiệp mở rộng (như LinkedIn).

Trọng tâm khác biệt của hệ thống xoay quanh 3 trụ cột:
1. **Quản trị quan hệ đối tác (CRM Core):** Quản lý hồ sơ đối tác doanh nghiệp, mạng lưới người liên hệ (`company_contacts`), trạng thái quan hệ hợp tác chiến lược (`relationship_status`), lịch sử tương tác đa kênh (Interactions), giao việc chăm sóc đối tác (Follow-up Tasks) và góc nhìn điều hành toàn cảnh **Company 360°** dành riêng cho Career Center AGU.
2. **Quy trình tuyển dụng minh bạch (University Job Lifecycle):** Doanh nghiệp chỉ được đăng tin khi nhà trường thẩm định tính hợp pháp; tin tuyển dụng chỉ được xuất bản (`PUBLISHED`) khi Career Center duyệt nội dung phù hợp với chuẩn đào tạo của trường.
3. **Quản lý ứng viên tin cậy (Student Career Pipeline):** Sinh viên đăng ký tài khoản dựa trên đối soát dữ liệu gốc sinh viên của trường (`student_masters`), nộp đơn ứng tuyển với cơ chế đóng băng **CV Snapshot bất biến**, bảo vệ lịch sử tuyển dụng thông qua bảng lưu vết trạng thái (`application_status_histories`).

---

## 3. BÀI TOÁN THỰC TẾ TẠI TRƯỜNG ĐẠI HỌC AN GIANG

Thực trạng kết nối việc làm và quản lý đối tác doanh nghiệp tại trường đại học hiện nay gặp nhiều trở ngại do dữ liệu bị phân tán trên nhiều kênh rời rạc: Email cá nhân, file Google Sheets/Excel, biểu mẫu Google Forms, nhóm mạng xã hội (Zalo/Facebook), văn bản giấy và trao đổi trực tiếp không lưu vết.

Điều này dẫn đến các hệ lụy nghiệp vụ cụ thể:
* **Đối với Career Center AGU:**
  * Khó nắm bắt kịp thời doanh nghiệp nào đang hợp tác tích cực, lịch sử trao đổi qua các năm ra sao.
  * Ai là người liên hệ chính (Primary Contact) phía doanh nghiệp khi nhân sự hai bên thay đổi.
  * Doanh nghiệp đang tuyển dụng những vị trí nào, đã tiếp nhận và xử lý bao nhiêu sinh viên AGU.
  * Các nhiệm vụ chăm sóc, tái liên hệ đối tác (Follow-up) bị bỏ quên khi thay đổi chuyên viên phụ trách.
* **Đối với Doanh nghiệp:**
  * Khó khăn trong việc tiếp cận đúng nguồn sinh viên theo chuyên ngành đào tạo của Trường Đại học An Giang.
  * Thiếu công cụ Kanban trực quan để sàng lọc hồ sơ, xếp lịch phỏng vấn và phản hồi kết quả tuyển dụng tập trung.
* **Đối với Sinh viên AGU:**
  * Tiếp cận tin tuyển dụng trôi nổi, khó xác minh uy tín pháp nhân của nhà tuyển dụng.
  * Nộp CV qua email cá nhân thường không nhận được phản hồi, không biết đơn ứng tuyển đang ở bước nào trong quy trình xét tuyển.
* **Đối với Lãnh đạo Nhà trường:**
  * Thiếu bảng điều khiển KPI và số liệu tổng hợp định lượng: tỷ lệ sinh viên có việc làm sau tốt nghiệp theo từng khoa/ngành, số lượng doanh nghiệp ký kết hợp tác thực chất, mức độ quan tâm của thị trường lao động đối với sinh viên trường.

---

## 4. MỤC TIÊU HỆ THỐNG

### 4.1. Mục tiêu tổng quát
Xây dựng nền tảng Web CRM tập trung, hỗ trợ Trường Đại học An Giang quản lý và điều phối khép kín toàn bộ vòng đời kết nối:
$$\text{Sinh viên AGU} \longleftrightarrow \text{Doanh nghiệp Đối tác} \longleftrightarrow \text{Career Center AGU}$$
trong quy trình tuyển dụng và hợp tác doanh nghiệp.

### 4.2. Các mục tiêu nghiệp vụ cụ thể
* **Mục tiêu 1 — Sinh viên:** Đăng ký tài khoản tự động bằng đối soát Student Master Data; xây dựng hồ sơ năng lực (Career Profile), kỹ năng, kinh nghiệm, dự án; quản lý đa bản CV; tìm kiếm việc làm; nộp đơn ứng tuyển; rút đơn; theo dõi tiến trình phỏng vấn và nhận thông báo kết quả.
* **Mục tiêu 2 — Doanh nghiệp:** Tự đăng ký tài khoản đại diện và gửi hồ sơ thẩm định pháp nhân; hoàn thiện hồ sơ doanh nghiệp và danh bạ người liên hệ; đăng tin tuyển dụng; sàng lọc ứng viên trên bảng Kanban; thiết lập lịch phỏng vấn; ghi nhận kết quả tuyển dụng.
* **Mục tiêu 3 — Career Center AGU:** Thẩm định pháp nhân doanh nghiệp; phê duyệt tin tuyển dụng; đánh giá trạng thái quan hệ hợp tác CRM; ghi nhận nhật ký tương tác; giao việc Follow-up có kỳ hạn; giám sát màn hình Company 360°; tổ chức sự kiện nghề nghiệp; theo dõi bảng điều khiển KPI và báo cáo thống kê.
* **Mục tiêu 4 — Kỹ thuật & An toàn:** Phân quyền đa tầng (RBAC + Data Ownership); bảo vệ tính bất biến của CV Snapshot và Status History; ghi nhật ký kiểm toán hệ thống (`activity_logs`) loại trừ mật khẩu/token; hệ thống chạy độc lập hoàn toàn không phụ thuộc OTP SMS, Email mail server hay AI trong phân hệ cốt lõi P0.

---

## 5. PHẠM VI HỆ THỐNG

### 5.1. Trong phạm vi triển khai (In Scope)
* **Phạm vi đơn vị:** Triển khai thử nghiệm gói gọn cho **Trường Đại học An Giang (AGU)**.
* **Tác nhân tham gia:** Sinh viên AGU, Doanh nghiệp hợp tác & Nhà tuyển dụng đại diện, Cán bộ Career Center AGU, Quản trị viên kỹ thuật (System Admin).
* **Phân hệ chức năng:** Trọn vẹn 15 module nghiệp vụ đã được định nghĩa trong tài liệu đặc tả:
  * *P0 (Cốt lõi bắt buộc):* Module 01 (Auth & RBAC), Module 02 (Student Profile & Multi-CV), Module 03 (Student Career Discovery), Module 04 (Company Verification), Module 05 (Company CRM & Company 360°), Module 06 (Job Lifecycle), Module 07 (Job Discovery), Module 08 (Application & CV Snapshot), Module 09 (Kanban Pipeline), Module 10 (Interview cơ bản), Module 11 (Interaction & Follow-up Tasks), Module 12 (In-app Notification), Module 14 (Dashboard KPI Widgets), Module 15 (System Audit Log).
  * *P1 (Mở rộng giá trị):* Bookmark Job (Module 07), Career Event & Job Fair (Module 13), Báo cáo chuyên sâu & Xuất dữ liệu CSV/XLSX (Module 14), Kênh thông báo bổ trợ qua Email (Module 12).
* **Môi trường vận hành:** Nền tảng Web Responsive tương thích đa thiết bị (Desktop, Laptop, Tablet, Mobile Web Browser).

### 5.2. Các chức năng loại trừ (Out of Scope)
* Không triển khai kiến trúc đa trường (Multi-university) hay mô hình SaaS thương mại nhiều trường.
* Không tích hợp trực tiếp phần mềm quản lý đào tạo (SIS) hay phần mềm nhân sự chấm công/tính lương (HRM) của doanh nghiệp.
* Không bắt buộc OTP qua SMS hoặc gửi Email Verification Link để kích hoạt tài khoản trong quy trình nghiệm thu.
* Không xây dựng tính năng trò chuyện thời gian thực (Realtime Chat) giữa Sinh viên và Doanh nghiệp.
* Không nhúng nền tảng Video Call nội bộ; không xây dựng bộ tiêu chí chấm điểm (Interview Scorecard/Rubric) phức tạp.
* Không xây dựng mạng xã hội nghề nghiệp mở rộng (tường tin, tương tác Like/Share, bình luận công khai).
* Không ứng dụng AI để tự động ra quyết định tuyển dụng hay loại bỏ hồ sơ sinh viên.
* Không phát triển ứng dụng di động riêng (Native Android/iOS App).
* Không áp dụng kiến trúc Microservices phân tán hay Event Broker phức tạp trong phạm vi 4 tháng.

---

## 6. CÁC TÁC NHÂN HỆ THỐNG (ACTORS)

Hệ thống phân định rạch ròi 4 nhóm Actor với ranh giới trách nhiệm nghiệp vụ độc lập:

| Actor | Vai trò hệ thống | Ranh giới trách nhiệm & Phạm vi nghiệp vụ |
| :--- | :--- | :--- |
| **Student** | Sinh viên thuộc AGU | Người tìm việc và ứng tuyển; đăng ký theo Student Master Data; quản lý hồ sơ năng lực và đa bản CV; tìm kiếm việc làm; nộp/rút đơn ứng tuyển; theo dõi lịch phỏng vấn và kết quả. |
| **Employer / Recruiter** | Đại diện doanh nghiệp | Nhà tuyển dụng; tự đăng ký pháp nhân; quản lý Company Profile và người liên hệ; đăng tin tuyển dụng; điều phối ứng viên trên Kanban; lên lịch phỏng vấn và ghi nhận kết quả. |
| **Career Center** | Đơn vị Hợp tác DN AGU | **Trung tâm điều phối nghiệp vụ;** thẩm định doanh nghiệp; duyệt tin tuyển dụng; quản lý trạng thái quan hệ đối tác CRM; ghi nhật ký tương tác; giao việc Follow-up; giám sát màn hình Company 360°; quản lý sự kiện và xem báo cáo. |
| **System Admin** | Quản trị kỹ thuật | Quản trị nền tảng hệ thống; quản lý tài khoản người dùng, cấu hình Role/Permission (RBAC), khóa/mở khóa tài khoản, giám sát nhật ký kiểm toán (`activity_logs`). Tuyệt đối không can thiệp vào ghi chú nội bộ CRM hay quy trình tuyển dụng. |

---

## 7. PHÂN BIỆT RẠCH RÒI GIỮA CAREER CENTER VÀ SYSTEM ADMIN

Đây là nguyên tắc thiết kế sống còn để bảo đảm bản chất CRM của đồ án:

```
┌────────────────────────────────────────────────────────┐
│             CAREER CENTER (Business Actor)             │
│  - Thẩm định pháp nhân & Phê duyệt tin tuyển dụng       │
│  - Quản lý quan hệ đối tác CRM & Màn hình Company 360° │
│  - Ghi nhật ký tương tác & Giao việc Follow-up Task     │
│  - Điều phối sự kiện nghề nghiệp & Xem báo cáo KPI     │
└────────────────────────────────────────────────────────┘
                           ≠
┌────────────────────────────────────────────────────────┐
│              SYSTEM ADMIN (Technical Actor)           │
│  - Quản lý tài khoản User & Phân quyền RBAC            │
│  - Khóa / Mở khóa tài khoản người dùng vi phạm         │
│  - Cấu hình hạ tầng & Giám sát System Audit Logs       │
│  - Tuyệt đối KHÔNG duyệt Job, KHÔNG can thiệp CRM note │
└────────────────────────────────────────────────────────┘
```

* **Career Center là Business Actor:** Nắm toàn bộ quyền điều phối quan hệ trường – doanh nghiệp – sinh viên. Career Center không thay thế vai trò kỹ thuật của Admin.
* **System Admin là Technical/System Actor:** Tập trung vào an toàn thông tin và tài khoản. Tuyệt đối không gộp chức năng CRM vào tài khoản Admin để tránh làm sai lệch mô hình phân quyền phần mềm chuyên nghiệp.

---

## 8. LUỒNG ĐĂNG KÝ SINH VIÊN BẰNG STUDENT MASTER DATA

### 8.1. Quyết định nghiệp vụ chốt
* Không sử dụng mã OTP qua SMS hay liên kết xác thực email tự động làm điều kiện tiên quyết.
* Không phụ thuộc vào dịch vụ gửi email bên thứ ba trong môi trường phát triển và demo nghiệm thu.
* Sinh viên AGU được xác minh danh tính bằng: **Mã số sinh viên (MSSV)** tồn tại hợp lệ trong bảng dữ liệu gốc `student_masters` do nhà trường nạp trước.

### 8.2. Cấu trúc dữ liệu nguồn mẫu (Student Master Data)
Bảng dữ liệu gốc `student_masters` được chuẩn bị trước cho Trường Đại học An Giang:

| Student Code (MSSV) | Họ và tên | Email định danh trường | Trạng thái tài khoản ban đầu |
| :--- | :--- | :--- | :--- |
| `DTH235632` | Phan Khánh Duy | `duy_dth235632@student.agu.edu.vn` | `Chưa đăng ký (user_id IS NULL)` |
| `DTH235633` | Nguyễn Văn A | `student01@student.agu.edu.vn` | `Chưa đăng ký (user_id IS NULL)` |
| `DTH235634` | Trần Thị B | `student02@student.agu.edu.vn` | `Chưa đăng ký (user_id IS NULL)` |

### 8.3. Sơ đồ xử lý đăng ký tài khoản Sinh viên

```
              SINH VIÊN AGU
                    │
                    ▼
           Nhập thông tin:
           - MSSV (student_code)
           - Email cá nhân / trường
           - Mật khẩu & Xác nhận mật khẩu
                    │
                    ▼
         Backend kiểm tra MSSV
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
 Không tồn tại trong         Tồn tại trong
  student_masters           student_masters
       │                         │
       ▼                         ▼
  Từ chối (Reject)          Kiểm tra tài khoản
                             đã liên kết chưa
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
               user_id IS NOT NULL      user_id IS NULL
              (Đã có tài khoản)        (Chưa đăng ký)
                     │                       │
                     ▼                       ▼
              Từ chối (Reject)       Thực thi Prisma Transaction:
                                     1. Tạo User (status = 'ACTIVE')
                                     2. Gán Role 'STUDENT'
                                     3. Tạo hồ sơ bảng students
                                     4. Cập nhật student_masters.user_id
                                             │
                                             ▼
                                     ĐĂNG KÝ THÀNH CÔNG
```

### 8.4. Quy tắc nghiệp vụ bắt buộc
* **BR-AUTH-01:** MSSV phải tồn tại trong bảng `student_masters`.
* **BR-AUTH-02:** Mỗi MSSV chỉ được liên kết với duy nhất 01 tài khoản người dùng (`student_masters.user_id` là UNIQUE).
* **BR-AUTH-03:** Quá trình tạo User và liên kết sinh viên bắt buộc chạy trong **Prisma Atomic Transaction**; kiểm tra cập nhật nguyên tử chống race-condition khi có nhiều request đồng thời.
* **BR-AUTH-04:** Sinh viên tốt nghiệp (`GRADUATED`) hoặc đang học (`ACTIVE`) được xét duyệt theo chính sách `Student Eligibility Policy` do nhà trường thiết lập.

---

## 9. LUỒNG ĐĂNG KÝ VÀ THẨM ĐỊNH DOANH NGHIỆP

### 9.1. Quyết định nghiệp vụ chốt
* Doanh nghiệp **tự đăng ký tài khoản** và khai báo thông tin pháp nhân ban đầu trên hệ thống Web.
* Sau khi đăng ký, doanh nghiệp chuyển sang trạng thái chờ duyệt `PENDING`.
* Cán bộ Career Center AGU là chốt chặn duy nhất có thẩm quyền thẩm định và phê duyệt.

### 9.2. Sơ đồ quy trình xét duyệt doanh nghiệp

```
                 ĐẠI DIỆN DOANH NGHIỆP
                           │
                           │ 1. Đăng ký tài khoản (Self-registration)
                           ▼
                  ACCOUNT + COMPANY
                           │
                           │ 2. Khởi tạo: verification_status = 'PENDING'
                           │              relationship_status = 'NEW'
                           ▼
               Gửi yêu cầu thẩm định (Submit Request)
                           │
                           ▼
                 CAREER CENTER AGU
                           │
               3. Kiểm tra thông tin pháp nhân
                           │
                ┌──────────┴──────────┐
                │                     │
           Bấm REJECT            Bấm APPROVE
                │                     │
                ▼                     ▼
        Bắt buộc nhập          Cập nhật trạng thái
        rejection_reason       verification_status = 'APPROVED'
                │                     │
                ▼                     ▼
      Phát In-app Notification  Phát In-app Notification
      Doanh nghiệp sửa thông tin Mở khóa toàn quyền Tuyển dụng
                │               (Được tạo và gửi duyệt Job)
                ▼
        Bấm RESUBMIT
        (Quay lại PENDING)
```

### 9.3. Các trạng thái định danh của Doanh nghiệp
Bảng `companies` sở hữu 2 trường trạng thái hoàn toàn độc lập:
1. **Trạng thái Thẩm định (`companies.verification_status` - Quản lý bởi Module 04):**
   * `PENDING`: Mới đăng ký hoặc vừa nộp lại hồ sơ; bị khóa hoàn toàn chức năng tuyển dụng.
   * `APPROVED`: Đã được Career Center duyệt; được phép quản lý hồ sơ và đăng tin tuyển dụng.
   * `REJECTED`: Bị từ chối; bắt buộc có lý do từ chối đi kèm; được phép chỉnh sửa và nộp lại (`RESUBMIT`).
   * `SUSPENDED`: Đã từng được duyệt nhưng bị nhà trường đình chỉ hoạt động do vi phạm quy chế.
2. **Trạng thái Quan hệ Đối tác (`companies.relationship_status` - Quản lý độc quyền bởi Module 05 CRM):**
   * Gồm: `NEW` $\rightarrow$ `POTENTIAL` $\rightarrow$ `ACTIVE_PARTNER` $\rightarrow$ `STRATEGIC` $\rightarrow$ `INACTIVE`.
   * **Nguyên tắc độc lập:** Trạng thái quan hệ CRM không tự động thay đổi khi doanh nghiệp được `APPROVED` hoặc khi doanh nghiệp đăng tin tuyển dụng.

---

## 10. TẠI SAO KHÔNG DÙNG EMAIL INVITATION CHO DOANH NGHIỆP?

Hệ thống loại bỏ quy trình bắt buộc gửi thư mời qua email (Email Invitation Link) vì các lý do thực tiễn:
1. **Triệt tiêu phụ thuộc dịch vụ ngoài:** Không phụ thuộc vào kết nối Internet tới máy chủ SMTP công cộng (SendGrid, Mailgun, Gmail SMTP).
2. **Thuận tiện kiểm thử và nghiệm thu:** Dễ dàng trình diễn luồng đăng ký trực tiếp trước Hội đồng mà không bị nghẽn mạng hay trễ thư.
3. **Chủ động dữ liệu:** Dễ dàng nạp dữ liệu mẫu (Seed Data) cho 5–10 doanh nghiệp trong kịch bản demo.
4. **Mở rộng tương lai:** Tính năng gửi email mời hợp tác được định vị là phân hệ mở rộng **P1** và không ảnh hưởng đến điều kiện hoàn thành khóa luận.

---

## 11. XÁC THỰC VÀ BẢO MẬT PHÂN QUYỀN (RBAC & BACKEND ENFORCEMENT)

### 11.1. Bảo mật mật khẩu
* Tuyệt đối không lưu trữ mật khẩu dạng thô (plaintext) trong cơ sở dữ liệu.
* Bắt buộc băm mật khẩu một chiều bằng thuật toán mã hóa mạnh (**Argon2id** hoặc **BCrypt** với salt rounds tối thiểu 10).
* API đăng nhập và thông tin tài khoản tuyệt đối không trả trường `password_hash` về phía Frontend.

### 11.2. Mô hình Đánh giá Truy cập 3 Tầng (3-Tier Access Evaluation)
Mọi request gửi đến Backend đều phải vượt qua 3 chốt chặn kiểm tra:
1. **Tầng 1 — Trạng thái tài khoản (`users.status`):** Tài khoản có đang `ACTIVE` không? Nếu `LOCKED`, lập tức từ chối và trả mã lỗi `403 Forbidden`.
2. **Tầng 2 — Quyền hạn vai trò (RBAC Guard):** Người dùng có mang Role và Permission tương ứng để gọi endpoint này không?
3. **Tầng 3 — Sở hữu dữ liệu & Ngữ cảnh nghiệp vụ (Data Ownership Guard):**
   * Employer A gọi API xem ứng viên: Backend đối soát quyền sở hữu: `job.company_id == employer.company_id`. Nếu không khớp, lập tức chặn đứng nguy cơ tấn công IDOR.
   * Sinh viên chỉ được chỉnh sửa thông tin hồ sơ và đơn ứng tuyển của chính mình.

> **Nguyên tắc bất biến:** Toàn bộ kiểm tra phân quyền và quyền sở hữu bắt buộc phải thực thi tại **Backend NestJS Guards**. Frontend chỉ có trách nhiệm hỗ trợ hiển thị giao diện phù hợp.

---

## 12. HỒ SƠ DOANH NGHIỆP (COMPANY PROFILE)

Sau khi doanh nghiệp được duyệt (`APPROVED`), nhà tuyển dụng có thể cập nhật thông tin giới thiệu:
* **Thông tin cốt lõi (P0):** Tên doanh nghiệp, Logo đại diện (lưu trữ trên MinIO Object Storage), Website, Email liên hệ, Số điện thoại, Địa chỉ trụ sở, Lĩnh vực hoạt động (`industry`), Quy mô nhân sự (`company_size`), Mô tả giới thiệu.
* **Quy tắc bảo vệ dữ liệu:**
  * Thông tin giới thiệu thông thường: Doanh nghiệp được tự do chỉnh sửa.
  * Các trường định danh pháp nhân nhạy cảm (Tên công ty, Mã số thuế): Khi chỉnh sửa lớn, hệ thống có thể yêu cầu Career Center xác nhận lại để chống gian lận thương hiệu.

---

## 13. QUẢN LÝ DANH BẠ LIÊN HỆ DOANH NGHIỆP (COMPANY CONTACTS)

Một doanh nghiệp có thể khai báo nhiều người liên hệ tuyển dụng:
* Thông tin: Họ tên, Chức vụ, Email làm việc, Số điện thoại di động, Trạng thái hoạt động.
* **Quy tắc Primary Contact:** Trong một doanh nghiệp, tại một thời điểm chỉ cho phép **duy nhất 01 người liên hệ giữ vai trò chính (`is_primary = TRUE`)**.
* **Phân biệt Contact và Account:** Bản ghi Contact trong CRM dùng để quản lý quan hệ đối tác; người liên hệ không bắt buộc phải có tài khoản đăng nhập hệ thống (`user_id` trong bảng `company_contacts` có thể mang giá trị NULL).

---

## 14. ĐIỀU HÀNH TOÀN CẢNH QUA MÀN HÌNH COMPANY 360°

**Company 360°** là trung tâm điều hành nghiệp vụ của Career Center AGU, giúp cán bộ nhà trường nhìn thấy bức tranh toàn cảnh về một đối tác từ một điểm duy nhất:
* Thẻ định danh pháp nhân, mã số thuế, địa chỉ và trạng thái quan hệ hợp tác.
* Danh bạ tất cả nhân sự đại diện và người liên hệ chính.
* Danh sách tất cả tin tuyển dụng doanh nghiệp đã đăng và trạng thái xét duyệt.
* Lịch sử tất cả sinh viên AGU đã từng nộp hồ sơ vào doanh nghiệp và kết quả tuyển dụng.
* Dòng thời gian lịch sử tương tác đa kênh (Interactions Timeline).
* Danh sách các nhiệm vụ chăm sóc đối tác (Follow-up Tasks) kèm huy hiệu cảnh báo quá hạn.
* Danh sách sự kiện ngày hội việc làm doanh nghiệp đã đăng ký tham gia.

> Đây là thành phần quyết định chứng minh chiều sâu CRM của đề tài, xóa bỏ hoàn toàn định kiến cho rằng hệ thống chỉ là một Job Portal thông thường.

---

## 15. VÒNG ĐỜI VÀ QUẢN LÝ TIN TUYỂN DỤNG (JOB LIFECYCLE)

### 15.1. Máy trạng thái tin tuyển dụng (Job State Machine)

```
        EMPLOYER                                CAREER CENTER
           │                                          │
       Tạo Job mới                                    │
           │                                          │
           ▼                                          │
        [DRAFT]                                       │
           │                                          │
     Gửi yêu cầu duyệt                                │
           │                                          │
           ▼                                          │
  [PENDING_APPROVAL] ───────────────────────────► Kiểm duyệt nội dung
                                                      │
                       ┌──────────────────────────────┴──────────┐
                       ▼                                         ▼
                  Bấm REJECT                                Bấm APPROVE
                       │                                         │
                       ▼                                         ▼
                  [REJECTED]                                [PUBLISHED]
                 (Có lý do)                         (Hiển thị ra cổng tìm việc)
                       │                                         │
           ┌───────────┴───────────┐                             │
           ▼                       ▼                             ▼
       Sửa nội dung            Hủy bỏ                 Đóng tin thủ công HOẶC
           │                                          Hết hạn nộp (Deadline)
           ▼                                                     │
     [RESUBMIT] ───────────────────┐                             ▼
           │                       │                          [CLOSED]
           └───────────────────────┘                  (Từ chối nhận đơn mới)
```

### 15.2. Các quy tắc nghiệp vụ tin tuyển dụng
* **BR-JOB-01:** Chỉ doanh nghiệp ở trạng thái `verification_status = 'APPROVED'` mới được phép tạo tin tuyển dụng.
* **BR-JOB-02:** Tin tuyển dụng bắt buộc phải được Career Center AGU phê duyệt trước khi chuyển sang trạng thái `PUBLISHED`.
* **BR-JOB-03:** Khi từ chối tin tuyển dụng, cán bộ trường bắt buộc phải nhập lý do cụ thể (`rejection_reason`). Doanh nghiệp được phép chỉnh sửa và gửi duyệt lại.
* **BR-JOB-04:** Khi thời gian hiện tại vượt quá hạn nộp hồ sơ (`deadline`) hoặc khi doanh nghiệp chủ động đóng tin sang `CLOSED`, hệ thống **tự động từ chối nhận mọi đơn ứng tuyển mới**.

---

## 16. KHÁM PHÁ CƠ HỘI VIỆC LÀM (JOB DISCOVERY)

* **Cổng thông tin việc làm công khai:** Sinh viên AGU có thể tra cứu danh sách việc làm mà không bắt buộc phải đăng nhập trước.
* **Điều kiện hiển thị:** Chỉ các tin tuyển dụng thỏa mãn đồng thời: `status = 'PUBLISHED'` và `deadline >= CURRENT_TIMESTAMP` và doanh nghiệp đang hoạt động hợp lệ.
* **Bộ lọc đa tiêu chí:** Tìm kiếm từ khóa theo vị trí tuyển dụng; lọc theo chuyên ngành đào tạo, kỹ năng yêu cầu, địa điểm, hình thức làm việc (Full-time, Part-time, Internship), mức lương.
* **Bookmark Job (Phân hệ P1):** Sinh viên đã đăng nhập có thể đánh dấu lưu lại các việc làm quan tâm vào bảng `saved_jobs` để xem lại sau.
* **Không lệ thuộc AI:** Phân hệ tìm kiếm cốt lõi P0 hoạt động dựa trên truy vấn lọc quan hệ và tìm kiếm văn bản chuẩn mực của PostgreSQL; không đưa AI matching vào điều kiện nghiệm thu lõi.

---

## 17. ĐƠN ỨNG TUYỂN VÀ BẢO TOÀN CV SNAPSHOT BẤT BIẾN

### 17.1. Quy trình nộp đơn ứng tuyển
1. Sinh viên xem chi tiết tin tuyển dụng đang mở.
2. Sinh viên bấm "Ứng tuyển" và chọn 01 bản CV phù hợp trong danh mục CV cá nhân.
3. Backend kiểm tra điều kiện: Tin tuyển dụng còn nhận hồ sơ, sinh viên chưa từng nộp đơn vào vị trí này (`student_id` + `job_id` là UNIQUE).
4. Hệ thống thực thi giao dịch nguyên tử (**Prisma Atomic Transaction**):
   * Tạo bản ghi mới trong bảng `applications` (`current_status = 'APPLIED'`).
   * **Tạo CV Snapshot bất biến (`application_cv_snapshots`):** Sao chép bản ghi tệp CV độc lập, lưu đường dẫn lưu trữ Object Storage riêng biệt và tính toán mã băm toàn vẹn SHA-256. Mọi thao tác sửa hoặc xóa CV gốc của sinh viên sau này hoàn toàn không làm biến đổi bản CV đã nộp cho nhà tuyển dụng.
   * Ghi nhận dòng khởi tạo đầu tiên vào lịch sử trạng thái `application_status_histories`.
   * Phát sự kiện In-app Notification thông báo cho nhà tuyển dụng.

### 17.2. Vòng đời trạng thái đơn ứng tuyển (Application Pipeline)

$$\text{APPLIED} \longrightarrow \text{REVIEWING} \longrightarrow \text{SHORTLISTED} \longrightarrow \text{INTERVIEW} \longrightarrow \text{OFFER} \longrightarrow \text{HIRED}$$

* **Nhánh kết thúc:** `REJECTED` (Nhà tuyển dụng từ chối) hoặc `WITHDRAWN` (Sinh viên chủ động rút đơn).
* **Rút đơn ứng tuyển (Withdraw):** Sinh viên được quyền rút đơn khi hồ sơ đang ở các bước đầu (`APPLIED`, `REVIEWING`, `SHORTLISTED`). Khi đã bước vào phỏng vấn (`INTERVIEW`) hoặc đã có kết quả (`OFFER`/`HIRED`), hệ thống khóa chức năng rút đơn để bảo đảm tính nghiêm túc của quy trình tuyển dụng.

---

## 18. LƯU VẾT LỊCH SỬ TRẠNG THÁI ỨNG TUYỂN (STATUS HISTORY)

Hệ thống không chỉ lưu một trường trạng thái hiện tại `current_status` mà bắt buộc phải lưu vết toàn bộ dòng thời gian chuyển trạng thái:

```
APPLICATION #1024
   │
   ├── [2026-10-01 08:30] APPLIED       (Actor: Sinh viên Phan Khánh Duy)
   ├── [2026-10-02 14:15] REVIEWING     (Actor: HR Recruiter Nguyễn Văn A)
   ├── [2026-10-03 09:00] SHORTLISTED   (Actor: HR Recruiter Nguyễn Văn A)
   ├── [2026-10-05 10:30] INTERVIEW     (Actor: HR Recruiter Nguyễn Văn A - Lịch hẹn 08/10)
   ├── [2026-10-09 16:00] OFFER         (Actor: HR Recruiter Nguyễn Văn A)
   └── [2026-10-10 09:00] HIRED         (Actor: HR Recruiter Nguyễn Văn A - Tiếp nhận chính thức)
```

* **Cấu trúc bảng `application_status_histories`:** Lưu trữ `application_id`, `from_status`, `to_status`, `actor_user_id`, `changed_at`, và `note` ghi chú đi kèm.
* **Nguyên tắc Single Source of Truth:** Bảng `applications` và `application_status_histories` do **Module 08** sở hữu độc quyền. Module 09 (Kanban Pipeline) và Module 10 (Interview) khi cần cập nhật trạng thái bắt buộc phải gọi Public Service Contract của Module 08.

---

## 19. ĐIỀU PHỐI TUYỂN DỤNG TRÊN BẢNG KANBAN (MODULE 09)

* **Giao diện Kanban trực quan:** Dành riêng cho Nhà tuyển dụng để kéo thả và điều phối ứng viên giữa các cột trạng thái theo từng vị trí tuyển dụng cụ thể.
* **Thẻ ứng viên:** Hiển thị tóm tắt họ tên sinh viên, chuyên ngành đào tạo, ngày nộp hồ sơ, bản xem trước CV Snapshot và nút thao tác nhanh.
* **Bảo vệ ranh giới sở hữu (Company Data Isolation):** Backend Guard kiểm soát nghiêm ngặt: Nhà tuyển dụng công ty A tuyệt đối không thể xem, tìm kiếm hay chuyển trạng thái ứng viên thuộc các tin tuyển dụng của công ty B (kiểm thử IDOR thành công).

---

## 20. QUẢN LÝ PHỎNG VẤN (MODULE 10)

* **Thiết lập lịch hẹn:** Khi ứng viên được đưa vào bước phỏng vấn, nhà tuyển dụng thiết lập lịch hẹn gồm: Thời gian bắt đầu/kết thúc (`scheduled_time`), hình thức (Trực tiếp / Trực tuyến), địa điểm cụ thể hoặc đường dẫn phòng họp trực tuyến (`location_url`), ghi chú dặn dò.
* **Thông báo tự động:** Hệ thống tự động phát In-app Notification cho sinh viên khi lịch phỏng vấn được tạo mới, dời lịch hoặc hủy bỏ.
* **Ghi nhận đánh giá sơ bộ:** Nhà tuyển dụng ghi chú nhận xét và kết quả buổi phỏng vấn sơ bộ (`result`: Đạt, Không đạt, Cân nhắc) vào bảng `interviews`.
* **Phân định ranh giới tuyển dụng:** Kết quả phỏng vấn sơ bộ là đánh giá của buổi gặp mặt. Quyết định tuyển dụng chính thức (`OFFER`/`HIRED` hoặc `REJECTED`) được thực hiện trên đơn ứng tuyển thông qua Module 08/09. Hệ thống không xây dựng bộ tiêu chí chấm điểm (Scorecard) phức tạp nhằm giữ đúng phạm vi 4 tháng của khóa luận.

---

## 21. QUẢN TRỊ TƯƠNG TÁC ĐỐI TÁC (CRM INTERACTIONS — P0)

Đây là thành phần cốt lõi khẳng định bản chất CRM của hệ thống:
* **Nhật ký tương tác (`crm_interactions`):** Cán bộ Career Center AGU ghi nhận lịch sử trao đổi với doanh nghiệp sau mỗi hoạt động tiếp xúc.
* **Phân loại hình thức:** Cuộc gọi trao đổi (`CALL`), Thư điện tử (`EMAIL`), Gặp gỡ trực tiếp (`MEETING`), Sự kiện giao lưu (`EVENT`), Ngày hội việc làm (`JOB_FAIR`), Khác (`OTHER`).
* **Ràng buộc quan hệ:** Bắt buộc gắn kết với một doanh nghiệp cụ thể (`company_id` NOT NULL); có thể liên kết tùy chọn với người liên hệ (`company_contact_id`), việc làm (`job_id`) hoặc sự kiện (`event_id`).
* **Hiển thị dòng thời gian:** Toàn bộ nhật ký được sắp xếp theo trình tự thời gian trên màn hình Company 360° để mọi cán bộ trường đều có thể nắm bắt tiến trình chăm sóc đối tác.

---

## 22. NHIỆM VỤ CHĂM SÓC ĐỐI TÁC VÀ CẢNH BÁO QUÁ HẠN (FOLLOW-UP TASKS — P0)

* **Thiết lập việc cần làm (`crm_follow_ups`):** Cán bộ trường tạo nhiệm vụ cần xử lý tiếp theo với doanh nghiệp (ví dụ: *"Gửi công văn mời tài trợ học bổng"*, *"Liên hệ xác nhận số lượng gian hàng Job Fair"*).
* **Ràng buộc bắt buộc:** Bắt buộc chỉ định doanh nghiệp liên quan (`company_id`), cán bộ phụ trách xử lý (`owner_user_id`) và thời hạn hoàn thành (`due_date`).
* **Vòng đời nhiệm vụ:** `TODO` $\longrightarrow$ `IN_PROGRESS` $\longrightarrow$ `DONE` (hoặc `CANCELLED`).
* **Cơ chế nhận diện quá hạn trên UI (Derived State):**
  * Hệ thống tính toán động trạng thái quá hạn tại thời điểm truy vấn:
    $$\text{OVERDUE} \iff (\text{due\_date} < \text{CURRENT\_DATE}) \land (\text{status} \notin \{\text{DONE}, \text{CANCELLED}\})$$
  * Hiển thị trực quan bằng huy hiệu cảnh báo (Warning Badge màu đỏ) nổi bật trên danh sách công việc và màn hình Company 360°.
  * **Giải pháp tinh gọn:** Hệ thống **không triển khai background scheduler / cron-job** để gửi notification nhắc việc tự động nhằm đảm bảo tính khả thi và tiết kiệm tài nguyên trong thời gian 4 tháng của khóa luận.

---

## 23. BẢO MẬT GHI CHÚ NỘI BỘ NHÀ TRƯỜNG (INTERNAL NOTES PRIVACY)

* Các ghi chú đánh giá riêng tư của Career Center AGU (ví dụ: *"Doanh nghiệp phản hồi chậm, cần cân nhắc khi ký MOU hợp tác chiến lược"*) chỉ được lưu trữ và hiển thị cho nhân sự nhà trường có thẩm quyền.
* Backend kiểm soát chặt chẽ: Các trường ghi chú nội bộ này bị lọc bỏ hoàn toàn khỏi các API response trả về cho Doanh nghiệp và Sinh viên.

---

## 24. SỰ KIỆN NGHỀ NGHIỆP VÀ NGÀY HỘI VIỆC LÀM (CAREER EVENT — P1)

* Career Center AGU tạo và quản lý các ngày hội việc làm (Job Fair), workshop hướng nghiệp, talkshow giao lưu doanh nghiệp.
* Hỗ trợ Doanh nghiệp và Sinh viên đăng ký tham gia trực tiếp trên hệ thống; ghi nhận danh sách vào bảng `event_registrations`.
* Quản lý giới hạn sức chứa (`capacity`): Tự động khóa đăng ký khi sự kiện đã tiếp nhận đủ số lượng người tham dự. Cho phép hủy đăng ký trước thời điểm diễn ra.
* Loại bỏ tính năng soát vé, quét mã QR check-in tại chỗ hay thanh toán trực tuyến trong phạm vi MVP.

---

## 25. HỆ THỐNG THÔNG BÁO NỘI BỘ (IN-APP NOTIFICATION — P0)

* Module 12 quản lý hộp thư thông báo nội bộ hệ thống tiếp nhận các sự kiện nghiệp vụ:
  * Doanh nghiệp được phê duyệt hoặc bị từ chối kèm lý do (Module 04).
  * Tin tuyển dụng được duyệt công bố hoặc bị từ chối kèm lý do (Module 06).
  * Sinh viên nộp đơn ứng tuyển mới (Module 08 $\rightarrow$ thông báo cho Recruiter).
  * Đơn ứng tuyển chuyển bước quan trọng: Shortlisted, Interview, Offer, Hired, Rejected (Module 08 $\rightarrow$ thông báo cho Sinh viên).
  * Lịch phỏng vấn được tạo mới, dời lịch hoặc hủy bỏ (Module 10 $\rightarrow$ thông báo cho Sinh viên).
* Kênh thông báo mở rộng qua Email bên ngoài được định vị ở phân hệ **P1** và không ràng buộc vào tiêu chí nghiệm thu MVP.

---

## 26. BẢNG ĐIỀU KHIỂN KPI VÀ BÁO CÁO THỐNG KÊ (MODULE 14)

### 26.1. Bảng điều khiển KPI cơ bản (Basic Dashboard Widgets — P0)
Hiển thị tức thời trên trang chủ làm việc của từng nhóm người dùng:
* **Student Workspace:** Số việc làm đã lưu, số đơn đã nộp, số lịch phỏng vấn sắp tới, kết quả ứng tuyển.
* **Employer Workspace:** Số tin tuyển dụng đang mở, số hồ sơ mới tiếp nhận, số lịch phỏng vấn trong tuần, số ứng viên đã tuyển dụng thành công.
* **Career Center Workspace:** Tổng số đối tác doanh nghiệp, số việc làm đang công bố toàn trường, tổng số đơn ứng tuyển, số sinh viên đã được tuyển dụng (`HIRED`), số nhiệm vụ Follow-up cần xử lý và cảnh báo task quá hạn.

### 26.2. Phân hệ Báo cáo Chuyên sâu và Xuất dữ liệu (Advanced Reports & Export — P1)
* **Báo cáo Phễu chuyển đổi tuyển dụng (Recruitment Conversion):** Thống kê tỷ lệ phần trăm hồ sơ vượt qua từng vòng: $\text{Applied} \rightarrow \text{Reviewing} \rightarrow \text{Shortlisted} \rightarrow \text{Interview} \rightarrow \text{Offer} \rightarrow \text{Hired}$.
* **Báo cáo Nhu cầu Tuyển dụng theo Ngành học:** Thống kê số lượng việc làm và vị trí phân bổ theo từng ngành đào tạo của Trường Đại học An Giang.
* **Xuất dữ liệu báo cáo (Export):** Cho phép cán bộ trường xuất danh sách ứng viên, báo cáo doanh nghiệp đối tác ra định dạng bảng tính **CSV** và **Excel (XLSX)**.

---

## 27. NHẬT KÝ KIỂM TOÁN HỆ THỐNG (SYSTEM AUDIT LOG — MODULE 15 — P0)

* Bảng `activity_logs` tự động ghi nhận các biến động dữ liệu quan trọng phục vụ tra cứu kiểm toán:
  * Đăng nhập/Đăng xuất, Đổi mật khẩu, Khóa/Mở khóa tài khoản, Gán Role/Permission.
  * Thẩm định doanh nghiệp: Duyệt, Từ chối, Nộp lại hồ sơ xét duyệt.
  * Vòng đời việc làm: Duyệt tin, Từ chối tin, Công bố, Đóng tin.
  * Diễn biến ứng tuyển: Nộp đơn, Rút đơn, Chuyển trạng thái tuyển dụng, Lên lịch phỏng vấn.
  * Nghiệp vụ CRM: Cập nhật trạng thái quan hệ hợp tác, Thay đổi cán bộ phụ trách nhiệm vụ Follow-up.
* **Cấu trúc bản ghi:** Tác nhân (`actor_user_id`), Hành động (`action`), Đối tượng tác động (`resource_type`, `resource_id`), Dữ liệu biến đổi (`old_values`, `new_values` dạng JSONB), Địa chỉ IP và Thời điểm (`created_at`).
* **Quy tắc an toàn bảo mật (Data Scrubbing & Masking):**
  * Tuyệt đối nghiêm cấm ghi nhận mật khẩu, mật khẩu băm, chuỗi token phiên vào bảng kiểm toán.
  * Che mờ thông tin cá nhân (PII Masking) như SĐT, CCCD khi hiển thị nhật ký qua giao diện người dùng.

---

## 28. QUYỀN RIÊNG TƯ VÀ BẢO VỆ DỮ LIỆU SINH VIÊN

* **Phân định rõ ràng hai lớp dữ liệu:**
  1. **Hồ sơ nghề nghiệp công khai (Public Career Profile):** Họ và tên sinh viên, chuyên ngành đào tạo, kỹ năng, kinh nghiệm thực tế, dự án tiêu biểu. Doanh nghiệp và Career Center có thể tìm kiếm khi sinh viên bật chế độ hiển thị công khai.
  2. **Dữ liệu riêng tư của sinh viên (Private Student Data):** Số điện thoại cá nhân, email cá nhân, bảng điểm chi tiết, danh mục CV cá nhân.
* **Nguyên tắc bộc lộ dữ liệu:** Doanh nghiệp chỉ được quyền xem số điện thoại liên hệ và tải CV chi tiết của sinh viên khi sinh viên **chủ động nộp đơn ứng tuyển** vào tin tuyển dụng của doanh nghiệp đó.

---

## 29. LƯU TRỮ VÀ QUẢN LÝ TỆP TIN AN TOÀN

* **Kiến trúc lưu trữ:**
  * Cơ sở dữ liệu PostgreSQL chỉ lưu trữ siêu dữ liệu (Metadata): Tên tệp, Định dạng MIME, Kích thước tệp, Đường dẫn tham chiếu lưu trữ (`storage_key`), Mã băm bảo toàn SHA-256.
  * Tệp nhị phân binary (CV sinh viên, Logo doanh nghiệp) được lưu trữ an toàn trên dịch vụ **MinIO Object Storage** (chuẩn tương thích AWS S3).
* **Kiểm tra an toàn tệp tải lên:** Backend NestJS Interceptor kiểm tra nghiêm ngặt phần mở rộng tệp, định dạng MIME thực tế (chỉ chấp nhận PDF/DOCX cho CV, PNG/JPG cho Logo) và giới hạn dung lượng tệp tối đa không quá 5MB.

---

## 30. KIẾN TRÚC VÀ CƠ SỞ DỮ LIỆU CHUẨN CỦA DỰ ÁN

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRONTEND WEB APPLICATION                             │
│       React / Next.js + TypeScript + Tailwind CSS (Responsive)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST API (Stateless JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    BACKEND APPLICATION (NestJS)                        │
│                Kiến trúc Modular Monolith (15 Modules)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ AuthModule   │  │ StudentModule│  │ CompanyModule│  │ JobModule  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ AppliModule  │  │ PipelineMod  │  │ InterviewMod │  │ CRMModule  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ NotificModule│  │ EventModule  │  │ DashboardMod │  │ AuditModule│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │ Prisma ORM                      │ S3 SDK
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        CƠ SỞ DỮ LIỆU QUAN HỆ         │  │     OBJECT STORAGE SERVICE   │
│            PostgreSQL 16             │  │            MinIO             │
│   (30+ Bảng dữ liệu quan hệ 3NF)     │  │   (Lưu trữ CV, Logo binary)  │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 31. NGỮ CẢNH TRƯỜNG ĐẠI HỌC AN GIANG (AGU CONTEXT)

* Dự án được thiết kế và thực nghiệm thực tế cho **Trường Đại học An Giang (ĐHQG-HCM)**.
* **Quy chuẩn mã định danh:**
  * Mã số sinh viên: Định dạng chuẩn của trường (ví dụ các mã sinh viên bắt đầu bằng `DTH...`).
  * Email sinh viên: Định dạng tài khoản sinh viên của trường (`... @student.agu.edu.vn`).
  * Email cán bộ: Định dạng tài khoản nhà trường (`... @agu.edu.vn`).
* **Nguyên tắc thiết kế mở rộng:** Hệ thống lưu trực tiếp chuỗi định danh vào cột `student_code` và không code cứng logic suy luận tên trường từ tiền tố `DTH` (không dùng logic `if student_code.startsWith("DTH") then university = AGU`). Điều này giúp cấu trúc CSDL sẵn sàng mở rộng cho mô hình đa trường trong tương lai mà không cần cấu trúc lại mã nguồn.

---

## 32. MA TRẬN PHÂN QUYỀN TỔNG QUÁT THEO VAI TRÒ (ROLE MATRIX)

| Chức năng nghiệp vụ | Student | Employer | Career Center | System Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Đăng ký tài khoản Sinh viên** | **✓** | – | – | Hỗ trợ nạp data |
| **Đăng ký tài khoản Doanh nghiệp** | – | **✓** | – | – |
| **Thẩm định & Duyệt Doanh nghiệp** | – | – | **✓** | – |
| **Quản lý Hồ sơ Doanh nghiệp** | – | Của mình | Xem toàn trường | – |
| **Quản lý Danh bạ Liên hệ (Contacts)** | – | Của mình | Xem toàn trường | – |
| **Tạo và Chỉnh sửa Tin tuyển dụng** | – | Của mình | Xem / Hỗ trợ | – |
| **Phê duyệt Tin tuyển dụng** | – | – | **✓** | – |
| **Tìm kiếm & Xem Tin tuyển dụng** | **✓** | **✓** | **✓** | **✓** |
| **Nộp đơn Ứng tuyển & Rút đơn** | **✓** | – | – | – |
| **Xem Danh sách Ứng viên** | Đơn của mình | Vị trí của mình | Giám sát toàn trường | – |
| **Điều phối Ứng viên trên Kanban** | – | **✓** | Giám sát | – |
| **Lên lịch và Ghi nhận Phỏng vấn** | Xem lịch mình | Tạo / Cập nhật | Giám sát | – |
| **Ghi nhận Nhật ký Tương tác CRM** | – | Liên quan | **✓** | – |
| **Tạo và Xử lý Follow-up Task** | – | – | **✓** | – |
| **Quản trị Sự kiện Nghề nghiệp (P1)** | Đăng ký | Đăng ký | **✓** | – |
| **Hộp thư Thông báo In-app** | **✓** | **✓** | **✓** | **✓** |
| **Bảng điều khiển KPI Dashboard** | Cá nhân | Công ty mình | Toàn trường | Toàn hệ thống |
| **Quản lý Người dùng & Phân quyền RBAC** | – | – | – | **✓** |
| **Tra cứu Nhật ký Kiểm toán (Audit Log)** | – | – | – | **✓** |

---

## 33. DANH MỤC QUY TẮC NGHIỆP VỤ BẮT BUỘC (BUSINESS RULES)

### Nhóm Tài khoản & Bảo mật:
* **BR-01:** Mật khẩu người dùng bắt buộc phải được băm một chiều, không lưu plaintext.
* **BR-02:** Backend bắt buộc kiểm tra quyền (RBAC) và quyền sở hữu (Ownership) trên 100% các endpoint nghiệp vụ.
* **BR-03:** Người dùng bị khóa tài khoản (`users.status = 'LOCKED'`) bị Backend Guard từ chối ngay lập tức trên toàn hệ thống.

### Nhóm Sinh viên:
* **BR-04:** Sinh viên đăng ký phải có MSSV tồn tại trong `student_masters` và chưa từng liên kết tài khoản nào.
* **BR-05:** Mỗi MSSV chỉ được liên kết với duy nhất 01 tài khoản người dùng.
* **BR-06:** Sinh viên chỉ có quyền chỉnh sửa hồ sơ, kỹ năng, dự án và CV của chính mình.
* **BR-07:** Dữ liệu riêng tư của sinh viên (SĐT, email cá nhân, bảng điểm) không được công khai mặc định cho doanh nghiệp.

### Nhóm Doanh nghiệp & CRM:
* **BR-08:** Doanh nghiệp mới đăng ký luôn khởi tạo ở trạng thái xét duyệt `verification_status = 'PENDING'`.
* **BR-09:** Chỉ cán bộ Career Center mới có quyền phê duyệt (`APPROVED`) hoặc từ chối (`REJECTED`) doanh nghiệp.
* **BR-10:** Doanh nghiệp bị từ chối bắt buộc phải có lý do cụ thể và được quyền chỉnh sửa hồ sơ để nộp lại (`RESUBMIT`).
* **BR-11:** Chỉ doanh nghiệp ở trạng thái `APPROVED` mới được quyền tạo và gửi duyệt tin tuyển dụng.
* **BR-12:** Trong một doanh nghiệp, tại một thời điểm chỉ cho phép duy nhất 01 người liên hệ giữ vai trò chính (`is_primary = TRUE`).
* **BR-13:** Trạng thái quan hệ đối tác CRM (`relationship_status`) do Career Center quản lý độc quyền và không tự động thay đổi theo trạng thái đăng tin của doanh nghiệp.
* **BR-14:** Ghi chú nội bộ (Internal Notes) của nhà trường tuyệt đối không được trả về cho Doanh nghiệp hay Sinh viên.

### Nhóm Tin tuyển dụng & Ứng tuyển:
* **BR-15:** Tin tuyển dụng chỉ được hiển thị công khai khi đã được Career Center duyệt sang trạng thái `PUBLISHED`.
* **BR-16:** Tin tuyển dụng khi đã hết hạn nộp hồ sơ (`deadline`) hoặc đã đóng (`CLOSED`) thì hệ thống tự động từ chối nhận đơn ứng tuyển mới.
* **BR-17:** Một sinh viên không được nộp trùng nhiều đơn ứng tuyển vào cùng một tin tuyển dụng đang mở.
* **BR-18:** Bản CV dùng khi nộp hồ sơ bắt buộc phải được sao chép và đóng băng thành bản CV Snapshot bất biến kèm mã SHA-256.
* **BR-19:** Mọi thay đổi trạng thái đơn ứng tuyển bắt buộc phải được lưu vết vào bảng `application_status_histories`.
* **BR-20:** Nhà tuyển dụng công ty A tuyệt đối không được xem, tìm kiếm hay xử lý ứng viên nộp vào tin tuyển dụng của công ty B.

### Nhóm Phỏng vấn & Chăm sóc Đối tác:
* **BR-21:** Mọi lịch phỏng vấn bắt buộc phải gắn kết trực tiếp với một đơn ứng tuyển cụ thể.
* **BR-22:** Nhật ký tương tác CRM (`crm_interactions`) bắt buộc phải gắn với một doanh nghiệp cụ thể.
* **BR-23:** Nhiệm vụ chăm sóc đối tác (`crm_follow_ups`) bắt buộc phải có cán bộ phụ trách (`owner_user_id`) và thời hạn hoàn thành (`due_date`).
* **BR-24:** Trạng thái quá hạn (`OVERDUE`) của Follow-up Task được tính toán động tại thời điểm truy vấn, không chạy Background Cron-job để gửi notification tự động.

### Nhóm Quản trị & Trí tuệ Nhân tạo:
* **BR-25:** Mọi biến động dữ liệu quan trọng bắt buộc phải được ghi vết vào bảng kiểm toán `activity_logs`.
* **BR-26:** Tuyệt đối không ghi mật khẩu, mật khẩu băm hay access token vào bảng kiểm toán (Data Scrubbing).
* **BR-27:** Trí tuệ nhân tạo (AI) tuyệt đối không được tự động ra quyết định tuyển dụng hay loại bỏ hồ sơ của sinh viên. Hệ thống Web CRM cốt lõi phải hoạt động hoàn chỉnh 100% không cần AI.

---

## 34. SƠ ĐỒ WORKFLOW TRUNG TÂM TOÀN HỆ THỐNG (END-TO-END)

```
       DOANH NGHIỆP                    CAREER CENTER AGU                     SINH VIÊN AGU
            │                                  │                                   │
    1. Tự đăng ký TK                           │                                   │
    (status = PENDING)                         │                                   │
            │                                  │                                   │
    2. Nộp hồ sơ duyệt ─────────────────► 3. Thẩm định pháp nhân                   │
                                               │                                   │
                                      ┌────────┴────────┐                          │
                                      ▼                 ▼                          │
                                    REJECT           APPROVE                       │
                                 (Ghi lý do)            │                          │
                                                        │                          │
    4. Được cấp quyền Tuyển dụng ◄──────────────────────┘                          │
            │                                                                      │
    5. Tạo tin tuyển dụng (DRAFT)                                                  │
            │                                                                      │
    6. Gửi duyệt tin ───────────────────► 7. Thẩm định nội dung Job                │
                                               │                                   │
                                      ┌────────┴────────┐                          │
                                      ▼                 ▼                          │
                                    REJECT           APPROVE                       │
                                 (Ghi lý do)            │                          │
                                                        ▼                          │
                                                  Công bố tin                      │
                                                  (PUBLISHED)                      │
                                                        │                          │
                                                        ├────────────────────────► 8. Tra cứu & Xem Job
                                                        │                          │
                                                        │                          9. Chọn CV & Nộp đơn
                                                        │                             (Tạo CV Snapshot)
                                                        │                                  │
    10. Tiếp nhận hồ sơ ◄───────────────────────────────┼──────────────────────────────────┘
            │                                           │
    11. Sàng lọc trên Kanban                            │
        (REVIEWING ➔ SHORTLISTED)                       │
            │                                           │
    12. Lên lịch Interview ─────────────────────────────┼────────────────────────► 13. Nhận lịch phỏng vấn
            │                                           │
    14. Chốt kết quả tuyển dụng                         │
        (OFFER ➔ HIRED / REJECTED) ─────────────────────┼────────────────────────► 15. Nhận thông báo kết quả
            │                                           │
            ▼                                           ▼
    [LƯU STATUS HISTORY]                     [GIÁM SÁT TOÀN DIỆN]
                                                        │
                                            ┌───────────┼───────────┐
                                            ▼           ▼           ▼
                                       Company 360° Interaction Follow-up Task
                                            │           │           │
                                            └───────────┼───────────┘
                                                        ▼
                                                  DASHBOARD KPI
```

---

## 35. PHÂN TẦNG ƯU TIÊN VÀ PHẠM VI NGHIỆM THU (P0 / P1 / P2)

### 35.1. P0 — Bắt buộc hoàn thành để nghiệm thu (Core MVP)
1. **Module 01 (Auth & RBAC):** Đăng nhập/Đăng xuất, Quản lý tài khoản, Đổi mật khẩu, Phân quyền RBAC đa tầng, Khóa/Mở tài khoản.
2. **Module 02 (Student Profile):** Đăng ký theo Student Master Data không OTP, Quản lý hồ sơ, Kỹ năng, Kinh nghiệm, Dự án, Đa bản CV.
3. **Module 03 (Student Career Discovery):** Tìm kiếm và xem hồ sơ nghề nghiệp công khai của sinh viên.
4. **Module 04 (Company Verification):** Doanh nghiệp tự đăng ký, Gửi hồ sơ xét duyệt, Career Center duyệt/từ chối kèm lý do, Nộp lại hồ sơ.
5. **Module 05 (Company CRM):** Quản lý hồ sơ doanh nghiệp, Danh bạ người liên hệ (tối đa 1 Primary Contact), Trạng thái quan hệ hợp tác, Màn hình điều hành Company 360°.
6. **Module 06 (Job Management):** Vòng đời tin tuyển dụng (Draft $\rightarrow$ Submit $\rightarrow$ Approve $\rightarrow$ Publish $\rightarrow$ Close).
7. **Module 07 (Job Discovery):** Tra cứu, tìm kiếm, lọc và xem chi tiết cơ hội việc làm công khai còn hạn nộp.
8. **Module 08 (Application Management):** Nộp đơn ứng tuyển, Rút đơn, Đóng băng bản sao CV Snapshot bất biến kèm SHA-256, Lưu vết lịch sử trạng thái Status History.
9. **Module 09 (Recruitment Pipeline):** Bảng Kanban điều phối ứng viên theo vị trí tuyển dụng cho doanh nghiệp.
10. **Module 10 (Interview):** Lên lịch hẹn phỏng vấn, liên kết đơn ứng tuyển, ghi nhận đánh giá phỏng vấn sơ bộ.
11. **Module 11 (Interaction & Follow-up):** Ghi nhật ký tương tác đối tác, Phân công nhiệm vụ Follow-up có kỳ hạn, Nhận diện và cảnh báo task quá hạn trên UI CRM.
12. **Module 12 (Notification):** Hộp thư thông báo nội bộ In-app Notification theo dòng sự kiện hệ thống.
13. **Module 14 (Dashboard):** Các thẻ KPI Widgets cơ bản gắn với không gian làm việc của Student, Employer và Career Center.
14. **Module 15 (Audit Log):** Tự động ghi nhật ký kiểm toán hệ thống `activity_logs` loại trừ thông tin nhạy cảm.

### 35.2. P1 — Nên hoàn thành để gia tăng giá trị
1. Lưu tin tuyển dụng yêu thích (Bookmark Job - Module 07).
2. Quản lý sự kiện nghề nghiệp, Job Fair và tiếp nhận đăng ký tham dự (Module 13).
3. Báo cáo chuyển đổi phễu tuyển dụng, Thống kê nhu cầu theo ngành và Xuất file CSV / Excel XLSX (Module 14).
4. Kênh thông báo bổ trợ qua Email bên ngoài (Module 12).

### 35.3. P2 — Định hướng nghiên cứu mở rộng sau khóa luận
1. Trí tuệ nhân tạo so khớp CV – Job (AI Matching).
2. Gợi ý việc làm thông minh dựa trên hành vi sinh viên (Job Recommendation).
3. Phân tích khoảng trống kỹ năng so với thị trường (Skill Gap Analysis).
4. Trợ lý ảo AI tư vấn quy chế và hướng nghiệp (RAG Career Assistant).
5. Kiến trúc Đa trường (Multi-university Platform) và Single Sign-On liên trường.

> **Quy tắc cắt Scope khi chậm tiến độ:** Cắt giảm phân hệ P2 đầu tiên $\rightarrow$ Tạm hoãn phân hệ P1 nếu cần $\rightarrow$ **Tuyệt đối bảo vệ 100% phân hệ cốt lõi P0**. Không bao giờ lấy thời gian của P0 để làm AI hay các tính năng phụ.

---

## 36. TIÊU CHÍ NGHIỆM THU HỆ THỐNG (ACCEPTANCE CRITERIA)

Hệ thống được đánh giá đạt yêu cầu khi vượt qua toàn bộ 20 tiêu chí nghiệm thu thực tế:
1. Người dùng thuộc 4 nhóm Actor đăng nhập thành công và được phân quyền chính xác theo ma trận RBAC.
2. Sinh viên có MSSV hợp lệ trong `student_masters` của Trường Đại học An Giang tự đăng ký tài khoản thành công mà không cần mã OTP.
3. Doanh nghiệp tự đăng ký tài khoản và gửi hồ sơ xét duyệt đến trường.
4. Career Center duyệt hoặc từ chối doanh nghiệp; từ chối bắt buộc có lý do và doanh nghiệp chỉnh sửa, nộp lại được.
5. Doanh nghiệp được duyệt (`APPROVED`) quản lý được hồ sơ và danh bạ người liên hệ.
6. Doanh nghiệp tạo tin tuyển dụng và gửi Career Center kiểm duyệt.
7. Career Center duyệt tin tuyển dụng; tin được duyệt chuyển sang `PUBLISHED` và hiển thị trên cổng việc làm sinh viên.
8. Sinh viên tìm kiếm, lọc và xem được thông tin chi tiết tin tuyển dụng còn hạn nộp.
9. Sinh viên nộp đơn ứng tuyển bằng 01 bản CV cụ thể; hệ thống ngăn chặn triệt để nộp trùng đơn vào cùng một tin.
10. Bản CV dùng khi nộp đơn được đóng băng an toàn thành CV Snapshot độc lập, không bị thay đổi khi sinh viên sửa hoặc xóa CV gốc.
11. Đơn ứng tuyển lưu vết đầy đủ toàn bộ dòng thời gian thay đổi trạng thái trong `application_status_histories`.
12. Nhà tuyển dụng quản lý và chuyển bước hồ sơ ứng viên trên bảng Kanban trong đúng phạm vi công việc của công ty mình.
13. Nhà tuyển dụng thiết lập và cập nhật lịch phỏng vấn thành công; hệ thống gửi thông báo In-app tức thì cho sinh viên.
14. Ghi nhận kết quả tuyển dụng cuối cùng của ứng viên.
15. Career Center truy cập và xem được toàn cảnh bức tranh Company 360° cùng lịch sử tương tác của doanh nghiệp.
16. Career Center tạo được nhật ký tương tác và phân công nhiệm vụ Follow-up có kỳ hạn xử lý; các task quá hạn hiển thị huy hiệu cảnh báo màu đỏ trên giao diện.
17. Bảng điều khiển Dashboard hiển thị các số liệu KPI nghiệp vụ chính xác, không bị đếm trùng lặp.
18. Backend ngăn chặn triệt để mọi hành vi truy cập dữ liệu trái quyền hoặc truy cập chéo giữa các doanh nghiệp (kiểm thử IDOR thành công).
19. Mọi thao tác làm biến đổi dữ liệu quan trọng đều được ghi nhận đầy đủ vào bảng `activity_logs`.
20. Hệ thống có sẵn bộ dữ liệu mẫu (Seed Data) chuẩn mực để chứng minh trọn vẹn ít nhất 02 kịch bản tuyển dụng và chăm sóc đối tác hoàn chỉnh từ đầu đến cuối trước Hội đồng.

---

## 37. BỘ CÂU HỎI VÀ PHẢN BIỆN BẢO VỆ TRƯỚC HỘI ĐỒNG

* **Q1: Tại sao hệ thống chỉ triển khai cho Trường Đại học An Giang mà không làm cho nhiều trường cùng lúc?**  
  *Trả lời:* Để kiểm soát chặt chẽ phạm vi nghiệp vụ và tập trung hoàn thiện chiều sâu của bài toán quản trị quan hệ (CRM) trong thời gian 4 tháng của khóa luận. Mỗi trường có quy chuẩn mã sinh viên, cơ cấu tổ chức và quy trình quan hệ doanh nghiệp rất khác nhau. Việc làm multi-university quá sớm sẽ làm tăng độ phức tạp về Tenant Isolation, SSO và phân quyền mà không làm tăng giá trị nghiệp vụ cốt lõi của đề tài.

* **Q2: Hệ thống này khác gì các trang web tuyển dụng thông thường như TopCV, VietnamWorks?**  
  *Trả lời:* Điểm khác biệt sống còn là hệ thống này lấy **CRM làm trung tâm** và đặt trong bối cảnh **nhà trường điều phối**. Hệ thống không chỉ kết nối ứng tuyển đơn thuần mà còn quản lý hồ sơ đối tác doanh nghiệp, danh bạ nhân sự, lịch sử tương tác của trường, phân công nhiệm vụ chăm sóc đối tác, thẩm định chất lượng tin tuyển dụng theo ngành đào tạo của AGU và cung cấp góc nhìn toàn cảnh Company 360° cho ban giám hiệu và đơn vị việc làm.

* **Q3: Trí tuệ nhân tạo (AI) có phải là yêu cầu bắt buộc của khóa luận này không?**  
  *Trả lời:* Không. Đề tài tập trung giải quyết trọn vẹn bài toán Phân tích thiết kế hệ thống thông tin, Quy trình nghiệp vụ tuyển dụng và CRM trường học. Toàn bộ hệ thống lõi hoạt động độc lập và hoàn chỉnh 100% không cần AI. AI chỉ đóng vai trò là phân hệ nghiên cứu mở rộng P2 sau khi hệ thống cốt lõi đã được nghiệm thu đạt chuẩn.

* **Q4: Vì sao cần phải lưu trữ bản CV Snapshot bất biến mà không dùng trực tiếp CV của sinh viên?**  
  *Trả lời:* Trong quy trình tuyển dụng, đơn ứng tuyển là một bằng chứng pháp lý và nghiệp vụ tại thời điểm nộp đơn. Sinh viên có thể cập nhật, chỉnh sửa kỹ năng hoặc xóa bản CV trong trang cá nhân sau khi nộp. Việc tạo bản CV Snapshot độc lập bảo đảm nhà tuyển dụng luôn nhìn thấy đúng bản CV mà sinh viên đã nộp tại thời điểm đó, bảo toàn tính bất biến và lịch sử của quy trình tuyển dụng.

* **Q5: Kiến trúc Modular Monolith có phù hợp với thời gian thực hiện 4 tháng không?**  
  *Trả lời:* Rất phù hợp. Kiến trúc Modular Monolith trên nền tảng NestJS + TypeScript và PostgreSQL cho phép nhóm phát triển phân tách rõ ràng ranh giới giữa 15 module nghiệp vụ, dễ dàng kiểm thử, bảo trì và quản lý giao dịch CSDL nguyên tử mà không phải chịu chi phí vận hành hạ tầng phức tạp, rủi ro phân tán mạng hay vấn đề tính nhất quán dữ liệu của kiến trúc Microservices.

---

## 38. KẾT LUẬN VÀ BƯỚC TRIỂN KHAI TIẾP THEO

Tài liệu **Chốt luồng và Nghiệp vụ Hệ thống Web CRM phiên bản v1.1** đã chuẩn hóa và đóng gói trọn vẹn toàn bộ các quy trình nghiệp vụ của đồ án trong bối cảnh cụ thể của **Trường Đại học An Giang**:
1. Khẳng định vững chắc bản chất **University Recruitment CRM**, phân định rạch ròi vai trò của 4 nhóm Actor với trọng tâm điều phối thuộc về Career Center AGU.
2. Đồng bộ 100% với 15 Module SRS chi tiết, loại bỏ hoàn toàn các xung đột về công nghệ, xung đột thông báo nhắc việc và làm rõ các ràng buộc toàn vẹn dữ liệu.
3. Xác lập bộ tiêu chuẩn nghiệm thu và lộ trình 4 tháng khả thi, bảo vệ an toàn phân hệ cốt lõi P0 trước mọi nguy cơ phình to phạm vi (Scope Creep).

Bản tài liệu này là căn cứ tối cao để tiếp tục hoàn thiện:
* **Tài liệu Đặc tả Use Case chi tiết (Use Case Specification - 38 Use Cases).**
* **Tài liệu Thiết kế Cơ sở Dữ liệu (Database Architecture Specification - DDL & Prisma Schema).**
* **Tài liệu Kiến trúc Kỹ thuật (Technical Architecture Specification).**
* **Tài liệu Đặc tả Giao diện Lập trình (API Contract Specification / Swagger).**