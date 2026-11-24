# Báo cáo rà soát và kiểm thử refactor Student Profile

## 1. Thông tin chung

| Thuộc tính | Giá trị |
|---|---|
| Ngày rà soát/cập nhật | 2026-11-25 |
| Phạm vi | Frontend Student Profile sau refactor feature-based |
| Công nghệ kiểm tra | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod |
| Kết quả | Đã rà soát, sửa các sai lệch phát hiện và chạy build/lint thành công |

## 2. Tổng quan

Rà soát các tiện ích dùng chung, component UI, feature sinh viên, API contract, validation ngày, quyền chỉnh sửa, trạng thái `SUSPENDED`, đồng bộ thông tin layout và các ràng buộc TypeScript/React.

Các sửa đổi chính trong lượt rà soát và lần hiệu chỉnh nghiệp vụ tiếp theo:

1. Khôi phục quyền chỉnh sửa đủ 7 trường hồ sơ thuộc bảng `students`: `displayName`, `phone`, `dateOfBirth`, `gender`, `gpa`, `address` và `bio`. Việc chỉ cho sửa `displayName` ở lần rà soát trước là sai nghiệp vụ và đã được khắc phục.
2. Bổ sung xử lý an toàn hơn cho hai lớp response API và dữ liệu URL tải CV.
3. Hoàn thiện khóa thao tác CV và các form đang mở khi hồ sơ ở trạng thái `SUSPENDED`.
4. Đồng bộ `displayName` ưu tiên hơn `fullName` trên layout sinh viên.
5. Bổ sung export barrel cho `FormDialog` và `TagInput`.

## 3. Kết quả rà soát theo hạng mục

### 3.1. Shared utilities và import paths

Đã xác nhận các hàm cần thiết tồn tại:

- [cn.ts](../../frontend/src/shared/lib/cn.ts): `cn`.
- [formatDate.ts](../../frontend/src/shared/lib/formatDate.ts): `formatDate`, `formatDateTime`, `getTodayInputValue`, `toDateInputValue`, `formatMonthYear`.
- [format.ts](../../frontend/src/shared/lib/format.ts): `formatSize`, `parseCommaTokens`.
- [apiError.ts](../../frontend/src/shared/lib/apiError.ts): `extractApiErrorMessage`.

Không có thư mục `frontend/src/shared/utils/` và không tìm thấy import `@/shared/utils/...` trong `frontend/src`.

### 3.2. UI components dùng chung

Đã kiểm tra:

- [FormDialog.tsx](../../frontend/src/components/ui/FormDialog.tsx) có named export `FormDialog`.
- [TagInput.tsx](../../frontend/src/components/ui/TagInput.tsx) có named export `TagInput`.
- [index.ts](../../frontend/src/components/ui/index.ts) hiện export cả hai component và prop types tương ứng.

Các class trong hai component tuân thủ token màu, token bo góc và breakpoint `md:`/`desktop:` theo yêu cầu. Không phát hiện các breakpoint `sm:`, `lg:`, `xl:` hoặc các class màu/bo góc trái với Design System trong hai tệp này.

### 3.3. Cấu trúc feature và định tuyến

Đã xác nhận feature nằm tại [frontend/src/features/students](../../frontend/src/features/students) với:

- `types.ts`
- `constants/projectDomains.ts`
- `api/studentProfileApi.ts`
- `schemas/studentProfile.schema.ts`
- `hooks/useStudentProfileQueries.ts`
- Các component: `AcademicInfoCard`, `VisibilityToggleCard`, `PersonalInfoForm`, `SkillsSection`, `ExperiencesSection`, `ProjectsSection`, `CvsSection`, `DeleteConfirmDialog`.
- `pages/StudentProfilePage.tsx`

`StudentProfilePage` có cả named export và default export phù hợp với lazy route tại [router.tsx](../../frontend/src/app/router.tsx). [AppLayout.tsx](../../frontend/src/layouts/AppLayout.tsx) import API từ đúng feature path. Build TypeScript thành công, không còn lỗi module resolution `TS2307`.

### 3.4. API contract

Trong [studentProfileApi.ts](../../frontend/src/features/students/api/studentProfileApi.ts):

- `unwrapData<T>` nhận diện Axios response qua `data`, `headers`, `config`, sau đó bóc `response.data`.
- Nếu phần data là envelope backend có `statusCode`, `message`, `data`, hàm tiếp tục bóc lớp `data`.
- `updateVisibility` gửi `{ visibility }` tới `PATCH /students/me/visibility`; không gửi `careerProfileVisibility`.
- `uploadAvatar` gửi `FormData` với field `file` tới `POST /students/me/avatar`; `deleteAvatar` gọi `DELETE /students/me/avatar`.
- `getCvDownloadUrl` hỗ trợ `downloadUrl`, `url` và trường hợp thiếu/null dữ liệu bằng chuỗi rỗng.

### 3.5. Validation ngày và toàn vẹn dữ liệu

Đã đối chiếu [studentProfile.schema.ts](../../frontend/src/features/students/schemas/studentProfile.schema.ts), [ExperiencesSection.tsx](../../frontend/src/features/students/components/ExperiencesSection.tsx) và [ProjectsSection.tsx](../../frontend/src/features/students/components/ProjectsSection.tsx):

- Ngày bắt đầu/kết thúc không được lớn hơn ngày địa phương trả về bởi `getTodayInputValue()`.
- Các input ngày có `max={todayStr}`.
- Kinh nghiệm yêu cầu ngày kết thúc không trước ngày bắt đầu, ngoại trừ trường hợp `isCurrent === true`.
- Dự án yêu cầu ngày hoàn thành không trước ngày bắt đầu khi cả hai ngày được nhập.

Trong [AcademicInfoCard.tsx](../../frontend/src/features/students/components/AcademicInfoCard.tsx), các dữ liệu gốc do Nhà trường quản lý (`studentCode`, `originalFullName`, `institutionalEmail`, `major`, `faculty`, `academicYear`, `status`) chỉ hiển thị, không chỉnh sửa. [PersonalInfoForm.tsx](../../frontend/src/features/students/components/PersonalInfoForm.tsx) cho phép cập nhật đủ 7 trường thuộc hồ sơ cá nhân: `displayName`, `phone`, `dateOfBirth`, `gender`, `gpa`, `address` và `bio`; ảnh đại diện được cập nhật riêng tại `AcademicInfoCard`.

Validation và payload của form:

- `displayName` cho phép để trống để dùng tên gốc AGU; nếu nhập thì tối thiểu 2 ký tự, tối đa 150 ký tự.
- `phone` cho phép để trống hoặc số Việt Nam hợp lệ sau khi bỏ khoảng trắng, dấu chấm và gạch ngang; tối đa 30 ký tự.
- `dateOfBirth` cho phép để trống hoặc ngày lịch hợp lệ nhỏ hơn ngày hiện tại theo giờ địa phương.
- `gender` chỉ nhận giá trị rỗng, `Nam`, `Nữ` hoặc `Khác`.
- `gpa` cho phép để trống hoặc số từ 0 đến 4, tối đa 2 chữ số thập phân.
- `address` tối đa 255 ký tự; `bio` tối đa 2000 ký tự.
- Khi submit, giá trị đã xóa được gửi `null` nếu DB đang có dữ liệu; gửi `undefined` nếu DB vốn đã `null`, tránh payload thừa. GPA được chuyển sang `Number` khi có giá trị.
- `useWatch()` cập nhật bộ đếm ký tự bio theo thời gian thực. Các trường và nút lưu bị vô hiệu hóa khi `isSuspended` hoặc mutation đang chạy; handler submit có guard trạng thái đình chỉ.

### 3.6. Tương tác đa ngành và TagInput

Đã xác nhận trong [ProjectsSection.tsx](../../frontend/src/features/students/components/ProjectsSection.tsx):

- Lĩnh vực mặc định được suy luận từ ngành/khoa qua `inferProjectDomain`.
- Có đủ các lựa chọn Công nghệ, Kinh tế, Ngoại ngữ, Nông - Thủy sản và Chung.
- Chuyển lĩnh vực cập nhật placeholder, chip vai trò và gợi ý công cụ/phương pháp.
- Trường công nghệ dùng [TagInput.tsx](../../frontend/src/components/ui/TagInput.tsx), hỗ trợ thêm bằng Enter/dấu phẩy, tự commit khi blur, xóa bằng Backspace/nút xóa và bật/tắt chip gợi ý.

### 3.7. Trạng thái `SUSPENDED` và layout

Các component đã được kiểm tra gồm [AcademicInfoCard.tsx](../../frontend/src/features/students/components/AcademicInfoCard.tsx), [VisibilityToggleCard.tsx](../../frontend/src/features/students/components/VisibilityToggleCard.tsx), [SkillsSection.tsx](../../frontend/src/features/students/components/SkillsSection.tsx), [ExperiencesSection.tsx](../../frontend/src/features/students/components/ExperiencesSection.tsx), [ProjectsSection.tsx](../../frontend/src/features/students/components/ProjectsSection.tsx) và [CvsSection.tsx](../../frontend/src/features/students/components/CvsSection.tsx).

Các thao tác thêm/sửa/xóa, đổi/gỡ ảnh, đổi visibility, quản lý CV và tải/xem CV bị vô hiệu hóa khi hồ sơ bị đình chỉ. Các handler quan trọng cũng có guard để không gọi mutation nếu trạng thái bị đình chỉ trong lúc form hoặc dialog đang mở. `DeleteConfirmDialog` nhận trạng thái đình chỉ và vô hiệu hóa nút xác nhận; handler tại [StudentProfilePage.tsx](../../frontend/src/features/students/pages/StudentProfilePage.tsx) cũng từ chối thực thi xóa.

`AppLayout` dùng cùng query key `["student-profile"]`; tên sinh viên hiển thị ưu tiên `displayName` không rỗng rồi fallback về `fullName`. Avatar tiếp tục lấy từ cache hồ sơ để đồng bộ giữa Sidebar và Header.

### 3.8. TypeScript, React và Tailwind

- [tsconfig.app.json](../../frontend/tsconfig.app.json) bật `verbatimModuleSyntax`.
- Không phát hiện `any`, `React.FC`, `watch()` hoặc import `@/shared/utils/...` trong `frontend/src`.
- Build TypeScript thành công, xác nhận import kiểu và module paths hợp lệ.
- Lint thành công, không có lỗi hoặc cảnh báo.

## 4. Tệp được chỉnh sửa trong lượt rà soát

| Tệp | Nội dung chỉnh sửa |
|---|---|
| [frontend/src/components/ui/index.ts](../../frontend/src/components/ui/index.ts) | Thêm export barrel cho `FormDialog`, `TagInput` và prop types. |
| [frontend/src/layouts/AppLayout.tsx](../../frontend/src/layouts/AppLayout.tsx) | Ưu tiên `displayName` khi hiển thị tên sinh viên; tiếp tục dùng query cache hồ sơ cho tên/avatar. |
| [frontend/src/features/students/api/studentProfileApi.ts](../../frontend/src/features/students/api/studentProfileApi.ts) | Bổ sung guard nhận diện object response/envelope và xử lý an toàn URL tải CV. |
| [frontend/src/features/students/schemas/studentProfile.schema.ts](../../frontend/src/features/students/schemas/studentProfile.schema.ts) | Khôi phục validation đầy đủ 7 trường hồ sơ cá nhân theo `FR-STU-02`; giữ nguyên validation kỹ năng, kinh nghiệm và dự án. |
| [frontend/src/features/students/components/PersonalInfoForm.tsx](../../frontend/src/features/students/components/PersonalInfoForm.tsx) | Khôi phục 7 ô nhập liệu, payload null/undefined, chuyển GPA sang number, bộ đếm bio bằng `useWatch()` và guard `SUSPENDED`. |
| [frontend/src/features/students/components/SkillsSection.tsx](../../frontend/src/features/students/components/SkillsSection.tsx) | Chặn submit và vô hiệu hóa trường/nút lưu trong modal khi hồ sơ bị đình chỉ. |
| [frontend/src/features/students/components/ExperiencesSection.tsx](../../frontend/src/features/students/components/ExperiencesSection.tsx) | Chặn submit và vô hiệu hóa trường/nút lưu trong modal khi hồ sơ bị đình chỉ. |
| [frontend/src/features/students/components/ProjectsSection.tsx](../../frontend/src/features/students/components/ProjectsSection.tsx) | Chặn submit; khóa trường dữ liệu, chip lĩnh vực, chip vai trò và nút lưu khi bị đình chỉ. |
| [frontend/src/features/students/components/CvsSection.tsx](../../frontend/src/features/students/components/CvsSection.tsx) | Khóa xem/tải CV và bổ sung guard cho tải lên, đặt mặc định, đổi tên khi bị đình chỉ. |
| [frontend/src/features/students/components/DeleteConfirmDialog.tsx](../../frontend/src/features/students/components/DeleteConfirmDialog.tsx) | Nhận trạng thái đình chỉ và vô hiệu hóa xác nhận xóa. |
| [frontend/src/features/students/pages/StudentProfilePage.tsx](../../frontend/src/features/students/pages/StudentProfilePage.tsx) | Chặn handler xóa khi bị đình chỉ và truyền trạng thái xuống dialog. |

Các tiện ích shared lib, component `FormDialog`/`TagInput`, API hooks, constants, các phần lớn component hồ sơ và cấu hình router được rà soát nhưng không chỉnh trong lượt này, ngoại trừ export barrel nêu trên.

## 5. Kiểm chứng

Chạy tại thư mục `frontend/`, theo đúng thứ tự:

```text
npm.cmd run build
npm.cmd run lint
```

Kết quả:

- `npm.cmd run build`: thành công; TypeScript compile và Vite production build hoàn tất.
- `npm.cmd run lint`: thành công; không có lỗi hoặc cảnh báo ESLint.

## 6. Kết luận

Refactor Student Profile đáp ứng các kiểm tra về cấu trúc feature, import paths, API contract, validation ngày, quyền chỉnh sửa dữ liệu, trạng thái `SUSPENDED`, đồng bộ layout và quy tắc TypeScript/React. Các sai lệch phát hiện trong lượt rà soát đã được sửa và cả build lẫn lint đều đạt.
