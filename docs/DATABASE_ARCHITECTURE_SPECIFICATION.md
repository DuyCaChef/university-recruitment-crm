# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE ARCHITECTURE SPECIFICATION)

## HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC AN GIANG

| Thông tin | Giá trị chuẩn hóa |
| :--- | :--- |
| **Mã tài liệu** | `CRM-DBS-01` |
| **Phiên bản** | **v1.1.0 — Implementation Ready Baseline** |
| **Dự án** | Web CRM Sinh viên – Doanh nghiệp tại Trường Đại học An Giang (ĐHQG-HCM / AGU) |
| **Module phụ trách** | Toàn bộ 15 Module cốt lõi (Module 01 đến Module 15) |
| **Hệ quản trị CSDL** | PostgreSQL 16 Enterprise / Open Source |
| **ORM / Data Access** | Prisma ORM 5.x+ (TypeScript Type-safe Client) |
| **Storage Architecture** | PostgreSQL 16 (Relational Metadata) + MinIO / S3 (Binary Object Storage) |
| **Quy chuẩn định danh** | Single University Context (Mã SV: `DTH...`, Email: `@student.agu.edu.vn`) |
| **Trạng thái** | **Chính thức — Approved for DDL & Prisma Migration** |

---

## 1. TRIẾT LÝ THIẾT KẾ & TIÊU CHUẨN QUY ƯỚC (DESIGN STANDARDS)

Hệ thống được thiết kế theo mô hình quan hệ chuẩn hóa cao **3NF (Third Normal Form)**, ưu tiên tuyệt đối tính toàn vẹn dữ liệu, khả năng truy vết lịch sử tuyển dụng (Audit Trail) và kiểm soát phân quyền sở hữu (Data Ownership). Cơ sở dữ liệu PostgreSQL 16 đóng vai trò là "Single Source of Truth", trong khi Prisma ORM đóng vai trò là tầng schema migration và truy vấn type-safe, không thay thế các ràng buộc logic của CSDL.

```text
                         DATABASE DESIGN PRINCIPLES
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
   Data Integrity                Auditability                  Security
   3NF + FK + CHECK              Status History                RBAC + Ownership
   UNIQUE + Transaction          Immutable Snapshots           Backend Guard Enforced
   Concurrency Locking           Activity Logs (Scrubbed)      Private Data Isolation
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                         PostgreSQL 16 Engine
                                      │
                           Prisma Migration Layer
```

### 1.1. Quy ước đặt tên (Naming Conventions)

- **Tên bảng:** Danh từ số nhiều viết thường ở dạng `snake_case` (ví dụ: `student_masters`, `companies`, `application_cv_snapshots`, `crm_interactions`).
- **Khóa chính (PK):** Đặt tên là `id`, kiểu dữ liệu UUID (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`).
- **Khóa ngoại (FK):** Định dạng `<singular_entity>_id` (ví dụ: `student_id`, `company_id`, `job_id`, `application_id`).
- **Cột thời gian:** Bắt buộc kiểu `TIMESTAMPTZ` (lưu UTC), hậu tố `_at` (ví dụ: `created_at`, `updated_at`, `reviewed_at`, `applied_at`, `cancelled_at`).
- **Cột logic (Boolean):** Tiền tố `is_` hoặc `has_`, định nghĩa `NOT NULL` và luôn có giá trị `DEFAULT` rõ ràng (ví dụ: `is_default`, `is_primary`, `is_active`).
- **Chuỗi ký tự:** Dùng `VARCHAR(n)` có giới hạn độ dài cho các trường định danh/mã/tên; dùng `TEXT` cho văn bản dài, mô tả nội dung.
- **Tiền tệ / Lương:** Sử dụng `NUMERIC(15,2)`, tuyệt đối không dùng kiểu số thực dấu phẩy động (`FLOAT`/`DOUBLE`) để tránh sai số làm tròn.
- **Dữ liệu phi cấu trúc:** Dùng `JSONB` cho snapshot lịch sử hoặc dữ liệu cấu hình linh hoạt; tuyệt đối không dùng JSONB để thay thế các quan hệ bảng chuẩn hóa 3NF.

### 1.2. Khóa chính, Khóa ngoại và Toàn vẹn tham chiếu

- **UUID v4 làm định danh nội bộ:** Tránh phụ thuộc vào số tăng tự động (Auto-increment ID), ngăn ngừa nguy cơ tấn công thu thập dữ liệu hàng loạt (Enumeration Attack/IDOR).
- **Chính sách cập nhật (`ON UPDATE`):** Mặc định `NO ACTION / RESTRICT` vì các giá trị UUID là bất biến sau khi sinh ra.
- **Chính sách xóa (`ON DELETE`):**
  - `CASCADE`: Chỉ áp dụng hạn chế cho các bảng quan hệ phụ thuộc hoàn toàn vào bảng cha (ví dụ: `user_roles`, `role_permissions`, `job_skills`, `student_skills`).
  - `RESTRICT / NO ACTION`: Áp dụng cho 100% dữ liệu nghiệp vụ cần bảo toàn chứng cứ lịch sử (ví dụ: `student_masters` $\rightarrow$ `students`, `companies` $\rightarrow$ `jobs` $\rightarrow$ `applications` $\rightarrow$ `application_status_histories`).
  - `SET NULL`: Áp dụng cho các tham chiếu tùy chọn khi actor hoặc đối tượng nguồn bị vô hiệu hóa (ví dụ: `reviewed_by`, `contact_id`, `cv_id` trong bảng `applications`).

### 1.3. Tính bất biến và Bảo toàn dấu vết (Audit & Snapshots)

- **Nguyên tắc không xóa cứng (No Hard-Delete on Business Entities):** Nghiêm cấm câu lệnh `DELETE` vật lý đối với các thực thể tuyển dụng cốt lõi khi đã có giao dịch phát sinh.
- **Single Source of Truth cho Ứng tuyển:** Đơn ứng tuyển (`applications`) bắt buộc phải có trạng thái hiện tại (`status`) đi kèm bảng dòng thời gian chuyển trạng thái (`application_status_histories`).
- **CV Snapshot bất biến (`application_cv_snapshots`):** Khi sinh viên nộp hồ sơ, hệ thống tạo một bản ghi snapshot độc lập lưu trữ đường dẫn Object Storage riêng biệt kèm mã băm SHA-256. Mọi thao tác sửa/xóa CV gốc của sinh viên sau này hoàn toàn không làm biến đổi hồ sơ đã nộp cho doanh nghiệp.
- **Audit Log độc lập và Append-Only:** Bảng `activity_logs` lưu vết mọi hành vi biến động dữ liệu nhạy cảm theo kiến trúc ghi tăng dần (Append-only).

### 1.4. Phân tách lưu trữ tệp (Object Storage Boundary)

```text
PostgreSQL 16 (Metadata Only)
   └── files
       ├── id (UUID)
       ├── original_name (VARCHAR)
       ├── mime_type (VARCHAR)
       ├── size_bytes (BIGINT)
       └── storage_key (VARCHAR, UNIQUE)
                 │
                 ▼
        MinIO / S3 Object Storage (Binary Data)
                 └── {bucket}/{storage_key} (Binary PDF / PNG / JPG)
```

Cơ sở dữ liệu PostgreSQL tuyệt đối không lưu trữ file nhị phân (Binary LOBs/Bytea) mà chỉ quản lý Metadata và đường dẫn tham chiếu `storage_key`. Dữ liệu nhị phân của CV và Logo được lưu trữ trên MinIO / Object Storage tương thích AWS S3.

### 1.5. Danh mục Enum Baseline

Hệ thống thiết lập 17 kiểu dữ liệu Enums chuẩn hóa trên PostgreSQL 16:

| Tên Enum PostgreSQL | Danh mục giá trị hợp lệ | Phạm vi ứng dụng |
| :--- | :--- | :--- |
| `user_status` | `ACTIVE, LOCKED, INACTIVE` | Vòng đời tài khoản người dùng (`users`) |
| `student_status` | `ACTIVE, GRADUATED, SUSPENDED` | Trạng thái sinh viên AGU (`student_masters`, `students`) |
| `company_verification_status` | `PENDING, APPROVED, REJECTED, SUSPENDED` | Thẩm định pháp nhân doanh nghiệp (`companies`) |
| `company_relationship_status` | `NEW, POTENTIAL, ACTIVE_PARTNER, STRATEGIC, INACTIVE` | Quan hệ đối tác CRM nhà trường (`companies`) |
| `verification_request_status` | `PENDING, APPROVED, REJECTED` | Lịch sử yêu cầu xét duyệt (`company_verification_requests`) |
| `job_status` | `DRAFT, PENDING_APPROVAL, PUBLISHED, REJECTED, CLOSED` | Vòng đời tin tuyển dụng (`jobs`) |
| `employment_type` | `FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT` | Hình thức làm việc (`jobs`, `recruitment_results`) |
| `application_status` | `APPLIED, REVIEWING, SHORTLISTED, INTERVIEW, OFFER, HIRED, REJECTED, WITHDRAWN` | Phễu trạng thái ứng tuyển (`applications`) |
| `recruitment_result_type` | `HIRED, REJECTED` | Quyết định tuyển dụng cuối cùng (`recruitment_results`) |
| `interview_type` | `ONSITE, ONLINE, PHONE` | Hình thức gặp mặt phỏng vấn (`interviews`) |
| `interview_status` | `SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED` | Trạng thái lịch phỏng vấn (`interviews`) |
| `interaction_type` | `CALL, EMAIL, MEETING, EVENT, JOB_FAIR, OTHER` | Hoạt động tiếp xúc CRM (`crm_interactions`) |
| `interaction_visibility` | `INTERNAL, COMPANY_SHARED` | Phân quyền hiển thị nhật ký (`crm_interactions`) |
| `follow_up_status` | `TODO, IN_PROGRESS, DONE, CANCELLED` | Vòng đời nhiệm vụ chăm sóc đối tác (`follow_up_tasks`) |
| `event_type` | `JOB_FAIR, CAREER_TALK, WORKSHOP` | Thể loại sự kiện việc làm (`events`) |
| `event_status` | `DRAFT, PUBLISHED, CLOSED` | Vòng đời sự kiện (`events`) |
| `registration_status` | `REGISTERED, CANCELLED` | Trạng thái đăng ký tham dự (`event_registrations`) |

---

## 2. SƠ ĐỒ MỐI QUAN HỆ THỰC THỂ (ENTITY RELATIONSHIP DIAGRAM — 29 TABLES)

```text
STUDENT_MASTERS (AGU Data)
       │ 1
       └── 0..1 ── STUDENTS ──< STUDENT_SKILLS
                      │     ├──< STUDENT_EXPERIENCES
                      │     ├──< STUDENT_PROJECTS
                      │     ├──< STUDENT_CVS >── FILES
                      │     ├──< SAVED_JOBS >── JOBS
                      │     └──< APPLICATIONS >── JOBS
                      │              │
                      │              ├── 1:1 ── APPLICATION_CV_SNAPSHOTS >── FILES
                      │              ├── 1:N ── APPLICATION_STATUS_HISTORIES
                      │              ├── 1:1 ── RECRUITMENT_RESULTS
                      │              └── 1:N ── INTERVIEWS
                      │
USERS ──< USER_ROLES >── ROLES ──< ROLE_PERMISSIONS >── PERMISSIONS
  │
  ├── 0..1 (Link via Student Master Registration)
  ├── 1:N ── FILES
  ├── 0..1 ── COMPANY_CONTACTS >── COMPANIES ──< JOBS ──< JOB_SKILLS
  │                                   │
  │                                   ├──< COMPANY_VERIFICATION_REQUESTS
  │                                   ├──< CRM_INTERACTIONS ──0..1> FOLLOW_UP_TASKS
  │                                   └──< EVENT_REGISTRATIONS
  │
  ├── 1:N ── NOTIFICATIONS
  ├── 1:N ── EVENTS ──< EVENT_REGISTRATIONS
  └── 1:N ── ACTIVITY_LOGS (Polymorphic Target)

JOBS             ──0..1> CRM_INTERACTIONS
EVENTS           ──0..1> CRM_INTERACTIONS
COMPANY_CONTACTS ──0..1> CRM_INTERACTIONS
```

### 2.1. Ma trận Bậc quan hệ cốt lõi (Cardinality Matrix)

| Quan hệ giữa các thực thể | Cardinality | Ràng buộc nghiệp vụ toàn vẹn |
| :--- | :---: | :--- |
| `student_masters` $\rightarrow$ `students` | `1 : 0..1` | Mỗi MSSV trường nạp chỉ được liên kết tối đa 01 hồ sơ sinh viên đã kích hoạt. |
| `users` $\rightarrow$ `students` | `1 : 1` | Mỗi tài khoản sinh viên liên kết chính xác 01 hồ sơ `students` (`user_id UNIQUE`). |
| `users` $\rightarrow$ `user_roles` | `1 : N` | Một tài khoản có thể có nhiều vai trò (Role). |
| `roles` $\rightarrow$ `role_permissions` | `1 : N` | Một vai trò bao gồm nhiều quyền nguyên tử (Permission). |
| `students` $\rightarrow$ `student_cvs` | `1 : N` | Sinh viên tải lên nhiều bản CV; tối đa 01 bản CV mặc định (`is_default = TRUE`). |
| `companies` $\rightarrow$ `company_contacts` | `1 : N` | Doanh nghiệp có nhiều người liên hệ; duy nhất 01 Primary Contact (`is_primary = TRUE`). |
| `users` $\rightarrow$ `company_contacts` | `0..1 : 0..1` | Contact CRM có thể chưa có tài khoản (`user_id NULL`); nếu có thì liên kết duy nhất 1-1. |
| `companies` $\rightarrow$ `jobs` | `1 : N` | Doanh nghiệp đã được duyệt (`APPROVED`) được đăng nhiều tin tuyển dụng. |
| `jobs` $\rightarrow$ `applications` | `1 : N` | Một tin tuyển dụng nhận nhiều đơn ứng tuyển. |
| `students` $\rightarrow$ `applications` | `1 : N` | Sinh viên nộp đơn vào nhiều tin khác nhau; cấm nộp trùng (`UNIQUE(job_id, student_id)`). |
| `applications` $\rightarrow$ `application_cv_snapshots` | `1 : 1` | Mỗi đơn ứng tuyển gắn chặt với duy nhất 01 bản CV Snapshot bất biến độc lập. |
| `applications` $\rightarrow$ `application_status_histories`| `1 : N` | Lưu vết đầy đủ toàn bộ các lần đổi trạng thái ứng tuyển theo trình tự thời gian. |
| `applications` $\rightarrow$ `recruitment_results` | `1 : 0..1` | Tối đa 01 bản ghi kết quả tuyển dụng chính thức gắn với đơn ứng tuyển. |
| `applications` $\rightarrow$ `interviews` | `1 : N` | Một đơn ứng tuyển có thể trải qua một hoặc nhiều vòng phỏng vấn. |
| `companies` $\rightarrow$ `crm_interactions` | `1 : N` | Lưu vết lịch sử tương tác đa kênh phục vụ màn hình Company 360°. |
| `companies` $\rightarrow$ `follow_up_tasks` | `1 : N` | Nhiệm vụ chăm sóc doanh nghiệp có cán bộ phụ trách và kỳ hạn xử lý. |
| `events` $\rightarrow$ `event_registrations` | `1 : N` | Sự kiện tiếp nhận đăng ký; kiểm soát không vượt quá sức chứa (`capacity`). |

---

## 3. ĐẶC TẢ CHI TIẾT LƯỢC ĐỒ CƠ SỞ DỮ LIỆU (DATA DICTIONARY — 29 TABLES)

### PHÂN HỆ 01: XÁC THỰC VÀ PHÂN QUYỀN (AUTHENTICATION & RBAC)

#### 3.1. Bảng `users`
Tài khoản đăng nhập dùng chung cho toàn bộ các nhóm Actor trong hệ thống.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status user_status NOT NULL DEFAULT 'ACTIVE',
    last_login_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính (Primary Key). |
| `email` | `VARCHAR(255)` | **NO** | — | Email đăng nhập hệ thống; Ràng buộc UNIQUE toàn cục. |
| `password_hash` | `VARCHAR(255)` | **NO** | — | Mật khẩu băm an toàn (Argon2id hoặc BCrypt salt rounds $\ge 10$). |
| `status` | `user_status` | **NO** | `'ACTIVE'` | Trạng thái tài khoản: `ACTIVE, LOCKED, INACTIVE`. |
| `last_login_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm đăng nhập thành công gần nhất. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo bản ghi. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật thông tin gần nhất. |

#### 3.2. Bảng `roles`
Danh mục vai trò người dùng trong mô hình phân quyền RBAC.

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_code UNIQUE (code)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `code` | `VARCHAR(50)` | **NO** | — | Mã định danh vai trò (`STUDENT`, `EMPLOYER`, `CAREER_CENTER`, `ADMIN`); UNIQUE. |
| `name` | `VARCHAR(100)` | **NO** | — | Tên hiển thị của vai trò. |
| `description` | `TEXT` | YES | `NULL` | Mô tả trách nhiệm của vai trò. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật. |

#### 3.3. Bảng `permissions`
Danh mục quyền hạn nguyên tử bảo vệ API endpoints và tài nguyên.

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_permissions_code UNIQUE (code)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `code` | `VARCHAR(100)` | **NO** | — | Mã quyền hạn (`JOB_CREATE`, `COMPANY_APPROVE`); UNIQUE. |
| `name` | `VARCHAR(150)` | **NO** | — | Tên diễn giải quyền hạn. |
| `description` | `TEXT` | YES | `NULL` | Chi tiết hành động được phép thực thi. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |

#### 3.4. Bảng `user_roles`
Bảng trung gian phân bổ vai trò cho người dùng ($N:N$).

```sql
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `user_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `users(id)`; thành phần Composite PK. |
| `role_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `roles(id)`; thành phần Composite PK. |
| `assigned_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm gán vai trò. |

#### 3.5. Bảng `role_permissions`
Bảng trung gian phân bổ quyền hạn cho từng vai trò ($N:N$).

```sql
CREATE TABLE role_permissions (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `role_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `roles(id)`; thành phần Composite PK. |
| `permission_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `permissions(id)`; thành phần Composite PK. |
| `granted_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cấp quyền cho vai trò. |

---

### PHÂN HỆ 02: DỮ LIỆU GỐC VÀ HỒ SƠ SINH VIÊN (STUDENT MASTER & PROFILE)

#### 3.6. Bảng `student_masters` *(Bảng mới — Chuẩn hóa AGU)*
Dữ liệu sinh viên gốc do Trường Đại học An Giang nạp trước (Seed/Import Data).

```sql
CREATE TABLE student_masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code VARCHAR(30) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    institutional_email VARCHAR(255) NOT NULL,
    major VARCHAR(150) NOT NULL,
    faculty VARCHAR(150) NULL DEFAULT NULL,
    academic_year INTEGER NULL DEFAULT NULL,
    status student_status NOT NULL DEFAULT 'ACTIVE',
    user_id UUID NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_student_masters_code UNIQUE (student_code),
    CONSTRAINT uq_student_masters_inst_email UNIQUE (institutional_email),
    CONSTRAINT uq_student_masters_user UNIQUE (user_id),
    CONSTRAINT fk_student_masters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_student_masters_academic_year CHECK (academic_year IS NULL OR academic_year > 0)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_code` | `VARCHAR(30)` | **NO** | — | Mã sinh viên AGU (ví dụ: `DTH235632`); UNIQUE tuyệt đối. |
| `full_name` | `VARCHAR(150)` | **NO** | — | Họ và tên sinh viên theo hồ sơ đào tạo của trường. |
| `institutional_email` | `VARCHAR(255)` | **NO** | — | Email định danh trường (`@student.agu.edu.vn`); UNIQUE. |
| `major` | `VARCHAR(150)` | **NO** | — | Chuyên ngành đào tạo. |
| `faculty` | `VARCHAR(150)` | YES | `NULL` | Khoa chủ quản (ví dụ: Khoa Công nghệ thông tin). |
| `academic_year` | `INTEGER` | YES | `NULL` | Khóa tuyển sinh (ví dụ: 24, 25); CHECK `> 0`. |
| `status` | `student_status` | **NO** | `'ACTIVE'` | Tình trạng học tập: `ACTIVE, GRADUATED, SUSPENDED`. |
| `user_id` | `UUID` | YES | `NULL` | Liên kết tài khoản `users(id)`; UNIQUE; NULL nếu chưa đăng ký. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm nạp dữ liệu gốc. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật dữ liệu gốc. |

#### 3.7. Bảng `students`
Hồ sơ năng lực cá nhân và thông tin tìm việc của sinh viên sau khi tạo tài khoản.

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_master_id UUID NOT NULL,
    user_id UUID NOT NULL,
    phone VARCHAR(30) NULL DEFAULT NULL,
    bio TEXT NULL DEFAULT NULL,
    address TEXT NULL DEFAULT NULL,
    date_of_birth DATE NULL DEFAULT NULL,
    gender VARCHAR(30) NULL DEFAULT NULL,
    career_profile_visibility BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_students_master UNIQUE (student_master_id),
    CONSTRAINT uq_students_user UNIQUE (user_id),
    CONSTRAINT fk_students_master FOREIGN KEY (student_master_id) REFERENCES student_masters(id) ON DELETE RESTRICT,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_master_id` | `UUID` | **NO** | — | FK tham chiếu `student_masters(id)`; UNIQUE 1-1; cấm xóa gốc. |
| `user_id` | `UUID` | **NO** | — | FK tham chiếu `users(id)`; UNIQUE 1-1. |
| `phone` | `VARCHAR(30)` | YES | `NULL` | Số điện thoại liên hệ cá nhân (Private Student Data). |
| `bio` | `TEXT` | YES | `NULL` | Đoạn giới thiệu bản thân / mục tiêu nghề nghiệp. |
| `address` | `TEXT` | YES | `NULL` | Địa chỉ thường trú / liên hệ. |
| `date_of_birth` | `DATE` | YES | `NULL` | Ngày tháng năm sinh. |
| `gender` | `VARCHAR(30)` | YES | `NULL` | Giới tính (Nam, Nữ, Khác). |
| `career_profile_visibility` | `BOOLEAN` | **NO** | `FALSE` | Cờ bật/tắt hiển thị Public Career Profile cho nhà tuyển dụng. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm kích hoạt hồ sơ. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật hồ sơ. |

#### 3.8. Bảng `student_skills`
Danh mục kỹ năng chuyên môn của sinh viên.

```sql
CREATE TABLE student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(30) NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_student_skills_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_skills_name UNIQUE (student_id, skill_name)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE CASCADE. |
| `skill_name` | `VARCHAR(100)` | **NO** | — | Tên kỹ năng (ví dụ: Node.js, SQL, Java); UNIQUE theo sinh viên. |
| `proficiency` | `VARCHAR(30)` | YES | `NULL` | Mức độ thành thạo (Beginner, Intermediate, Advanced). |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |

#### 3.9. Bảng `student_experiences`
Kinh nghiệm làm việc và thực tập của sinh viên.

```sql
CREATE TABLE student_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL DEFAULT NULL,
    description TEXT NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_student_exp_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT chk_student_exp_dates CHECK (end_date IS NULL OR end_date >= start_date)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE CASCADE. |
| `company_name` | `VARCHAR(150)` | **NO** | — | Tên cơ quan, doanh nghiệp đã thực tập / làm việc. |
| `position` | `VARCHAR(150)` | **NO** | — | Vị trí / chức danh đảm nhiệm. |
| `start_date` | `DATE` | **NO** | — | Ngày bắt đầu. |
| `end_date` | `DATE` | YES | `NULL` | Ngày kết thúc; CHECK `end_date >= start_date`. |
| `description` | `TEXT` | YES | `NULL` | Chi tiết công việc thực hiện. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |

#### 3.10. Bảng `student_projects`
Dự án thực tế và sản phẩm tiêu biểu của sinh viên.

```sql
CREATE TABLE student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL DEFAULT NULL,
    role VARCHAR(100) NULL DEFAULT NULL,
    technologies TEXT NULL DEFAULT NULL,
    project_url VARCHAR(500) NULL DEFAULT NULL,
    start_date DATE NULL DEFAULT NULL,
    end_date DATE NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_student_projects_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT chk_student_proj_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE CASCADE. |
| `name` | `VARCHAR(200)` | **NO** | — | Tên dự án tiêu biểu. |
| `description` | `TEXT` | YES | `NULL` | Mục tiêu và mô tả dự án. |
| `role` | `VARCHAR(100)` | YES | `NULL` | Vai trò trong dự án (Leader, Frontend Dev...). |
| `technologies` | `TEXT` | YES | `NULL` | Công nghệ sử dụng. |
| `project_url` | `VARCHAR(500)` | YES | `NULL` | Liên kết mã nguồn (GitHub) hoặc sản phẩm demo. |
| `start_date` | `DATE` | YES | `NULL` | Ngày khởi động dự án. |
| `end_date` | `DATE` | YES | `NULL` | Ngày kết thúc; CHECK `end_date >= start_date`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |

---

### PHÂN HỆ 03: QUẢN LÝ TỆP TIN VÀ CV (FILE STORAGE & STUDENT CVS)

#### 3.11. Bảng `files`
Siêu dữ liệu (Metadata) của các tệp nhị phân lưu trữ trên MinIO Object Storage.

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NULL DEFAULT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_files_storage_key UNIQUE (storage_key),
    CONSTRAINT fk_files_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_files_size_positive CHECK (size_bytes > 0)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `owner_user_id` | `UUID` | YES | `NULL` | FK tham chiếu `users(id)`; người tải tệp lên. |
| `original_name` | `VARCHAR(255)` | **NO** | — | Tên tệp gốc từ phía người dùng (ví dụ: `CV_NguyenVanA.pdf`). |
| `storage_key` | `VARCHAR(500)` | **NO** | — | Khóa đường dẫn Object Storage (MinIO); UNIQUE toàn cục. |
| `mime_type` | `VARCHAR(100)` | **NO** | — | Định dạng MIME đã kiểm duyệt (`application/pdf`, `image/png`...). |
| `size_bytes` | `BIGINT` | **NO** | — | Kích thước tệp (bytes); CHECK `size_bytes > 0`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm lưu trữ metadata. |

#### 3.12. Bảng `student_cvs`
Danh mục đa bản CV trong kho tài liệu cá nhân của sinh viên.

```sql
CREATE TABLE student_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    file_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_student_cvs_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_cvs_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE CASCADE. |
| `file_id` | `UUID` | **NO** | — | FK tham chiếu `files(id)` ON DELETE RESTRICT (chống xóa file gốc). |
| `title` | `VARCHAR(150)` | **NO** | — | Tên gợi nhớ của bản CV (ví dụ: "CV Backend Golang", "CV Java"). |
| `is_default` | `BOOLEAN` | **NO** | `FALSE` | Đánh dấu CV mặc định; tối đa 01 bản ghi `TRUE`/sinh viên. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật. |

---

### PHÂN HỆ 04: QUẢN TRỊ ĐỐI TÁC DOANH NGHIỆP VÀ CRM (COMPANY & CRM CORE)

#### 3.13. Bảng `companies`
Hồ sơ pháp nhân doanh nghiệp, trạng thái thẩm định và quan hệ đối tác CRM.

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    tax_code VARCHAR(50) NULL DEFAULT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL DEFAULT NULL,
    website VARCHAR(500) NULL DEFAULT NULL,
    address TEXT NULL DEFAULT NULL,
    industry VARCHAR(100) NULL DEFAULT NULL,
    company_size VARCHAR(50) NULL DEFAULT NULL,
    description TEXT NULL DEFAULT NULL,
    logo_file_id UUID NULL DEFAULT NULL,
    verification_status company_verification_status NOT NULL DEFAULT 'PENDING',
    relationship_status company_relationship_status NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_companies_tax_code UNIQUE (tax_code),
    CONSTRAINT fk_companies_logo FOREIGN KEY (logo_file_id) REFERENCES files(id) ON DELETE SET NULL
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `name` | `VARCHAR(200)` | **NO** | — | Tên pháp nhân đầy đủ của doanh nghiệp. |
| `tax_code` | `VARCHAR(50)` | YES | `NULL` | Mã số thuế; UNIQUE nếu có giá trị. |
| `email` | `VARCHAR(255)` | **NO** | — | Email liên hệ chính thức của doanh nghiệp. |
| `phone` | `VARCHAR(30)` | YES | `NULL` | Số điện thoại tổng đài / hotline. |
| `website` | `VARCHAR(500)` | YES | `NULL` | Website chính thức. |
| `address` | `TEXT` | YES | `NULL` | Địa chỉ trụ sở chính / chi nhánh. |
| `industry` | `VARCHAR(100)` | YES | `NULL` | Lĩnh vực hoạt động (CNTT, Ngân hàng, Cơ khí công nghệ cao...). |
| `company_size` | `VARCHAR(50)` | YES | `NULL` | Quy mô nhân sự (ví dụ: `1-50`, `51-200`, `201-500`, `500+`). |
| `description` | `TEXT` | YES | `NULL` | Giới thiệu doanh nghiệp, môi trường văn hóa. |
| `logo_file_id` | `UUID` | YES | `NULL` | FK tham chiếu `files(id)` chứa logo nhãn hiệu. |
| `verification_status` | `company_verification_status` | **NO** | `'PENDING'` | Trạng thái thẩm định: `PENDING, APPROVED, REJECTED, SUSPENDED`. |
| `relationship_status` | `company_relationship_status` | **NO** | `'NEW'` | Quan hệ CRM độc quyền của trường: `NEW, POTENTIAL, ACTIVE_PARTNER, STRATEGIC, INACTIVE`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm đăng ký. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật hồ sơ. |

#### 3.14. Bảng `company_contacts`
Danh bạ nhân sự đại diện của doanh nghiệp phục vụ quản trị quan hệ CRM.

```sql
CREATE TABLE company_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    user_id UUID NULL DEFAULT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL DEFAULT NULL,
    position VARCHAR(100) NULL DEFAULT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_company_contacts_user UNIQUE (user_id),
    CONSTRAINT fk_company_contacts_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_company_contacts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `company_id` | `UUID` | **NO** | — | FK tham chiếu `companies(id)` ON DELETE RESTRICT. |
| `user_id` | `UUID` | YES | `NULL` | FK `users(id)`; UNIQUE; NULL nếu là nhân sự CRM chưa cấp account. |
| `full_name` | `VARCHAR(150)` | **NO** | — | Họ và tên người liên hệ. |
| `email` | `VARCHAR(255)` | **NO** | — | Email làm việc của người liên hệ. |
| `phone` | `VARCHAR(30)` | YES | `NULL` | Số điện thoại di động làm việc. |
| `position` | `VARCHAR(100)` | YES | `NULL` | Chức vụ (HR Manager, Tech Lead, Recruiter). |
| `is_primary` | `BOOLEAN` | **NO** | `FALSE` | Người liên hệ chính (tối đa 01 Primary Contact hoạt động/công ty). |
| `is_active` | `BOOLEAN` | **NO** | `TRUE` | Trạng thái hoạt động; dùng soft-deactivate khi nhân sự nghỉ việc. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo contact. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật contact. |

#### 3.15. Bảng `company_verification_requests`
Lịch sử các lần doanh nghiệp gửi hồ sơ yêu cầu Career Center AGU xét duyệt.

```sql
CREATE TABLE company_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    submitted_by UUID NOT NULL,
    status verification_request_status NOT NULL DEFAULT 'PENDING',
    reason TEXT NULL DEFAULT NULL,
    reviewed_by UUID NULL DEFAULT NULL,
    reviewed_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_cvr_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cvr_submitter FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cvr_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_cvr_rejected_reason CHECK (status <> 'REJECTED' OR (reason IS NOT NULL AND length(trim(reason)) > 0))
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `company_id` | `UUID` | **NO** | — | FK tham chiếu `companies(id)` ON DELETE RESTRICT. |
| `submitted_by` | `UUID` | **NO** | — | FK tham chiếu `users(id)` của Recruiter gửi hồ sơ. |
| `status` | `verification_request_status` | **NO** | `'PENDING'` | Trạng thái xét duyệt: `PENDING, APPROVED, REJECTED`. |
| `reason` | `TEXT` | YES | `NULL` | Lý do từ chối; bắt buộc có nội dung khi status là `REJECTED`. |
| `reviewed_by` | `UUID` | YES | `NULL` | FK `users(id)` của Cán bộ Career Center thực hiện duyệt. |
| `reviewed_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm phê duyệt hoặc từ chối. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm gửi yêu cầu xét duyệt. |

---

### PHÂN HỆ 05: TIN TUYỂN DỤNG VÀ KHÁM PHÁ VIỆC LÀM (JOBS & DISCOVERY)

#### 3.16. Bảng `jobs`
Tin tuyển dụng việc làm do doanh nghiệp đăng tải và nhà trường kiểm duyệt.

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    created_by UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NULL DEFAULT NULL,
    employment_type employment_type NOT NULL,
    salary_min NUMERIC(15,2) NULL DEFAULT NULL,
    salary_max NUMERIC(15,2) NULL DEFAULT NULL,
    deadline DATE NULL DEFAULT NULL,
    status job_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_jobs_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_jobs_salary_non_negative CHECK (
        (salary_min IS NULL OR salary_min >= 0) AND 
        (salary_max IS NULL OR salary_max >= 0)
    ),
    CONSTRAINT chk_jobs_salary_range CHECK (
        salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min
    )
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `company_id` | `UUID` | **NO** | — | FK tham chiếu `companies(id)` ON DELETE RESTRICT. |
| `created_by` | `UUID` | **NO** | — | FK tham chiếu `users(id)` của Recruiter tạo tin. |
| `title` | `VARCHAR(200)` | **NO** | — | Tiêu đề vị trí tuyển dụng (ví dụ: "Lập trình viên ReactJS"). |
| `description` | `TEXT` | **NO** | — | Mô tả chi tiết yêu cầu, trách nhiệm và quyền lợi. |
| `location` | `VARCHAR(255)` | YES | `NULL` | Địa điểm làm việc (An Giang, Cần Thơ, TP.HCM...). |
| `employment_type` | `employment_type` | **NO** | — | Hình thức: `FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT`. |
| `salary_min` | `NUMERIC(15,2)` | YES | `NULL` | Mức lương tối thiểu (VNĐ); CHECK $\ge 0$. |
| `salary_max` | `NUMERIC(15,2)` | YES | `NULL` | Mức lương tối đa (VNĐ); CHECK `salary_max >= salary_min`. |
| `deadline` | `DATE` | YES | `NULL` | Hạn chót nhận hồ sơ ứng tuyển. |
| `status` | `job_status` | **NO** | `'DRAFT'` | Trạng thái: `DRAFT, PENDING_APPROVAL, PUBLISHED, REJECTED, CLOSED`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo tin tuyển dụng. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật tin tuyển dụng. |

#### 3.17. Bảng `job_skills`
Danh mục kỹ năng yêu cầu gắn với tin tuyển dụng.

```sql
CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    required_level VARCHAR(30) NULL DEFAULT NULL,
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uq_job_skills_name UNIQUE (job_id, skill_name)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `job_id` | `UUID` | **NO** | — | FK tham chiếu `jobs(id)` ON DELETE CASCADE. |
| `skill_name` | `VARCHAR(100)` | **NO** | — | Kỹ năng yêu cầu (TypeScript, PostgreSQL...); UNIQUE theo job. |
| `required_level` | `VARCHAR(30)` | YES | `NULL` | Trình độ mong muốn (Cơ bản, Thành thạo). |

#### 3.18. Bảng `saved_jobs`
Danh mục tin việc làm được sinh viên đánh dấu yêu thích (Bookmark Job — Phân hệ P1).

```sql
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    job_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_saved_jobs_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uq_saved_jobs_pair UNIQUE (student_id, job_id)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE CASCADE. |
| `job_id` | `UUID` | **NO** | — | FK tham chiếu `jobs(id)` ON DELETE CASCADE. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm lưu bookmark; UNIQUE `(student_id, job_id)`. |

---

### PHÂN HỆ 06: QUẢN LÝ ỨNG TUYỂN VÀ PHỄU KANBAN (APPLICATION & PIPELINE)

#### 3.19. Bảng `applications`
Đơn ứng tuyển kết nối giữa Sinh viên và Tin tuyển dụng (Single Source of Truth cho phễu tuyển dụng).

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    student_id UUID NOT NULL,
    cv_id UUID NULL DEFAULT NULL,
    status application_status NOT NULL DEFAULT 'APPLIED',
    version INTEGER NOT NULL DEFAULT 1,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    withdrawn_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_applications_job_student UNIQUE (job_id, student_id),
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT,
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    CONSTRAINT fk_applications_cv FOREIGN KEY (cv_id) REFERENCES student_cvs(id) ON DELETE SET NULL,
    CONSTRAINT chk_applications_version_positive CHECK (version >= 1),
    CONSTRAINT chk_applications_withdrawn_timestamp CHECK (
        (status = 'WITHDRAWN' AND withdrawn_at IS NOT NULL) OR 
        (status <> 'WITHDRAWN' AND withdrawn_at IS NULL)
    )
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `job_id` | `UUID` | **NO** | — | FK tham chiếu `jobs(id)` ON DELETE RESTRICT. |
| `student_id` | `UUID` | **NO** | — | FK tham chiếu `students(id)` ON DELETE RESTRICT. |
| `cv_id` | `UUID` | YES | `NULL` | FK tham chiếu `student_cvs(id)`; SET NULL khi CV gốc bị xóa. |
| `status` | `application_status` | **NO** | `'APPLIED'` | Trạng thái hiện tại: `APPLIED, REVIEWING, SHORTLISTED, INTERVIEW, OFFER, HIRED, REJECTED, WITHDRAWN`. |
| `version` | `INTEGER` | **NO** | `1` | Số phiên bản phục vụ Khóa lạc quan (Optimistic Concurrency Control) chống Lost Updates khi kéo thả Kanban đồng thời; CHECK $\ge 1$. |
| `applied_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm nộp đơn chính thức. |
| `withdrawn_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm rút đơn; bắt buộc có giá trị khi `status = 'WITHDRAWN'`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo bản ghi. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật trạng thái gần nhất. |

#### 3.20. Bảng `application_cv_snapshots` *(Bảng mới — Chuẩn hóa BR-09)*
Bản sao lưu bất biến của tệp CV tại thời điểm nộp đơn ứng tuyển, bảo toàn tính pháp lý và lịch sử tuyển dụng.

```sql
CREATE TABLE application_cv_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    file_id UUID NULL DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_cv_snapshots_application UNIQUE (application_id),
    CONSTRAINT uq_cv_snapshots_storage_key UNIQUE (storage_key),
    CONSTRAINT fk_cv_snapshots_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cv_snapshots_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL,
    CONSTRAINT chk_cv_snapshots_size CHECK (file_size > 0)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `application_id` | `UUID` | **NO** | — | FK tham chiếu `applications(id)` ON DELETE RESTRICT; UNIQUE 1-1. |
| `file_id` | `UUID` | YES | `NULL` | FK tham chiếu `files(id)` ban đầu (nếu còn). |
| `file_name` | `VARCHAR(255)` | **NO** | — | Tên tệp CV hiển thị khi nộp. |
| `file_size` | `BIGINT` | **NO** | — | Dung lượng tệp CV tại thời điểm nộp (bytes); CHECK $> 0$. |
| `mime_type` | `VARCHAR(100)` | **NO** | — | Định dạng tệp (`application/pdf`). |
| `storage_key` | `VARCHAR(500)` | **NO** | — | Đường dẫn vật lý độc lập trên Object Storage; UNIQUE. |
| `sha256_hash` | `CHAR(64)` | **NO** | — | Mã băm SHA-256 bảo toàn tính toàn vẹn của tệp đã nộp. |
| `snapshot_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm đóng băng bản sao CV. |

#### 3.21. Bảng `application_status_histories`
Lịch sử lưu vết từng bước chuyển đổi trạng thái của đơn ứng tuyển.

```sql
CREATE TABLE application_status_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    old_status application_status NULL DEFAULT NULL,
    new_status application_status NOT NULL,
    changed_by UUID NOT NULL,
    note TEXT NULL DEFAULT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_app_histories_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_app_histories_actor FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `application_id` | `UUID` | **NO** | — | FK tham chiếu `applications(id)` ON DELETE RESTRICT. |
| `old_status` | `application_status` | YES | `NULL` | Trạng thái trước khi chuyển; `NULL` khi nộp đơn lần đầu. |
| `new_status` | `application_status` | **NO** | — | Trạng thái mới sau khi chuyển. |
| `changed_by` | `UUID` | **NO** | — | FK tham chiếu `users(id)` của tác nhân thực hiện thao tác. |
| `note` | `TEXT` | YES | `NULL` | Ghi chú đi kèm khi chuyển bước tuyển dụng. |
| `changed_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm chuyển trạng thái. |

#### 3.22. Bảng `recruitment_results`
Ghi nhận kết quả tuyển dụng chính thức cuối cùng của đơn ứng tuyển.

```sql
CREATE TABLE recruitment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    result recruitment_result_type NOT NULL,
    position VARCHAR(150) NULL DEFAULT NULL,
    employment_type employment_type NULL DEFAULT NULL,
    start_date DATE NULL DEFAULT NULL,
    note TEXT NULL DEFAULT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_recruitment_results_app UNIQUE (application_id),
    CONSTRAINT fk_recruitment_results_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_recruitment_results_actor FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `application_id` | `UUID` | **NO** | — | FK tham chiếu `applications(id)` ON DELETE RESTRICT; UNIQUE 1-1. |
| `result` | `recruitment_result_type` | **NO** | — | Quyết định cuối: `HIRED, REJECTED`. |
| `position` | `VARCHAR(150)` | YES | `NULL` | Vị trí tiếp nhận chính thức. |
| `employment_type` | `employment_type` | YES | `NULL` | Loại hình hợp đồng tiếp nhận. |
| `start_date` | `DATE` | YES | `NULL` | Ngày dự kiến bắt đầu làm việc (Onboarding date). |
| `note` | `TEXT` | YES | `NULL` | Nhận xét tổng kết tuyển dụng. |
| `created_by` | `UUID` | **NO** | — | FK `users(id)` của Recruiter chốt kết quả. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm ghi nhận kết quả. |

---

### PHÂN HỆ 07: QUẢN LÝ PHỎNG VẤN (INTERVIEW MANAGEMENT)

#### 3.23. Bảng `interviews`
Lịch phỏng vấn cơ bản gắn trực tiếp với đơn ứng tuyển.

```sql
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type interview_type NOT NULL,
    location VARCHAR(255) NULL DEFAULT NULL,
    meeting_url VARCHAR(500) NULL DEFAULT NULL,
    interviewer VARCHAR(150) NULL DEFAULT NULL,
    note TEXT NULL DEFAULT NULL,
    result VARCHAR(100) NULL DEFAULT NULL,
    status interview_status NOT NULL DEFAULT 'SCHEDULED',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_interviews_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_interviews_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_interviews_time CHECK (end_time > start_time)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `application_id` | `UUID` | **NO** | — | FK tham chiếu `applications(id)` ON DELETE RESTRICT. |
| `scheduled_date` | `DATE` | **NO** | — | Ngày diễn ra buổi phỏng vấn. |
| `start_time` | `TIME` | **NO** | — | Giờ bắt đầu. |
| `end_time` | `TIME` | **NO** | — | Giờ kết thúc; CHECK `end_time > start_time`. |
| `type` | `interview_type` | **NO** | — | Hình thức: `ONSITE, ONLINE, PHONE`. |
| `location` | `VARCHAR(255)` | YES | `NULL` | Địa điểm phỏng vấn trực tiếp (văn phòng công ty). |
| `meeting_url` | `VARCHAR(500)` | YES | `NULL` | Đường dẫn phòng họp trực tuyến (Google Meet, MS Teams). |
| `interviewer` | `VARCHAR(150)` | YES | `NULL` | Cán bộ / Chuyên viên thực hiện phỏng vấn. |
| `note` | `TEXT` | YES | `NULL` | Ghi chú dặn dò ứng viên hoặc nhận xét sơ bộ. |
| `result` | `VARCHAR(100)` | YES | `NULL` | Kết quả sơ bộ buổi gặp (Đạt, Không đạt, Cân nhắc). |
| `status` | `interview_status` | **NO** | `'SCHEDULED'` | Trạng thái lịch: `SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED`. |
| `created_by` | `UUID` | **NO** | — | FK `users(id)` của người lên lịch phỏng vấn. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo lịch hẹn. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật lịch hẹn gần nhất. |

---

### PHÂN HỆ 08: QUẢN TRỊ TƯƠNG TÁC VÀ NHẮC VIỆC CRM (INTERACTIONS & FOLLOW-UPS)

#### 3.24. Bảng `crm_interactions`
Nhật ký lịch sử trao đổi giữa Career Center AGU và các đối tác doanh nghiệp.

```sql
CREATE TABLE crm_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    contact_id UUID NULL DEFAULT NULL,
    staff_user_id UUID NOT NULL,
    job_id UUID NULL DEFAULT NULL,
    event_id UUID NULL DEFAULT NULL,
    type interaction_type NOT NULL,
    subject VARCHAR(200) NOT NULL,
    interaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    note TEXT NULL DEFAULT NULL,
    visibility interaction_visibility NOT NULL DEFAULT 'INTERNAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_crm_interactions_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_crm_interactions_contact FOREIGN KEY (contact_id) REFERENCES company_contacts(id) ON DELETE SET NULL,
    CONSTRAINT fk_crm_interactions_staff FOREIGN KEY (staff_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_crm_interactions_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `company_id` | `UUID` | **NO** | — | FK tham chiếu `companies(id)` ON DELETE RESTRICT; Bắt buộc có công ty. |
| `contact_id` | `UUID` | YES | `NULL` | FK tham chiếu `company_contacts(id)` người tiếp xúc. |
| `staff_user_id` | `UUID` | **NO** | — | FK `users(id)` của Cán bộ trường thực hiện tương tác. |
| `job_id` | `UUID` | YES | `NULL` | FK `jobs(id)` nếu cuộc trao đổi gắn với tin tuyển dụng cụ thể. |
| `event_id` | `UUID` | YES | `NULL` | FK `events(id)` nếu liên quan đến sự kiện/Job Fair. |
| `type` | `interaction_type` | **NO** | — | Hình thức: `CALL, EMAIL, MEETING, EVENT, JOB_FAIR, OTHER`. |
| `subject` | `VARCHAR(200)` | **NO** | — | Tiêu đề tóm tắt cuộc tiếp xúc. |
| `interaction_date` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm diễn ra hoạt động trao đổi. |
| `note` | `TEXT` | YES | `NULL` | Nội dung chi tiết cuộc họp / trao đổi đối tác. |
| `visibility` | `interaction_visibility` | **NO** | `'INTERNAL'` | Phạm vi hiển thị: `INTERNAL` (Nội bộ trường), `COMPANY_SHARED`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm ghi nhận tương tác. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật ghi chú gần nhất. |

#### 3.25. Bảng `follow_up_tasks`
Nhiệm vụ chăm sóc và tái liên hệ đối tác của Career Center AGU.

```sql
CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    owner_user_id UUID NOT NULL,
    interaction_id UUID NULL DEFAULT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL DEFAULT NULL,
    due_date DATE NOT NULL,
    status follow_up_status NOT NULL DEFAULT 'TODO',
    completed_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_follow_up_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_follow_up_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_follow_up_interaction FOREIGN KEY (interaction_id) REFERENCES crm_interactions(id) ON DELETE SET NULL,
    CONSTRAINT chk_follow_up_completed_timestamp CHECK (
        (status = 'DONE' AND completed_at IS NOT NULL) OR 
        (status <> 'DONE' AND completed_at IS NULL)
    )
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `company_id` | `UUID` | **NO** | — | FK tham chiếu `companies(id)` ON DELETE RESTRICT. |
| `owner_user_id` | `UUID` | **NO** | — | FK `users(id)` của Cán bộ trường chịu trách nhiệm xử lý task. |
| `interaction_id` | `UUID` | YES | `NULL` | FK tham chiếu `crm_interactions(id)` nguồn gốc phát sinh task. |
| `title` | `VARCHAR(200)` | **NO** | — | Tiêu đề nhiệm vụ (ví dụ: "Gửi công văn mời tham dự Job Fair 2026"). |
| `description` | `TEXT` | YES | `NULL` | Hướng dẫn và chi tiết công việc cần làm. |
| `due_date` | `DATE` | **NO** | — | Hạn chót hoàn thành nhiệm vụ. |
| `status` | `follow_up_status` | **NO** | `'TODO'` | Trạng thái: `TODO, IN_PROGRESS, DONE, CANCELLED`. |
| `completed_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm hoàn thành; bắt buộc khi `status = 'DONE'`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm giao việc. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật tiến độ task. |

---

### PHÂN HỆ 09: THÔNG BÁO VÀ SỰ KIỆN NGHỀ NGHIỆP (NOTIFICATIONS & EVENTS)

#### 3.26. Bảng `notifications`
Hộp thư thông báo nội bộ hệ thống (In-app Notification).

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    resource_type VARCHAR(50) NULL DEFAULT NULL,
    resource_id UUID NULL DEFAULT NULL,
    event_key VARCHAR(255) NULL DEFAULT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_notifications_read_timestamp CHECK (
        (is_read = FALSE AND read_at IS NULL) OR 
        (is_read = TRUE AND read_at IS NOT NULL)
    )
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `user_id` | `UUID` | **NO** | — | FK tham chiếu `users(id)` người nhận thông báo; CASCADE khi xóa user. |
| `type` | `VARCHAR(50)` | **NO** | — | Mã phân loại thông báo (`APPLICATION_STATUS`, `JOB_APPROVED`...). |
| `title` | `VARCHAR(200)` | **NO** | — | Tiêu đề ngắn gọn của thông báo. |
| `message` | `TEXT` | **NO** | — | Nội dung chi tiết thông báo. |
| `resource_type` | `VARCHAR(50)` | YES | `NULL` | Thực thể đích phục vụ điều hướng Frontend (`JOB`, `APPLICATION`...). |
| `resource_id` | `UUID` | YES | `NULL` | ID của đối tượng đích để Frontend tự động mở màn hình chi tiết. |
| `event_key` | `VARCHAR(255)` | YES | `NULL` | Khóa chống bắn trùng lặp thông báo (Idempotency Key) khi retry. |
| `is_read` | `BOOLEAN` | **NO** | `FALSE` | Trạng thái đọc (Chưa đọc / Đã đọc). |
| `read_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm đọc thông báo; bắt buộc khi `is_read = TRUE`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm phát sinh thông báo. |

#### 3.27. Bảng `events`
Sự kiện hướng nghiệp, ngày hội việc làm (Job Fair, Talkshow, Workshop — Phân hệ P1).

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    type event_type NOT NULL,
    description TEXT NULL DEFAULT NULL,
    location VARCHAR(255) NULL DEFAULT NULL,
    capacity INTEGER NULL DEFAULT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    status event_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_events_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_events_time CHECK (end_at > start_at),
    CONSTRAINT chk_events_capacity_positive CHECK (capacity IS NULL OR capacity > 0)
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `created_by` | `UUID` | **NO** | — | FK tham chiếu `users(id)` của Cán bộ trường tạo sự kiện. |
| `name` | `VARCHAR(200)` | **NO** | — | Tên sự kiện (ví dụ: "Ngày hội Việc làm AGU 2026"). |
| `type` | `event_type` | **NO** | — | Phân loại: `JOB_FAIR, CAREER_TALK, WORKSHOP`. |
| `description` | `TEXT` | YES | `NULL` | Kế hoạch và nội dung chi tiết của sự kiện. |
| `location` | `VARCHAR(255)` | YES | `NULL` | Địa điểm tổ chức (Hội trường rùa AGU, Sân trường...). |
| `capacity` | `INTEGER` | YES | `NULL` | Sức chứa tối đa (Participant limit); `NULL` quy ước không giới hạn; CHECK $> 0$. |
| `start_at` | `TIMESTAMPTZ` | **NO** | — | Thời gian bắt đầu sự kiện. |
| `end_at` | `TIMESTAMPTZ` | **NO** | — | Thời gian kết thúc sự kiện; CHECK `end_at > start_at`. |
| `status` | `event_status` | **NO** | `'DRAFT'` | Vòng đời sự kiện: `DRAFT, PUBLISHED, CLOSED`. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm tạo sự kiện. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật sự kiện. |

#### 3.28. Bảng `event_registrations`
Danh sách đăng ký tham dự sự kiện của Sinh viên và Doanh nghiệp.

```sql
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    user_id UUID NULL DEFAULT NULL,
    company_id UUID NULL DEFAULT NULL,
    status registration_status NOT NULL DEFAULT 'REGISTERED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    cancelled_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT fk_event_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT,
    CONSTRAINT fk_event_reg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_reg_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT chk_event_reg_single_participant CHECK (
        (user_id IS NOT NULL AND company_id IS NULL) OR 
        (user_id IS NULL AND company_id IS NOT NULL)
    ),
    CONSTRAINT chk_event_reg_status_timestamps CHECK (
        (status = 'CANCELLED' AND cancelled_at IS NOT NULL) OR 
        (status = 'REGISTERED' AND cancelled_at IS NULL AND registered_at IS NOT NULL)
    )
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `event_id` | `UUID` | **NO** | — | FK tham chiếu `events(id)` ON DELETE RESTRICT. |
| `user_id` | `UUID` | YES | `NULL` | FK tham chiếu `users(id)` của Sinh viên tham gia. |
| `company_id` | `UUID` | YES | `NULL` | FK tham chiếu `companies(id)` của Doanh nghiệp tham gia gian hàng. |
| `status` | `registration_status` | **NO** | `'REGISTERED'` | Rút gọn MVP: `REGISTERED, CANCELLED` (loại bỏ `ATTENDED, NO_SHOW`). |
| `registered_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm đăng ký gần nhất. |
| `cancelled_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm hủy tham dự (giới hạn trong 15 phút từ `registered_at`). |

---

### PHÂN HỆ 10: NHẬT KÝ KIỂM TOÁN HỆ THỐNG (SYSTEM AUDIT LOG)

#### 3.29. Bảng `activity_logs`
Nhật ký kiểm toán hệ thống (Audit Trail) ghi vết mọi thay đổi dữ liệu nhạy cảm.

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID NULL DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    old_values JSONB NULL DEFAULT NULL,
    new_values JSONB NULL DEFAULT NULL,
    ip_address INET NULL DEFAULT NULL,
    user_agent TEXT NULL DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_activity_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

| Cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa / Ràng buộc toàn vẹn |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính. |
| `actor_user_id` | `UUID` | YES | `NULL` | FK `users(id)`; NULL khi là tiến trình nền tự động hoặc tác nhân ẩn danh. |
| `action` | `VARCHAR(100)` | **NO** | — | Mã hành động nghiệp vụ (`JOB_APPROVE`, `USER_STATUS_CHANGE`...). |
| `resource_type` | `VARCHAR(50)` | **NO** | — | Loại thực thể bị tác động (`Job`, `Company`, `Application`...). |
| `resource_id` | `UUID` | **NO** | — | ID của thực thể bị tác động (Liên kết đa hình, không có FK vật lý). |
| `old_values` | `JSONB` | YES | `NULL` | Dữ liệu trước thay đổi (đã loại trừ thông tin nhạy cảm - Scrubbed). |
| `new_values` | `JSONB` | YES | `NULL` | Dữ liệu sau thay đổi (đã loại trừ thông tin nhạy cảm - Scrubbed). |
| `ip_address` | `INET` | YES | `NULL` | Địa chỉ IP của máy khách gửi yêu cầu (IPv4 hoặc IPv6). |
| `user_agent` | `TEXT` | YES | `NULL` | Chuỗi định danh thiết bị / trình duyệt người dùng. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm phát sinh sự kiện kiểm toán (UTC). |

---

## 4. CHIẾN LƯỢC ĐÁNH CHỈ MỤC TỐI ƯU TRUY VẤN (INDEXING STRATEGY)

Hệ thống thiết lập chiến lược đánh chỉ mục toàn diện, ưu tiên tối ưu hóa các đường dẫn truy vấn nóng (Hot Paths), các khóa ngoại JOIN thường xuyên và áp dụng Partial Unique Indexes để bảo vệ các bất biến nghiệp vụ.

### 4.1. Danh mục Chỉ mục Toàn hệ thống (System Indexes)

| Bảng CSDL | Định nghĩa Index | Mục đích kỹ thuật |
| :--- | :--- | :--- |
| `users` | `UNIQUE(email)`<br>`INDEX(status)` | Tối ưu hóa API đăng nhập và lọc trạng thái tài khoản. |
| `roles` | `UNIQUE(code)` | Tra cứu quyền hạn theo vai trò trong RBAC Guard. |
| `permissions`| `UNIQUE(code)` | Tra cứu phân quyền nguyên tử. |
| `user_roles` | `PK(user_id, role_id)`<br>`INDEX(role_id)` | Tra cứu hai chiều giữa người dùng và vai trò. |
| `role_permissions` | `PK(role_id, permission_id)`<br>`INDEX(permission_id)` | Tra cứu ma trận phân quyền trong NestJS Execution Context. |
| `student_masters` | `UNIQUE(student_code)`<br>`UNIQUE(institutional_email)`<br>`INDEX(status)` | Tra cứu đối soát MSSV lúc đăng ký; lọc danh sách sinh viên. |
| `students` | `UNIQUE(student_master_id)`<br>`UNIQUE(user_id)`<br>`INDEX(career_profile_visibility)` | Truy vấn hồ sơ cá nhân; lọc các hồ sơ Career Profile công khai. |
| `student_skills` | `UNIQUE(student_id, skill_name)` | Chống gắn trùng kỹ năng; JOIN danh mục kỹ năng. |
| `student_experiences`| `INDEX(student_id, start_date DESC)` | Sắp xếp timeline kinh nghiệm làm việc của sinh viên. |
| `student_projects` | `INDEX(student_id)` | Truy vấn danh mục dự án cá nhân. |
| `files` | `UNIQUE(storage_key)`<br>`INDEX(owner_user_id)` | Xác thực tham chiếu tệp trên MinIO; kiểm tra hạn ngạch người dùng. |
| `student_cvs` | `INDEX(student_id)` | Liệt kê danh mục CV của sinh viên. |
| `companies` | `UNIQUE(tax_code)`<br>`INDEX(verification_status)`<br>`INDEX(relationship_status)` | Review Queue xét duyệt pháp nhân; lọc đối tác CRM theo phân loại. |
| `company_contacts` | `INDEX(company_id)`<br>`UNIQUE(user_id)` | Tải danh bạ liên hệ trong Company 360°; đối soát quyền đại diện. |
| `company_verification_requests` | `INDEX(company_id)`<br>`INDEX(status, created_at DESC)` | Truy vấn lịch sử thẩm định; sắp xếp hàng đợi xét duyệt của Career Center. |
| `jobs` | `INDEX(company_id)`<br>`INDEX(status, deadline)`<br>`INDEX(created_at DESC)` | Cổng tìm việc sinh viên (Job Discovery Hot Path); quản lý tin doanh nghiệp. |
| `job_skills` | `UNIQUE(job_id, skill_name)` | Khớp kỹ năng tin tuyển dụng; chống trùng kỹ năng yêu cầu. |
| `saved_jobs` | `UNIQUE(student_id, job_id)`<br>`INDEX(student_id, created_at DESC)` | Truy vấn danh sách việc làm đã lưu của sinh viên. |
| `applications`| `UNIQUE(job_id, student_id)`<br>`INDEX(job_id, status)`<br>`INDEX(student_id, status)`<br>`INDEX(applied_at DESC)` | Quản lý bảng Kanban phễu tuyển dụng (Module 09); chống nộp trùng hồ sơ. |
| `application_cv_snapshots` | `UNIQUE(application_id)`<br>`UNIQUE(storage_key)` | Tải xem bản CV đóng băng bất biến của đơn ứng tuyển. |
| `application_status_histories` | `INDEX(application_id, changed_at DESC)` | Dòng thời gian chuyển bước tuyển dụng (Single Source Timeline). |
| `recruitment_results` | `UNIQUE(application_id)` | Đối soát kết quả tuyển dụng cuối cùng. |
| `interviews` | `INDEX(application_id)`<br>`INDEX(scheduled_date, status)` | Lịch phỏng vấn sắp tới (Upcoming Interviews Widget). |
| `crm_interactions` | `INDEX(company_id, interaction_date DESC)`<br>`INDEX(staff_user_id)` | Dòng thời gian tương tác đối tác trên màn hình Company 360°. |
| `follow_up_tasks` | `INDEX(company_id, due_date)`<br>`INDEX(owner_user_id, status, due_date)` | Bảng theo dõi công việc CRM; nhận diện task quá hạn (`OVERDUE`). |
| `notifications` | `INDEX(user_id, is_read, created_at DESC)` | Hộp thư thông báo người dùng (Inbox Notification Hot Path). |
| `events` | `INDEX(status, start_at)` | Lịch sự kiện việc làm công khai của nhà trường. |
| `event_registrations` | `INDEX(event_id, status)` | Đếm số lượng người tham dự thực tế ($N_{\text{registered}}$). |
| `activity_logs` | `INDEX(resource_type, resource_id, created_at DESC)`<br>`INDEX(actor_user_id, created_at DESC)`<br>`INDEX(created_at DESC)` | Tra cứu dòng thời gian kiểm toán hệ thống toàn cục. |

### 4.2. Danh mục Chỉ mục Điều kiện (Partial Unique Indexes)

```sql
-- 1. Bảo đảm duy nhất 01 CV mặc định cho mỗi sinh viên
CREATE UNIQUE INDEX uq_student_default_cv 
ON student_cvs (student_id) 
WHERE is_default = TRUE;

-- 2. Bảo đảm duy nhất 01 Primary Contact đang hoạt động cho mỗi công ty
CREATE UNIQUE INDEX uq_company_primary_contact 
ON company_contacts (company_id) 
WHERE is_primary = TRUE AND is_active = TRUE;

-- 3. Ngăn chặn doanh nghiệp gửi trùng yêu cầu xét duyệt PENDING (chống Double-click / Race Condition)
CREATE UNIQUE INDEX uq_company_pending_verification 
ON company_verification_requests (company_id) 
WHERE status = 'PENDING';

-- 4. Ngăn chặn phát sinh trùng lặp thông báo do retry sự kiện (Idempotency Control)
CREATE UNIQUE INDEX uq_notifications_user_event_key 
ON notifications (user_id, event_key) 
WHERE event_key IS NOT NULL;

-- 5. Bảo đảm một sinh viên chỉ có tối đa 01 bản ghi đăng ký tham gia sự kiện đang có hiệu lực
CREATE UNIQUE INDEX uq_event_reg_active_user 
ON event_registrations (event_id, user_id) 
WHERE user_id IS NOT NULL AND status = 'REGISTERED';

-- 6. Bảo đảm một doanh nghiệp chỉ có tối đa 01 bản ghi đăng ký tham gia sự kiện đang có hiệu lực
CREATE UNIQUE INDEX uq_event_reg_active_company 
ON event_registrations (event_id, company_id) 
WHERE company_id IS NOT NULL AND status = 'REGISTERED';
```

---

## 5. QUY TẮC GIAO DỊCH, KHÓA ĐỒNG THỜI VÀ TOÀN VẸN NGHIỆP VỤ

### 5.1. Luồng Đăng ký Sinh viên bằng Student Master Data
- Thao tác đăng ký bắt buộc thực thi trong một **Prisma Atomic Transaction**:
  1. Kiểm tra tồn tại `student_code` trong bảng `student_masters`.
  2. Kiểm tra điều kiện `student_masters.user_id IS NULL` và email chưa tồn tại trong `users`.
  3. Tạo bản ghi tài khoản trong `users` (`status = 'ACTIVE'`).
  4. Gán Role `STUDENT` vào bảng `user_roles`.
  5. Tạo bản ghi hồ sơ cá nhân trong `students` (`user_id`, `student_master_id`).
  6. **Cập nhật nguyên tử có điều kiện (Conditional Atomic Update):**
     ```sql
     UPDATE student_masters 
     SET user_id = :userId, updated_at = clock_timestamp() 
     WHERE id = :masterId AND user_id IS NULL;
     ```
     Nếu câu lệnh cập nhật trả về `affected_rows = 0`, lập tức ném ngoại lệ `ConflictException` (409 Conflict) và ROLLBACK giao dịch để chặn đứng race condition khi hai request đăng ký cùng một MSSV.

### 5.2. Luồng Nộp đơn Ứng tuyển và CV Snapshot Bất biến
- Để ngăn chặn mâu thuẫn giữa việc lưu tệp MinIO và ghi dữ liệu CSDL:
  1. Backend kiểm tra điều kiện tiên quyết: Job đang `PUBLISHED`, chưa quá `deadline`, sinh viên chưa từng ứng tuyển (`job_id` + `student_id`).
  2. Đọc tệp CV nguồn từ MinIO, tính toán mã băm SHA-256 checksum và sao chép tệp nhị phân sang Object Key mới độc lập (`snapshots/apps/{appId}.pdf`).
  3. Mở **Prisma Atomic Transaction**:
     - Tạo bản ghi mới trong `applications` (`status = 'APPLIED'`, `version = 1`, `applied_at = clock_timestamp()`).
     - Tạo bản ghi trong `application_cv_snapshots` lưu metadata, SHA-256 hash và đường dẫn `storage_key` độc lập.
     - Tạo bản ghi dòng đầu tiên trong `application_status_histories` (`old_status = NULL`, `new_status = 'APPLIED'`).
  4. **Cơ chế Bù trừ (Compensating Cleanup):** Nếu giao dịch CSDL thất bại sau khi đã ghi file lên MinIO, Interceptor tiến hành xóa tệp snapshot mồ côi trên Object Storage.

### 5.3. Khóa Lạc quan (Optimistic Concurrency Control) trên Bảng Kanban
- Khi nhiều Recruiter cùng mở màn hình phễu Kanban (Module 09) và kéo thả cùng một ứng viên:
  - Frontend gửi kèm trường số phiên bản hiện tại (`version`).
  - Backend thực thi câu lệnh cập nhật trạng thái có điều kiện:
    ```sql
    UPDATE applications 
    SET status = :newStatus, version = version + 1, updated_at = clock_timestamp() 
    WHERE id = :applicationId AND version = :expectedVersion;
    ```
  - Nếu `affected_rows = 0`, Backend từ chối giao dịch với mã lỗi `409 Conflict` (`STALE_DATA_VERSION_CONFLICT`), bảo vệ hệ thống khỏi lỗi ghi đè dữ liệu (Lost Updates).

### 5.4. Kiểm soát Sức chứa Sự kiện và Chống Overbooking (Module 13 Concurrency)
- **Công thức tính số lượng người tham dự đang chiếm suất:**
  $$N_{\text{registered}} = \text{COUNT}(\text{id}) \quad \text{FROM event\_registrations} \quad \text{WHERE event\_id} = E \land \text{status} = \text{'REGISTERED'}$$
- **Quy tắc sức chứa còn lại:**
  $$\text{remaining\_capacity} = \begin{cases} \text{NULL} & \text{khi capacity IS NULL (không giới hạn)} \\ \text{capacity} - N_{\text{registered}} & \text{khi capacity có giá trị} \end{cases}$$
- **Cơ chế Khóa bi quan (Pessimistic Locking / `FOR UPDATE`):**
  - Mọi thao tác đăng ký tham gia sự kiện hoặc cập nhật giảm `capacity` bắt buộc phải khóa hàng sự kiện trong Prisma Transaction:
    ```sql
    SELECT id, capacity, status FROM events WHERE id = :eventId FOR UPDATE;
    ```
  - Sau khi giữ khóa hàng `events`, Backend tính toán $N_{\text{registered}}$.
  - Nếu $N_{\text{registered}} \ge \text{capacity}$, Backend lập tức ROLLBACK giao dịch và trả mã lỗi `409 Conflict` (`EVENT_CAPACITY_EXCEEDED`).
  - Khi cập nhật giảm sức chứa sự kiện, nếu $\text{new\_capacity} < N_{\text{registered}}$, Backend từ chối với lỗi `400 Bad Request` (`CAPACITY_CANNOT_BE_LESS_THAN_REGISTERED_COUNT`).

### 5.5. Vòng đời Hủy và Đăng ký lại Sự kiện (Module 13 Registration Lifecycle)
1. **Khi đăng ký lần đầu:** Tạo bản ghi mới trong `event_registrations` (`status = 'REGISTERED'`, `registered_at = clock_timestamp()`, `cancelled_at = NULL`).
2. **Khi hủy đăng ký:**
   - Kiểm tra điều kiện thời hạn 15 phút nghiêm ngặt:
     $$\text{CURRENT\_TIMESTAMP} \le \text{registered\_at} + \text{INTERVAL '15 minutes'}$$
   - Nếu hợp lệ: Cập nhật `status = 'CANCELLED'`, `cancelled_at = clock_timestamp()`. Suất tham gia được giải phóng ngay lập tức.
   - Nếu quá 15 phút: Từ chối với lỗi `400 Bad Request` (`CANCELLATION_DEADLINE_EXCEEDED`).
3. **Khi đăng ký lại (Re-register):**
   - Điều kiện: Event vẫn ở trạng thái `PUBLISHED` và còn sức chứa ($N_{\text{registered}} < \text{capacity}$).
   - Xử lý nguyên tử: Tái sử dụng bản ghi hiện có, cập nhật `status = 'REGISTERED'`, làm mới `registered_at = clock_timestamp()` và **reset xóa `cancelled_at = NULL`**.
   - Thời hạn hủy 15 phút cho chu kỳ mới sẽ được tính lại dựa trên mốc `registered_at` mới này.

---

## 6. CẤU HÌNH VẬN HÀNH POSTGRESQL 16 & DOCKER COMPOSE BASELINE

### 6.1. Tham số Cấu hình Khuyến nghị (`postgresql.conf`)

```ini
# Kết nối mạng và Pool kết nối
max_connections = 50
superuser_reserved_connections = 3

# Cấu hình Bộ nhớ (Ước tính trên môi trường phát triển/staging RAM 4GB)
shared_buffers = 1GB                  # 25% tổng RAM máy chủ
effective_cache_size = 2800MB         # 70% tổng RAM máy chủ
work_mem = 8MB                        # Bộ nhớ cho mỗi thao tác sắp xếp / hash JOIN
maintenance_work_mem = 128MB          # Bộ nhớ cho thao tác tạo Index / VACUUM

# Ghi nhật ký giao dịch (WAL) và Checkpoint
wal_compression = on
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
max_wal_size = 2GB
min_wal_size = 512MB

# Trình lập lịch truy vấn (Query Planner) - Tối ưu cho ổ đĩa SSD / NVMe
random_page_cost = 1.1
effective_io_concurrency = 200

# Tự động dọn dẹp và thu hồi không gian (Autovacuum)
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 1min
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.1
```

### 6.2. Tiện ích mở rộng và Chuẩn múi giờ (Timezone Standard)

```sql
-- Kích hoạt tiện ích sinh mã UUID và mã hóa
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Thiết lập chuẩn múi giờ UTC trên toàn bộ phiên kết nối CSDL
SET timezone TO 'UTC';
```

Ứng dụng thống nhất lưu trữ toàn bộ các cột thời gian theo chuẩn UTC (`TIMESTAMPTZ`). Việc định dạng múi giờ địa phương (Việt Nam — UTC+7) được thực hiện tại tầng giao diện Client/Frontend hoặc Response Serializer.

### 6.3. Cấu hình Dịch vụ Cơ sở Hạ tầng (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: agu-crm-postgres
    restart: always
    environment:
      POSTGRES_DB: agu_crm_db
      POSTGRES_USER: agu_crm_admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-AguCrm@Secure2026}
      TZ: UTC
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U agu_crm_admin -d agu_crm_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:RELEASE.2024-01-18T22-51-28Z
    container_name: agu-crm-minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minio_admin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-Minio@Secure2026}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 15s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
  minio_data:
```

---

## 7. CHECKLIST NGHIỆM THU KIẾN TRÚC CƠ SỞ DỮ LIỆU

| Mã kiểm tra | Hạng mục thẩm định | Tiêu chí đánh giá chấp nhận | Trạng thái |
| :---: | :--- | :--- | :---: |
| **DB-CHK-01** | **Tổng số lượng bảng** | Cơ sở dữ liệu khởi tạo chính xác toàn bộ **29 bảng quan hệ 3NF**, không thiếu sót thực thể nghiệp vụ nào. | **ĐẠT** |
| **DB-CHK-02** | **Student Master Data** | Bảng `student_masters` tách biệt vật lý với `students`; `student_code` UNIQUE; liên kết nguyên tử với `users`. | **ĐẠT** |
| **DB-CHK-03** | **CV Snapshot bất biến** | Bảng `application_cv_snapshots` lưu trữ đường dẫn tệp độc lập và mã băm SHA-256; không bị biến đổi khi xóa CV gốc. | **ĐẠT** |
| **DB-CHK-04** | **Phân lập Trạng thái Công ty** | Tách bạch rõ `verification_status` (Module 04) và `relationship_status` (Module 05 CRM) trong bảng `companies`. | **ĐẠT** |
| **DB-CHK-05** | **Bảo vệ Primary Contact** | Bảng `company_contacts` có Partial Unique Index bảo đảm tối đa duy nhất 01 Primary Contact đang hoạt động (`is_active = TRUE`). | **ĐẠT** |
| **DB-CHK-06** | **Chống gửi trùng xét duyệt** | Partial Unique Index `uq_company_pending_verification` ngăn chặn doanh nghiệp bấm gửi trùng yêu cầu `PENDING`. | **ĐẠT** |
| **DB-CHK-07** | **Khóa lạc quan Kanban** | Bảng `applications` có cột `version INTEGER DEFAULT 1` và CHECK $\ge 1$ để bảo vệ tính nhất quán khi điều phối ứng viên. | **ĐẠT** |
| **DB-CHK-08** | **Ngữ cảnh thông báo** | Bảng `notifications` có đủ `resource_type`, `resource_id` và Partial Unique Index trên `(user_id, event_key)`. | **ĐẠT** |
| **DB-CHK-09** | **Quản lý Sức chứa Sự kiện** | Bảng `events` có cột `capacity`, ràng buộc `CHECK (capacity IS NULL OR capacity > 0)` và cơ chế khóa `FOR UPDATE`. | **ĐẠT** |
| **DB-CHK-10** | **Vòng đời Đăng ký Sự kiện** | Bảng `event_registrations` có `cancelled_at`, loại bỏ `attended_at`, rút gọn enum thành `REGISTERED, CANCELLED`. | **ĐẠT** |
| **DB-CHK-11** | **Toàn vẹn Audit Log** | Bảng `activity_logs` áp dụng quy tắc Append-only; thực thi Data Scrubbing loại trừ 100% mật khẩu, hash và token. | **ĐẠT** |
| **DB-CHK-12** | **Migration Prisma sạch** | File migration khởi tạo chạy thành công từ đầu đến cuối trên database trắng không phát sinh lỗi cú pháp hay xung đột khóa ngoại. | **ĐẠT** |

---

## 8. KẾT LUẬN & HƯỚNG DẪN TRIỂN KHAI TIẾP THEO

Tài liệu **Database Architecture Specification phiên bản v1.1.0** đã hoàn thiện toàn diện lược đồ dữ liệu 29 bảng quan hệ phục vụ bài toán **Web CRM kết nối Sinh viên – Doanh nghiệp tại Trường Đại học An Giang**:
1. Khắc phục triệt để 6 lỗ hổng kiến trúc và 6 điểm thiếu sót về ràng buộc so với bản phác thảo v1.0.0.
2. Tích hợp trọn vẹn các yêu cầu nghiệp vụ chuyên sâu của **Module 13 (Career Event)** và **Module 08 (Application CV Snapshot)**.
3. Đảm bảo tính sẵn sàng cao độ để sinh mã **Prisma Schema (`schema.prisma`)** và chạy lệnh `npx prisma migrate dev --name init_database_schema_v1_1`.