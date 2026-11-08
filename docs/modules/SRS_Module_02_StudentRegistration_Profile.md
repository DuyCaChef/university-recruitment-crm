# SRS - Module 02: Student Registration & Profile

| Thuộc tính       | Giá trị                          |
| ---------------- | -------------------------------- |
| **Dự án**        | Web CRM Sinh viên - Doanh nghiệp |
| **Module**       | Student Registration & Profile   |
| **Module Code**  | `MOD-STU`                        |
| **Priority**     | `P0`                             |
| **Version**      | `1.0`                            |
| **Status**       | Baseline                         |
| **Architecture** | Modular Monolith                 |
| **Backend**      | NestJS + TypeScript              |
| **Database**     | PostgreSQL + Prisma              |

## 1. Mục đích module

Module Student Registration & Profile chịu trách nhiệm quản lý dữ liệu định danh, thông tin học tập cơ bản và hồ sơ nghề nghiệp của sinh viên trong hệ thống CRM.

Module bao gồm bốn nhóm nghiệp vụ:

- Quản lý hồ sơ Student.
- Quản lý Skills, Experience và Projects.
- Quản lý nhiều CV.
- Cung cấp Career Profile công khai để Employer/Recruiter và Career Center tìm kiếm.

Module này không thay thế Authentication & RBAC.

Có thể hiểu:

- **Module 1:** “Sinh viên là ai và có được phép đăng nhập hay không?”
- **Module 2:** “Sinh viên có thông tin học tập, năng lực và hồ sơ nghề nghiệp như thế nào?”

## 2. Phạm vi module

### 2.1. In scope

| STT | Chức năng                             | FR          |
| --: | ------------------------------------- | ----------- |
|   1 | Quản lý Student Profile               | `FR-STU-01` |
|   2 | Quản lý Skills                        | `FR-STU-02` |
|   3 | Quản lý Experience                    | `FR-STU-02` |
|   4 | Quản lý Projects                      | `FR-STU-02` |
|   5 | Quản lý nhiều CV                      | `FR-STU-03` |
|   6 | Chọn CV mặc định                      | `FR-STU-03` |
|   7 | Career Profile Visibility             | `FR-STU-04` |
|   8 | Tìm kiếm Career Profile công khai     | `FR-STU-04` |
|   9 | Kiểm soát Public/Private Student Data | Xuyên suốt  |

### 2.2. Out of scope

Theo baseline hiện tại, Module 2 không bao gồm:

- AI matching.
- AI recommendation.
- Skill gap analysis.
- Semantic search.
- Transcript management ở MVP.
- Certificate management ở MVP.
- Portfolio document management nâng cao.
- OTP xác thực Student.
- Multi-university.
- Tự động đánh giá hoặc quyết định tuyển dụng.

Transcript, certificate và portfolio được định hướng **P1**. AI matching/recommendation và semantic search được định hướng **P2**.

## 3. Actors

| Actor                  | Vai trò trong module                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Student**            | Đăng ký tài khoản, quản lý hồ sơ, skills, experience, projects và CV            |
| **Employer/Recruiter** | Tìm kiếm và xem Career Profile công khai                                        |
| **Career Center**      | Tìm kiếm Career Profile theo phạm vi quyền                                      |
| **System Admin**       | Hỗ trợ quản trị hệ thống theo quyền, không trực tiếp thay Student quản lý hồ sơ |

FR hiện tại xác định Student là actor chính của `FR-STU-01` đến `FR-STU-03`. Employer/Recruiter và Career Center là actor của `FR-STU-04`.

## 4. Dependency với Module 1

Module 2 phụ thuộc trực tiếp vào Authentication & RBAC.

### 4.1. Luồng tổng quát

```text
Student Master Data
        │
        ▼
Student Registration
        │
        ▼
Authentication / Account
        │
        ▼
Student Profile
        │
        ├── Skills
        ├── Experiences
        ├── Projects
        └── CVs
               │
               ▼
       Career Profile
               │
               ▼
 Employer / Career Center
```

### 4.2. Quan hệ cơ sở dữ liệu

```text
USERS
  │
  │ 0..1
  ▼
STUDENTS
  │
  ├──< STUDENT_SKILLS
  ├──< STUDENT_EXPERIENCES
  ├──< STUDENT_PROJECTS
  └──< STUDENT_CVS >── FILES
```

Trong DB, `students.user_id` là FK tới `users.id`, có ràng buộc `UNIQUE` và có thể `NULL`. Điều này nghĩa là Student Master Data có thể tồn tại trước khi Student tạo account.

Đây là điểm rất quan trọng đối với nghiệp vụ đăng ký Student.

## 5. Data model của module

### 5.1. Bảng `students`

Đây là bảng trung tâm của Module 2.

```text
students
├── id
├── user_id
├── student_code
├── full_name
├── date_of_birth
├── gender
├── major
├── faculty
├── academic_year
├── status
├── phone
├── career_profile_visibility
├── created_at
└── updated_at
```

| Field                       | Ý nghĩa                                  |
| --------------------------- | ---------------------------------------- |
| `id`                        | ID nội bộ của Student                    |
| `user_id`                   | Liên kết Account                         |
| `student_code`              | Mã sinh viên                             |
| `full_name`                 | Họ tên                                   |
| `date_of_birth`             | Ngày sinh                                |
| `gender`                    | Giới tính                                |
| `major`                     | Ngành học                                |
| `faculty`                   | Khoa                                     |
| `academic_year`             | Khóa/năm học                             |
| `status`                    | `ACTIVE` / `GRADUATED` / `SUSPENDED`     |
| `phone`                     | Số điện thoại                            |
| `career_profile_visibility` | Cho phép public Career Profile hay không |

Các ràng buộc chính:

- `student_code` là `UNIQUE`.
- `user_id` là `UNIQUE`.
- `status` thuộc một trong các giá trị `ACTIVE`, `GRADUATED`, `SUSPENDED`.
- `career_profile_visibility` mặc định là `FALSE`.

## 6. FR-STU-01 - Quản lý hồ sơ Student

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| **Priority** | `P0`    |
| **Actor**    | Student |

### 6.1. Mục tiêu

Cho phép Student xem và cập nhật hồ sơ cá nhân và thông tin học tập cơ bản của chính mình.

### 6.2. Preconditions

- Student đã có account.
- Account đang ở trạng thái cho phép hoạt động.
- Student được liên kết với một bản ghi `students`.

### 6.3. Functional requirement

Hệ thống phải cho phép Student:

- Xem hồ sơ của mình.
- Cập nhật thông tin cá nhân được phép.
- Xem mã Student ID.
- Xem và cập nhật thông tin học tập được phép.
- Xem trạng thái Student.
- Thiết lập khả năng public Career Profile.

### 6.4. Data mapping

| FR                    | Database                             |
| --------------------- | ------------------------------------ |
| Student ID            | `students.student_code`              |
| Họ tên                | `students.full_name`                 |
| Ngày sinh             | `students.date_of_birth`             |
| Giới tính             | `students.gender`                    |
| Ngành                 | `students.major`                     |
| Khoa                  | `students.faculty`                   |
| Khóa/năm học          | `students.academic_year`             |
| Trạng thái            | `students.status`                    |
| Phone                 | `students.phone`                     |
| Public Career Profile | `students.career_profile_visibility` |

Database hiện tại không có trường GPA trong `students`. Vì FR-STU-01 chỉ nói “GPA nếu có dữ liệu”, SRS không nên tự thêm `gpa` vào DB baseline hiện tại. Đây là điểm cần giữ nguyên khi triển khai.

### 6.5. Business rules

#### BR-STU-01 - Ownership của Student Profile

Student chỉ được sửa hồ sơ của chính mình.

```text
currentUser
     │
     ▼
user_id
     │
     ▼
student
     │
     ▼
allow update
```

Không được:

```text
Student A
   │
   └────X────> Student B Profile
```

#### BR-STU-02 - Student code duy nhất

`student_code` là định danh Student và phải `UNIQUE`.

#### BR-STU-03 - Liên kết Account duy nhất

Một Student tối đa liên kết với một User Account.

Database thể hiện bằng:

```text
students.user_id UNIQUE
```

#### BR-STU-04 - Student status

Student status gồm:

```text
ACTIVE
GRADUATED
SUSPENDED
```

Không tạo actor riêng cho Alumni trong MVP.

### 6.6. Acceptance criteria

| ID            | Acceptance criteria                            |
| ------------- | ---------------------------------------------- |
| `AC-STU01-01` | Student xem được hồ sơ của mình                |
| `AC-STU01-02` | Student cập nhật được thông tin được phép      |
| `AC-STU01-03` | Không thể cập nhật Student khác                |
| `AC-STU01-04` | `student_code` không bị trùng                  |
| `AC-STU01-05` | `user_id` không thể liên kết với nhiều Student |
| `AC-STU01-06` | Student status được lưu đúng                   |
| `AC-STU01-07` | Backend từ chối truy cập trái ownership        |

## 7. FR-STU-02 - Quản lý Skills, Experience và Projects

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| **Priority** | `P0`    |
| **Actor**    | Student |

FR này được Database Architecture hỗ trợ trực tiếp bằng ba bảng con của `students`:

```text
students
   │
   ├──< student_skills
   ├──< student_experiences
   └──< student_projects
```

Cardinality:

```text
Student 1 ─── N Skills
Student 1 ─── N Experiences
Student 1 ─── N Projects
```

### 7.1. Skills

#### Database

```text
student_skills
├── id
├── student_id
├── skill_name
└── proficiency
```

#### Functional requirements

Student có thể:

- Xem skills.
- Thêm skill.
- Sửa skill.
- Xóa skill.
- Nhập mức độ thành thạo nếu muốn.

`proficiency` hiện là `VARCHAR(30)` và không khóa enum. Do đó, SRS không nên tự quy định cứng các mức như `Beginner`, `Intermediate` hoặc `Advanced` nếu chưa có business decision riêng.

### 7.2. Experience

#### Database

```text
student_experiences
├── id
├── student_id
├── company_name
├── position
├── start_date
├── end_date
└── description
```

Dùng để lưu kinh nghiệm làm việc/thực tập.

#### Business constraint

`end_date` phải lớn hơn hoặc bằng `start_date` nếu `end_date` có giá trị:

```text
end_date >= start_date
```

Student có thể:

- Thêm experience.
- Sửa experience.
- Xóa experience.
- Xem experience.

### 7.3. Projects

#### Database

```text
student_projects
├── id
├── student_id
├── name
├── description
├── role
├── technologies
├── project_url
├── start_date
└── end_date
```

Student có thể:

- Thêm project.
- Sửa project.
- Xóa project.
- Xem project.

#### Business rule

Project phải thuộc đúng Student đang thao tác.

Không được:

```text
Student A → UPDATE project của Student B
```

### 7.4. Acceptance criteria

| ID            | Tiêu chí                                      |
| ------------- | --------------------------------------------- |
| `AC-STU02-01` | Student thêm được Skill                       |
| `AC-STU02-02` | Student sửa/xóa Skill của mình                |
| `AC-STU02-03` | Student thêm Experience                       |
| `AC-STU02-04` | Experience lưu đúng Student                   |
| `AC-STU02-05` | `end_date` không nhỏ hơn `start_date`         |
| `AC-STU02-06` | Student thêm Project                          |
| `AC-STU02-07` | Project lưu đúng Student                      |
| `AC-STU02-08` | Không thể chỉnh sửa dữ liệu Student khác      |
| `AC-STU02-09` | Career Profile có thể sử dụng các dữ liệu này |

## 8. FR-STU-03 - Quản lý nhiều CV

| Thuộc tính   | Giá trị |
| ------------ | ------- |
| **Priority** | `P0`    |
| **Actor**    | Student |

Đây là FR có sự hỗ trợ rõ từ Database Architecture.

### 8.1. Mô hình dữ liệu

```text
Student
   │
   └──< student_cvs >── files
```

```text
student_cvs
├── id
├── student_id
├── file_id
├── title
├── is_default
├── created_at
└── updated_at
```

### 8.2. Functional requirements

Student có thể:

- Upload CV.
- Lưu nhiều CV.
- Đặt tên CV.
- Xem danh sách CV.
- Chọn CV mặc định.
- Thay đổi CV mặc định.
- Sử dụng CV đã chọn khi Apply Job.

Ví dụ:

```text
Student
│
├── CV Frontend Developer
├── CV Backend Developer       ← Default
└── CV Software Engineer
```

### 8.3. Default CV

Database đã thiết kế:

```sql
is_default BOOLEAN

UNIQUE INDEX
ON student_cvs(student_id)
WHERE is_default = TRUE
```

Điều này đảm bảo một Student chỉ có tối đa một CV mặc định. Đây là business constraint tốt và nên được giữ trong SRS.

### 8.4. File storage

DB không lưu trực tiếp binary CV.

```text
Student
   │
   ▼
student_cvs
   │
   ▼
files
   │
   ▼
MinIO / Object Storage
```

Bảng `files` lưu metadata:

- `original_name`
- `storage_key`
- `mime_type`
- `size_bytes`
- `owner_user_id`

Binary thực tế nằm ở object storage.

### 8.5. Quy tắc bảo mật

CV được xem là dữ liệu có quyền truy cập.

| Thao tác             | Student A |
| -------------------- | --------: |
| Xem CV của A         |         ✓ |
| Upload CV            |         ✓ |
| Xem CV của Student B |         ✗ |

Employer không được mặc định truy cập CV private.

FR-X-06 cũng xác định CV và các tài liệu Student phải được kiểm soát quyền truy cập. File thật nằm ở filesystem/object storage; DB chỉ lưu metadata/reference.

### 8.6. CV tại thời điểm Apply

Đây là điểm giao tiếp giữa Module 2 và Module Application.

```text
applications.cv_id
        │
        ▼
student_cvs.id
```

Application giữ CV đã chọn tại thời điểm Apply, không phụ thuộc CV mặc định hiện tại.

Ví dụ:

```text
Ngày 01:
Student Apply
CV = Backend Developer

Ngày 10:
Student đổi Default CV
CV = Frontend Developer

Application ngày 01 vẫn tham chiếu CV Backend Developer.
```

Database Architecture đã quy định rõ nguyên tắc này để bảo toàn lịch sử ứng tuyển.

## 9. FR-STU-04 - Tìm kiếm Career Profile công khai

| Thuộc tính   | Giá trị                                              |
| ------------ | ---------------------------------------------------- |
| **Priority** | `P0`                                                 |
| **Actors**   | Employer/Recruiter; Career Center theo phạm vi quyền |

Đây là FR đặc biệt vì không phải CRUD thông thường của Student.

```text
Student Data
      │
      ▼
Career Profile Visibility
      │
      ▼
Public Career Profile
      │
      ▼
Search
      │
 ┌────┴────┐
 ▼         ▼
Employer   Career Center
```

### 9.1. Public Career Profile

Database sử dụng `students.career_profile_visibility`, với giá trị mặc định:

```text
FALSE
```

Điều này phù hợp với requirement: private data không public mặc định.

### 9.2. Dữ liệu có thể public

Career Profile có thể bao gồm:

- Họ tên.
- Ngành.
- Skills.
- Experience.
- Projects.
- Thông tin nghề nghiệp được phép chia sẻ.

```text
PUBLIC CAREER PROFILE
├── Full Name
├── Major
├── Skills
├── Experience
├── Projects
└── Allowed Career Information
```

### 9.3. Dữ liệu không public mặc định

Không được đưa vào Public Career Profile mặc định:

- CV.
- GPA chi tiết.
- Transcript.
- Certificate.
- Phone.
- Private data.
- Sensitive information.

Employer chỉ được truy cập dữ liệu private nếu policy/quyền cho phép; backend phải enforce authorization.

## 10. Search Career Profile

Employer/Recruiter có thể tìm kiếm theo các thông tin nghề nghiệp được phép, chẳng hạn:

- Skill.
- Major/ngành.
- Experience.
- Project.

Ví dụ:

```text
Search:
"React"

        ↓

Career Profile
        ↓

Student A
Student B
Student C
```

Backend phải đảm bảo:

```sql
WHERE career_profile_visibility = TRUE
```

và chỉ select các trường public.

Không được thiết kế API kiểu sau:

```http
GET /students
```

rồi trả toàn bộ Student record cho Employer.

Thay vào đó nên có một public-facing projection/DTO riêng, ví dụ `CareerProfileResponse`, để tách biệt:

```text
Student Entity
      │
      ├── Private Data
      └── Public Career Profile
```

Đây là cách phù hợp với yêu cầu Public/Private separation của hệ thống.

## 11. Quyền truy cập tổng thể

| Dữ liệu               | Student | Employer            | Career Center |
| --------------------- | ------- | ------------------- | ------------- |
| Hồ sơ của mình        | CRUD    | -                   | Theo quyền    |
| Hồ sơ Student khác    | ✗       | Public only         | Theo policy   |
| Skills của mình       | CRUD    | Public nếu cho phép | Theo quyền    |
| Experience của mình   | CRUD    | Public nếu cho phép | Theo quyền    |
| Projects của mình     | CRUD    | Public nếu cho phép | Theo quyền    |
| CV của mình           | CRUD    | Private             | Theo quyền    |
| Career Profile public | ✓       | View/Search         | View/Search   |
| Private Student Data  | Own     | ✗ mặc định          | Theo quyền    |

Nguyên tắc xuyên suốt:

> RBAC quyết định actor có loại quyền gì; Ownership/Relationship quyết định actor có được thao tác trên resource cụ thể hay không.

Backend bắt buộc phải kiểm tra authorization, không được chỉ ẩn button trên Frontend.

## 12. State model

### 12.1. Student status

```text
ACTIVE
  │
  ├──────────────► GRADUATED
  │
  └──────────────► SUSPENDED
```

Database sử dụng:

```text
student_status
= ACTIVE
= GRADUATED
= SUSPENDED
```

> **Lưu ý:** SRS không tự định nghĩa thêm các transition nghiệp vụ chi tiết nếu Scope/DB chưa chốt.

## 13. Business rules tổng hợp

| ID          | Business rule                                            |
| ----------- | -------------------------------------------------------- |
| `BR-STU-01` | Student chỉ được sửa dữ liệu của chính mình              |
| `BR-STU-02` | `student_code` phải `UNIQUE`                             |
| `BR-STU-03` | Một Student tối đa liên kết một User Account             |
| `BR-STU-04` | Student status gồm `ACTIVE`/`GRADUATED`/`SUSPENDED`      |
| `BR-STU-05` | Student có thể có nhiều Skills                           |
| `BR-STU-06` | Student có thể có nhiều Experiences                      |
| `BR-STU-07` | Student có thể có nhiều Projects                         |
| `BR-STU-08` | `Experience.end_date` phải hợp lệ so với `start_date`    |
| `BR-STU-09` | Student có thể có nhiều CV                               |
| `BR-STU-10` | Một Student tối đa có một CV mặc định                    |
| `BR-STU-11` | CV phải được kiểm soát quyền truy cập                    |
| `BR-STU-12` | Application phải giữ CV được chọn tại thời điểm Apply    |
| `BR-STU-13` | Career Profile mặc định không public                     |
| `BR-STU-14` | Chỉ dữ liệu được phép mới xuất hiện trong Career Profile |
| `BR-STU-15` | Employer không được tự ý truy cập private Student data   |
| `BR-STU-16` | Backend phải enforce ownership/authorization             |

## 14. API requirements - Proposed Baseline

Phần này là thiết kế API đề xuất cho SRS, không phải các endpoint đã được source document chốt cứng.

### 14.1. Student Profile

```http
GET    /api/v1/students/me
PATCH  /api/v1/students/me
```

### 14.2. Skills

```http
GET    /api/v1/students/me/skills
POST   /api/v1/students/me/skills
PATCH  /api/v1/students/me/skills/:skillId
DELETE /api/v1/students/me/skills/:skillId
```

### 14.3. Experiences

```http
GET    /api/v1/students/me/experiences
POST   /api/v1/students/me/experiences
PATCH  /api/v1/students/me/experiences/:experienceId
DELETE /api/v1/students/me/experiences/:experienceId
```

### 14.4. Projects

```http
GET    /api/v1/students/me/projects
POST   /api/v1/students/me/projects
PATCH  /api/v1/students/me/projects/:projectId
DELETE /api/v1/students/me/projects/:projectId
```

### 14.5. CV

```http
GET    /api/v1/students/me/cvs
POST   /api/v1/students/me/cvs
PATCH  /api/v1/students/me/cvs/:cvId
DELETE /api/v1/students/me/cvs/:cvId
PATCH  /api/v1/students/me/cvs/:cvId/default
```

### 14.6. Career Profile

```http
GET    /api/v1/career-profiles
GET    /api/v1/career-profiles/:studentId
PATCH  /api/v1/students/me/career-profile/visibility
```

> **Lưu ý:** Các path trên là proposed API baseline để chuyển từ SRS sang API Design; không nên xem chúng là requirement đã được chốt trong tài liệu FR.

## 15. Use case đề xuất

Tương tự Module 1, từ bốn FR có thể phân rã thành các Use Case sau:

| UC          | Use Case                         | FR          |
| ----------- | -------------------------------- | ----------- |
| `UC-STU-01` | View Student Profile             | `FR-STU-01` |
| `UC-STU-02` | Update Student Profile           | `FR-STU-01` |
| `UC-STU-03` | Manage Skills                    | `FR-STU-02` |
| `UC-STU-04` | Manage Experience                | `FR-STU-02` |
| `UC-STU-05` | Manage Projects                  | `FR-STU-02` |
| `UC-STU-06` | Manage CV                        | `FR-STU-03` |
| `UC-STU-07` | Set Default CV                   | `FR-STU-03` |
| `UC-STU-08` | Manage Career Profile Visibility | `FR-STU-04` |
| `UC-STU-09` | Search Public Career Profiles    | `FR-STU-04` |
| `UC-STU-10` | View Public Career Profile       | `FR-STU-04` |

Đây là Use Case decomposition đề xuất, chưa phải mã Use Case chính thức đã được tài liệu baseline định nghĩa.

## 16. Traceability matrix

Đây là phần nên giữ trong SRS vì giúp chứng minh FR → DB → chức năng có liên kết.

| FR          | Chức năng                 | DB hỗ trợ                            | Actor       | Priority |
| ----------- | ------------------------- | ------------------------------------ | ----------- | -------- |
| `FR-STU-01` | Student Profile           | `students`                           | Student     | `P0`     |
| `FR-STU-02` | Skills                    | `student_skills`                     | Student     | `P0`     |
| `FR-STU-02` | Experience                | `student_experiences`                | Student     | `P0`     |
| `FR-STU-02` | Projects                  | `student_projects`                   | Student     | `P0`     |
| `FR-STU-03` | Multiple CV               | `student_cvs`                        | Student     | `P0`     |
| `FR-STU-03` | CV File                   | `files`                              | Student     | `P0`     |
| `FR-STU-04` | Career Profile visibility | `students.career_profile_visibility` | Student     | `P0`     |
| `FR-STU-04` | Public Career Profile     | `students` + child tables            | Employer/CC | `P0`     |

Có thể thấy bốn FR đều đã có data model tương ứng. Đây là dấu hiệu tốt về tính nhất quán giữa Functional Requirements và Database Architecture.

## 17. Non-functional requirements

### NFR-STU-01 - Authorization

Tất cả API liên quan Student phải kiểm tra authorization ở backend.

### NFR-STU-02 - Ownership

Student chỉ được truy cập resource thuộc Student của mình.

### NFR-STU-03 - Privacy

Private Student Data không được public mặc định.

### NFR-STU-04 - File Security

CV phải được kiểm soát quyền truy cập; không expose trực tiếp storage object nếu chưa qua authorization.

### NFR-STU-05 - Data Integrity

Các FK phải đảm bảo không tạo orphan record.

### NFR-STU-06 - Auditability

Các thao tác quan trọng phải có Activity Log theo cross-cutting requirement.

### NFR-STU-07 - API Separation

Public Career Profile nên trả DTO/projection chỉ chứa dữ liệu được phép public, không expose trực tiếp toàn bộ Student entity.

## 18. Acceptance test matrix

| Test ID     | Scenario                                  | Expected result                              |
| ----------- | ----------------------------------------- | -------------------------------------------- |
| `TC-STU-01` | Student xem profile                       | Thành công                                   |
| `TC-STU-02` | Student sửa profile                       | Thành công                                   |
| `TC-STU-03` | Student sửa profile người khác            | `403 Forbidden`                              |
| `TC-STU-04` | Tạo skill                                 | Thành công                                   |
| `TC-STU-05` | Sửa skill của người khác                  | Từ chối                                      |
| `TC-STU-06` | Tạo experience                            | Thành công                                   |
| `TC-STU-07` | `end_date < start_date`                   | Validation Error                             |
| `TC-STU-08` | Tạo project                               | Thành công                                   |
| `TC-STU-09` | Upload CV                                 | Thành công                                   |
| `TC-STU-10` | Tạo CV thứ hai                            | Thành công                                   |
| `TC-STU-11` | Đặt CV mặc định                           | Thành công                                   |
| `TC-STU-12` | Có 2 CV default                           | Database/Business validation ngăn chặn       |
| `TC-STU-13` | Student bật public profile                | Career Profile có thể xuất hiện trong search |
| `TC-STU-14` | Student tắt public profile                | Profile không xuất hiện trong public search  |
| `TC-STU-15` | Employer xem public profile               | Chỉ nhận public data                         |
| `TC-STU-16` | Employer lấy private CV trái quyền        | `403 Forbidden`                              |
| `TC-STU-17` | Apply bằng CV A rồi đổi default sang CV B | Application vẫn giữ CV A                     |

## 19. Definition of Done

Module 2 được xem là hoàn thành khi đáp ứng các tiêu chí sau:

### Student Profile

- Student có thể xem profile.
- Student cập nhật được profile.
- Student không thể sửa Student khác.
- Student ID được bảo toàn uniqueness.
- Student status hoạt động đúng.

### Skills / Experience / Projects

- CRUD Skills.
- CRUD Experience.
- CRUD Projects.
- Ownership được enforce.
- Validation ngày tháng hoạt động.

### CV

- Upload CV.
- Quản lý nhiều CV.
- Chọn default CV.
- Không tồn tại hai default CV.
- File access được kiểm soát.
- Application giữ đúng CV tại thời điểm Apply.

### Career Profile

- Student bật/tắt visibility.
- Employer tìm kiếm được public profile.
- Career Center tìm kiếm được theo quyền.
- Private data không xuất hiện trong public response.
- Backend enforce authorization.

## 20. Kết luận thiết kế

Sau khi đối chiếu, Module 2 có mức độ khớp rất tốt giữa FR và Database Architecture:

```text
FR-STU-01
    │
    ▼
students
    │
    ├── student_skills
    ├── student_experiences
    ├── student_projects
    │
    └── student_cvs ─── files
             │
             ▼
        Application
```

Và:

```text
students.career_profile_visibility
                │
                ▼
       Public Career Profile
                │
         ┌──────┴──────┐
         ▼             ▼
      Employer    Career Center
```

Các điểm đã chốt tốt trong thiết kế hiện tại:

- `students` tách khỏi `users`, đúng separation giữa Account và Student Profile.
- `student_code UNIQUE` hỗ trợ trực tiếp nghiệp vụ Student Registration.
- `user_id UNIQUE` đảm bảo một Student không gắn nhiều account.
- Skills/Experience/Projects được tách bảng, phù hợp quan hệ 1:N.
- CV tách thành `student_cvs` + `files`, phù hợp object storage.
- `is_default` + partial unique index giải quyết rõ bài toán một CV mặc định.
- Application tham chiếu `cv_id`, bảo toàn CV tại thời điểm ứng tuyển.
- `career_profile_visibility` hỗ trợ Public/Private separation.
- Privacy được thiết kế ở Backend authorization, không chỉ ở UI.

Các điểm không nên tự thêm vào SRS/DB lúc này gồm GPA, transcript, certificate, portfolio nâng cao hay AI matching, vì database hiện tại chưa mô hình hóa chúng trong phần Student MVP và Scope đang phân chúng sang P1/P2.
