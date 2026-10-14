# TÀI LIỆU YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS SPECIFICATION)

## HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC AN GIANG

| Thông tin              | Giá trị chuẩn hóa                                                                                              |
| :--------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Mã tài liệu**        | `CRM-FRS-v1.1`                                                                                                 |
| **Phiên bản**          | **Baseline v1.1 — Implementation Ready**                                                                       |
| **Dự án**              | Web CRM Kết nối Sinh viên – Doanh nghiệp trong Quy trình Tuyển dụng                                            |
| **Phạm vi triển khai** | Một trường đại học cụ thể (Single University Context)                                                          |
| **Căn cứ nghiệp vụ**   | Scope Specification v1.2; 15 Bộ SRS Module cốt lõi (Module 01 đến 15)                                          |
| **Căn cứ kỹ thuật**    | Technical Architecture Spec v1.0 (NestJS Modular Monolith); Database Architecture Spec v1.0 (`CRM-DBS-01`)     |
| **Mục đích**           | Cơ sở pháp lý kỹ thuật cho Use Case Specification, ERD, API Design, UI/UX Wireframes và Acceptance Test Suites |
| **Mức độ ưu tiên**     | **P0** = Cốt lõi bắt buộc hoàn thành; **P1** = Mở rộng giá trị gia tăng; **P2** = Nghiên cứu tương lai         |

---

## 1. MỤC ĐÍCH VÀ NGUYÊN TẮC THIẾT KẾ YÊU CẦU

Tài liệu này chuẩn hóa và chuyển đổi toàn bộ phạm vi nghiệp vụ từ Scope v1.2 và 15 Module SRS chi tiết thành hệ thống **Yêu cầu Chức năng (Functional Requirements - FR)** có định danh thống nhất, điều kiện kích hoạt, quy tắc xử lý, ranh giới dữ liệu và tiêu chuẩn nghiệm thu (Acceptance Criteria).

### Các nguyên tắc nền tảng bất biến (Core Principles):

1. **Kiến trúc Modular Monolith:** Backend xây dựng trên nền tảng **NestJS + TypeScript**, cơ sở dữ liệu quan hệ **PostgreSQL 16** quản lý qua **Prisma ORM**, lưu trữ tệp trên **MinIO / S3**. Các module giao tiếp qua Service Contracts công khai, cấm truy cập Repository chéo.
2. **Bảo mật & Phân quyền đa tầng (3-Tier Access Evaluation):** Mọi kiểm tra quyền (RBAC) và kiểm tra sở hữu dữ liệu (Data Ownership) bắt buộc phải thực thi tại **Backend Services**. Frontend chỉ hỗ trợ hiển thị giao diện.
3. **Phân định rạch ròi các nhóm trạng thái:**
   - _User Status_ (`users.status`: `ACTIVE`, `LOCKED`, `INACTIVE`)
   - _Student Status_ (`student_masters.student_status`: `ACTIVE`, `GRADUATED`, `SUSPENDED`)
   - _Company Verification Status_ (`companies.verification_status`: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`)
   - _CRM Relationship Status_ (`companies.relationship_status`: `NEW`, `POTENTIAL`, `ACTIVE_PARTNER`, `STRATEGIC`, `INACTIVE`)
4. **Vận hành độc lập:** Hệ thống vận hành trọn vẹn không phụ thuộc vào OTP SMS, liên kết xác thực email tự động hay bất kỳ giải pháp AI/Machine Learning nào trong phân hệ cốt lõi (Core P0).
5. **Đóng băng CV Snapshot bất biến:** Đơn ứng tuyển khi nộp bắt buộc phải sao chép metadata và tệp CV độc lập kèm mã băm SHA-256 để bảo toàn chứng cứ lịch sử.
6. **Không tự động hóa bằng Cron-job ngoài scope:** Cắt bỏ hoàn toàn notification nhắc việc CRM tự động; trạng thái quá hạn (`OVERDUE`) của nhiệm vụ Follow-up được tính toán động (derived state) và cảnh báo trực tiếp trên màn hình CRM.

---

## 2. TÁC NHÂN HỆ THỐNG VÀ RANH GIỚI VAI TRÒ (ACTORS)

```text
       ┌────────────────────────────────────────────────────────┐
       │             CAREER CENTER (Business Actor)             │
       │  - Thẩm định pháp nhân & Phê duyệt tin tuyển dụng       │
       │  - Quản trị quan hệ đối tác CRM & Màn hình Company 360° │
       │  - Ghi nhận tương tác & Giao việc Follow-up Task       │
       └───────────────────────────┬────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     STUDENT      │     │    EMPLOYER /    │     │   SYSTEM ADMIN   │
│ (Ứng viên trường)│     │    RECRUITER     │     │ (Kỹ thuật HT)    │
│- Master Data reg │     │- Self-register   │     │- User & RBAC mgmt│
│- Career Profile  │     │- Job Management  │     │- Account lock    │
│- Multiple CVs    │     │- Kanban Pipeline │     │- Audit Log trace │
│- Apply & Track   │     │- Interview setup │     │- Zero CRM access │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

| Actor                    | Vai trò hệ thống                    | Ranh giới trách nhiệm & Phạm vi nghiệp vụ                                                                                                                                                                 |
| :----------------------- | :---------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student**              | Sinh viên thuộc trường              | Đăng ký theo Student Master Data; quản lý hồ sơ năng lực (Career Profile) và đa bản CV; tìm việc, ứng tuyển, rút đơn, theo dõi lịch phỏng vấn và kết quả tuyển dụng.                                      |
| **Employer / Recruiter** | Đại diện pháp nhân doanh nghiệp     | Tự đăng ký tài khoản đại diện; quản lý thông tin doanh nghiệp và danh bạ liên hệ; đăng tin tuyển dụng; sàng lọc ứng viên trên Kanban pipeline; thiết lập lịch phỏng vấn và ghi nhận kết quả.              |
| **Career Center**        | Đơn vị Hỗ trợ Việc làm / Hợp tác DN | Thẩm định và duyệt doanh nghiệp; duyệt/từ chối tin tuyển dụng; quản lý trạng thái quan hệ đối tác CRM; ghi nhật ký tương tác; giao việc Follow-up; giám sát toàn cảnh Company 360°; xem báo cáo thống kê. |
| **System Admin**         | Quản trị kỹ thuật nền tảng          | Quản lý người dùng, cấu hình Role/Permission (RBAC), khóa/mở khóa tài khoản, giám sát Audit Log (`activity_logs`). Tuyệt đối không can thiệp ghi chú CRM hay quy trình tuyển dụng.                        |

---

## 3. HỆ THỐNG MÃ YÊU CẦU CHỨC NĂNG & ÁNH XẠ 15 MODULE SRS

| Phân hệ (Prefix) | Module SRS Cốt lõi | Tên Module Nghiệp vụ                               | Mức ưu tiên |
| :--------------- | :----------------: | :------------------------------------------------- | :---------: |
| **FR-AUTH-\***   |   **Module 01**    | Authentication & RBAC                              |   **P0**    |
| **FR-STU-\***    |   **Module 02**    | Student Registration & Profile Management          |   **P0**    |
| **FR-SCD-\***    |   **Module 03**    | Student Career Discovery (Khám phá hồ sơ ứng viên) |   **P0**    |
| **FR-CVR-\***    |   **Module 04**    | Company Registration & Verification                |   **P0**    |
| **FR-CRM-\***    |   **Module 05**    | Company CRM & Company 360°                         |   **P0**    |
| **FR-JOB-\***    |   **Module 06**    | Job Management (Vòng đời tin tuyển dụng)           |   **P0**    |
| **FR-JDISC-\***  |   **Module 07**    | Job Discovery & Bookmark                           | **P0 / P1** |
| **FR-APP-\***    |   **Module 08**    | Application Management (Single Source of Truth)    |   **P0**    |
| **FR-RP-\***     |   **Module 09**    | Recruitment Pipeline (Kanban Workflow)             |   **P0**    |
| **FR-INT-\***    |   **Module 10**    | Interview Management                               |   **P0**    |
| **FR-FU-\***     |   **Module 11**    | Interaction & Follow-up Task Management            |   **P0**    |
| **FR-NOT-\***    |   **Module 12**    | In-app Notification System                         | **P0 / P1** |
| **FR-EVT-\***    |   **Module 13**    | Career Event & Job Fair Management                 |   **P1**    |
| **FR-DASH-\***   |   **Module 14**    | Dashboard KPI & Advanced Reports                   | **P0 / P1** |
| **FR-AUD-\***    |   **Module 15**    | System Audit Log (Nhật ký kiểm toán)               |   **P0**    |

---

## 4. CHI TIẾT YÊU CẦU CHỨC NĂNG THEO 15 MODULE

### PHÂN HỆ 01: XÁC THỰC VÀ PHÂN QUYỀN (MODULE 01 — AUTHENTICATION & RBAC)

#### FR-AUTH-01: Đăng nhập và Đăng xuất hệ thống

- **Priority:** P0
- **Actor:** Student, Employer, Career Center, System Admin
- **Preconditions:** Tài khoản tồn tại trong bảng `users` và có `status = 'ACTIVE'`.
- **Hành vi hệ thống:**
  1. Người dùng gửi thông tin xác thực (`email`, `password`).
  2. Backend kiểm tra tài khoản, đối soát mật khẩu băm (Argon2id hoặc BCrypt), kiểm tra trạng thái `users.status`.
  3. Nếu tài khoản bị khóa (`LOCKED`), từ chối phiên và trả mã lỗi `403 Forbidden` (`ACCOUNT_LOCKED`).
  4. Nếu hợp lệ, hệ thống thiết lập phiên xác thực an toàn (Stateless JWT payload đính kèm `userId`, `roles`, `permissions` qua HttpOnly Cookie hoặc Authorization Bearer Header) và cập nhật `last_login_at`.
  5. Đăng xuất: Thu hồi phiên làm việc, xóa bỏ cookie phiên tại trình duyệt.
- **Quy tắc / Ràng buộc:** Mật khẩu tuyệt đối không lưu plaintext; không trả password hash trong phản hồi API.
- **Tiêu chí nghiệm thu:** Đăng nhập đúng cấp phiên làm việc; đăng nhập sai thông tin hoặc tài khoản bị khóa bị chặn dứt khoát.

#### FR-AUTH-02: Đổi mật khẩu tài khoản

- **Priority:** P0
- **Actor:** Tất cả người dùng đã đăng nhập
- **Hành vi hệ thống:** Cho phép người dùng nhập mật khẩu hiện tại và mật khẩu mới. Backend xác thực mật khẩu cũ, băm mật khẩu mới và cập nhật bản ghi trong bảng `users`. Mật khẩu cũ bị vô hiệu hóa ngay lập tức.
- **Ranh giới MVP:** Chức năng tự phục vụ quên mật khẩu qua Email/SMS (Self-service Forgot Password) nằm ngoài phạm vi MVP (Out of Scope); hỗ trợ cơ chế Admin reset trực tiếp nếu có yêu cầu.

#### FR-AUTH-03: Đăng ký tài khoản Sinh viên qua Student Master Data

- **Priority:** P0
- **Actor:** Student
- **Preconditions:** Mã số sinh viên (MSSV) hợp lệ tồn tại trong bảng `student_masters` và chưa từng liên kết với tài khoản `users` nào.
- **Hành vi hệ thống:**
  1. Sinh viên nhập: MSSV (`student_code`), email cá nhân, mật khẩu và xác nhận mật khẩu.
  2. Backend đối chiếu bảng `student_masters`: Kiểm tra sự tồn tại của `student_code` và trạng thái học tập theo chính sách `Student Eligibility Policy`.
  3. Kiểm tra tính duy nhất: Kiểm tra email chưa tồn tại trong `users` và `student_masters.user_id IS NULL`.
  4. Thực thi **Prisma Atomic Transaction**:
     - Tạo bản ghi mới trong bảng `users` (`status = 'ACTIVE'`).
     - Gán Role `STUDENT` vào bảng `user_roles`.
     - Tạo hồ sơ sinh viên tương ứng trong bảng `students`, gán khóa ngoại `user_id` và liên kết với `student_masters`.
  5. Phát sinh sự kiện Audit Log (`USER_STUDENT_REGISTERED`).
- **Quy tắc / Ràng buộc:** Không yêu cầu OTP; mỗi MSSV chỉ được liên kết duy nhất 1 tài khoản; ngăn chặn race condition bằng điều kiện cập nhật nguyên tử.

#### FR-AUTH-04: Đăng ký tài khoản Doanh nghiệp ban đầu

- **Priority:** P0
- **Actor:** Employer / Recruiter
- **Hành vi hệ thống:**
  1. Đại diện doanh nghiệp khai báo thông tin tài khoản (email, mật khẩu) và thông tin pháp nhân ban đầu (tên công ty, mã số thuế, địa chỉ).
  2. Thực thi giao dịch nguyên tử điều phối qua Orchestrator Service:
     - Tạo bản ghi `users` (`status = 'ACTIVE'`).
     - Gán Role `EMPLOYER` vào `user_roles`.
     - Tạo bản ghi trong `companies` với trạng thái xét duyệt ban đầu `verification_status = 'PENDING'` và `relationship_status = 'NEW'`.
     - Tạo bản ghi đại diện trong `company_contacts` liên kết `user_id` với công ty (`is_primary = TRUE`).
- **Quy tắc / Ràng buộc:** Doanh nghiệp ở trạng thái `PENDING` bị chặn hoàn toàn các quyền nghiệp vụ tuyển dụng (không được tạo tin, duyệt tin hay xem ứng viên).

#### FR-AUTH-05: Quản trị Vai trò và Phân quyền (RBAC)

- **Priority:** P0
- **Actor:** System Admin
- **Hành vi hệ thống:** Cho phép System Admin cấu hình ma trận `roles`, `permissions`, gán Role cho User (`user_roles`) và gán Permission cho Role (`role_permissions`).
- **Quy tắc / Ràng buộc:** Khóa chính phức hợp (Composite Primary Key) ở các bảng trung gian ngăn chặn phân quyền trùng lặp; phân quyền có hiệu lực ngay ở lần request tiếp theo của người dùng.

#### FR-AUTH-06: Khóa và Mở khóa tài khoản người dùng

- **Priority:** P0
- **Actor:** System Admin
- **Hành vi hệ thống:** Cập nhật trạng thái tài khoản `users.status` sang `LOCKED` hoặc `ACTIVE`. Tài khoản `LOCKED` lập tức bị Backend Guard từ chối trên toàn bộ các endpoint nghiệp vụ. Ghi nhận nhật ký kiểm toán `activity_logs`.

---

### PHÂN HỆ 02: HỒ SƠ NĂNG LỰC SINH VIÊN (MODULE 02 — STUDENT PROFILE)

#### FR-STU-01: Quản lý thông tin học tập và cá nhân

- **Priority:** P0
- **Actor:** Student, Career Center (Read-only)
- **Hành vi hệ thống:** Cho phép sinh viên cập nhật số điện thoại liên hệ, giới thiệu bản thân, địa chỉ. Các thông tin học thuật gốc (MSSV, Họ tên, Khoa, Ngành) được thừa hưởng từ Master Data và bảo vệ tính toàn vẹn.

#### FR-STU-02: Quản lý Kỹ năng, Kinh nghiệm và Dự án

- **Priority:** P0
- **Actor:** Student
- **Hành vi hệ thống:** Sinh viên thêm, sửa, xóa các bản ghi năng lực trong 3 bảng con: `student_skills` (gắn thẻ kỹ năng và mức độ), `student_experiences` (công ty, vị trí, khoảng thời gian) và `student_projects` (dự án, mô tả, liên kết sản phẩm).

#### FR-STU-03: Quản lý Đa bản CV (Multiple CV Management)

- **Priority:** P0
- **Actor:** Student
- **Hành vi hệ thống:**
  1. Cho phép sinh viên tải lên nhiều tệp CV (định dạng PDF/Word, kích thước tối đa 5MB).
  2. Tệp binary được đẩy lên **MinIO Object Storage**; database bảng `student_cvs` lưu trữ metadata, URL tham chiếu và cờ đánh dấu CV mặc định (`is_default = TRUE`).
  3. Cho phép tải xuống, đổi tên và xóa bản CV trong danh mục cá nhân.

#### FR-STU-04: Cấu hình Quyền riêng tư Hồ sơ (Profile Visibility)

- **Priority:** P0
- **Actor:** Student
- **Hành vi hệ thống:** Cho phép sinh viên bật/tắt cờ `career_profile_visibility` (Public/Private). Khi bật Public, hồ sơ xuất hiện trong cổng tìm kiếm ứng viên của Nhà tuyển dụng.

---

### PHÂN HỆ 03: KHÁM PHÁ HỒ SƠ ỨNG VIÊN (MODULE 03 — STUDENT CAREER DISCOVERY)

#### FR-SCD-01: Tìm kiếm và Lọc ứng viên công khai

- **Priority:** P0
- **Actor:** Employer, Career Center
- **Preconditions:** Doanh nghiệp có `verification_status = 'APPROVED'`.
- **Hành vi hệ thống:** Cung cấp API truy vấn tổng hợp (Read-only):
  1. Tìm kiếm theo từ khóa vị trí, chuyên ngành đào tạo, kỹ năng (`skills`).
  2. Lọc theo trạng thái sinh viên (`ACTIVE`, `GRADUATED`).
  3. Kết quả chỉ trả về các sinh viên đang bật `career_profile_visibility = TRUE`.
  4. Hỗ trợ phân trang (`page`, `limit`) bắt buộc.

#### FR-SCD-02: Xem chi tiết Hồ sơ Năng lực Công khai

- **Priority:** P0
- **Actor:** Employer, Career Center
- **Hành vi hệ thống:** Hiển thị trang Public Career Profile gồm họ tên, chuyên ngành, kỹ năng, kinh nghiệm và dự án.
- **Ràng buộc an toàn dữ liệu:** Bảo vệ tuyệt đối thông tin nhạy cảm: Không hiển thị số điện thoại cá nhân, điểm GPA chi tiết, bảng điểm và danh mục CV riêng tư. Nhà tuyển dụng chỉ tiếp cận được CV cụ thể khi sinh viên chủ động nộp đơn ứng tuyển vào Job của mình.

---

### PHÂN HỆ 04: ĐĂNG KÝ VÀ XÉT DUYỆT DOANH NGHIỆP (MODULE 04 — COMPANY VERIFICATION)

#### FR-CVR-01: Gửi yêu cầu thẩm định Doanh nghiệp

- **Priority:** P0
- **Actor:** Employer
- **Preconditions:** Doanh nghiệp có `verification_status = 'PENDING'`.
- **Hành vi hệ thống:** Employer hoàn thiện thông tin pháp nhân, đính kèm giấy phép/website và bấm "Gửi yêu cầu xét duyệt". Hệ thống ghi nhận yêu cầu vào `company_verification_requests` và đưa doanh nghiệp vào hàng đợi thẩm định của Career Center.

#### FR-CVR-02: Thẩm định và Phê duyệt Doanh nghiệp

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:**
  1. Cán bộ Career Center xem xét thông tin pháp nhân trong Review Queue.
  2. Bấm **APPROVE**: Hệ thống cập nhật `companies.verification_status = 'APPROVED'`, ghi nhận thời điểm duyệt và cán bộ duyệt (`verified_at`, `verified_by`). Phát thông báo In-app cho Employer và ghi Audit Log.
  3. Doanh nghiệp chính thức được mở khóa quyền đăng tin tuyển dụng.

#### FR-CVR-03: Từ chối xét duyệt và Nộp lại hồ sơ (Reject & Resubmit)

- **Priority:** P0
- **Actor:** Career Center, Employer
- **Hành vi hệ thống:**
  1. Khi từ chối, Career Center **bắt buộc nhập lý do từ chối** (`rejection_reason`).
  2. Cập nhật `companies.verification_status = 'REJECTED'`. Phát thông báo In-app giải thích lý do cho doanh nghiệp.
  3. Doanh nghiệp đăng nhập, xem lý do bị từ chối, tiến hành chỉnh sửa hồ sơ và bấm **RESUBMIT**. Trạng thái chuyển về `PENDING` để nhà trường thẩm định lại.

---

### PHÂN HỆ 05: QUẢN TRỊ QUAN HỆ DOANH NGHIỆP (MODULE 05 — COMPANY CRM)

#### FR-CRM-01: Quản trị Hồ sơ Doanh nghiệp và Nhãn hiệu

- **Priority:** P0
- **Actor:** Employer (quản lý công ty mình), Career Center (xem toàn trường)
- **Hành vi hệ thống:** Quản lý thông tin hồ sơ doanh nghiệp: Tên giao dịch, Logo (lưu trữ trên MinIO), Website, Địa chỉ, Quy mô nhân sự (`company_size`), Lĩnh vực hoạt động (`industry`), Mô tả giới thiệu.

#### FR-CRM-02: Quản lý Danh bạ Người liên hệ (Company Contacts)

- **Priority:** P0
- **Actor:** Employer, Career Center
- **Hành vi hệ thống:** Cho phép quản lý nhiều người liên hệ thuộc doanh nghiệp (`company_contacts`): Họ tên, Chức vụ, Email, Số điện thoại.
- **Ràng buộc nghiệp vụ:** Trong một doanh nghiệp, tại một thời điểm chỉ cho phép duy nhất 1 người liên hệ giữ vai trò chính (`is_primary = TRUE`). Backend bảo vệ ràng buộc này chống xung đột đồng thời.

#### FR-CRM-03: Quản lý Trạng thái Quan hệ Đối tác (CRM Relationship Status)

- **Priority:** P0
- **Actor:** Career Center độc quyền
- **Hành vi hệ thống:** Career Center đánh giá và cập nhật trạng thái hợp tác của trường với doanh nghiệp: `NEW` $\rightarrow$ `POTENTIAL` $\rightarrow$ `ACTIVE_PARTNER` $\rightarrow$ `STRATEGIC` $\rightarrow$ `INACTIVE`.
- **Ràng buộc nghiệp vụ:** Trạng thái quan hệ CRM này hoàn toàn độc lập với `verification_status` và không tự động nhảy trạng thái khi doanh nghiệp đăng tin tuyển dụng.

#### FR-CRM-04: Điều hành toàn cảnh qua màn hình Company 360°

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:** Giao diện điều hành tổng hợp tập trung toàn bộ dữ liệu xoay quanh 1 doanh nghiệp:
  1. Thẻ thông tin định danh pháp nhân và trạng thái quan hệ đối tác.
  2. Danh bạ nhân sự đại diện (Contacts).
  3. Lịch sử các tin tuyển dụng đã đăng (Jobs).
  4. Lịch sử ứng viên của trường nộp hồ sơ vào doanh nghiệp.
  5. Dòng thời gian tương tác CRM (Interactions Timeline).
  6. Danh sách nhiệm vụ chăm sóc đối tác (Follow-up Tasks) kèm cảnh báo quá hạn.
  7. Sự kiện hướng nghiệp đã phối hợp tham gia.

#### FR-CRM-05: Bảo mật Ghi chú Nội bộ Nhà trường (Internal Notes Privacy)

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:** Mọi ghi chú đánh giá nội bộ của nhà trường đối với doanh nghiệp chỉ được phép trả về cho cán bộ Career Center có thẩm quyền; Backend lọc bỏ hoàn toàn các trường này khỏi API response của Employer và Student.

---

### PHÂN HỆ 06: QUẢN LÝ TIN TUYỂN DỤNG (MODULE 06 — JOB MANAGEMENT)

#### FR-JOB-01: Tạo và Chỉnh sửa Tin tuyển dụng (Job Draft)

- **Priority:** P0
- **Actor:** Employer
- **Preconditions:** Doanh nghiệp có `verification_status = 'APPROVED'`.
- **Hành vi hệ thống:** Employer tạo tin tuyển dụng: Vị trí tuyển dụng, Mô tả công việc, Yêu cầu ứng viên, Mức lương, Địa điểm, Hạn nộp hồ sơ (`deadline`), Danh mục kỹ năng yêu cầu (`job_skills`). Tin mới khởi tạo ở trạng thái `DRAFT`.

#### FR-JOB-02: Gửi duyệt Tin tuyển dụng (Submit Job)

- **Priority:** P0
- **Actor:** Employer
- **Hành vi hệ thống:** Doanh nghiệp gửi tin tuyển dụng đến nhà trường; tin chuyển trạng thái sang `PENDING_APPROVAL`.

#### FR-JOB-03: Phê duyệt hoặc Từ chối Tin tuyển dụng

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:**
  1. Cán bộ trường kiểm duyệt nội dung tin tuyển dụng.
  2. **APPROVE:** Tin chuyển sang trạng thái `PUBLISHED`, lập tức hiển thị công khai trên cổng việc làm của sinh viên. Phát thông báo In-app cho doanh nghiệp.
  3. **REJECT:** Cán bộ nhập lý do từ chối cụ thể; tin chuyển trạng thái `REJECTED`. Doanh nghiệp được phép sửa nội dung và gửi duyệt lại.

#### FR-JOB-04: Đóng và Tự động hết hạn Tin tuyển dụng (Close Job)

- **Priority:** P0
- **Actor:** Employer, Career Center, Hệ thống tự động
- **Hành vi hệ thống:**
  1. Cho phép doanh nghiệp hoặc trường chủ động đóng tin thủ công sang trạng thái `CLOSED`.
  2. Khi thời gian hiện tại vượt quá hạn nộp (`deadline`), hệ thống tự động coi tin là hết hạn.
  3. Tin ở trạng thái `CLOSED` hoặc hết hạn lập tức bị ẩn khỏi danh sách tìm kiếm và **từ chối nhận mọi đơn ứng tuyển mới**.

---

### PHÂN HỆ 07: KHÁM PHÁ CƠ HỘI VIỆC LÀM (MODULE 07 — JOB DISCOVERY)

#### FR-JDISC-01: Tra cứu và Lọc việc làm công khai

- **Priority:** P0
- **Actor:** Student, Khách vãng lai
- **Hành vi hệ thống:**
  1. Tìm kiếm theo từ khóa vị trí, công ty.
  2. Bộ lọc đa tiêu chí: Lọc theo chuyên ngành, kỹ năng yêu cầu, mức lương, hình thức làm việc (Full-time, Part-time, Internship).
  3. Chỉ hiển thị các tin tuyển dụng thỏa mãn đồng thời: `status = 'PUBLISHED'` và `deadline >= CURRENT_TIMESTAMP` và doanh nghiệp đang hoạt động bình thường.
  4. Hỗ trợ sắp xếp theo tin mới nhất, hạn nộp gần nhất và phân trang danh sách.

#### FR-JDISC-02: Xem chi tiết Cơ hội Việc làm

- **Priority:** P0
- **Actor:** Student
- **Hành vi hệ thống:** Hiển thị chi tiết mô tả công việc, quyền lợi, yêu cầu năng lực, thông tin doanh nghiệp đăng tuyển và trạng thái còn hạn hay đã hết hạn nộp hồ sơ.

#### FR-JDISC-03: Lưu tin tuyển dụng quan tâm (Bookmark Job)

- **Priority:** P1
- **Actor:** Student
- **Hành vi hệ thống:** Cho phép sinh viên đã đăng nhập lưu các tin việc làm vào danh mục quan tâm (`saved_jobs`), xóa tin khỏi danh mục lưu và xem lại danh sách công việc đã đánh dấu.

---

### PHÂN HỆ 08: ĐƠN ỨNG TUYỂN VÀ CV SNAPSHOT (MODULE 08 — APPLICATION MANAGEMENT)

#### FR-APP-01: Nộp đơn ứng tuyển và Đóng băng CV Snapshot bất biến

- **Priority:** P0
- **Actor:** Student
- **Preconditions:** Tin tuyển dụng đang `PUBLISHED`, chưa hết hạn; sinh viên chưa từng nộp đơn vào tin này.
- **Hành vi hệ thống:**
  1. Sinh viên chọn 1 bản CV trong danh mục cá nhân và bấm nộp đơn.
  2. Backend kiểm tra điều kiện trùng lặp (`student_id` + `job_id` UNIQUE).
  3. Thực thi **Atomic Transaction**:
     - Tạo bản ghi mới trong bảng `applications` (`current_status = 'APPLIED'`).
     - **Tạo CV Snapshot bất biến (`application_cv_snapshots`):** Sao chép bản ghi tệp CV, lưu đường dẫn file độc lập, metadata và tính toán mã băm toàn vẹn SHA-256. Mọi thao tác sửa/xóa CV gốc của sinh viên sau này hoàn toàn không làm biến đổi bản CV đã nộp.
     - Tạo bản ghi khởi tạo trong lịch sử trạng thái `application_status_histories` (`to_status = 'APPLIED'`).
  4. Phát sinh sự kiện In-app Notification cho Nhà tuyển dụng.

#### FR-APP-02: Rút đơn ứng tuyển (Withdraw Application)

- **Priority:** P0
- **Actor:** Student
- **Preconditions:** Đơn ứng tuyển của chính sinh viên đang ở các bước đầu (`APPLIED`, `REVIEWING`, `SHORTLISTED`).
- **Hành vi hệ thống:** Sinh viên bấm "Rút đơn"; hệ thống cập nhật `current_status = 'WITHDRAWN'`, ghi nhận bản ghi vào `application_status_histories`. Đơn rút sẽ bị đóng và không tiếp tục tham gia quy trình xét tuyển.
- **Ràng buộc nghiệp vụ:** Không cho phép rút đơn khi hồ sơ đã chuyển sang bước phỏng vấn (`INTERVIEW`) hoặc đã có kết quả chính thức (`OFFER`, `HIRED`).

#### FR-APP-03: Quản lý và Lưu vết Lịch sử trạng thái ứng tuyển (Status History)

- **Priority:** P0
- **Actor:** Module 08 (Single Source of Truth)
- **Hành vi hệ thống:** Mọi hành vi cập nhật trạng thái đơn ứng tuyển (từ ứng viên, nhà tuyển dụng hoặc phễu Kanban) đều bắt buộc thực hiện thông qua Service của Module 08. Hệ thống cập nhật `applications.current_status` đồng thời ghi chép tức thời một dòng mới vào `application_status_histories` (bao gồm `from_status`, `to_status`, `actor_user_id`, `changed_at`, `note`).

---

### PHÂN HỆ 09: PHỄU TUYỂN DỤNG KANBAN (MODULE 09 — RECRUITMENT PIPELINE)

#### FR-RP-01: Bảng Kanban điều phối ứng viên theo vị trí tuyển dụng

- **Priority:** P0
- **Actor:** Employer (quản lý công ty mình), Career Center (giám sát)
- **Hành vi hệ thống:**
  1. Hiển thị bảng Kanban trực quan phân chia theo các cột trạng thái phễu: `APPLIED` $\rightarrow$ `REVIEWING` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEW` $\rightarrow$ `OFFER` $\rightarrow$ `HIRED` và các cột kết thúc (`REJECTED`, `WITHDRAWN`).
  2. Thẻ ứng viên thể hiện tóm tắt: Họ tên sinh viên, chuyên ngành, ngày nộp, CV Snapshot kèm nút tải xem trực tiếp.
  3. Hỗ trợ lọc ứng viên theo chuyên ngành, kỹ năng và tìm kiếm họ tên.

#### FR-RP-02: Chuyển bước trạng thái ứng viên trên Kanban

- **Priority:** P0
- **Actor:** Employer
- **Hành vi hệ thống:** Khi nhà tuyển dụng kéo thả thẻ ứng viên hoặc chọn chuyển bước từ menu thao tác, Module 09 gọi Public Contract của Module 08 để thực thi chuyển trạng thái. Backend kiểm tra chặt chẽ Data Ownership: Nhà tuyển dụng chỉ được chuyển bước hồ sơ nộp vào tin tuyển dụng của công ty mình.

---

### PHÂN HỆ 10: QUẢN LÝ PHỎNG VẤN (MODULE 10 — INTERVIEW MANAGEMENT)

#### FR-INT-01: Thiết lập và Điều chỉnh Lịch phỏng vấn

- **Priority:** P0
- **Actor:** Employer
- **Preconditions:** Đơn ứng tuyển đang ở trạng thái `SHORTLISTED` hoặc `INTERVIEW`.
- **Hành vi hệ thống:**
  1. Nhà tuyển dụng tạo lịch hẹn: Thời gian diễn ra (`scheduled_time`), Hình thức (Trực tiếp / Trực tuyến), Địa điểm cụ thể hoặc Liên kết phòng họp trực tuyến (`location_url`), Ghi chú dặn dò ứng viên.
  2. Bản ghi được lưu vào bảng `interviews` liên kết trực tiếp với `application_id`.
  3. Hệ thống đồng thời chuyển trạng thái đơn ứng tuyển sang `INTERVIEW` (nếu chưa chuyển) và phát thông báo In-app tức thì cho Sinh viên.
  4. Hỗ trợ cập nhật đổi lịch (Reschedule) hoặc hủy lịch hẹn kèm lý do.

#### FR-INT-02: Ghi nhận Đánh giá Phỏng vấn cơ bản

- **Priority:** P0
- **Actor:** Employer
- **Hành vi hệ thống:** Sau buổi phỏng vấn, nhà tuyển dụng ghi nhận kết quả sơ bộ (`result`: Đạt, Không đạt, Cân nhắc) và ghi chú nhận xét cơ bản vào bảng `interviews`.
- **Ranh giới tinh gọn:** Loại bỏ bộ tiêu chí chấm điểm (Scorecard/Rubric) phức tạp nhằm tối ưu hóa phạm vi MVP. Việc chốt kết quả tuyển dụng cuối cùng (`HIRED`/`REJECTED`) được thực hiện trên quy trình của đơn ứng tuyển (Module 08/09).

---

### PHÂN HỆ 11: TƯƠNG TÁC VÀ NHẮC VIỆC CRM (MODULE 11 — INTERACTION & FOLLOW-UP)

#### FR-FU-01: Ghi nhận Nhật ký Tương tác đối tác (Interaction Logging)

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:**
  1. Ghi nhận lịch sử trao đổi giữa nhà trường và doanh nghiệp vào bảng `crm_interactions`.
  2. Phân loại hình thức: Cuộc gọi (`CALL`), Email trao đổi (`EMAIL`), Gặp mặt trực tiếp (`MEETING`), Sự kiện (`EVENT`), Hội chợ việc làm (`JOB_FAIR`), Khác (`OTHER`).
  3. Bắt buộc liên kết với `company_id`; tùy chọn liên kết với `company_contact_id`, `job_id`, `event_id`.
  4. Lưu trữ tiêu đề, nội dung chi tiết, cán bộ thực hiện (`staff_user_id`) và thời điểm diễn ra. Hiển thị dòng thời gian trên màn hình Company 360°.

#### FR-FU-02: Quản lý Nhiệm vụ Chăm sóc đối tác (Follow-up Tasks)

- **Priority:** P0
- **Actor:** Career Center
- **Hành vi hệ thống:**
  1. Cán bộ trường tạo nhiệm vụ cần xử lý tiếp theo với doanh nghiệp vào bảng `crm_follow_ups`.
  2. Bắt buộc chỉ định cán bộ chịu trách nhiệm (`owner_user_id`) và thời hạn hoàn thành (`due_date`). Bắt buộc liên kết với doanh nghiệp `company_id`.
  3. Quản lý vòng đời trạng thái nhiệm vụ: `TODO` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `DONE` (hoặc `CANCELLED`).
  4. Khi hoàn thành nhiệm vụ, cập nhật `completed_at` và ghi chú kết quả xử lý.

#### FR-FU-03: Cơ chế Nhận diện và Cảnh báo Nhiệm vụ Quá hạn trên UI

- **Priority:** P0
- **Actor:** Hệ thống & Giao diện CRM Career Center
- **Hành vi hệ thống:**
  1. Trạng thái quá hạn (`OVERDUE`) được **tính toán động tại thời điểm truy vấn** (Derived State) dựa trên điều kiện: `due_date < CURRENT_DATE` và trạng thái nhiệm vụ khác `DONE`/`CANCELLED`.
  2. Hiển thị trực quan qua huy hiệu cảnh báo (Warning Badge màu đỏ) trên danh sách công việc và màn hình Company 360°.
  3. **Ranh giới tinh giản:** Hệ thống không triển khai Background Cron-job để gửi Notification nhắc việc tự động nhằm đảm bảo tính khả thi trong thời gian 4 tháng của khóa luận.

---

### PHÂN HỆ 12: HỆ THỐNG THÔNG BÁO NỘI BỘ (MODULE 12 — NOTIFICATION)

#### FR-NOT-01: Tiếp nhận Sự kiện và Phát thông báo In-app Nội bộ

- **Priority:** P0
- **Actor:** Tất cả người dùng có tài khoản hợp lệ
- **Hành vi hệ thống:**
  1. Module 12 cung cấp Service nội bộ tiếp nhận các sự kiện nghiệp vụ từ các module nguồn và lưu vào bảng `notifications`:
     - Doanh nghiệp được phê duyệt hoặc bị từ chối kèm lý do (Module 04).
     - Tin tuyển dụng được duyệt công bố hoặc bị từ chối (Module 06).
     - Sinh viên nộp đơn ứng tuyển mới (Module 08 $\rightarrow$ thông báo cho Recruiter).
     - Đơn ứng tuyển chuyển trạng thái quan trọng: Phỏng vấn, Trúng tuyển, Từ chối (Module 08 $\rightarrow$ thông báo cho Sinh viên).
     - Lịch phỏng vấn được tạo mới, đổi lịch hoặc hủy (Module 10 $\rightarrow$ thông báo cho Sinh viên và Recruiter).
  2. Hộp thư thông báo (Notification Inbox): Người dùng xem danh sách thông báo của chính mình, sắp xếp theo thời gian mới nhất, phân biệt thông báo đã đọc và chưa đọc.
  3. Đánh dấu đã đọc: Cung cấp API cập nhật `is_read = TRUE` và `read_at = CURRENT_TIMESTAMP`.
- **Phân tầng mở rộng:** Thông báo qua kênh Email bên ngoài thuộc phân hệ **P1**; không ràng buộc vào tiêu chí nghiệm thu MVP.

---

### PHÂN HỆ 13: SỰ KIỆN NGHỀ NGHIỆP (MODULE 13 — CAREER EVENT)

#### FR-EVT-01: Quản trị Sự kiện Hướng nghiệp và Job Fair

- **Priority:** P1
- **Actor:** Career Center
- **Hành vi hệ thống:** Tạo và quản lý thông tin sự kiện: Tên ngày hội/workshop, Thời gian tổ chức, Địa điểm, Giới hạn số lượng tham dự (`capacity`), Thời hạn đăng ký, Mô tả nội dung.

#### FR-EVT-02: Đăng ký tham gia Sự kiện

- **Priority:** P1
- **Actor:** Student, Employer
- **Hành vi hệ thống:**
  1. Sinh viên và Doanh nghiệp đăng ký tham dự trực tiếp trên hệ thống; ghi nhận vào `event_registrations`.
  2. Hệ thống kiểm tra sức chứa tối đa (`capacity`): Tự động khóa đăng ký khi sự kiện đã đủ số lượng tham dự.
  3. Cho phép người tham gia hủy đăng ký trước khi sự kiện diễn ra.
- **Ranh giới tinh gọn:** MVP không tích hợp quét mã QR, check-in tại chỗ hay bán vé thu phí.

---

### PHÂN HỆ 14: BẢNG ĐIỀU KHIỂN VÀ BÁO CÁO (MODULE 14 — DASHBOARD & REPORT)

#### FR-DASH-01: Bảng điều khiển KPI cơ bản (Basic Dashboard Widgets)

- **Priority:** P0
- **Actor:** Student, Employer, Career Center
- **Hành vi hệ thống:** Hiển thị thẻ KPI tức thời phù hợp với không gian làm việc của từng nhóm người dùng:
  - **Student Workspace:** Số việc làm đã ứng tuyển, số đơn đang chờ xử lý, số lịch phỏng vấn sắp diễn ra.
  - **Employer Workspace:** Số tin tuyển dụng đang mở, số đơn ứng tuyển mới chưa duyệt, số lịch phỏng vấn trong tuần.
  - **Career Center Workspace:** Tổng số doanh nghiệp hợp tác, số việc làm đang tuyển toàn trường, số sinh viên đã được tuyển dụng thành công (`HIRED`), số nhiệm vụ Follow-up cần xử lý.

#### FR-DASH-02: Phân hệ Báo cáo Chuyên sâu và Xuất dữ liệu (Advanced Reports & Export)

- **Priority:** P1
- **Actor:** Career Center
- **Hành vi hệ thống:**
  1. **Báo cáo Phễu chuyển đổi tuyển dụng (Recruitment Conversion):** Thống kê tỷ lệ chuyển đổi qua các bước: `APPLIED` $\rightarrow$ `REVIEWING` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEW` $\rightarrow$ `OFFER` $\rightarrow$ `HIRED` theo từng tin tuyển dụng hoặc toàn trường.
  2. **Báo cáo Nhu cầu Tuyển dụng theo Ngành học:** Thống kê số lượng việc làm và số lượng vị trí tuyển dụng phân bổ theo từng ngành đào tạo của trường.
  3. **Trích xuất dữ liệu (Data Export):** Hỗ trợ xuất danh sách báo cáo ứng viên, báo cáo mạng lưới doanh nghiệp ra định dạng bảng tính **CSV** và **Excel (XLSX)**.

---

### PHÂN HỆ 15: NHẬT KÝ KIỂM TOÁN HỆ THỐNG (MODULE 15 — AUDIT LOG)

#### FR-AUD-01: Tự động Ghi nhận Nhật ký Kiểm toán (Activity Logging)

- **Priority:** P0
- **Actor:** Hệ thống Backend tự động ghi nhận
- **Hành vi hệ thống:**
  1. Mọi thao tác làm thay đổi dữ liệu nghiệp vụ quan trọng đều phát sinh bản ghi kiểm toán ghi vào bảng `activity_logs`:
     - Thao tác tài khoản: Đăng ký, Đổi mật khẩu, Khóa/Mở khóa tài khoản, Gán Role/Permission.
     - Thẩm định doanh nghiệp: Duyệt, Từ chối, Nộp lại hồ sơ xét duyệt.
     - Quản lý tin tuyển dụng: Duyệt, Từ chối, Công bố, Đóng tin.
     - Điều phối tuyển dụng: Nộp đơn, Rút đơn, Chuyển trạng thái tuyển dụng, Ghi nhận lịch phỏng vấn.
     - Nghiệp vụ CRM: Cập nhật trạng thái đối tác, Thay đổi cán bộ phụ trách nhiệm vụ Follow-up.
  2. Cấu trúc bản ghi kiểm toán: Tác nhân (`actor_user_id`), Hành động (`action`), Đối tượng tác động (`resource_type`, `resource_id`), Dữ liệu biến đổi (`old_values`, `new_values` dạng JSONB), Địa chỉ IP và Thời điểm (`created_at`).
- **Quy tắc an toàn bảo mật (Data Scrubbing):** Tuyệt đối nghiêm cấm ghi nhận mật khẩu, mật khẩu băm, mã token phiên hay thông tin bí mật vào bảng kiểm toán.

#### FR-AUD-02: Tra cứu và Giám sát Nhật ký Kiểm toán

- **Priority:** P0
- **Actor:** System Admin
- **Hành vi hệ thống:** Cung cấp giao diện tra cứu lịch sử kiểm toán toàn hệ thống. Hỗ trợ lọc theo loại hành động, loại đối tượng, khoảng thời gian thực hiện và phân trang danh sách. Bản ghi kiểm toán là bất biến ở cấp ứng dụng (không cung cấp API sửa/xóa log).

---

## 5. CÁC QUY TẮC CHỨC NĂNG XUYÊN SUỐT (CROSS-CUTTING RULES)

| Mã quy tắc  | Tên quy tắc                          | Phạm vi áp dụng & Chi tiết thực thi                                                                                                                                                                          |
| :---------- | :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-X-01** | **Backend Authorization Enforced**   | 100% các endpoint nghiệp vụ bắt buộc phải kiểm tra quyền (RBAC) và kiểm tra sở hữu dữ liệu (Data Ownership) tại Backend NestJS Guards; tuyệt đối không tin tưởng dữ liệu định danh từ Client.                |
| **FR-X-02** | **Data Isolation & Ownership Check** | Phân lập dữ liệu triệt để: Doanh nghiệp A tuyệt đối không được xem ứng viên hoặc tin tuyển dụng của Doanh nghiệp B; Sinh viên chỉ được thao tác trên hồ sơ và đơn ứng tuyển của chính mình.                  |
| **FR-X-03** | **State Machine Integrity**          | Các thực thể Company, Job, Application bắt buộc phải tuân thủ nghiêm ngặt ma trận chuyển đổi trạng thái đã định nghĩa; từ chối mọi thao tác nhảy cóc trạng thái trái quy tắc.                                |
| **FR-X-04** | **System Auditability**              | Mọi biến động dữ liệu quan trọng đều phải được lưu vết: Ứng tuyển có `application_status_histories`, toàn hệ thống có `activity_logs`.                                                                       |
| **FR-X-05** | **Student Privacy Protection**       | Phân tách nghiêm ngặt giữa Public Career Profile (họ tên, kỹ năng, kinh nghiệm, dự án) và Private Student Data (SĐT, Email cá nhân, Bảng điểm chi tiết, CV gốc); chỉ bộc lộ khi sinh viên nộp đơn ứng tuyển. |
| **FR-X-06** | **Secure File Storage Management**   | Tệp nhị phân (CV, Logo) lưu trữ trên Object Storage (MinIO); CSDL chỉ lưu metadata và URL tham chiếu; kiểm tra nghiêm ngặt định dạng MIME, phần mở rộng và kích thước tệp trước khi lưu.                     |
| **FR-X-07** | **Zero AI Dependency in Core**       | Phân hệ cốt lõi hoạt động độc lập hoàn toàn mà không cần các dịch vụ AI/ML/RAG; AI được định vị ở phân hệ nghiên cứu mở rộng P2.                                                                             |
| **FR-X-08** | **Zero External Service Dependency** | Quy trình nghiệm thu không phụ thuộc vào OTP SMS bên ngoài hay mail server công cộng; hệ thống hoạt động khép kín hoàn chỉnh.                                                                                |
| **FR-X-09** | **Single University Boundary**       | Hệ thống triển khai gói gọn cho 1 trường đại học cụ thể; không triển khai hạ tầng đa trường (Multi-tenant) hay SSO liên trường trong MVP.                                                                    |
| **FR-X-10** | **P0 Priority Enforcement**          | Hoàn thành và kiểm thử đạt chuẩn 100% các yêu cầu P0 trước khi phân bổ nguồn lực sang các yêu cầu P1 và P2.                                                                                                  |

---

## 6. MA TRẬN PHÂN BỔ CHỨC NĂNG THEO TÁC NHÂN (ACTOR MATRIX)

| Actor                    | Danh mục Yêu cầu Chức năng được phép thực hiện                                                                                                                    |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student**              | `FR-AUTH-01..03`; `FR-STU-01..04`; `FR-JDISC-01..03`; `FR-APP-01..02`; `FR-NOT-01`; `FR-EVT-02`; `FR-DASH-01`                                                     |
| **Employer / Recruiter** | `FR-AUTH-01,02,04`; `FR-SCD-01..02`; `FR-CVR-01,03`; `FR-CRM-01..02`; `FR-JOB-01..02,04`; `FR-RP-01..02`; `FR-INT-01..02`; `FR-NOT-01`; `FR-EVT-02`; `FR-DASH-01` |
| **Career Center**        | `FR-AUTH-01..02`; `FR-SCD-01..02`; `FR-CVR-02..03`; `FR-CRM-01..05`; `FR-JOB-03..04`; `FR-RP-01`; `FR-FU-01..03`; `FR-NOT-01`; `FR-EVT-01`; `FR-DASH-01..02`      |
| **System Admin**         | `FR-AUTH-01..02,05..06`; `FR-AUD-01..02` _(Không can thiệp vào quy trình tuyển dụng và CRM đối tác)_                                                              |

---

## 7. MA TRẬN PHÂN TẦNG ƯU TIÊN TRIỂN KHAI (P0 / P1 / P2)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PHÂN TẦNG ƯU TIÊN DỰ ÁN                         │
├────────────────────────────────────────────────────────────────────────┤
│  P0: BẮT BUỘC NGHIỆM THU (CORE MVP)                                    │
│  - Xác thực, Phân quyền RBAC, Master Data MSSV (Mod 01)                │
│  - Quản lý hồ sơ cá nhân & Đa bản CV (Mod 02)                          │
│  - Khám phá hồ sơ ứng viên công khai (Mod 03)                          │
│  - Đăng ký & Thẩm định doanh nghiệp (Mod 04)                           │
│  - Quản trị quan hệ đối tác, Contacts & Company 360° (Mod 05)         │
│  - Vòng đời tin tuyển dụng: Tạo, Duyệt, Công bố, Đóng (Mod 06)         │
│  - Tra cứu, tìm kiếm & xem chi tiết việc làm công khai (Mod 07)        │
│  - Nộp đơn, Rút đơn, Đóng băng CV Snapshot & Status History (Mod 08)   │
│  - Phễu tuyển dụng Kanban điều phối ứng viên (Mod 09)                  │
│  - Lịch phỏng vấn & Ghi nhận đánh giá sơ bộ (Mod 10)                   │
│  - Nhật ký tương tác CRM & Follow-up Task có cảnh báo UI (Mod 11)      │
│  - Hộp thư thông báo nội bộ In-app Notification (Mod 12)               │
│  - Bảng điều khiển KPI cơ bản cho từng Actor (Mod 14)                  │
│  - Nhật ký kiểm toán hệ thống Activity Logs (Mod 15)                   │
├────────────────────────────────────────────────────────────────────────┤
│  P1: NÊN HOÀN THÀNH (EXTENDED FEATURES)                                │
│  - Lưu tin tuyển dụng yêu thích (Bookmark Job - Mod 07)                │
│  - Quản lý Sự kiện nghề nghiệp & Tiếp nhận đăng ký (Mod 13)            │
│  - Báo cáo chuyển đổi phễu, Nhu cầu theo ngành & Export CSV/XLSX (Mod 14)
│  - Kênh phát thông báo bổ trợ qua Email (Mod 12)                       │
├────────────────────────────────────────────────────────────────────────┤
│  P2: ĐỊNH HƯỚNG MỞ RỘNG TƯƠNG LAI (FUTURE ROADMAP)                     │
│  - Trí tuệ nhân tạo so khớp CV – Job (AI Matching)                     │
│  - Gợi ý việc làm thông minh & Phân tích khoảng trống kỹ năng          │
│  - Trợ lý ảo AI tư vấn hướng nghiệp (RAG Career Assistant)             │
│  - Kiến trúc Đa trường (Multi-university) & Single Sign-On liên trường │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. DANH MỤC CÁC CHỨC NĂNG LOẠI TRỪ (OUT OF SCOPE TRONG MVP)

1. Không bắt buộc OTP qua SMS hoặc gửi Email Verification Link để kích hoạt tài khoản.
2. Không xây dựng tính năng nhắn tin tức thời (Realtime Chat) giữa Sinh viên và Nhà tuyển dụng.
3. Không xây dựng bộ tiêu chí chấm điểm phỏng vấn (Scorecard/Rubric) phức tạp; không nhúng nền tảng Video Call nội bộ.
4. Không thay thế hệ thống quản lý đào tạo, bảng điểm chính khóa (SIS); không quản lý chấm công, tính lương (HRM) của doanh nghiệp.
5. Không xây dựng mạng xã hội nghề nghiệp mở rộng ngoài trường (như LinkedIn).
6. Không để AI tự động đưa ra quyết định tuyển dụng hay loại bỏ hồ sơ sinh viên.
7. Không bắt buộc tích hợp cơ chế đăng nhập một lần Google/Microsoft SSO trong phạm vi cốt lõi.
8. Không triển khai mô hình phần mềm SaaS đa trường (Multi-tenant) trong khóa luận.

---

## 9. TRACEABILITY MATRIX (TỪ YÊU CẦU ĐẾN THIẾT KẾ & KIỂM THỬ)

| Mã FR Chuẩn hóa | Module SRS | Thực thể CSDL chính                            | API Endpoint Đề xuất                    | Tiêu chuẩn Kiểm thử Chấp nhận                                                 |
| :-------------- | :--------: | :--------------------------------------------- | :-------------------------------------- | :---------------------------------------------------------------------------- |
| **FR-AUTH-01**  |    M01     | `users`, `roles`, `permissions`                | `POST /auth/login`, `POST /auth/logout` | Đăng nhập đúng cấp phiên; sai chặn; tài khoản `LOCKED` từ chối `403`.         |
| **FR-AUTH-03**  |  M01, M02  | `student_masters`, `users`, `students`         | `POST /auth/student/register`           | Đúng MSSV tạo tài khoản; sai/trùng reject; không OTP; transaction an toàn.    |
| **FR-AUTH-04**  |  M01, M04  | `users`, `companies`, `company_contacts`       | `POST /auth/company/register`           | Tạo User + Company `PENDING`; chặn quyền đăng tin cho đến khi được duyệt.     |
| **FR-STU-02**   |    M02     | `student_skills`, `student_experiences`        | `POST/PUT /students/me/skills`          | Thêm/sửa kỹ năng đúng sinh viên; sinh viên khác không sửa được.               |
| **FR-STU-03**   |    M02     | `student_cvs`, MinIO Storage                   | `POST /students/me/cvs`                 | Upload CV lên MinIO thành công; DB lưu metadata; kiểm tra MIME/size.          |
| **FR-SCD-01**   |    M03     | `students`, `student_skills`                   | `GET /students/public`                  | Chỉ tìm thấy sinh viên bật Public Profile; che giấu dữ liệu riêng tư.         |
| **FR-CVR-02**   |    M04     | `companies`, `company_verification_requests`   | `POST /companies/:id/approve`           | Cập nhật `APPROVED`; mở khóa quyền tạo Job; phát thông báo In-app.            |
| **FR-CVR-03**   |    M04     | `company_verification_requests`                | `POST /companies/:id/reject`            | Bắt buộc nhập lý do từ chối; công ty được sửa và Resubmit.                    |
| **FR-CRM-02**   |    M05     | `company_contacts`                             | `POST /companies/:id/contacts`          | Chỉ cho phép duy nhất 1 Primary Contact; bảo vệ chống xung đột đồng thời.     |
| **FR-CRM-04**   |    M05     | Tổng hợp (Read-only aggregation)               | `GET /companies/:id/360`                | Hiển thị trọn vẹn Profile, Contacts, Jobs, Applicants, Tương tác, Follow-up.  |
| **FR-JOB-01**   |    M06     | `jobs`, `job_skills`                           | `POST /jobs`                            | Chỉ Company `APPROVED` mới tạo được; trạng thái ban đầu `DRAFT`.              |
| **FR-JOB-03**   |    M06     | `jobs`, `activity_logs`                        | `POST /jobs/:id/approve`                | Duyệt tin sang `PUBLISHED`; hiển thị ra cổng tìm việc sinh viên.              |
| **FR-JDISC-01** |    M07     | `jobs`, `companies`                            | `GET /jobs/public`                      | Tìm kiếm, lọc theo tiêu chí; chỉ trả tin `PUBLISHED` và còn hạn nộp.          |
| **FR-APP-01**   |    M08     | `applications`, `application_cv_snapshots`     | `POST /jobs/:id/apply`                  | Đóng băng CV Snapshot kèm SHA-256; ghi Status History; chống nộp trùng.       |
| **FR-APP-02**   |    M08     | `applications`, `application_status_histories` | `POST /applications/:id/withdraw`       | Rút đơn ở bước đầu thành công; chặn rút đơn khi đã bước vào phỏng vấn.        |
| **FR-RP-01**    |    M09     | Gọi Public Service Module 08                   | `GET /jobs/:id/pipeline`                | Hiển thị bảng Kanban theo vị trí tuyển dụng của công ty mình.                 |
| **FR-RP-02**    |    M09     | Gọi Public Service Module 08                   | `PATCH /applications/:id/status`        | Kéo thả Kanban cập nhật đúng status qua Module 08; ghi Status History.        |
| **FR-INT-01**   |    M10     | `interviews`, `notifications`                  | `POST /applications/:id/interviews`     | Tạo lịch hẹn; liên kết đơn ứng tuyển; phát In-app notification cho sinh viên. |
| **FR-FU-01**    |    M11     | `crm_interactions`                             | `POST /crm/interactions`                | Ghi nhận tương tác gắn với Company; hiển thị trên timeline Company 360°.      |
| **FR-FU-02**    |    M11     | `crm_follow_ups`                               | `POST /crm/follow-ups`                  | Giao việc có owner và due date; tính toán cảnh báo `OVERDUE` trên UI.         |
| **FR-NOT-01**   |    M12     | `notifications`                                | `GET /notifications`, `PATCH /read`     | Nhận thông báo đúng sự kiện; đánh dấu đã đọc; bảo vệ ownership hòm thư.       |
| **FR-EVT-01**   |    M13     | `career_events`, `event_registrations`         | `POST /events`, `POST /register`        | Quản lý sự kiện; tiếp nhận đăng ký; khóa khi hết sức chứa (Capacity).         |
| **FR-DASH-01**  |    M14     | Query tổng hợp từ các module                   | `GET /dashboard/kpi`                    | Trả số liệu KPI chính xác theo vai trò; không đếm trùng dữ liệu.              |
| **FR-DASH-02**  |    M14     | Query phân tích nâng cao                       | `GET /reports/conversion/export`        | Xuất báo cáo phễu chuyển đổi ra CSV/XLSX đúng định dạng (P1).                 |
| **FR-AUD-01**   |    M15     | `activity_logs`                                | Backend Interceptor / Event Listener    | Ghi nhận log đầy đủ; khử triệt để password/token (Data Scrubbing).            |

---

## 10. KẾT LUẬN VÀ BƯỚC TRIỂN KHAI TIẾP THEO

Tài liệu **Functional Requirements Specification v1.1** đã chuẩn hóa và đóng gói hoàn chỉnh yêu cầu nghiệp vụ của toàn bộ 15 module cốt lõi trong dự án:

1. **Tính nhất quán tuyệt đối:** Đồng bộ 100% với Scope v1.2, loại bỏ hoàn toàn các xung đột công nghệ cũ (Go vs NestJS), loại bỏ notification nhắc việc CRM tự động và phân tầng rõ ràng ranh giới P0/P1 cho Báo cáo và Thông báo.
2. **Khả năng kiểm chứng kỹ thuật:** Toàn bộ các yêu cầu đều có tiêu chí nghiệm thu rõ ràng, phân định cụ thể trách nhiệm giữa các module theo mô hình Modular Monolith và thiết lập ma trận truy vết (Traceability) chặt chẽ.

Bản tài liệu này là căn cứ kỹ thuật chính thức để tiếp tục hoàn thiện:

- **Tài liệu Đặc tả Use Case chi tiết (38 Use Cases Specification).**
- **Tài liệu Kiến trúc Cơ sở Dữ liệu (Database Architecture Specification - DDL & Prisma Schema).**
- **Tài liệu Đặc tả Giao diện Lập trình (API Contract Specification / Swagger).**
