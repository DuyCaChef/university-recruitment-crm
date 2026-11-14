# Báo cáo hoàn thiện Module 02

## 1. Thông tin chung

| Thuộc tính | Giá trị |
|---|---|
| Module | Module 02 - Student Registration & Profile |
| Phạm vi | Đăng nhập sinh viên, hồ sơ cá nhân, Career Profile, kỹ năng, kinh nghiệm, dự án và CV |
| Ngày báo cáo | 2026-11-14 |
| Backend | NestJS + TypeScript |
| ORM/CSDL | Prisma + PostgreSQL |
| Object Storage | MinIO S3-compatible |
| Bucket CV chuẩn | `agu-crm-storage` |
| Prefix lưu CV | `resumes/` |

Tài liệu này tổng hợp các nghiệp vụ đã hoàn thành của Module 02, các vấn đề đã được xử lý trong các phiên làm việc, các file đã thay đổi và các migration/schema liên quan.

## 2. Tổng quan kết quả

Module 02 đã hoàn thiện các nhóm chức năng chính:

1. Xác thực Google SSO dành riêng cho sinh viên AGU.
2. JIT provisioning tài khoản và hồ sơ sinh viên.
3. Quản lý hồ sơ cá nhân và dữ liệu học thuật chỉ đọc.
4. CRUD kỹ năng, kinh nghiệm và dự án.
5. Upload và quản lý nhiều CV.
6. Bảo đảm chỉ có một CV mặc định.
7. Public Career Profile và tìm kiếm hồ sơ.
8. Kiểm soát trạng thái `SUSPENDED`.
9. Audit Log cho các sự kiện nghiệp vụ quan trọng.
10. Validation edge case và bảo vệ MinIO private policy.
11. Đồng bộ SRS, Scope, Functional Requirements và cấu hình bucket.

## 3. Xác thực Google SSO và JIT Provisioning

### 3.1. Kiểm tra domain Google

`GoogleStrategy` yêu cầu đồng thời:

- Google Hosted Domain (`hd`) bằng `student.agu.edu.vn`.
- Email kết thúc bằng `@student.agu.edu.vn`.

Email sai domain hoặc thiếu hosted domain hợp lệ bị từ chối ngay tại OAuth strategy, không tạo user và không phát hành token.

### 3.2. Kiểm tra whitelist sinh viên

Email Google phải tồn tại trong `student_masters.institutional_email`. Nếu không có dữ liệu master tương ứng, luồng đăng nhập bị chặn.

### 3.3. Chặn sinh viên bị đình chỉ

Trạng thái `student_masters.status = SUSPENDED` được kiểm tra:

- Ngay trong `GoogleStrategy`.
- Trong `AuthService.handleGoogleAuth`.
- Một lần nữa bên trong transaction JIT để giảm rủi ro race condition.

Sinh viên bị đình chỉ nhận lỗi `403 Forbidden`, không được tạo profile, không được phát hành token.

### 3.4. JIT provisioning nguyên tử

Khi sinh viên đăng nhập lần đầu, hệ thống tạo trong một Prisma transaction:

1. User.
2. Role `STUDENT`.
3. Student profile.
4. Liên kết `student_masters.user_id`.

Nếu một bước lỗi, toàn bộ transaction rollback. Audit event `STUDENT_JIT_PROVISIONED` được ghi sau khi transaction provisioning thành công.

File liên quan:

- [google.strategy.ts](../../backend/src/modules/auth/strategies/google.strategy.ts)
- [auth.service.ts](../../backend/src/modules/auth/services/auth.service.ts)
- [jwt.strategy.ts](../../backend/src/modules/auth/strategies/jwt.strategy.ts)

## 4. Hồ sơ cá nhân sinh viên

### 4.1. Dữ liệu học thuật chỉ đọc

Các trường lấy từ `student_masters` và không cho sinh viên chỉnh sửa:

- MSSV.
- Họ tên.
- Email trường.
- Ngành.
- Khoa.
- Niên khóa.
- Trạng thái học tập.

### 4.2. Dữ liệu cá nhân được cập nhật

Sinh viên có thể cập nhật:

- Số điện thoại.
- Bio.
- Địa chỉ.
- Ngày sinh.
- Giới tính.
- GPA.

Các trường ngoài DTO bị loại bỏ hoặc từ chối nhờ `ValidationPipe` với `whitelist` và `forbidNonWhitelisted`.

Endpoint:

- `GET /api/v1/students/me`
- `PATCH /api/v1/students/me`

## 5. Quản lý kỹ năng, kinh nghiệm và dự án

### 5.1. Skills

Đã triển khai:

- Xem danh sách kỹ năng.
- Thêm kỹ năng.
- Cập nhật kỹ năng.
- Xóa kỹ năng.
- Chống trùng tên kỹ năng trong cùng hồ sơ.
- Không phân biệt hoa thường khi kiểm tra trùng.
- Chặn tên kỹ năng rỗng hoặc chỉ chứa khoảng trắng.

Endpoint:

- `GET/POST /api/v1/students/me/skills`
- `PATCH/DELETE /api/v1/students/me/skills/:id`

### 5.2. Experiences

Đã triển khai:

- CRUD kinh nghiệm làm việc/thực tập.
- Cho phép `endDate = null` cho công việc hiện tại.
- Bắt buộc `endDate >= startDate`.
- Kiểm tra ownership theo `studentId`.
- Chặn chuỗi rỗng hoặc chỉ chứa khoảng trắng ở tên công ty và vị trí.

Endpoint:

- `GET/POST /api/v1/students/me/experiences`
- `PATCH/DELETE /api/v1/students/me/experiences/:id`

### 5.3. Projects

Đã triển khai:

- CRUD dự án.
- Kiểm tra URL dự án theo HTTP/HTTPS.
- Kiểm tra ownership.
- Chặn tên dự án rỗng hoặc chỉ chứa khoảng trắng.

Endpoint:

- `GET/POST /api/v1/students/me/projects`
- `PATCH/DELETE /api/v1/students/me/projects/:id`

## 6. Upload và quản lý nhiều CV

### 6.1. Validation file

CV chỉ được chấp nhận khi:

- Có file.
- Không rỗng.
- Kích thước lớn hơn 0.
- Không vượt quá 5MB (`5 * 1024 * 1024` bytes).
- Phần mở rộng là `.pdf`.
- MIME type là `application/pdf`.
- Magic bytes bắt đầu bằng `%PDF-`.

Validation được thực hiện ở:

- Multer file size limit.
- `PdfFileValidationPipe`.

File:

- [pdf-file-validation.pipe.ts](../../backend/src/common/pipes/pdf-file-validation.pipe.ts)
- [student.controller.ts](../../backend/src/modules/student/controllers/student.controller.ts)

### 6.2. Lưu MinIO

Bucket chuẩn:

```text
agu-crm-storage
```

Storage key chuẩn:

```text
resumes/{studentId}/{uuid}.pdf
```

Database chỉ lưu metadata file và quan hệ `student_cvs`:

- Tên file gốc đã được làm sạch.
- MIME type.
- Kích thước.
- Storage key.
- Tiêu đề CV.
- Trạng thái mặc định.

### 6.3. Bảo đảm một CV mặc định

Các luồng upload và đổi CV mặc định đều bảo đảm tối đa một bản ghi `is_default = true` cho mỗi sinh viên.

- CV đầu tiên tự động là CV mặc định.
- Upload CV mới với `isDefault = true` sẽ hạ CV mặc định cũ.
- Đổi CV mặc định thực hiện trong transaction.
- Xóa CV mặc định sẽ chọn CV còn lại mới nhất làm mặc định nếu có.

### 6.4. Presigned URL và ownership

Tải CV không trả URL MinIO công khai. Backend kiểm tra CV thuộc sinh viên hiện tại rồi cấp presigned URL thời hạn 15 phút.

Endpoint:

- `GET/POST /api/v1/students/me/cvs`
- `GET /api/v1/students/me/cvs/:cvId/download-url`
- `PATCH /api/v1/students/me/cvs/:cvId`
- `PATCH /api/v1/students/me/cvs/:cvId/default`
- `DELETE /api/v1/students/me/cvs/:cvId`

### 6.5. Cơ chế bù trừ khi lỗi

File được upload lên MinIO trước khi lưu metadata vào database. Nếu transaction database thất bại:

1. Hệ thống ghi log lỗi.
2. Gọi cleanup xóa object vừa upload.
3. Nếu cleanup thất bại, ghi log riêng để phát hiện object mồ côi.
4. Trả lỗi `500` rõ ràng cho client.

## 7. Public Career Profile và visibility

### 7.1. Visibility

Sinh viên có thể bật/tắt:

```text
PATCH /api/v1/students/me/visibility
```

Audit Log ghi lại giá trị trước và sau:

- `careerProfileVisibility`.

### 7.2. Public search/detail

Endpoint:

- `GET /api/v1/career-profiles`
- `GET /api/v1/career-profiles/:studentId`

Chỉ role sau được truy cập:

- `EMPLOYER`.
- `CAREER_CENTER`.

Điều kiện truy vấn bắt buộc đồng thời:

```text
students.career_profile_visibility = true
users.status = ACTIVE
student_masters.status = ACTIVE
```

Search hiện hỗ trợ:

- Ngành (`major`).
- Kỹ năng (`skill`).

Public DTO chỉ trả:

- Student ID.
- Họ tên.
- Ngành.
- Khoa.
- Niên khóa.
- Bio.
- Skills.
- Experiences.
- Projects.

Không trả:

- Số điện thoại.
- Địa chỉ.
- Ngày sinh.
- Giới tính.
- GPA.
- Email.
- CCCD.
- CV.
- Password/hash.

File liên quan:

- [career-profile.controller.ts](../../backend/src/modules/student/controllers/career-profile.controller.ts)
- [public-career-profile.dto.ts](../../backend/src/modules/student/dto/public-career-profile.dto.ts)
- [update-visibility.dto.ts](../../backend/src/modules/student/dto/update-visibility.dto.ts)
- [student.service.ts](../../backend/src/modules/student/services/student.service.ts)

## 8. Audit Log

### 8.1. Model và service

Đã thêm `AuditLogService` và `AuditLogModule` global.

Thông tin lưu:

- Actor user.
- Action.
- Resource type.
- Resource ID.
- Old values.
- New values.
- IP address.
- Thời điểm tạo.

Service tự động che các key nhạy cảm có chứa:

- `password`.
- `token`.
- `secret`.
- `hash`.
- `authorization`.

Giá trị `BigInt` được chuyển thành chuỗi trước khi lưu JSONB.

### 8.2. Sự kiện đã tích hợp

- `STUDENT_JIT_PROVISIONED`.
- `STUDENT_CAREER_PROFILE_VISIBILITY_CHANGED`.
- `STUDENT_CV_DELETED`.

### 8.3. Quan hệ và bảo toàn log

`actor_user_id` là nullable và dùng `ON DELETE SET NULL`, nên audit log vẫn tồn tại nếu user bị xóa.

File liên quan:

- [audit-log.service.ts](../../backend/src/infrastructure/audit/audit-log.service.ts)
- [audit-log.module.ts](../../backend/src/infrastructure/audit/audit-log.module.ts)
- [audit-log.service.spec.ts](../../backend/src/infrastructure/audit/audit-log.service.spec.ts)
- [app.module.ts](../../backend/src/app.module.ts)

## 9. Validation edge cases đã bổ sung trong phiên này

### 9.1. Custom validator chống chuỗi trắng

Đã thêm `IsNotBlank`, kiểm tra sau khi trim chuỗi. Validator được áp dụng cho:

- Skill name.
- Proficiency.
- CV title.
- Company name.
- Position.
- Project name.

File:

- [is-not-blank.validator.ts](../../backend/src/common/validators/is-not-blank.validator.ts)

### 9.2. Boolean `isDefault` strict

`isDefault` chỉ chấp nhận:

- Boolean thật.
- Chuỗi `"true"`.
- Chuỗi `"false"`.

Các chuỗi như `"yes"`, `"1"` hoặc giá trị không hợp lệ không còn bị chuyển ngầm thành `false`.

File:

- [student-cv.dto.ts](../../backend/src/modules/student/dto/student-cv.dto.ts)

### 9.3. MinIO private policy

Khi module storage khởi động:

1. Kiểm tra bucket.
2. Tạo bucket nếu chưa tồn tại.
3. Áp dụng policy không có public statement.
4. Nếu không thiết lập được private policy, lỗi được ghi nhận và ném lại.

Bucket CV không được truy cập public trực tiếp; chỉ presigned URL do backend cấp mới được sử dụng.

File:

- [storage.service.ts](../../backend/src/infrastructure/storage/storage.service.ts)

## 10. Cập nhật Prisma schema

### 10.1. Các enum chính

`UserStatus`:

- `ACTIVE`.
- `LOCKED`.
- `INACTIVE`.

`StudentStatus`:

- `ACTIVE`.
- `GRADUATED`.
- `SUSPENDED`.

### 10.2. Các model Module 02

#### `StudentMaster`

Lưu dữ liệu gốc do nhà trường quản lý, gồm MSSV, email trường, họ tên, ngành, khoa, niên khóa và trạng thái học tập.

#### `Student`

Lưu hồ sơ cá nhân và các quan hệ:

- `careerProfileVisibility`.
- Skills.
- Experiences.
- Projects.
- CVs.

#### `StudentSkill`

Lưu tên kỹ năng, proficiency và student ownership.

#### `StudentExperience`

Lưu công ty, vị trí, khoảng thời gian và mô tả; có index theo `studentId, startDate DESC`.

#### `StudentProject`

Lưu tên, mô tả, vai trò, technologies, URL và khoảng thời gian.

#### `StudentCv`

Lưu title, `isDefault`, student ID và file ID; có index theo student.

#### `File`

Lưu metadata object MinIO:

- Original name.
- Storage key.
- MIME type.
- Size bytes.
- Owner user.

#### `ActivityLog`

Model mới lưu audit trail với các index:

- Resource type/resource ID/time.
- Actor/time.
- Created time.

File schema:

- [schema.prisma](../../backend/prisma/schema.prisma)

## 11. Chi tiết migration

### 11.1. `20261108132847_init_student_profile_schema`

Tạo nền tảng Module 02:

- `student_masters`.
- `students`.
- `student_skills`.
- `student_experiences`.
- `student_projects`.
- `student_cvs`.
- `files`.

Đồng thời tạo:

- Foreign key ownership.
- Quan hệ cascade/restrict/set null.
- Unique student master/user.
- Unique file storage key.
- Index cho timeline experiences và project lookup.

### 11.2. `20261114023208_add_unique_default_cv_index`

Tạo partial unique index:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_cvs_single_default
ON student_cvs (student_id)
WHERE is_default = TRUE;
```

Mục tiêu là bảo đảm ở tầng database mỗi sinh viên có tối đa một CV mặc định.

### 11.3. `20261114152000_add_activity_logs`

Tạo bảng `activity_logs` với:

- UUID primary key.
- Actor user nullable.
- Action/resource metadata.
- JSONB old/new values.
- IP address.
- Created timestamp.
- Các index truy vấn audit.
- Foreign key actor với `ON DELETE SET NULL`.

### 11.4. `20261114160000_case_insensitive_skill_name`

Thay unique index phân biệt hoa thường bằng expression index:

```sql
DROP INDEX IF EXISTS "uq_student_skills_name";

CREATE UNIQUE INDEX "uq_student_skills_name"
ON "student_skills" ("student_id", LOWER("skill_name"));
```

Nhờ đó `JavaScript`, `javascript` và `JAVASCRIPT` được xem là cùng một kỹ năng trong cùng hồ sơ.

Do Prisma schema không biểu diễn trực tiếp expression index `LOWER(...)`, ràng buộc này được quản lý bằng migration SQL và không còn khai báo `@@unique([studentId, skillName])` trong schema.

## 12. Các file đã thay đổi/bổ sung trong phạm vi hoàn thiện Module 02

### Backend và schema

- [backend/.env.example](../../backend/.env.example)
- [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma)
- [backend/prisma/migrations/20261114023208_add_unique_default_cv_index/migration.sql](../../backend/prisma/migrations/20261114023208_add_unique_default_cv_index/migration.sql)
- [backend/prisma/migrations/20261114152000_add_activity_logs/migration.sql](../../backend/prisma/migrations/20261114152000_add_activity_logs/migration.sql)
- [backend/prisma/migrations/20261114160000_case_insensitive_skill_name/migration.sql](../../backend/prisma/migrations/20261114160000_case_insensitive_skill_name/migration.sql)
- [backend/src/modules/auth/strategies/google.strategy.ts](../../backend/src/modules/auth/strategies/google.strategy.ts)
- [backend/src/modules/auth/services/auth.service.ts](../../backend/src/modules/auth/services/auth.service.ts)
- [backend/src/modules/student/controllers/student.controller.ts](../../backend/src/modules/student/controllers/student.controller.ts)
- [backend/src/modules/student/controllers/career-profile.controller.ts](../../backend/src/modules/student/controllers/career-profile.controller.ts)
- [backend/src/modules/student/services/student.service.ts](../../backend/src/modules/student/services/student.service.ts)
- [backend/src/modules/student/student.module.ts](../../backend/src/modules/student/student.module.ts)
- [backend/src/modules/student/dto/skill.dto.ts](../../backend/src/modules/student/dto/skill.dto.ts)
- [backend/src/modules/student/dto/experience.dto.ts](../../backend/src/modules/student/dto/experience.dto.ts)
- [backend/src/modules/student/dto/project.dto.ts](../../backend/src/modules/student/dto/project.dto.ts)
- [backend/src/modules/student/dto/student-cv.dto.ts](../../backend/src/modules/student/dto/student-cv.dto.ts)
- [backend/src/modules/student/dto/public-career-profile.dto.ts](../../backend/src/modules/student/dto/public-career-profile.dto.ts)
- [backend/src/modules/student/dto/update-visibility.dto.ts](../../backend/src/modules/student/dto/update-visibility.dto.ts)
- [backend/src/common/pipes/pdf-file-validation.pipe.ts](../../backend/src/common/pipes/pdf-file-validation.pipe.ts)
- [backend/src/common/validators/is-not-blank.validator.ts](../../backend/src/common/validators/is-not-blank.validator.ts)
- [backend/src/infrastructure/storage/storage.service.ts](../../backend/src/infrastructure/storage/storage.service.ts)
- [backend/src/infrastructure/audit/audit-log.service.ts](../../backend/src/infrastructure/audit/audit-log.service.ts)
- [backend/src/infrastructure/audit/audit-log.module.ts](../../backend/src/infrastructure/audit/audit-log.module.ts)
- [backend/src/infrastructure/audit/audit-log.service.spec.ts](../../backend/src/infrastructure/audit/audit-log.service.spec.ts)
- [backend/src/modules/student/dto/student-validation.spec.ts](../../backend/src/modules/student/dto/student-validation.spec.ts)

### Tài liệu nghiệp vụ

- [SRS Module 02](../modules/SRS_Module_02_StudentRegistration_Profile.md)
- [Scope Project](../Scope_Project_WebCRM.md)
- [Functional Requirements](../Functional_Requirements_Web_CRM.md)

Các tài liệu đã được đồng bộ về:

- Google SSO/JIT thay cho self-registration cũ.
- CV PDF tối đa 5MB.
- Bucket `agu-crm-storage`.
- Prefix `resumes/`.
- Private bucket policy.
- Role `CAREER_CENTER`.
- Tên route parameter `cvId`.

## 13. Kiểm tra và xác nhận

Các lệnh đã chạy thành công:

```bash
npx prisma generate
npx prisma validate
npm run build
npm test -- --runInBand
npm run lint
git diff --check
```

Kết quả test cuối cùng:

- 4 test suites passed.
- 13 tests passed.

Lint không có lỗi blocking; còn một warning tồn tại trước đó về import `IS_ALPHA` chưa sử dụng trong `update-student-profile.dto.ts`.

## 14. Triển khai database

Sau khi cập nhật code, cần chạy migration trên database triển khai:

```bash
cd backend
npx prisma migrate deploy
```

Trước khi chạy migration case-insensitive skill index, cần kiểm tra dữ liệu trùng tên kỹ năng khác hoa thường. Nếu dữ liệu đã tồn tại các cặp như `JavaScript` và `javascript`, migration sẽ thất bại cho đến khi dữ liệu trùng được hợp nhất hoặc xóa theo nghiệp vụ.

## 15. Kết luận

Module 02 đã hoàn thiện phần lõi nghiệp vụ Student Registration & Profile, bao gồm cả luồng chính, bảo mật ownership/RBAC, lưu trữ CV private, public profile an toàn, trạng thái đình chỉ, audit trail và các edge case validation.

Các thay đổi trong phiên làm việc cuối đã loại bỏ sự không nhất quán giữa code và tài liệu, đồng thời chuẩn hóa toàn bộ cấu hình CV về:

```text
MINIO_DEFAULT_BUCKET=agu-crm-storage
storage_key prefix: resumes/
access: private + presigned URL
```
