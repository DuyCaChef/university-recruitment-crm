# MODULE 03: STUDENT CAREER DISCOVERY

- **Mã module:** `CRM-SRS-03`
- **Dự án:** Web CRM Sinh viên – Doanh nghiệp
- **Phân loại:** SRS – Software Requirements Specification
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `IN REVIEW`
- **Priority:** `P0/P1`

## 1. TỔNG QUAN

Module Student Career Discovery cung cấp lớp chức năng khám phá cơ hội nghề nghiệp trong Web CRM, gồm hai hướng:

1. Employer/Recruiter và Career Center tìm kiếm, lọc, xem Career Profile công khai của Student.
2. Student tìm kiếm, lọc, xem Job đang tuyển; Bookmark Job là P1.

Module 3 **không sở hữu dữ liệu gốc** của Student Profile hoặc Job. Module sử dụng dữ liệu được phép truy cập từ các module sở hữu dữ liệu.

### 1.1. Phạm vi

| Chức năng | Priority |
|---|---:|
| Tìm kiếm Career Profile công khai | P0 |
| Lọc Career Profile | P0 |
| Xem Career Profile | P0 |
| Tìm kiếm Job | P0 |
| Lọc Job | P0 |
| Xem Job Detail | P0 |
| Bookmark Job | P1 |
| Xem Saved Jobs | P1 |
| Remove Bookmark | P1 |

Nguồn requirement chính: `FR-STU-04` P0, `FR-JOB-05` P0 và `FR-JOB-06` P1.

### 1.2. Ngoài phạm vi

- AI matching/recommendation.
- Semantic search, skill gap analysis, RAG assistant.
- AI tự động quyết định tuyển/loại ứng viên.
- Realtime chat, video interview.
- SSO/SIS integration.
- Social network nghề nghiệp.

## 2. ACTORS VÀ QUYỀN

| Actor | Quyền nghiệp vụ |
|---|---|
| **Student** | Tìm kiếm/lọc/xem Job; Bookmark Job P1; quản lý Career Profile của chính mình thông qua Student Profile Module |
| **Employer/Recruiter** | Tìm kiếm/lọc/xem Career Profile công khai theo phạm vi quyền |
| **Career Center** | Tìm kiếm/xem Career Profile theo phạm vi quyền nghiệp vụ |
| **System Admin** | Quản lý quyền truy cập dữ liệu theo RBAC; không thực hiện Discovery nghiệp vụ |

Backend phải enforce authorization. Frontend không được là nơi quyết định quyền truy cập cuối cùng.

## 3. MODULE BOUNDARY

```text
Student Profile Module
        |
        | Public Career Profile
        v
Student Career Discovery
        ^
        | Published Jobs
        |
Job Management / Job Domain
```

- Student Profile Module sở hữu Student Profile, Skills, Experience, Projects, CV.
- Job Module sở hữu Job và Job lifecycle.
- Application Module sở hữu Application và Recruitment Pipeline.
- Module 3 chỉ truy cập dữ liệu module khác qua public service/interface/application use case theo kiến trúc Modular Monolith; không truy cập repository/table nội bộ trực tiếp.

## 4. CAREER PROFILE DISCOVERY

### 4.1. FR-DISC-01 – Tìm kiếm Career Profile công khai

**Priority:** P0  
**Actor:** Employer/Recruiter; Career Center theo phạm vi quyền.

**Preconditions**
- Actor đã đăng nhập.
- Actor có quyền xem Career Profile.
- Có Student cho phép Career Profile public.

**Functional Requirement**
Cho phép tìm kiếm Career Profile công khai theo thông tin nghề nghiệp được phép chia sẻ, gồm ngành/chuyên ngành, skill, experience và project.

**Main Flow**
1. Actor mở Career Discovery.
2. Nhập keyword/điều kiện tìm kiếm.
3. Gửi request.
4. Backend kiểm tra authorization.
5. Backend chỉ lấy Student có `career_profile_visibility = TRUE`.
6. Hệ thống trả danh sách kết quả với dữ liệu public được phép.

**Alternative Flow**
- Không nhập điều kiện: trả danh sách Career Profile public theo pagination.
- Không có kết quả: trả empty result.

**Exception Flow**
- Không có quyền: `403 Forbidden`.
- Request không hợp lệ: `400 Bad Request`.
- Lỗi hệ thống: lỗi API chuẩn và ghi log phù hợp.

**Business Rules**
- Chỉ Career Profile public mới được Discovery.
- Private data không public mặc định.
- Employer không được tùy ý xem transcript/private data/dữ liệu nhạy cảm.

**Acceptance Criteria**
- Kết quả chỉ chứa Student có Career Profile public.
- Private data không xuất hiện mặc định.
- Actor không có quyền không truy cập được dữ liệu trái phép.

### 4.2. FR-DISC-02 – Lọc Career Profile

**Priority:** P0  
**Actor:** Employer/Recruiter; Career Center theo phạm vi quyền.

Cho phép lọc theo:
- Ngành/chuyên ngành.
- Skill.
- Experience.
- Project.

**Rules**
- Chỉ lọc trên tập Profile actor được phép xem.
- Không dùng private data làm filter nếu actor không có quyền.
- Không tự bổ sung GPA, giới tính, tuổi, salary expectation nếu chưa có requirement chính thức.

**Acceptance Criteria**
- Kết quả phản ánh đúng điều kiện lọc.
- Không làm lộ Career Profile private.
- Có thể kết hợp nhiều điều kiện.

### 4.3. FR-DISC-03 – Xem Career Profile

**Priority:** P0  
**Actor:** Employer/Recruiter; Career Center theo phạm vi quyền.

**Public Career Profile có thể gồm:**
- Họ tên.
- Ngành/chuyên ngành.
- Skills.
- Experience.
- Projects.
- Thông tin nghề nghiệp được phép chia sẻ.

**Private Data không public mặc định:**
- Phone.
- Email cá nhân.
- GPA chi tiết.
- Transcript.
- Certificate.
- CV riêng tư.
- Tài liệu khác.

Backend phải kiểm tra quyền trước khi trả dữ liệu.

## 5. JOB DISCOVERY

### 5.1. FR-DISC-04 – Tìm kiếm Job

**Priority:** P0  
**Actor:** Student.

Cho phép Student tìm kiếm Job đang tuyển theo các thông tin đã có trong nghiệp vụ Job:
- Job Title.
- Description/Requirements.
- Skills.
- Industry.
- Major.
- Location.
- Work Type.
- Salary.
- Job Type.
- Deadline.
- Company.

**Job lifecycle**

```text
DRAFT -> PENDING_APPROVAL -> PUBLISHED -> CLOSED
                 |
                 v
             REJECTED -> EDIT -> RESUBMIT -> PENDING_APPROVAL
```

**Rules**
- Job chưa PUBLISHED không được hiển thị như Job đang tuyển.
- Job CLOSED không xuất hiện như Job đang tuyển.
- Job hết deadline không nhận Application mới.

### 5.2. FR-DISC-05 – Lọc Job

**Priority:** P0  
**Actor:** Student.

Filter chính:

| Filter | Nguồn |
|---|---|
| Keyword | Job |
| Industry | Job |
| Major | Job |
| Skill | Job Skill |
| Location | Job |
| Work Type | Job |
| Job Type | Job |
| Deadline | Job |
| Company | Company/Job relationship |

Không sử dụng AI semantic matching trong MVP. Discovery hiện tại dựa trên Search + Filter + rule-based matching.

### 5.3. FR-DISC-06 – Xem Job Detail

**Priority:** P0  
**Actor:** Student.

Job Detail hiển thị thông tin Job được phép public, gồm title, company, description, requirements, skills, industry, major, location, work type, salary, job type và deadline.

Từ Job Detail:

```text
Job Detail
  |-- Apply -> Application Module
  `-- Bookmark -> Saved Jobs (P1)
```

Module 3 không xử lý Application status hoặc Recruitment Pipeline.

## 6. BOOKMARK JOB

### 6.1. FR-DISC-07 – Bookmark Job

**Priority:** P1  
**Actor:** Student.

**Preconditions**
- Student đã đăng nhập.
- Job tồn tại.
- Job thuộc tập Job được phép Discovery.

**Main Flow**
1. Student mở Job Detail.
2. Chọn Bookmark.
3. Backend xác thực Student và Job.
4. Tạo Saved Job.
5. Trả trạng thái thành công.

**Business Rule**
Một Student không được Bookmark cùng một Job nhiều lần. Database hỗ trợ bằng `UNIQUE(student_id, job_id)`.

### 6.2. FR-DISC-08 – Remove Bookmark

**Priority:** P1  
**Actor:** Student.

Student có thể bỏ Bookmark Job đã lưu. Chỉ được thao tác trên Saved Job của chính mình.

### 6.3. FR-DISC-09 – Xem Saved Jobs

**Priority:** P1  
**Actor:** Student.

Student xem danh sách Job đã Bookmark; chỉ trả Saved Jobs thuộc Student hiện tại.

Job đã đóng/hết hạn có thể vẫn tồn tại trong danh sách Saved Jobs nếu chưa có business rule yêu cầu xóa; trạng thái phải được hiển thị chính xác.

## 7. PRIVACY & DATA ACCESS

Database sử dụng:

```text
students.career_profile_visibility BOOLEAN DEFAULT FALSE
```

- `FALSE`: Career Profile không xuất hiện trong public Discovery.
- `TRUE`: Career Profile có thể xuất hiện nhưng vẫn chịu RBAC/policy.

**Privacy by default** là nguyên tắc bắt buộc.

| Dữ liệu | Public mặc định |
|---|---:|
| Full name | Có thể |
| Major | Có thể |
| Skills | Có thể |
| Experience | Có thể |
| Projects | Có thể |
| Phone | Không |
| Personal Email | Không |
| Detailed GPA | Không |
| Transcript | Không |
| Certificate | Không |
| Private CV | Không |
| Private Documents | Không |

## 8. DATA MODEL / DATA SOURCES

Module 3 không tạo bảng `career_profiles` riêng theo thiết kế hiện tại.

### 8.1. Career Profile

```text
students
  |-- student_skills
  |-- student_experiences
  |-- student_projects
  `-- student_cvs
```

Career Profile là dữ liệu tổng hợp để phục vụ Discovery.

### 8.2. Job Discovery

```text
jobs
  `-- job_skills
```

### 8.3. Saved Jobs

```text
saved_jobs
  |-- student_id
  |-- job_id
  `-- created_at
```

Constraint: `UNIQUE(student_id, job_id)`.

## 9. DATA OWNERSHIP

| Dữ liệu | Module sở hữu | Module 3 |
|---|---|---|
| Student Profile | Student Registration & Profile | Read |
| Student Skills | Student Registration & Profile | Read |
| Student Experience | Student Registration & Profile | Read |
| Student Projects | Student Registration & Profile | Read |
| Student CV | Student Registration & Profile | Read theo policy |
| Career Profile visibility | Student Registration & Profile | Enforce khi Discovery |
| Job | Job Management | Read |
| Job Skills | Job Management | Read |
| Saved Job | Discovery/Job Discovery scope | Create/Read/Delete |
| Application | Application | Không sở hữu |
| Recruitment Pipeline | Recruitment Pipeline | Không sở hữu |

## 10. USE CASE MAP

```text
Employer/Recruiter
  |-- UC-DISC-01 Search Career Profile
  |-- UC-DISC-02 Filter Career Profile
  `-- UC-DISC-03 View Career Profile

Career Center
  |-- UC-DISC-01 Search Career Profile
  |-- UC-DISC-02 Filter Career Profile
  `-- UC-DISC-03 View Career Profile

Student
  |-- UC-DISC-04 Search Job
  |-- UC-DISC-05 Filter Job
  |-- UC-DISC-06 View Job Detail
  |-- UC-DISC-07 Bookmark Job [P1]
  |-- UC-DISC-08 Remove Bookmark [P1]
  `-- UC-DISC-09 View Saved Jobs [P1]
```

## 11. END-TO-END FLOW

### Employer tìm Student

```text
Employer/Recruiter
      -> Career Discovery
      -> Search / Filter
      -> Backend Authorization
      -> career_profile_visibility = TRUE
      -> Career Profile List
      -> Career Profile Detail
      -> Public data only
```

### Student tìm Job

```text
Student
  -> Job Discovery
  -> Search / Filter
  -> PUBLISHED Jobs
  -> Job Detail
       |-- Apply -> Application Module
       `-- Bookmark -> saved_jobs
```

## 12. ERROR & EDGE CASES

| Case | Expected behavior |
|---|---|
| Career Profile private | Không xuất hiện trong public result |
| Actor không có quyền | `403 Forbidden` |
| Không tìm thấy Profile | Empty result |
| Không tìm thấy Job | Empty result |
| Job không PUBLISHED | Không hiển thị như Job đang tuyển |
| Job hết deadline | Không nhận Application mới |
| Bookmark trùng | Không tạo duplicate |
| Student truy cập Saved Job của Student khác | Từ chối truy cập |
| Invalid filter | `400 Bad Request` |

## 13. API DESIGN GUIDELINE

> Endpoint dưới đây là đề xuất thiết kế cho SRS, không phải endpoint đã được chốt trong Functional Requirements.

```text
GET /api/v1/career-discovery/students
GET /api/v1/career-discovery/students/{studentId}

GET /api/v1/career-discovery/jobs
GET /api/v1/career-discovery/jobs/{jobId}

GET    /api/v1/career-discovery/saved-jobs
POST   /api/v1/career-discovery/saved-jobs
DELETE /api/v1/career-discovery/saved-jobs/{jobId}
```

Implementation phải tuân theo Technical Architecture và Module Boundary.

## 14. ACCEPTANCE CRITERIA TỔNG HỢP

| ID | Acceptance Criteria |
|---|---|
| AC-DISC-01 | Employer/Recruiter có thể tìm Career Profile public |
| AC-DISC-02 | Career Profile private không xuất hiện trong public result |
| AC-DISC-03 | Employer không nhận private Student data nếu không có quyền |
| AC-DISC-04 | Career Center xem Career Profile theo permission |
| AC-DISC-05 | Student có thể tìm Job |
| AC-DISC-06 | Student có thể lọc Job theo tiêu chí được hỗ trợ |
| AC-DISC-07 | Student có thể xem Job Detail |
| AC-DISC-08 | Job không PUBLISHED không xuất hiện như Job đang tuyển |
| AC-DISC-09 | Student có thể Bookmark Job ở P1 |
| AC-DISC-10 | Không tồn tại duplicate Bookmark |
| AC-DISC-11 | Student chỉ xem/quản lý Saved Jobs của chính mình |
| AC-DISC-12 | Apply từ Job Detail chuyển sang Application Module |

## 15. TRACEABILITY MATRIX

| Module Requirement | Source Requirement | Priority |
|---|---|---:|
| FR-DISC-01 Search Career Profile | `FR-STU-04` | P0 |
| FR-DISC-02 Filter Career Profile | `FR-STU-04` | P0 |
| FR-DISC-03 View Career Profile | `FR-STU-04` | P0 |
| FR-DISC-04 Search Job | `FR-JOB-05` | P0 |
| FR-DISC-05 Filter Job | `FR-JOB-05` | P0 |
| FR-DISC-06 View Job Detail | Job Discovery scope | P0 |
| FR-DISC-07 Bookmark Job | `FR-JOB-06` | P1 |
| FR-DISC-08 Remove Bookmark | `FR-JOB-06` | P1 |
| FR-DISC-09 View Saved Jobs | `FR-JOB-06` | P1 |

## 16. NON-FUNCTIONAL REQUIREMENTS

### NFR-DISC-01 — Security

Authorization phải được kiểm tra tại Backend.

### NFR-DISC-02 — Privacy

Không trả private Student data nếu request không có quyền.

### NFR-DISC-03 — Performance

Job Search là hot query path. Database Architecture đã xác định index `jobs(status, deadline)` và `job_skills(job_id, skill_name)` phục vụ Job Search.

### NFR-DISC-04 — Pagination

Danh sách Career Profile, Job và Saved Jobs phải hỗ trợ pagination.

### NFR-DISC-05 — Audit

Các action quan trọng phải tuân theo cơ chế Activity Log của toàn hệ thống khi được xác định là auditable action.

## 17. DEPENDENCIES

```text
Authentication & RBAC
        |
        v
Student Career Discovery
   |         |          |
   v         v          v
Student    Job       Application
Profile    Module    Module
```

Required:
- Authentication & RBAC.
- Student Registration & Profile.
- Job Management / Job data.
- Application Module cho luồng Apply.

Không dependency:
- SSO/SIS.
- AI.
- Realtime Chat.
- External Calendar.
- Email nâng cao.

## 18. FUTURE EXTENSION

Các hướng P2 không phải dependency của MVP:

```text
AI Matching
    -> Recommendation
    -> Skill Gap Analysis
    -> Semantic Search
    -> RAG Career Assistant
```

## 19. DESIGN DECISIONS

### Decision 01 — Không tạo bảng `career_profiles`

Career Profile được tổng hợp từ Student Profile và các entity liên quan; tránh duplicate ownership/dữ liệu.

### Decision 02 — Privacy mặc định

`career_profile_visibility = FALSE`; Student phải chủ động cho phép Career Profile public.

### Decision 03 — Discovery không sở hữu Job

Job thuộc Job Management; Discovery chỉ đọc dữ liệu Job đã được phép công bố.

### Decision 04 — Bookmark là P1

Theo Functional Requirements, `FR-JOB-06` là P1.

### Decision 05 — Không AI Matching trong MVP

AI matching/recommendation/semantic search thuộc P2.

### Decision 06 — Không SSO

Module 3 không phụ thuộc SSO. Authentication được cung cấp bởi Authentication & RBAC nội bộ của hệ thống.

## 20. SUMMARY

Module 3 cung cấp hai nhóm chức năng cốt lõi:

1. **Career Profile Discovery:** Employer/Recruiter và Career Center tìm kiếm, lọc, xem Career Profile public.
2. **Job Discovery:** Student tìm kiếm, lọc, xem Job Detail; Bookmark là P1.

Module tập trung vào **Discovery**, không thay thế Student Profile, Job Management hay Application. Privacy, Authorization và Module Boundary là các yêu cầu nền tảng của thiết kế.
