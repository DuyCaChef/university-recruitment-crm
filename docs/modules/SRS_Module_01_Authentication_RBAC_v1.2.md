# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## MODULE 01 — AUTHENTICATION & RBAC (XÁC THỰC VÀ PHÂN QUYỀN)

**Mã tài liệu:** `CRM-SRS-AUTH-01`  
**Dự án:** Hệ thống Web CRM Kết nối Sinh viên – Doanh nghiệp trong Quy trình Tuyển dụng  
**Module:** `01 — Authentication & Role-Based Access Control (RBAC)`  
**Phiên bản:** `1.2.0 (Draft cho phê duyệt — thay đổi mô hình tài khoản sinh viên)`  
**Mức độ ưu tiên:** `P0 (Bắt buộc hoàn thành trong MVP)`  
**Kiến trúc hệ thống:** Modular Monolith (NestJS + TypeScript)  
**Cơ sở dữ liệu:** PostgreSQL 16 (ORM: Prisma)  
**Trạng thái tài liệu:** `PENDING APPROVAL` *(Đang chờ phê duyệt mô hình cấp tài khoản sinh viên và các quyết định mở tại Mục 17)*

---

## MỤC LỤC TỔNG QUAN

1. [BẢNG ĐỐI CHIẾU VÀ ĐÁNH GIÁ MÂU THUẪN (GAP ANALYSIS)](#i-bảng-đối-chiếu-và-đánh-giá-mâu-thuẫn-gap-analysis)
2. [THÔNG TIN TÀI LIỆU VÀ LỊCH SỬ PHIÊN BẢN](#1-thông-tin-tài-liệu-và-lịch-sử-phiên-bản)
3. [TỔNG QUAN VÀ MỤC TIÊU CỦA MODULE](#2-tổng-quan-và-mục-tiêu-của-module)
4. [PHẠM VI (SCOPE BOUNDARIES)](#3-phạm-vi-scope-boundaries)
5. [ĐẶC TẢ ACTORS VÀ TRÁCH NHIỆM](#4-đặc-tả-actors-và-trách-nhiệm)
6. [PHÂN BIỆT RÕ RÀNG GIỮA ACCOUNT STATUS, RBAC VÀ BUSINESS POLICY](#5-phân-biệt-rõ-ràng-giữa-account-status-rbac-và-business-policy)
7. [ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)](#6-đặc-tả-yêu-cầu-chức-năng-functional-requirements)
   - FR-AUTH-01: Đăng nhập và Đăng xuất
   - FR-AUTH-02: Quản lý Tài khoản và Mật khẩu (bao gồm Đổi mật khẩu bắt buộc lần đầu)
   - FR-AUTH-03: Cấp tài khoản Sinh viên qua Provisioning và Kích hoạt lần đầu
   - FR-AUTH-04: Đăng ký Doanh nghiệp và Ranh giới liên Module
   - FR-AUTH-05: Quản lý Phân quyền (RBAC Management)
   - FR-AUTH-06: Khóa, Mở khóa và Vô hiệu hóa Tài khoản
8. [TỔNG HỢP QUY TẮC NGHIỆP VỤ (BUSINESS RULES MATRIX)](#7-tổng-hợp-quy-tắc-nghiệp-vụ-business-rules-matrix)
9. [ĐẶC TẢ DỮ LIỆU VÀ QUAN HỆ CƠ SỞ DỮ LIỆU (DATABASE SPECIFICATION)](#8-đặc-tả-dữ-liệu-và-quan-hệ-cơ-sở-dữ-liệu-database-specification)
10. [KIỂM SOÁT GIAO DỊCH VÀ TÍNH TOÀN VẸN DỮ LIỆU (TRANSACTIONS & CONCURRENCY)](#9-kiểm-soát-giao-dịch-và-tính-toàn-vẹn-dữ-liệu-transactions--concurrency)
11. [ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (API SPECIFICATION REQUIREMENTS)](#10-đặc-tả-giao-diện-lập-trình-ứng-dụng-api-specification-requirements)
12. [YÊU CẦU BẢO MẬT (SECURITY REQUIREMENTS)](#11-yêu-cầu-bảo-mật-security-requirements)
13. [YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)](#12-yêu-cầu-phi-chức-năng-non-functional-requirements)
14. [KỊCH BẢN KIỂM THỬ CHẤP NHẬN (ACCEPTANCE TEST CASES)](#13-kịch-bản-kiểm-thử-chấp-nhận-acceptance-test-cases)
15. [MA TRẬN TRUY VẾT YÊU CẦU (TRACEABILITY MATRIX)](#14-ma-trận-truy-vết-yêu-cầu-traceability-matrix)
16. [PHỤ THUỘC VÀ TÍCH HỢP LIÊN MODULE (MODULE DEPENDENCIES)](#15-phụ-thuộc-và-tích-hợp-liên-module-module-dependencies)
17. [TIÊU CHÍ HOÀN THÀNH NGHIỆM THU (DEFINITION OF DONE - DOD)](#16-tiêu-chí-hoàn-thành-nghiệm-thu-definition-of-done---dod)
18. [CÁC QUYẾT ĐỊNH KỸ THUẬT VÀ VẤN ĐỀ CẦN XÁC NHẬN (PENDING DECISIONS)](#17-các-quyết-định-kỹ-thuật-và-vấn-đề-cần-xác-nhận-pending-decisions)
19. [BÁO CÁO THAY ĐỔI VÀ ĐÁNH GIÁ TÍNH NHẤT QUÁN (AUDIT REPORT)](#18-báo-cáo-thay-đổi-và-đánh-giá-tính-nhất-quán-audit-report)

---

## I. BẢNG ĐỐI CHIẾU VÀ ĐÁNH GIÁ MÂU THUẪN (GAP ANALYSIS)

Rà soát chéo giữa bản phân tích Module 01 với 5 tài liệu baseline chuẩn hóa:
1. *Scope_Web_CRM_Sinh_Vien_Doanh_Nghiep_REV_v1_1(1).docx* (Scope Baseline)
2. *TÀI LIỆU CHỐT LUỒNG VÀ NGHIỆP VỤ HỆ THỐNG WEB CRM.docx* (Business Baseline)
3. *Functional_Requirements_Web_CRM_Sinh_Vien_Doanh_Nghiep_v1_0(1).docx* (Functional Boundary)
4. *TECHNICAL_ARCHITECTURE_SPECIFICATION_Web_CRM(1).md* (Architecture Baseline)
5. *DATABASE_ARCHITECTURE_SPECIFICATION_Web_CRM(1).md* (Data Architecture Baseline)

### Bảng đối chiếu chi tiết

| STT | Nội dung trong phân tích cũ | Nguồn nghiệp vụ / Kiến trúc đối chiếu | Vấn đề phát hiện | Nội dung điều chỉnh trong SRS | Mức độ ưu tiên | Trạng thái quyết định |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Bảng `users` có cột `status` kiểu enum `user_status` (`ACTIVE, LOCKED, INACTIVE`). | `DATABASE_ARCHITECTURE` Mục 8.1, 25 & Source DDL. | Mục 8.1 mô tả `account_status ENUM(ACTIVE, LOCKED)` trong khi bảng tổng hợp và DDL lại dùng enum `user_status` có 3 trạng thái (`ACTIVE, LOCKED, INACTIVE`). | Chuẩn hóa enum `user_status` gồm 3 trạng thái: `ACTIVE`, `LOCKED`, `INACTIVE` để phục vụ quy trình quản trị tài khoản dài hạn (Deactivate tài khoản cũ). | **P0** | **Confirmed** (Theo DDL chuẩn) |
| **2** | Đăng ký Student: Chỉ đối chiếu MSSV và tự động chặn theo `student_status = ACTIVE`, đề cập `EXPELLED`. | `TÀI LIỆU CHỐT LUỒNG` Mục 8; `Scope v1.1` Mục 8.1.1; `DB Arch` Mục 8.7. | Enum `student_status` trong schema chỉ gồm `ACTIVE`, `GRADUATED`, `SUSPENDED` (không có `EXPELLED`). Chưa có quyết định nghiệp vụ chính thức về tập trạng thái nào được phép cấp tài khoản (ví dụ: `GRADUATED`). | Tiêu chí kiểm tra `student_status` được thiết kế dưới dạng kiểm tra chính sách (Eligibility Policy) áp dụng cho cả provisioning; tập trạng thái cụ thể là **Pending Decision** chờ Hội đồng/Trường phê duyệt; không tự mặc định chỉ có `ACTIVE`. | **P0** | **Pending Confirmation** |
| **3** | Đăng ký Company: Gán `companies.status = 'PENDING'` và transaction trực tiếp giữa AuthModule và Company tables. | `DATABASE_ARCHITECTURE` Mục 8.4; `Functional Requirements` FR-COM-01. | Tên cột trạng thái thẩm định doanh nghiệp trong CSDL là `verification_status` (enum `company_verification_status`: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`), không phải `status`. Schema có thêm `relationship_status` (CRM). AuthModule không được thao tác trực tiếp bảng `companies`. | Chuẩn hóa dùng đúng cột `companies.verification_status`. Phân định: Luồng đăng ký được điều phối bởi Application Orchestrator Service gọi Public Interface của `AuthModule` và `CompanyModule`. Cam kết transaction nguyên tử nếu dùng chung context CSDL, hoặc cơ chế bù trừ nếu tách context. | **P0** | **Confirmed** |
| **4** | Quên mật khẩu / Khôi phục mật khẩu (Forgot Password): Chưa rõ ràng phạm vi. | `Scope v1.1` Mục 2.2 & 19; `Functional Requirements` FR-AUTH-02. | Dễ hiểu nhầm hệ thống hỗ trợ self-service reset mật khẩu qua Email/SMS trong MVP. | Đưa chức năng Self-service Password Reset qua Email/SMS vào mục **Out of Scope (MVP)**; chỉ hỗ trợ đổi mật khẩu khi đã đăng nhập, đổi mật khẩu bắt buộc lần đầu, hoặc System Admin đặt lại thủ công. | **P0** | **Confirmed** |
| **5** | Cơ chế phiên xác thực (Session vs JWT): Tự mặc định JWT, Access Token 15 phút, HttpOnly Cookie. | `TECHNICAL_ARCHITECTURE` Mục 3.11 & 5.2. | Technical Architecture nêu rõ: "Chọn một trong hai: JWT hoặc Session. Không sử dụng cả hai độc lập". Chưa có quyết định phê duyệt chính thức kiến trúc phiên. | Chuyển toàn bộ chi tiết JWT/Cookie thành **Đề xuất kỹ thuật (Proposed Implementation)**; giữ yêu cầu cốt lõi ở mức logic phiên làm việc (Session/Token Management); đánh dấu cơ chế là Pending Decision. | **P0** | **Pending Decision** |
| **6** | Quy tắc 1:1 Student–User và Race Condition: Chỉ viện dẫn `UNIQUE(students.user_id)`. | `DATABASE_ARCHITECTURE` Mục 8.7; Nguyên lý Concurrency. | Ràng buộc `UNIQUE(students.user_id)` chỉ ngăn 1 User gắn nhiều Student, không ngăn 2 request đồng thời cùng tạo 2 User cho cùng 1 Student. | Module 02 sở hữu bảng `students`. Việc cấp tài khoản thực hiện trong một transaction điều phối, kèm cập nhật nguyên tử có điều kiện (`WHERE user_id IS NULL`) trên `student_masters` để xử lý race condition khi import đồng thời. | **P0** | **Confirmed** |
| **7** | Phân quyền Career Center và System Admin: Ghi "trừ khi kiêm nhiệm" dễ gây hiểu lầm. | `TÀI LIỆU CHỐT LUỒNG` Mục 7; `Functional Requirements` Section 5. | Nguy cơ hiểu sai rằng chức danh kiêm nhiệm tự động cho phép Career Center can thiệp cấu hình RBAC hệ thống. | Khẳng định nguyên tắc: Thẩm quyền được cấp phát duy nhất thông qua Permission được gán cho Role; không tự động phát sinh quyền kỹ thuật dựa trên chức danh nghiệp vụ. | **P1** | **Confirmed** |
| **8** | Sinh viên tự đăng ký tài khoản bằng MSSV (self-registration) có kiểm tra `user_id IS NULL`. | `TÀI LIỆU CHỐT LUỒNG` Mục 8, 10, 11, 33, 36; `Scope v1.1` Mục 8.1.1; `SRS v1.1.0-rev2` FR-AUTH-03. | MSSV thường gần như công khai trong lớp. Ai biết MSSV của bạn cùng lớp có thể kích hoạt tài khoản trước chủ thật; với mật khẩu mặc định dùng chung, kẻ tấn công có thể chiếm đoạt hàng loạt tài khoản. | **Loại bỏ hoàn toàn luồng tự đăng ký.** Tài khoản sinh viên được cấp sẵn (provisioning) từ dữ liệu Trường cung cấp; mật khẩu khởi tạo riêng cho từng sinh viên; cờ `must_change_password` bắt buộc đổi mật khẩu ở lần đăng nhập đầu, được server enforce. Chi tiết mục 6.3. | **P0** | **Định hướng đã thống nhất — chờ phê duyệt**; các quyết định PD-01 đến PD-04 còn mở (Mục 17) |

---

## 1. THÔNG TIN TÀI LIỆU VÀ LỊCH SỬ PHIÊN BẢN

### 1.1. Mục đích tài liệu
Tài liệu này xác định chi tiết và chuẩn hóa các yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR), quy tắc nghiệp vụ (BR), kiến trúc dữ liệu và giao diện lập trình (API) cho **Module 01: Authentication & RBAC**. Tài liệu đóng vai trò là căn cứ kỹ thuật phục vụ triển khai, kiểm thử và nghiệm thu cho đồ án Web CRM Sinh viên – Doanh nghiệp.

### 1.2. Lịch sử hiệu chỉnh
| Phiên bản | Ngày hiệu chỉnh | Người thực hiện | Tóm tắt thay đổi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| `1.0.0` | 2026-06-15 | BA Team | Phiên bản nháp khởi tạo ban đầu. | Obsolete |
| `1.1.0` | 2026-10-11 | Senior BA & Architect | Rà soát toàn diện theo Scope v1.1, Database Architecture và Technical Architecture. | Superseded |
| `1.1.0-rev1` | 2026-10-11 | Senior BA & Architect | Hiệu chỉnh 7 điểm trọng yếu: Chuyển trạng thái sang PENDING APPROVAL; đưa JWT về đề xuất; chuẩn hóa `verification_status` và enum `student_status`. | Superseded |
| `1.1.0-rev2` | 2026-10-11 | Senior BA & Architect | Đồng bộ trạng thái sinh viên về Pending Decision; làm rõ vai trò Application Orchestrator; chuẩn hóa quyền sở hữu bảng `students`; chuyển DoD về dạng tiêu chí đánh giá. | Superseded |
| `1.2.0` | 2026-10-23 | Senior BA & Architect | **Thay đổi mô hình tài khoản sinh viên:** bỏ tự đăng ký bằng MSSV; chuyển sang cấp tài khoản qua provisioning từ dữ liệu Trường với mật khẩu khởi tạo riêng; bắt buộc đổi mật khẩu lần đầu (`must_change_password`); viết lại FR-AUTH-02 (đổi mật khẩu), FR-AUTH-03, các BR, API, bảo mật, kiểm thử; bổ sung PD-01 đến PD-04. | **PENDING APPROVAL** |

---

## 2. TỔNG QUAN VÀ MỤC TIÊU CỦA MODULE

### 2.1. Mục tiêu cốt lõi
Module Authentication & RBAC đóng vai trò là lớp nền tảng bảo mật trung tâm (Security Backbone) cho toàn bộ hệ thống Web CRM. Mọi yêu cầu truy cập tài nguyên nghiệp vụ (Hồ sơ Sinh viên, Doanh nghiệp, Tin tuyển dụng, Ứng tuyển, Phỏng vấn, Nhật ký CRM) đều phải đi qua cơ chế kiểm soát của Module 01.

Module có nhiệm vụ giải quyết 4 câu hỏi bảo mật:
1. **Xác thực (Authentication):** Người đang gửi yêu cầu là ai? Danh tính có hợp lệ không?
2. **Trạng thái tài khoản (Account State):** Tài khoản có đang ở trạng thái được phép hoạt động (`ACTIVE`) không, và đã hoàn tất bước đổi mật khẩu bắt buộc chưa?
3. **Phân quyền chức năng (RBAC Authorization):** Người dùng mang Role gì và có những Permission nào trong hệ thống?
4. **Cơ sở cho kiểm soát sở hữu (Ownership Foundation):** Cung cấp định danh đã xác thực (`userId`, `role`, `contextId`) để các module nghiệp vụ thực thi quy tắc kiểm tra quyền sở hữu dữ liệu (Ownership Policy).

```text
                         MODULE 01: AUTHENTICATION & RBAC
                                        │
       ┌────────────────────────────────┼────────────────────────────────┐
       │                                │                                │
       ▼                                ▼                                ▼
[AUTHENTICATION]                [ACCOUNT CONTROL]               [AUTHORIZATION]
- Login / Logout                - Change Password (incl.        - Roles Management
- Student Provisioning            first-login forced change)    - Permissions Management
  (Import từ dữ liệu Trường)    - Account Status                - User-Role Junction
- First-login Activation          (ACTIVE / LOCKED / INACTIVE)  - Role-Permission Junction
- Company Registration          - Audit Activity Logging        - Backend Guard & Policy
  (Orchestrated via Public API)
       │                                │                                │
       └────────────────────────────────┼────────────────────────────────┘
                                        │
                                        ▼
                 [CÁC MODULE NGHIỆP VỤ (BUSINESS DOMAINS)]
     Student (02) │ Company (04/05) │ Job (06) │ Application (08) │ CRM (11)
```

### 2.2. Nguyên tắc thiết kế (Architectural Principles)
* **Backend Enforced Only:** Toàn bộ quá trình xác thực, kiểm tra trạng thái phiên, kiểm tra cờ bắt buộc đổi mật khẩu, kiểm tra vai trò và quyền hạn phải thực hiện tại Backend. Frontend chỉ sử dụng thông tin quyền để tối ưu hóa hiển thị giao diện (UI Rendering), không được xem Frontend là chốt chặn an ninh.
* **Least Privilege:** Người dùng chỉ được gán các quyền tối thiểu cần thiết để thực thi nhiệm vụ tương ứng với vai trò của mình. Phiên đăng nhập lần đầu của sinh viên chỉ có quyền đổi mật khẩu.
* **Separation of Concerns & Module Boundaries:**
  * Module 01 chỉ quản trị tài khoản (`users`), vai trò (`roles`), quyền hạn (`permissions`) và quan hệ gán ghép.
  * Module 01 **không sở hữu** dữ liệu học tập (GPA, Khoa, Ngành, CV và toàn bộ hồ sơ sinh viên thuộc quyền sở hữu của Module 02 - Student Profile). Việc kiểm tra và liên kết hồ sơ sinh viên phải thông qua Public Service Interface của Module 02.
  * Module 01 **không sở hữu** dữ liệu pháp nhân và quy trình thẩm định doanh nghiệp (thuộc Module 04 - Company Verification).
* **Decoupled Session Strategy:** Yêu cầu nghiệp vụ tập trung vào việc quản lý phiên xác thực an toàn, thu hồi phiên hợp lệ khi đăng xuất hoặc khóa tài khoản; cơ chế kỹ thuật cụ thể (Stateful Session Cookie vs Stateless JWT) tuân theo quyết định kiến trúc được phê duyệt.
* **Không tự đăng ký cho sinh viên:** Tài khoản sinh viên chỉ được tạo bởi tiến trình cấp tài khoản từ dữ liệu của Nhà trường. Hệ thống không cho phép bất kỳ ai tự tạo tài khoản sinh viên bằng MSSV.

---

## 3. PHẠM VI (SCOPE BOUNDARIES)

### 3.1. Trong phạm vi (In-Scope - P0 MVP Baseline)
* `FR-AUTH-01`: Đăng nhập hệ thống và Đăng xuất kết thúc phiên làm việc.
* `FR-AUTH-02`: Quản lý thông tin tài khoản cơ bản, Đổi mật khẩu cá nhân và Đổi mật khẩu bắt buộc ở lần đăng nhập đầu.
* `FR-AUTH-03`: Cấp tài khoản Sinh viên qua tiến trình Provisioning từ dữ liệu Student Master của Nhà trường và kích hoạt lần đầu.
* `FR-AUTH-04`: Đăng ký tài khoản Doanh nghiệp ban đầu phối hợp cùng Module 04 qua cơ chế điều phối ứng dụng.
* `FR-AUTH-05`: Quản lý Role, Permission, gán/hủy Role cho User và Permission cho Role.
* `FR-AUTH-06`: Quản trị trạng thái tài khoản: Khóa (`LOCKED`), Mở khóa (`ACTIVE`), Vô hiệu hóa (`INACTIVE`).
* `SEC-AUTH`: Lưu trữ mật khẩu an toàn bằng chuỗi băm (Password Hash), ngăn chặn rò rỉ hash, bảo vệ endpoint quản trị, bảo vệ dữ liệu định danh nhạy cảm dùng cho mật khẩu khởi tạo.
* `AUD-AUTH`: Ghi nhận nhật ký kiểm toán (`activity_logs`) đối với các thay đổi bảo mật quan trọng.

### 3.2. Ngoài phạm vi (Out-of-Scope - Không thuộc MVP)
* Tự đăng ký tài khoản sinh viên bằng MSSV (**đã loại bỏ hoàn toàn khỏi phạm vi**).
* Xác thực mã OTP qua SMS hoặc cuộc gọi tự động.
* Bắt buộc xác thực kích hoạt tài khoản qua Email (Email Verification link) trước khi đăng nhập.
* Tự phục vụ Quên mật khẩu qua email/SMS (Self-service Forgot Password). *(Giai đoạn MVP: Quản trị viên hỗ trợ đặt lại mật khẩu thủ công nếu người dùng quên)*.
* Đăng nhập một lần (SSO) liên kết với hệ thống quản lý đào tạo trường đại học (SIS) hoặc Google/Microsoft Workspace.
* Xác thực hai yếu tố (2FA / MFA qua Google Authenticator / FIDO2).
* Xác thực sinh trắc học trên ứng dụng di động.
* AI phân tích hành vi bất thường để tự động khóa tài khoản.

---

## 4. ĐẶC TẢ ACTORS VÀ TRÁCH NHIỆM

Hệ thống phân định ranh giới nghiêm ngặt giữa 4 Actor chính:

```text
+-----------------------------------------------------------------------------------+
|                                  HỆ THỐNG WEB CRM                                 |
+-----------------------------------------+-----------------------------------------+
|             BUSINESS ACTORS             |              SYSTEM ACTOR               |
+--------------------+--------------------+-----------------------------------------+
|      Student       | Employer/Recruiter |               System Admin              |
|  - First-login     | - Self-Register    |  - Account Lifecycle (Lock/Unlock)      |
|    Activation      | - Login / Logout   |  - RBAC Configuration (Role/Permission) |
|  - Login / Logout  | - Change Password  |  - Student Master Data Import           |
|  - Change Password | (Doanh nghiệp)     |  - Security & Audit Log Inspection      |
+--------------------+--------------------+                                         |
|                  Career Center          |                                         |
|                  - Login / Logout       |                                         |
|                  - Change Password      |                                         |
|                  - Business Operations  |                                         |
|                  - (Nạp Student Master  |                                         |
|                    Data nếu được cấp    |                                         |
|                    quyền Permission)    |                                         |
+-----------------------------------------+-----------------------------------------+
```

### 4.1. Student (Sinh viên)
* Là người học thuộc trường đại học triển khai hệ thống.
* **Quyền hạn trong Module 01:**
  * **Không tự đăng ký tài khoản.** Tài khoản được Nhà trường cấp sẵn thông qua tiến trình provisioning (FR-AUTH-03).
  * Đăng nhập lần đầu bằng mật khẩu khởi tạo và **bắt buộc đổi mật khẩu** trước khi sử dụng các chức năng khác.
  * Đăng nhập, đăng xuất và đổi mật khẩu cá nhân sau khi đã kích hoạt.
  * Nhận Role mặc định: `STUDENT` do hệ thống gán khi cấp tài khoản.
* **Giới hạn:** Tuyệt đối không được phép tự gán các quyền quản trị hoặc can thiệp vào tài khoản khác.

### 4.2. Employer / Recruiter (Nhà tuyển dụng / Đại diện doanh nghiệp)
* Là đại diện doanh nghiệp có nhu cầu liên kết tuyển dụng với nhà trường.
* **Quyền hạn trong Module 01:**
  * Đăng ký tài khoản đại diện ban đầu thông qua luồng tự đăng ký doanh nghiệp.
  * Đăng nhập, đăng xuất và đổi mật khẩu cá nhân.
  * Nhận Role mặc định: `EMPLOYER` sau khi tạo tài khoản.
* **Giới hạn:** Sau khi đăng nhập, chỉ được thực hiện nghiệp vụ tuyển dụng khi doanh nghiệp đại diện đạt trạng thái xác minh `companies.verification_status = 'APPROVED'` tại Module 04.

### 4.3. Career Center (Bộ phận Quan hệ Doanh nghiệp / Hướng nghiệp trường)
* Là **Business Actor** vận hành các nghiệp vụ kết nối, thẩm định doanh nghiệp, duyệt tin tuyển dụng và chăm sóc đối tác (CRM).
* **Quyền hạn trong Module 01:**
  * Được cấp tài khoản nội bộ có Role `CAREER_CENTER`.
  * Đăng nhập, đăng xuất, đổi mật khẩu cá nhân.
  * Thực thi các nghiệp vụ được cấp quyền thông qua hệ thống Permission. Nếu được cấp Permission `STUDENT_MASTER_IMPORT`, có thể thực hiện nạp dữ liệu sinh viên (FR-AUTH-03).
* **Nguyên tắc phân lập:** Career Center là Business Actor, **không phải** là System Admin. Quyền hạn của Career Center được kiểm soát tuyệt đối thông qua các Permission được phân công cụ thể trong hệ thống RBAC; không tự động có quyền quản trị kỹ thuật hoặc cấu hình RBAC theo chức danh công việc.

### 4.4. System Admin (Quản trị viên kỹ thuật hệ thống)
* Là **Technical/System Actor** chịu trách nhiệm bảo đảm tính toàn vẹn kỹ thuật, bảo mật và vận hành của hệ thống Web CRM.
* **Quyền hạn trong Module 01:**
  * Đăng nhập, đăng xuất.
  * Quản trị toàn bộ danh mục Role và Permission.
  * Gán/hủy Role cho người dùng; cấu hình Permission cho từng Role.
  * Khóa (`LOCKED`), mở khóa (`ACTIVE`), vô hiệu hóa (`INACTIVE`) tài khoản người dùng theo quy trình quản trị.
  * Thực hiện nạp dữ liệu Student Master và xem báo cáo kết quả cấp tài khoản (FR-AUTH-03).
  * Xem và truy vết nhật ký kiểm toán bảo mật (`activity_logs`).
  * Đặt lại mật khẩu thủ công cho người dùng khi được xác minh danh tính (đưa tài khoản về trạng thái bắt buộc đổi mật khẩu lần đầu).
* **Giới hạn:** Không tự ý thay đổi các quyết định nghiệp vụ tuyển dụng của Career Center ngoài quyền hạn kỹ thuật.

---

## 5. PHÂN BIỆT RÕ RÀNG GIỮA ACCOUNT STATUS, RBAC VÀ BUSINESS POLICY

Để loại bỏ sự nhập nhằng trong kiểm soát an ninh, hệ thống áp dụng mô hình 3 tầng độc lập (Three-tier Access Evaluation Model):

```text
+-----------------------------------------------------------------------------------+
|                        MÔ HÌNH KIỂM SOÁT TRUY CẬP 3 TẦNG                          |
+-----------------------------------------------------------------------------------+
                                          │
                                    HTTP Request
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| TẦNG 1: USER ACCOUNT STATUS (Module 01 - Authentication)                         |
| - Kiểm tra: users.status == 'ACTIVE'? và must_change_password == FALSE?          |
|   (Nếu must_change_password == TRUE: chỉ cho phép API đổi mật khẩu và đăng xuất)  |
| - Vi phạm: Trả về HTTP 401 Unauthorized, 403 Forbidden (Account Locked) hoặc      |
|   403 Forbidden (PASSWORD_CHANGE_REQUIRED)                                       |
+-----------------------------------------------------------------------------------+
                                          │ Hợp lệ (Passed)
                                          ▼
+-----------------------------------------------------------------------------------+
| TẦNG 2: ROLE-BASED ACCESS CONTROL - RBAC (Module 01 - Authorization)              |
| - Kiểm tra: User có Role mang Permission tương ứng với thao tác/Endpoint không?   |
| - Ví dụ: Quyền 'JOB_CREATE' có trong danh sách quyền của User không?             |
| - Vi phạm: Trả về HTTP 403 Forbidden (Thiếu quyền hạn chức năng)                  |
+-----------------------------------------------------------------------------------+
                                          │ Hợp lệ (Passed)
                                          ▼
+-----------------------------------------------------------------------------------+
| TẦNG 3: BUSINESS STATUS & OWNERSHIP POLICY (Module nghiệp vụ sở tại)             |
| - Kiểm tra trạng thái nghiệp vụ: Company có verification_status == 'APPROVED'?   |
| - Kiểm tra quyền sở hữu: Resource này có thuộc về chính User/Company này không?   |
| - Vi phạm: Trả về HTTP 403 Forbidden / 400 Bad Request / 404 Not Found            |
+-----------------------------------------------------------------------------------+
                                          │ Hợp lệ (Passed)
                                          ▼
                           Thực thi Logic Nghiệp vụ (Core Use Case)
```

1. **User Status (`users.status`) và cờ bắt buộc đổi mật khẩu (`users.must_change_password`):**
   * Thuộc quyền sở hữu của Module 01.
   * `status` gồm: `ACTIVE`, `LOCKED`, `INACTIVE`.
   * `must_change_password` là cờ boolean; `TRUE` khi tài khoản được cấp qua provisioning và chưa đổi mật khẩu lần đầu.
   * Quyết định việc cấp phát hoặc duy trì phiên xác thực và phạm vi endpoint được phép gọi.
2. **Role & Permission (RBAC):**
   * Thuộc quyền sở hữu của Module 01.
   * Xác định *loại hành động chức năng* mà người dùng có thẩm quyền thực hiện trên hệ thống (VD: `STUDENT_PROFILE_READ`, `JOB_CREATE`, `COMPANY_APPROVE`, `STUDENT_MASTER_IMPORT`).
3. **Business Status & Data Ownership:**
   * Thuộc quyền sở hữu của từng Module nghiệp vụ chuyên biệt.
   * Ví dụ:
     * `students.student_status`: Trạng thái học tập của sinh viên tại trường (`ACTIVE`, `GRADUATED`, `SUSPENDED`).
     * `companies.verification_status`: Trạng thái thẩm định pháp nhân doanh nghiệp (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`).
     * `companies.relationship_status`: Quan hệ hợp tác CRM (`NEW`, `POTENTIAL`, `ACTIVE_PARTNER`, `INACTIVE_PARTNER`).
     * **Ownership Policy:** Nhà tuyển dụng có Permission `JOB_UPDATE` chỉ được phép cập nhật Job thuộc chính Doanh nghiệp mà tài khoản đại diện. Module 01 cung cấp `userId` đã xác thực; Module 06 (Job) thực thi kiểm tra `job.company_id == currentUser.companyId`.

---

## 6. ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 6.1. FR-AUTH-01: Đăng nhập và Đăng xuất (Login / Logout)
* **Priority:** P0
* **Actors:** Student, Employer/Recruiter, Career Center, System Admin

#### 6.1.1. Luồng chính - Đăng nhập (Login Happy Path)
1. Người dùng mở giao diện Đăng nhập, nhập `email` và `password`.
2. Frontend validate sơ bộ định dạng email và độ dài mật khẩu, gửi request `POST /api/v1/auth/login`.
3. Backend tiếp nhận request, chuẩn hóa email về dạng chữ thường (`lowercase`).
4. Backend truy vấn CSDL tìm bản ghi `users` tương ứng theo `email`.
5. Backend xác minh mật khẩu bằng cách so khớp chuỗi nhập vào với `password_hash` bằng thuật toán băm an toàn theo tiêu chuẩn kiến trúc.
6. Backend kiểm tra trường `users.status`:
   * Nếu `status != 'ACTIVE'`, từ chối đăng nhập.
7. Backend kiểm tra cờ `users.must_change_password`:
   * Nếu `TRUE`: khởi tạo phiên ở **chế độ hạn chế** (Restricted Session), chỉ cho phép gọi API đổi mật khẩu và đăng xuất (xem FR-AUTH-02, 6.2.2). Phản hồi kèm mã `PASSWORD_CHANGE_REQUIRED`.
   * Nếu `FALSE`: tiếp tục bước 8.
8. Backend nạp danh sách `roles` và tập hợp `permissions` tương ứng của User từ CSDL.
9. Backend khởi tạo phiên xác thực hợp lệ theo cơ chế được phê duyệt (Phiên làm việc Stateful Session hoặc Stateless Token theo quyết định kiến trúc).
10. Backend cập nhật `last_login_at = now()` trong CSDL khi xác thực thông tin đăng nhập thành công.
11. Backend trả về kết quả thành công HTTP `200 OK` kèm thông tin tài khoản cơ bản, thông tin phiên xác thực và trạng thái `mustChangePassword`.

#### 6.1.2. Luồng chính - Đăng xuất (Logout Happy Path)
1. Người dùng nhấn nút Đăng xuất trên giao diện.
2. Frontend gửi request `POST /api/v1/auth/logout` kèm thông tin phiên xác thực hiện tại.
3. Backend xử lý kết thúc hoặc thu hồi phiên làm việc theo cơ chế triển khai (hủy session trên server hoặc thu hồi token hợp lệ).
4. Client xóa sạch thông tin xác thực lưu tại trình duyệt và điều hướng về màn hình đăng nhập.
5. Các request yêu cầu xác thực tiếp theo sau đó đều bị Backend từ chối.

#### 6.1.3. Luồng ngoại lệ (Alternative & Exception Flows)
* **E-AUTH-01 (Sai thông tin định danh/Mật khẩu):** Email không tồn tại hoặc mật khẩu không chính xác.
  * *Xử lý:* Backend phản hồi HTTP `401 Unauthorized` với thông điệp chung: `"Thông tin email hoặc mật khẩu không chính xác."` Tuyệt đối không phản hồi chi tiết *"Email không tồn tại"* nhằm ngăn chặn hành vi dò quét danh tính người dùng (User Enumeration).
* **E-AUTH-02 (Tài khoản bị khóa - LOCKED):** Credentials hợp lệ nhưng `users.status == 'LOCKED'`.
  * *Xử lý:* Backend từ chối xác thực, trả về HTTP `403 Forbidden` kèm thông điệp: `"Tài khoản của bạn đã bị khóa bởi Quản trị viên hệ thống. Vui lòng liên hệ quản trị viên để được hỗ trợ."`
* **E-AUTH-03 (Tài khoản vô hiệu hóa - INACTIVE):** Credentials hợp lệ nhưng `users.status == 'INACTIVE'`.
  * *Xử lý:* Backend từ chối xác thực, trả về HTTP `403 Forbidden` kèm thông điệp: `"Tài khoản hiện không còn hoạt động."`
* **E-AUTH-04 (Lỗi cấu trúc dữ liệu gửi lên):** Thiếu trường bắt buộc hoặc sai định dạng email.
  * *Xử lý:* Backend trả về HTTP `400 Bad Request` kèm thông báo validation.
* **E-AUTH-05 (Đăng nhập lần đầu bằng mật khẩu khởi tạo):** Credentials đúng, `status = ACTIVE`, `must_change_password = TRUE`.
  * *Xử lý:* Trả về HTTP `200 OK` với `mustChangePassword = true` và phiên hạn chế. Không phải là lỗi; giao diện điều hướng sang màn hình đổi mật khẩu bắt buộc.

---

### 6.2. FR-AUTH-02: Quản lý Tài khoản và Mật khẩu (Account & Password Management)
* **Priority:** P0
* **Actors:** Tất cả người dùng đã đăng nhập thành công (`ACTIVE`)

#### 6.2.1. Đổi mật khẩu cá nhân (Change Password)
1. Người dùng đã đăng nhập truy cập trang Cài đặt bảo mật, nhập: `current_password`, `new_password`, `confirm_password`.
2. Frontend validate client-side và gửi request `PATCH /api/v1/auth/password`.
3. Backend trích xuất `userId` từ phiên xác thực an toàn của người dùng hiện tại (không nhận `userId` từ body).
4. Backend kiểm tra:
   * `new_password` và `confirm_password` phải trùng khớp tuyệt đối.
   * `new_password` phải thỏa mãn tiêu chuẩn độ phức tạp mật khẩu được cấu hình cho hệ thống (Yêu cầu nghiệp vụ: Đảm bảo độ an toàn; chi tiết quy tắc cụ thể xem Mục 11).
   * `new_password` không được trùng với `current_password`.
5. Backend lấy `password_hash` hiện tại trong bảng `users` và đối soát với `current_password`:
   * Nếu không khớp: Trả về HTTP `400 Bad Request` với thông điệp `"Mật khẩu hiện tại không chính xác."`
6. Backend thực hiện băm `new_password` mới theo thuật toán băm an toàn.
7. Backend cập nhật bằng câu lệnh có điều kiện (xem Mục 9.2): `password_hash = new_hash`, `must_change_password = FALSE`, `updated_at = now()`, với điều kiện `password_hash` vẫn bằng giá trị đã đối soát ở bước 5.
8. Ghi nhận log đổi mật khẩu vào `activity_logs` (tuyệt đối không lưu plaintext hoặc hash vào log payload).
9. Thu hồi các phiên đăng nhập khác của tài khoản này theo chính sách quản lý phiên của hệ thống.
10. Trả về kết quả thành công HTTP `200 OK`, kèm phiên đầy đủ quyền nếu trước đó là phiên hạn chế.

#### 6.2.2. Đổi mật khẩu bắt buộc ở lần đăng nhập đầu (Forced First-login Password Change)
* Áp dụng khi `users.must_change_password = TRUE`. Đây là đường dùng chung với 6.2.1, khác ở ba điểm:
  1. Phiên hiện tại là **phiên hạn chế**; chỉ endpoint `PATCH /api/v1/auth/password` và `POST /api/v1/auth/logout` được chấp nhận. Mọi endpoint khác trả `403 PASSWORD_CHANGE_REQUIRED`.
  2. Mật khẩu mới phải khác mật khẩu khởi tạo (đã được băm nên không so sánh chuỗi trực tiếp; đối soát bằng hàm verify của thuật toán băm).
  3. Sau khi cập nhật thành công, cờ `must_change_password` được hạ xuống `FALSE` **trong cùng câu lệnh** ghi mật khẩu mới. Phiên được nâng lên đầy đủ quyền; không yêu cầu đăng nhập lại.
* Không có đường đi nào cho phép bỏ qua bước này: không có nút "để sau", không có thời hạn ân hạn truy cập đầy đủ trước khi đổi.

---

### 6.3. FR-AUTH-03: Cấp tài khoản Sinh viên qua Provisioning và Kích hoạt Lần đầu
* **Priority:** P0
* **Actors:** System Admin; Career Center (nếu được cấp Permission `STUDENT_MASTER_IMPORT`); Student (ở bước kích hoạt)
* **Thay thế:** Luồng "Đăng ký Sinh viên bằng MSSV" của các phiên bản trước đã bị loại bỏ hoàn toàn.

#### 6.3.1. Bản chất nghiệp vụ và Nguồn dữ liệu Student Master
* **Bản chất:** Sinh viên không tự tạo tài khoản. Nhà trường cung cấp file dữ liệu sinh viên (Student Master Data); System Admin hoặc Career Center được cấp quyền nạp file vào hệ thống. Từ mỗi dòng hợp lệ, hệ thống tạo sẵn tài khoản với **mật khẩu khởi tạo riêng cho từng sinh viên**. Sinh viên nhận thông tin đăng nhập qua kênh do Nhà trường quy định và **bắt buộc đổi mật khẩu** ở lần đăng nhập đầu tiên.
* **Lý do thiết kế:** Nếu sinh viên tự đăng ký bằng MSSV (vốn gần như công khai trong lớp), kẻ tấn công có thể kích hoạt tài khoản trước chủ thật. Mô hình cấp sẵn kết hợp mật khẩu riêng và bắt buộc đổi mật khẩu loại bỏ rủi ro chiếm đoạt hàng loạt bằng một mật khẩu mặc định dùng chung.
* **Phân định quyền sở hữu dữ liệu:** Bảng `students` thuộc quyền sở hữu của **Module 02 (Student Profile)**. Module 01 chịu trách nhiệm tạo tài khoản `users`, gán Role `STUDENT`, và phối hợp với Module 02 để tạo hồ sơ `students` liên kết với tài khoản thông qua Public Service Interface.
* **Dữ liệu nguồn (Student Master) tối thiểu:**
  * `student_code` (MSSV), `full_name`, `institutional_email`, `major`, `faculty`, `academic_year`, `student_status`.
  * `citizen_id` (số CCCD/CMND) và `date_of_birth` (ngày sinh): **hiện chưa được Trường xác nhận có cung cấp hay không**. Quy tắc sinh mật khẩu khởi tạo ở mục 6.3.2 được viết theo hướng có dự phòng để không phụ thuộc vào việc này. Xem PD-01 và PD-02 tại Mục 17.
* **Quy chuẩn Mã số sinh viên (MSSV):**
  * `student_code` là chuỗi ký tự định danh duy nhất (`VARCHAR`), **bắt buộc giữ nguyên định dạng chuỗi bao gồm các chữ số `0` ở đầu nếu có** (không được parse về số nguyên làm mất số 0). Quy tắc này áp dụng cho cả file import (cột phải được đọc dưới dạng văn bản).
* **Quy tắc trạng thái sinh viên (`student_status` - PENDING DECISION):**
  * Schema CSDL định nghĩa enum `student_status` gồm 3 giá trị: `ACTIVE`, `GRADUATED`, `SUSPENDED`.
  * Hệ thống áp dụng **Student Eligibility Policy** cho bước cấp tài khoản: dòng có trạng thái không đủ điều kiện được ghi nhận nhưng **không** tạo tài khoản.
  * Tập trạng thái cụ thể được phép cấp tài khoản là **Pending Decision** chờ Hội đồng/Trường phê duyệt (xem Mục 17). Trong lúc chờ, logic được đóng gói trong một Service Policy độc lập để cấu hình mà không sửa cấu trúc luồng.

#### 6.3.2. Luồng A — Cấp tài khoản hàng loạt (Provisioning / Import, do System Admin hoặc Career Center thực hiện)

```text
Admin/Career Center     Frontend (Web)                 Import Service / AuthModule / StudentModule / DB
      │                       │                                   │                              │
      ├── 1. Chọn file ──────>│                                   │                              │
      │                       ├── 2. POST /admin/students/import─>│                              │
      │                       │                                   ├── 3. Validate file & header ─│
      │                       │                                   ├── 4. Với MỖI dòng:           │
      │                       │                                   │   a. Validate dữ liệu dòng   │
      │                       │                                   │   b. Xác định mật khẩu KĐ    │
      │                       │                                   │   c. BEGIN TRANSACTION ─────>│
      │                       │                                   │      - Upsert student_masters│
      │                       │                                   │      - Insert users (MCP=TRUE)│
      │                       │                                   │      - Assign role STUDENT   │
      │                       │                                   │      - Insert students       │
      │                       │                                   │      - Atomic link user_id   │
      │                       │                                   │   d. COMMIT / ROLLBACK ─────>│
      │                       │<── 5. Báo cáo theo dòng ──────────│                              │
      │<── 6. Tải báo cáo ────│                                   │                              │
```

1. Người dùng có Permission `STUDENT_MASTER_IMPORT` mở chức năng nạp dữ liệu và chọn file do Nhà trường cung cấp.
2. Frontend gửi file lên `POST /api/v1/admin/students/import`.
3. Backend kiểm tra file: đúng định dạng, đủ cột bắt buộc (`student_code`, `full_name`, `institutional_email`, `major`), `student_code` được đọc dưới dạng chuỗi.
4. Với **mỗi dòng dữ liệu**, Backend thực hiện trong một **Prisma Atomic Transaction riêng** (lỗi một dòng không làm hỏng các dòng khác):
   a. Kiểm tra dữ liệu bắt buộc và định dạng `institutional_email`.
   b. Xác định mật khẩu khởi tạo theo quy tắc (xem PD-01, PD-02, PD-04):
      * Nếu có `citizen_id`: dùng số CCCD/CMND làm mật khẩu khởi tạo (phương án đang xét).
      * Nếu không có `citizen_id` nhưng có `date_of_birth`: dùng ngày sinh định dạng `DDMMYYYY` (phương án dự phòng).
      * Nếu không có cả hai: **từ chối dòng** và ghi vào báo cáo import.
      * Mật khẩu khởi tạo **không bao giờ được lưu dạng rõ**; chỉ lưu chuỗi băm.
   c. Upsert bản ghi `student_masters` theo `student_code`. Nếu dòng đã có `user_id` (đã cấp tài khoản trước đó), chỉ cập nhật thông tin gốc (họ tên, chuyên ngành, khoa, trạng thái); **không** đổi mật khẩu và **không** tạo tài khoản mới.
   d. Nếu `student_masters.user_id IS NULL` và dòng đạt Eligibility Policy: tạo `users` (`email = institutional_email` đã chuẩn hóa lowercase, `password_hash`, `status = 'ACTIVE'`, `must_change_password = TRUE`).
   e. Gán Role `STUDENT` trong `user_roles`.
   f. Tạo bản ghi `students` (`user_id` NOT NULL nên bắt buộc nằm trong cùng transaction với bước d).
   g. Cập nhật liên kết nguyên tử có điều kiện: `UPDATE student_masters SET user_id = :userId WHERE id = :masterId AND user_id IS NULL`. Nếu `affected_rows = 0`, ROLLBACK và ghi nhận dòng xung đột.
   h. Ghi nhận `activity_logs` (`action = 'PROVISION_STUDENT_ACCOUNT'`, không chứa mật khẩu, CCCD hay ngày sinh trong payload).
5. Backend trả về báo cáo theo từng dòng: `CREATED`, `SKIPPED_ALREADY_PROVISIONED`, `REJECTED_MISSING_IDENTIFIER`, `REJECTED_DUPLICATE_CITIZEN_ID`, `REJECTED_NOT_ELIGIBLE`, `CONFLICT`. Trong báo cáo, `citizen_id` chỉ hiển thị dạng che (ví dụ: `********1234`).
6. Tiến trình import phải **idempotent**: chạy lại cùng một file không tạo tài khoản trùng và không đặt lại mật khẩu của sinh viên đã kích hoạt hoặc đã được cấp.

#### 6.3.3. Luồng B — Kích hoạt lần đầu (First-login Activation, do sinh viên thực hiện)
1. Sinh viên nhận thông tin đăng nhập từ Nhà trường (email `institutional_email` và mật khẩu khởi tạo).
2. Sinh viên đăng nhập qua `POST /api/v1/auth/login` (xem FR-AUTH-01). Backend xác minh mật khẩu, kiểm tra `status = ACTIVE`, và nhận thấy `must_change_password = TRUE`.
3. Backend cấp **phiên hạn chế**. Giao diện chuyển sang màn hình Đổi mật khẩu bắt buộc. Mọi chức năng khác đều bị chặn (xem 6.2.2).
4. Sinh viên nhập mật khẩu mới đạt chính sách độ mạnh và gửi `PATCH /api/v1/auth/password`. Backend thực hiện đúng luồng 6.2.1 và 6.2.2.
5. Sau khi đổi thành công, cờ `must_change_password` được hạ về `FALSE` trong cùng câu lệnh ghi mật khẩu. Sinh viên được chuyển vào Dashboard với đầy đủ quyền.
6. Trạng thái "lần đầu đăng nhập" chỉ được xác định bằng `must_change_password`, **không** dùng `last_login_at IS NULL`.

#### 6.3.4. Xử lý các trường hợp ngoại lệ (Exception Handling)
* **E-PROV-01 (Thiếu định danh để tạo mật khẩu khởi tạo):** Dòng không có cả `citizen_id` lẫn `date_of_birth`.
  * *Xử lý:* Từ chối dòng; báo cáo `REJECTED_MISSING_IDENTIFIER`; không tạo `users`. Trường có thể bổ sung dữ liệu và nạp lại (PD-04).
* **E-PROV-02 (Trùng số CCCD/CMND giữa hai dòng):** Hai sinh viên có cùng `citizen_id`.
  * *Xử lý:* Dòng sau bị từ chối theo ràng buộc `uq_student_masters_citizen_id`; báo cáo `REJECTED_DUPLICATE_CITIZEN_ID`. Đây là dấu hiệu dữ liệu nguồn sai và cần Nhà trường kiểm tra.
* **E-PROV-03 (Trùng email đăng nhập với tài khoản khác):** `institutional_email` đã tồn tại trên `users` nhưng không gắn với `student_masters` tương ứng.
  * *Xử lý:* Dòng bị đánh dấu `CONFLICT`; không tạo tài khoản mới; không ghi đè tài khoản hiện có.
* **E-PROV-04 (Sinh viên không đủ điều kiện theo chính sách):** `student_status` không thỏa Eligibility Policy (xem Mục 17, mục 2).
  * *Xử lý:* Ghi nhận dòng với `REJECTED_NOT_ELIGIBLE`; không tạo tài khoản; sau đó có thể nạp lại khi trạng thái thay đổi.
* **E-PROV-05 (Client tự gửi Role hoặc cờ bắt buộc đổi mật khẩu):** File hoặc payload chứa cột `role`, `must_change_password` hoặc `status`.
  * *Xử lý:* Backend Whitelist Validation loại bỏ các cột không thuộc danh sách; Role `STUDENT` và `must_change_password = TRUE` được gán cố định tại tầng Service nội bộ.
* **E-PROV-06 (Hai tiến trình import cùng một dòng):** Cập nhật `WHERE user_id IS NULL` chỉ cho phép đúng một tiến trình thành công; tiến trình còn lại ROLLBACK và báo `CONFLICT`.
* **E-FL-01 (Mật khẩu khởi tạo sai):** Đăng nhập với mật khẩu khởi tạo không đúng.
  * *Xử lý:* `401 Unauthorized` với thông điệp chung (E-AUTH-01). Tính vào bộ đếm rate limit (SEC-AUTH-07).
* **E-FL-02 (Quá thời hạn kích hoạt):** Tài khoản chưa đổi mật khẩu sau khi hết thời hạn kích hoạt (nếu PD-02 được chấp nhận với thời hạn).
  * *Xử lý:* Trạng thái và thời hạn xử lý theo quyết định PD-02; Admin đặt lại mật khẩu khởi tạo thủ công.
* **E-FL-03 (Gọi endpoint nghiệp vụ khi còn cờ bắt buộc):** Phiên hạn chế gọi API khác.
  * *Xử lý:* `403 Forbidden` với mã `PASSWORD_CHANGE_REQUIRED`. Guard từ chối ở phía server.
* **E-FL-04 (Đổi mật khẩu đồng thời hai lần):** Hai request đổi mật khẩu gửi cùng lúc.
  * *Xử lý:* Một request thành công; request còn lại nhận `409 Conflict` do điều kiện `password_hash` không còn khớp (xem 9.2).

#### 6.3.5. Giới hạn xác minh danh tính trong MVP (Known Risk / Scope Limitation)
> **GIỚI HẠN PHẠM VI MVP & RỦI RO ĐÃ BIẾT:**  
> Trong phạm vi MVP, hệ thống **không áp dụng OTP qua SMS hoặc Email Verification bắt buộc**. Mô hình cấp sẵn giảm đáng kể rủi ro chiếm đoạt tài khoản so với tự đăng ký, nhưng vẫn tồn tại hai rủi ro cần kiểm soát:
> 1. Nếu mật khẩu khởi tạo (CCCD hoặc ngày sinh) bị lộ trước khi sinh viên nhận được, kẻ khác có thể đăng nhập trước và đổi mật khẩu. Biện pháp: kênh phát thông tin đăng nhập do Nhà trường quản lý; rate limit; cảnh báo cho sinh viên khi có đăng nhập thành công lần đầu.
> 2. Mật khẩu khởi tạo dựa trên ngày sinh có không gian khóa nhỏ (PD-02). Nếu được chấp nhận, bắt buộc kèm rate limit và thời hạn kích hoạt.
> Biện pháp vận hành: System Admin/Career Center có thể đặt lại mật khẩu khởi tạo thủ công hoặc khóa tài khoản khi có khiếu nại từ sinh viên chính chủ.

---

### 6.4. FR-AUTH-04: Đăng ký Doanh nghiệp và Ranh giới liên Module (Company Registration Boundary)
* **Priority:** P0
* **Actors:** Employer / Recruiter

#### 6.4.1. Phân định ranh giới trách nhiệm (Module Boundary)
* **Trách nhiệm của Module 01 (Authentication & RBAC):**
  * Tiếp nhận thông tin tài khoản đại diện (`email`, `password`).
  * Validate tính hợp lệ của tài khoản xác thực.
  * Tạo bản ghi tài khoản trên bảng `users` (`status = 'ACTIVE'`, `must_change_password = FALSE`).
  * Tự động gán Role `EMPLOYER` cho người dùng trong bảng `user_roles`.
* **Trách nhiệm của Module 04 (Company Registration & Verification):**
  * Tiếp nhận và quản lý hồ sơ pháp nhân doanh nghiệp (`name`, `tax_code`, `email`, `phone`, `address`, `website`).
  * Khởi tạo bản ghi trên bảng `companies` với trạng thái thẩm định ban đầu bắt buộc: `verification_status = 'PENDING'` (và `relationship_status = 'NEW'` phục vụ CRM).
  * Tạo bản ghi người đại diện trên bảng `company_contacts` (`company_id`, `user_id`, `is_primary = true`).
  * Quản lý vòng đời xét duyệt (`company_verification_requests`: Submit -> Career Center Review -> Approve/Reject -> Resubmit).

#### 6.4.2. Luồng phối hợp Điều phối và Kiểm soát Giao dịch (Application Orchestration & Transaction)
Để tuân thủ kiến trúc Modular Monolith, `AuthModule` **không trực tiếp ghi dữ liệu vào các bảng nghiệp vụ nội bộ của `CompanyModule`**. Thay vào đó:
1. Luồng đăng ký được điều phối bởi **Application Orchestrator Service** (hoặc luồng Orchestration độc lập):
   * Orchestrator tiếp nhận request đăng ký doanh nghiệp.
   * Gọi Public Interface của `AuthModule` để tạo tài khoản người dùng và gán Role `EMPLOYER`.
   * Gọi Public Interface của `CompanyModule` để khởi tạo doanh nghiệp (`verification_status = 'PENDING'`) và liên kết người đại diện (`company_contacts`).
2. **Cơ chế cam kết giao dịch (Transaction Commitment Strategy):**
   * **Trường hợp 1 (Dùng chung Database Context):** Trong kiến trúc Modular Monolith NestJS cùng truy cập cơ sở dữ liệu PostgreSQL qua Prisma Client, Orchestrator truyền transaction client (`tx`) qua Public Interface của các module để thực thi toàn bộ chuỗi hành động trong một Database Transaction duy nhất. Nếu bất kỳ bước nào thất bại, CSDL sẽ tự động `ROLLBACK`.
   * **Trường hợp 2 (Phân tách Database Context / Decoupled Context):** Nếu các module chạy với context giao dịch độc lập, Orchestrator phải thực thi **Cơ chế Bù trừ (Compensating Actions)**: Nếu bước tạo Company/Contact thất bại sau khi đã tạo User, Orchestrator lập tức gọi lệnh xóa/hủy tài khoản User vừa tạo để đảm bảo không để lại tài khoản "mồ côi" trong hệ thống.
3. **Ràng buộc nghiệp vụ sau đăng ký:** Doanh nghiệp mới tạo có `verification_status = 'PENDING'`. Tài khoản Nhà tuyển dụng có thể đăng nhập vào hệ thống nhưng **bị chặn toàn bộ các quyền nghiệp vụ tuyển dụng** (không thể tạo Job, không thể xem hồ sơ ứng viên) cho đến khi Career Center phê duyệt (`verification_status = 'APPROVED'`) tại Module 04.

---

### 6.5. FR-AUTH-05: Quản lý Phân quyền (RBAC Management)
* **Priority:** P0
* **Actors:** System Admin

```text
[USERS] 1 ──── N [USER_ROLES] N ──── 1 [ROLES] 1 ──── N [ROLE_PERMISSIONS] N ──── 1 [PERMISSIONS]
```

#### 6.5.1. Quản lý Danh mục Role (Vai trò)
* Hệ thống khởi tạo sẵn 4 Role hệ thống cốt lõi (System Protected Roles):
  1. `STUDENT`: Sinh viên tìm việc.
  2. `EMPLOYER`: Đại diện doanh nghiệp/Nhà tuyển dụng.
  3. `CAREER_CENTER`: Chuyên viên Trung tâm Hướng nghiệp & Quan hệ Doanh nghiệp.
  4. `SYSTEM_ADMIN`: Quản trị viên kỹ thuật hệ thống.
* **Bảo vệ System Roles:** Các Role trên được đánh dấu cờ bảo vệ hệ thống. System Admin có quyền cấu hình lại danh sách Permission gán cho Role, nhưng **không được phép xóa hoặc đổi mã (`code`)** của các Role này.
* Ràng buộc dữ liệu: `roles.code` phải là duy nhất (`UNIQUE`) toàn hệ thống.

#### 6.5.2. Quản lý Danh mục Permission (Quyền hạn)
* Permission đại diện cho quyền thực thi một thao tác cụ thể, tuân theo quy ước đặt tên: `<MODULE>_<RESOURCE>_<ACTION>` (VD: `STUDENT_PROFILE_READ`, `JOB_CREATE`, `COMPANY_APPROVE`, `AUDIT_LOG_READ`, `STUDENT_MASTER_IMPORT`).
* Ràng buộc dữ liệu: `permissions.code` phải là duy nhất (`UNIQUE`) toàn hệ thống.
* Bảng `permissions` là danh mục tĩnh do mã nguồn Backend quản lý thông qua Seed/Migration dữ liệu. Giao diện quản trị cho phép xem và gán, không hỗ trợ tạo tùy tiện các Permission chưa có mã nguồn xử lý tương ứng.

#### 6.5.3. Gán Role cho User & Permission cho Role
* Quan hệ nhiều - nhiều ($N:N$) được chuẩn hóa qua 2 bảng junction: `user_roles` và `role_permissions`.
* Khóa chính phức hợp (`Composite Primary Key`):
  * `user_roles`: `PRIMARY KEY (user_id, role_id)`.
  * `role_permissions`: `PRIMARY KEY (role_id, permission_id)`.
* Cơ chế chống trùng lặp: Khóa chính phức hợp ngăn chặn triệt để việc gán trùng cặp `(user_id, role_id)` hoặc `(role_id, permission_id)`.
* Hiệu lực phân quyền: Thay đổi gán/hủy Role hoặc Permission có hiệu lực theo cơ chế xác thực phân quyền của Backend Guard (xem chi tiết mục Proposed Technical Implementation).

---

### 6.6. FR-AUTH-06: Khóa, Mở khóa và Vô hiệu hóa Tài khoản (Account Status Control)
* **Priority:** P0
* **Actors:** System Admin

#### 6.6.1. Vòng đời Trạng thái Tài khoản (Account State Transition)
Bảng `users` quản lý trạng thái tài khoản thông qua trường `status` (Enum: `user_status`):

```text
                     +---------------------------------------+
                     |                ACTIVE                 |
                     | (Hoạt động bình thường, được phép Login)
                     +---------------------------------------+
                                  │             ▲
                      Khóa tài khoản             Mở khóa (Unlock)
                      (Vi phạm/Bảo mật)         │
                                  ▼             │
                     +---------------------------------------+
                     |                LOCKED                 |
                     |  (Bị chặn toàn bộ quyền truy cập)     |
                     +---------------------------------------+
                                  │
                        Vô hiệu hóa dài hạn (Deactivate)
                                  ▼
                     +---------------------------------------+
                     |               INACTIVE                |
                     |    (Ngừng hoạt động / Lưu trữ cũ)     |
                     +---------------------------------------+
```

Cờ `must_change_password` là trạng thái độc lập với `status`, không thuộc vòng đời trên.

#### 6.6.2. Quy tắc chuyển trạng thái và Tác động hệ thống
1. **Khóa tài khoản (`ACTIVE -> LOCKED`):**
   * *Điều kiện:* System Admin thực hiện khi phát hiện hành vi gian lận, mạo danh sinh viên, hoặc theo yêu cầu an ninh.
   * *Tác động:*
     * Ngăn chặn toàn bộ các lần đăng nhập mới.
     * Thu hồi phiên làm việc hiện tại của tài khoản (tùy thuộc vào cơ chế kiểm tra trạng thái của Backend Guard ở từng request hoặc định kỳ xác thực lại).
     * Dữ liệu lịch sử, hồ sơ sinh viên, tin tuyển dụng cũ của tài khoản vẫn được bảo toàn nguyên vẹn trong CSDL (Không xóa vật lý).
2. **Mở khóa tài khoản (`LOCKED -> ACTIVE`):**
   * *Điều kiện:* System Admin xác nhận sự cố bảo mật đã được giải quyết.
   * *Tác động:* Tài khoản trở về trạng thái hoạt động bình thường, cho phép đăng nhập lại.
3. **Vô hiệu hóa tài khoản (`ACTIVE / LOCKED -> INACTIVE`):**
   * *Điều kiện:* Tài khoản đóng vĩnh viễn (sinh viên tốt nghiệp đã lâu yêu cầu đóng tài khoản, hoặc doanh nghiệp giải thể).
   * *Tác động:* Ngừng vĩnh viễn việc đăng nhập; bảo lưu dữ liệu phục vụ đối soát và báo cáo thống kê.
4. **Đặt lại mật khẩu thủ công (Admin Reset):**
   * *Điều kiện:* System Admin xác minh được danh tính người dùng ngoài hệ thống.
   * *Tác động:* Băm mật khẩu tạm mới, đặt `must_change_password = TRUE`, thu hồi phiên cũ. Người dùng phải đổi mật khẩu ở lần đăng nhập tiếp theo theo luồng 6.2.2.

#### 6.6.3. Bắt buộc Truy vết Kiểm toán (Audit Requirement)
* Mọi thao tác thay đổi trạng thái tài khoản (`Lock`, `Unlock`, `Deactivate`) và đặt lại mật khẩu thủ công bắt buộc phải tạo bản ghi tương ứng vào bảng `activity_logs`:
  * `actor_user_id`: ID của Admin thực hiện thao tác.
  * `action`: `'LOCK_ACCOUNT'`, `'UNLOCK_ACCOUNT'`, `'DEACTIVATE_ACCOUNT'` hoặc `'ADMIN_RESET_PASSWORD'`.
  * `entity_type`: `'USER'`.
  * `entity_id`: ID của tài khoản bị tác động.
  * `created_at`: Thời điểm thực thi.

---

## 7. TỔNG HỢP QUY TẮC NGHIỆP VỤ (BUSINESS RULES MATRIX)

| Mã BR | Tên quy tắc | Nội dung chi tiết | Cơ chế thực thi |
| :--- | :--- | :--- | :--- |
| `BR-AUTH-01` | Tính duy nhất của Email | `users.email` là duy nhất (`UNIQUE`) trên toàn hệ thống; email đăng nhập được đối soát dạng chữ thường (`lowercase`). | Database Constraint `UNIQUE` & DTO Transform. |
| `BR-AUTH-02` | Lưu trữ Mật khẩu An toàn | Mật khẩu (kể cả mật khẩu khởi tạo) tuyệt đối không lưu plaintext dưới mọi hình thức; bắt buộc băm bằng thuật toán an toàn trước khi lưu. | Backend Auth Service Hash Function. |
| `BR-AUTH-03` | Kiểm tra Trạng thái Tài khoản | Mọi yêu cầu đăng nhập hoặc kiểm tra phiên xác thực bắt buộc phải xác nhận `users.status == 'ACTIVE'`. | Backend Authentication Guard / Service. |
| `BR-AUTH-04` | Phân lập RBAC 2 tầng Junction | Quan hệ giữa User-Role và Role-Permission bắt buộc thông qua 2 bảng junction trung gian; không lưu mảng quyền tự do trong bảng `users`. | Database Schema 3NF (`user_roles`, `role_permissions`). |
| `BR-AUTH-05` | Tính duy nhất của Role/Permission Code | Mã định danh của Role (`roles.code`) và Permission (`permissions.code`) phải là duy nhất toàn cục. | Database Constraint `UNIQUE`. |
| `BR-AUTH-06` | Phân định Career Center và Admin | Career Center là Business Actor; System Admin là Technical Actor. Quyền hạn của Career Center được cấp qua Permission được duyệt, không mặc định theo chức danh. | RBAC Permission Assignment. |
| `BR-AUTH-07` | Không tự đăng ký tài khoản sinh viên | Tài khoản sinh viên chỉ được tạo bởi tiến trình provisioning từ dữ liệu Student Master của Nhà trường. Không có endpoint công khai nào cho phép sinh viên tự tạo tài khoản. | Không tồn tại API đăng ký sinh viên; Guard chỉ cho phép Permission `STUDENT_MASTER_IMPORT` gọi endpoint import. |
| `BR-AUTH-08` | Ràng buộc 1:1 Sinh viên - Tài khoản | Một MSSV chỉ được liên kết tối đa một User; một User chỉ liên kết tối đa một hồ sơ Sinh viên. | Database Constraint `UNIQUE(student_masters.user_id)`, `UNIQUE(students.user_id)`. |
| `BR-AUTH-09` | Role và cờ hệ thống được gán bởi Backend | Role `STUDENT` và cờ `must_change_password = TRUE` khi cấp tài khoản do Backend tự gán; Client không thể tự gửi các trường này trong payload. | Backend Service Hardcode Assignment & Whitelist Validation. |
| `BR-AUTH-10` | Độc lập giữa Đăng ký và Thẩm định Doanh nghiệp | Đăng ký Doanh nghiệp thành công chỉ tạo trạng thái `companies.verification_status = 'PENDING'`; chưa được cấp quyền hoạt động tuyển dụng. | Backend Business Policy & Module 04 Contract. |
| `BR-AUTH-11` | Cấm rò rỉ Hash và Thông tin nhạy cảm | Mọi API response tuyệt đối không trả về `password_hash`, mật khẩu khởi tạo, `citizen_id` (ngoài dạng che) hoặc `date_of_birth` của người khác; Application log không được ghi nhận plaintext password hay thông tin bảo mật nhạy cảm. | Prisma Select Filter / DTO Serialization / Interceptors. |
| `BR-AUTH-12` | Tính toàn vẹn của Giao dịch | Các thao tác cấp tài khoản Sinh viên (từng dòng import), đăng ký Doanh nghiệp, hoặc thay đổi trạng thái tài khoản phải được đảm bảo tính toàn vẹn thông qua Transaction hoặc Bù trừ lỗi. | Application Orchestrator / DB Transaction. |
| `BR-AUTH-13` | Quy chuẩn Định dạng MSSV | `student_code` là định danh dạng chuỗi (`VARCHAR`), bắt buộc bảo toàn nguyên vẹn định dạng bao gồm chữ số `0` ở đầu, kể cả khi đọc từ file import. | Backend Validation & CSDL String Type. |
| `BR-AUTH-14` | Student Eligibility Policy (Pending Decision) | Việc cấp tài khoản sinh viên phụ thuộc vào chính sách trạng thái học tập (`student_status`), chi tiết tập trạng thái hợp lệ chờ Hội đồng phê duyệt. | Student Eligibility Policy Service. |
| `BR-AUTH-15` | Bắt buộc đổi mật khẩu lần đầu | Tài khoản có `must_change_password = TRUE` chỉ được gọi API đổi mật khẩu và đăng xuất; cờ chỉ được hạ trong cùng câu lệnh ghi mật khẩu mới. | Backend Authentication Guard (kiểm tra phía server) & Conditional UPDATE. |
| `BR-AUTH-16` | Tính độc lập của mật khẩu khởi tạo | Mật khẩu khởi tạo không được tái sử dụng cho nhiều sinh viên và không được hiển thị lại sau khi cấp tài khoản. Khi Admin đặt lại, phải sinh mật khẩu tạm mới. | Service Policy; kiểm thử đơn vị. |

---

## 8. ĐẶC TẢ DỮ LIỆU VÀ QUAN HỆ CƠ SỞ DỮ LIỆU (DATABASE SPECIFICATION)

Module 01 sở hữu trực tiếp miền dữ liệu Authentication & RBAC, đồng thời thiết lập các quan hệ khóa ngoại với miền Sinh viên, Doanh nghiệp và Kiểm toán theo Database Architecture Specification.

```text
+---------------------------------------------------------------------------------------------------+
|                                     LƯỢC ĐỒ QUAN HỆ CƠ SỞ DỮ LIỆU                                 |
+---------------------------------------------------------------------------------------------------+

    +---------------+             +------------------+             +---------------+
    |     ROLES     | 1         N |    USER_ROLES    | N         1 |     USERS     |
    +---------------+<────────────+------------------+────────────>+---------------+
    | PK  id        |             | PK,FK1  user_id  |             | PK  id        |
    | UQ  code      |             | PK,FK2  role_id  |             | UQ  email     |
    |     name      |             |         assigned |             |     password  |
    +-------+-------+             +------------------+             |     status    |
            │ 1                                                    |     mcp_flag  |
            │                                                      |     last_login|
            │                                                      +───+───────+───+
            │ N                                                        │ 1     │ 1
    +-------▼----------+                                               │       │
    | ROLE_PERMISSIONS |                                               │ 0..1  │ 0..1
    +------------------+                                               │       │
    | PK,FK1 role_id   |                                               ▼       ▼
    | PK,FK2 perm_id   |                                    +────────────+   +----------------───+
    +-------+----------+                                    |  STUDENTS  |   | COMPANY_CONTACTS  |
            │ N                                             +────────────+   +----------------───+
            │                                               | PK  id     |   | PK  id            |
            │ 1                                             | UQ,FK user |   | FK  company_id    |
    +-------▼----------+                                    | UQ  code   |   | FK  user_id       |
    |   PERMISSIONS    |                                    |     name   |   |     full_name     |
    +------------------+                                    +────────────+   +----------------───+
    | PK  id           |                                                       │ N
    | UQ  code         |                                                       │ 1
    |     name         |                                                     +-▼───────────+
    +------------------+                                                     |  COMPANIES  |
                                                                             +─────────────+
                                                                             | PK  id      |
                                                                             | verif_status|
                                                                             +─────────────+
```

### 8.1. Bảng `users` (Tài khoản người dùng trung tâm)
* **Mục đích:** Lưu trữ thông tin tài khoản đăng nhập và trạng thái bảo mật cốt lõi cho mọi người dùng trong hệ thống.
* **Module sở hữu:** `AuthModule`.

| Tên cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa và Ràng buộc kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính (Primary Key). |
| `email` | `VARCHAR(255)` | **NO** | — | Email đăng nhập; Ràng buộc `UNIQUE`; So khớp dạng lowercase. |
| `password_hash` | `VARCHAR(255)` | **NO** | — | Chuỗi băm mật khẩu an toàn; Không bao giờ lưu plaintext. |
| `status` | `user_status` | **NO** | `'ACTIVE'` | Enum: `ACTIVE`, `LOCKED`, `INACTIVE`. |
| `must_change_password` | `BOOLEAN` | **NO** | `FALSE` | Cờ bắt buộc đổi mật khẩu. `TRUE` khi tài khoản được cấp qua provisioning; hạ về `FALSE` trong cùng câu lệnh đổi mật khẩu thành công. Tài khoản Admin, Career Center và Doanh nghiệp mặc định `FALSE`. |
| `last_login_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm đăng nhập thành công gần nhất. Không dùng để suy ra trạng thái "lần đầu đăng nhập". |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm khởi tạo bản ghi. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật dữ liệu gần nhất. |

### 8.2. Bảng `roles` (Danh mục Vai trò)
* **Mục đích:** Định nghĩa các vai trò trong hệ thống.
* **Module sở hữu:** `AuthModule`.

| Tên cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa và Ràng buộc kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính (Primary Key). |
| `code` | `VARCHAR(50)` | **NO** | — | Mã định danh vai trò (VD: `'STUDENT'`, `'SYSTEM_ADMIN'`); Ràng buộc `UNIQUE`. |
| `name` | `VARCHAR(100)` | **NO** | — | Tên hiển thị của vai trò. |
| `description` | `TEXT` | YES | `NULL` | Mô tả phạm vi nghiệp vụ của vai trò. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm khởi tạo bản ghi. |
| `updated_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cập nhật bản ghi. |

### 8.3. Bảng `permissions` (Danh mục Quyền hạn chi tiết)
* **Mục đích:** Định nghĩa các quyền nguyên tử để bảo vệ từng API và tài nguyên nghiệp vụ.
* **Module sở hữu:** `AuthModule`.

| Tên cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa và Ràng buộc kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **NO** | `gen_random_uuid()` | Khóa chính (Primary Key). |
| `code` | `VARCHAR(100)` | **NO** | — | Mã quyền hạn (VD: `'JOB_CREATE'`, `'STUDENT_MASTER_IMPORT'`); Ràng buộc `UNIQUE`. |
| `name` | `VARCHAR(150)` | **NO** | — | Tên hiển thị mô tả quyền. |
| `module` | `VARCHAR(50)` | **NO** | — | Tên module sở hữu quyền (VD: `'AUTH'`, `'STUDENT'`, `'JOB'`). |
| `description` | `TEXT` | YES | `NULL` | Mô tả chi tiết hành động được phép. |
| `created_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm khởi tạo bản ghi. |

### 8.4. Bảng `user_roles` (Bảng liên kết Người dùng - Vai trò)
* **Mục đích:** Thiết lập quan hệ nhiều - nhiều ($N:N$) giữa `users` và `roles`.
* **Module sở hữu:** `AuthModule`.

| Tên cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa và Ràng buộc kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `users(id)` ON DELETE CASCADE; Thành phần PK. |
| `role_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `roles(id)` ON DELETE RESTRICT; Thành phần PK. |
| `assigned_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm gán vai trò. |
| `assigned_by` | `UUID` | YES | `NULL` | Khóa ngoại tham chiếu `users(id)` (Admin thực hiện gán; `NULL` với tài khoản được provisioning tự động). |

* **Khóa chính:** `PRIMARY KEY (user_id, role_id)`.

### 8.5. Bảng `role_permissions` (Bảng liên kết Vai trò - Quyền hạn)
* **Mục đích:** Thiết lập quan hệ nhiều - nhiều ($N:N$) giữa `roles` và `permissions`.
* **Module sở hữu:** `AuthModule`.

| Tên cột | Kiểu dữ liệu | Nullable | Mặc định | Ý nghĩa và Ràng buộc kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| `role_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `roles(id)` ON DELETE CASCADE; Thành phần PK. |
| `permission_id` | `UUID` | **NO** | — | Khóa ngoại tham chiếu `permissions(id)` ON DELETE CASCADE; Thành phần PK. |
| `granted_at` | `TIMESTAMPTZ` | **NO** | `now()` | Thời điểm cấp quyền cho vai trò. |

* **Khóa chính:** `PRIMARY KEY (role_id, permission_id)`.

### 8.6. Quan hệ với các thực thể liên Module

#### 8.6.1. Thực thể `students` và `student_masters` (Thuộc sở hữu của Module 02 - Student Profile)
* Cấu trúc liên kết:
  * `student_masters`: dữ liệu gốc Nhà trường nạp vào; có `user_id` (UNIQUE, NULLABLE) liên kết tài khoản, `citizen_id` (NULLABLE, UNIQUE khi không NULL) và `date_of_birth` (NULLABLE).
  * `students`: hồ sơ cá nhân; `user_id` kiểu `UUID`, `NOT NULL`, `UNIQUE` và là Khóa ngoại tham chiếu tới `users(id)`.
* Ý nghĩa:
  * Khi Student Master Data được nạp, Module 01 tạo `users` và Module 02 tạo `students` với `user_id` trong cùng transaction (mục 6.3.2). Không tồn tại trạng thái `students` không có tài khoản.
  * Module 01 tuyệt đối không trực tiếp ghi các trường học tập: `student_code`, `full_name`, `major`, `faculty`, `gpa` vào bảng `users`.
  * `citizen_id` là dữ liệu định danh nhạy cảm; chỉ phục vụ tiến trình cấp tài khoản và không được sao chép sang `students` (xem PD-01).

#### 8.6.2. Thực thể `company_contacts` và `companies` (Thuộc Module 04/05 - Company CRM)
* Cấu trúc liên kết:
  * `companies`: Lưu hồ sơ pháp nhân doanh nghiệp (`id`, `name`, `tax_code`, `verification_status = 'PENDING'`, `relationship_status = 'NEW'`).
  * `company_contacts`: Lưu trữ danh bạ nhân sự đại diện của công ty. Trường `company_contacts.user_id` là Khóa ngoại tham chiếu tới `users(id)`.
* Ý nghĩa: Một Contact trong CRM có thể tồn tại mà chưa có tài khoản (`user_id = NULL`). Khi Nhà tuyển dụng đăng ký, tài khoản được tạo và gán vào Contact đại diện chính (`is_primary = true`).

#### 8.6.3. Bảng `activity_logs` (Thuộc Module 15 - Audit Log)
* Sử dụng mô hình kiểm toán đa hình (`polymorphic logging`):
  * `actor_user_id`: Khóa ngoại tham chiếu `users(id)`. Với sự kiện cấp tài khoản hàng loạt, `actor_user_id` là ID của Admin/Career Center thực hiện import; với sự kiện kích hoạt lần đầu, là ID của chính sinh viên.
  * `action`: Tên hành động (VD: `'PROVISION_STUDENT_ACCOUNT'`, `'IMPORT_STUDENT_MASTER_BATCH'`, `'FIRST_LOGIN_PASSWORD_CHANGED'`, `'REJECT_PROVISION_ROW'`, `'REGISTER_COMPANY'`, `'LOCK_ACCOUNT'`, `'ADMIN_RESET_PASSWORD'`, `'ASSIGN_ROLE'`).
  * `entity_type`: Bảng bị tác động (VD: `'USER'`, `'ROLE'`, `'STUDENT_MASTER'`).
  * `entity_id`: ID của bản ghi bị tác động.
  * `created_at`: Thời điểm ghi log.
* Tuyệt đối không lưu mật khẩu (kể cả mật khẩu khởi tạo), chuỗi hash, `citizen_id` đầy đủ, ngày sinh hoặc mã token vào metadata của log.

---

## 9. KIỂM SOÁT GIAO DỊCH VÀ TÍNH TOÀN VẸN DỮ LIỆU (TRANSACTIONS & CONCURRENCY)

### 9.1. Đề xuất Kỹ thuật cho Transaction Cấp tài khoản Sinh viên (Proposed Implementation)
Thao tác cấp tài khoản có rủi ro tranh chấp khi có nhiều tiến trình import cùng xử lý một dòng, hoặc khi cùng một email/CCCD xuất hiện ở nhiều dòng. Thiết kế đề xuất cho từng dòng import:

```typescript
// [Đề xuất triển khai kỹ thuật cho FR-AUTH-03 — xử lý MỘT dòng]
await dbContext.$transaction(async (tx) => {
  // 1. Upsert thông tin gốc (Module 02 Public Service)
  const master = await studentInternalService.upsertMaster(tx, row);

  // 2. Đã được cấp tài khoản trước đó -> bỏ qua, không đổi mật khẩu (idempotent)
  if (master.user_id !== null) {
    return { status: "SKIPPED_ALREADY_PROVISIONED" };
  }

  // 3. Kiểm tra Eligibility Policy (Pending Decision)
  if (!(await studentEligibilityPolicy.evaluate(master.student_status))) {
    return { status: "REJECTED_NOT_ELIGIBLE" };
  }

  // 4. Xác định mật khẩu khởi tạo (PD-01, PD-02, PD-04)
  const initialPassword = resolveInitialPassword(row); // CCCD -> DDMMYYYY -> null
  if (initialPassword === null) {
    return { status: "REJECTED_MISSING_IDENTIFIER" };
  }

  // 5. Auth Module Service: Tạo User với cờ bắt buộc đổi mật khẩu
  const newUser = await authInternalService.createUser(tx, {
    email: row.institutionalEmail.toLowerCase(),
    passwordHash: await hashPassword(initialPassword),
    status: "ACTIVE",
    mustChangePassword: true,
  });

  // 6. Auth Module Service: Gán Role STUDENT (hardcode, không nhận từ input)
  await authInternalService.assignRole(tx, newUser.id, "STUDENT");

  // 7. Module 02 Public Service: Tạo hồ sơ students (user_id NOT NULL)
  await studentInternalService.createProfile(tx, { masterId: master.id, userId: newUser.id });

  // 8. Cập nhật liên kết nguyên tử có điều kiện trên student_masters
  const affected = await studentInternalService.linkUserAtomically(tx, master.id, newUser.id);
  if (affected === 0) {
    throw new ConflictException("Dòng này vừa được cấp tài khoản bởi một tiến trình khác.");
  }

  // 9. Ghi nhận Activity Log (không chứa mật khẩu, CCCD hay ngày sinh)
  await auditInternalService.logAction(tx, {
    actorUserId: importerUserId,
    action: "PROVISION_STUDENT_ACCOUNT",
    entityType: "USER",
    entityId: newUser.id,
  });

  return { status: "CREATED" };
});
```

* **Bảo đảm toàn vẹn:** Nếu có bất kỳ lỗi nào xảy ra tại bất kỳ bước nào trong chuỗi trên, toàn bộ giao dịch của dòng đó tự động `ROLLBACK`. Không bao giờ xảy ra tình trạng User được tạo nhưng không có Role, hoặc User được tạo nhưng không có hồ sơ `students`.
* **Lưu ý:** Một lỗi ở dòng này không làm hủy các dòng khác của cùng file.

### 9.2. Đề xuất Kỹ thuật cho Đổi mật khẩu và Hạ cờ bắt buộc (Proposed Implementation)
```sql
UPDATE users
SET password_hash = :newHash,
    must_change_password = FALSE,
    updated_at = clock_timestamp()
WHERE id = :userId
  AND password_hash = :oldHash;
```
* Nếu `affected_rows = 0`, Backend trả `409 Conflict` và không thay đổi gì. Điều này chặn hai request đổi mật khẩu đồng thời cùng ghi đè lên nhau.
* Cờ `must_change_password` và mật khẩu mới được ghi trong **cùng một câu lệnh**, nên không tồn tại trạng thái trung gian.

---

## 10. ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (API SPECIFICATION REQUIREMENTS)

Tất cả các API tuân thủ chuẩn RESTful, trả về dữ liệu định dạng JSON, sử dụng mã trạng thái HTTP chuẩn.

```text
+--------+---------------------------------------+---------------------+---------------------------------------------+
| METHOD | ENDPOINT                              | PHÂN QUYỀN (ACCESS) | MÔ TẢ TỔNG QUAN                             |
+--------+---------------------------------------+---------------------+---------------------------------------------+
| POST   | /api/v1/auth/login                    | Public              | Đăng nhập; trả phiên đầy đủ hoặc phiên hạn chế (mustChangePassword) |
| POST   | /api/v1/auth/logout                   | Authenticated       | Đăng xuất và kết thúc phiên xác thực        |
| PATCH  | /api/v1/auth/password                 | Authenticated*      | Đổi mật khẩu cá nhân; cho phép cả phiên hạn chế (*) |
| POST   | /api/v1/admin/students/import         | STUDENT_MASTER_IMPORT | Nạp file Student Master và cấp tài khoản theo dòng |
| GET    | /api/v1/admin/students/import/:jobId  | STUDENT_MASTER_IMPORT | Xem báo cáo kết quả import theo từng dòng    |
| POST   | /api/v1/auth/company/register         | Public              | Đăng ký tài khoản Doanh nghiệp ban đầu      |
| GET    | /api/v1/users/me                      | Authenticated       | Lấy thông tin tài khoản và quyền của mình   |
| GET    | /api/v1/users/:id                     | ADMIN, CAREER_CTR   | Xem thông tin tài khoản theo định danh      |
| PATCH  | /api/v1/users/:id/status              | SYSTEM_ADMIN        | Khóa, mở khóa, vô hiệu hóa tài khoản        |
| POST   | /api/v1/users/:id/password-reset      | SYSTEM_ADMIN        | Đặt lại mật khẩu tạm; bật must_change_password |
| GET    | /api/v1/roles                         | SYSTEM_ADMIN        | Danh sách tất cả các Role trong hệ thống    |
| POST   | /api/v1/roles                         | SYSTEM_ADMIN        | Tạo mới một Role tùy chỉnh                  |
| PATCH  | /api/v1/roles/:id                     | SYSTEM_ADMIN        | Cập nhật thông tin mô tả của Role           |
| GET    | /api/v1/permissions                   | SYSTEM_ADMIN        | Danh mục tất cả Permission hệ thống         |
| POST   | /api/v1/roles/:id/permissions         | SYSTEM_ADMIN        | Gán Permission cho một Role                 |
| DELETE | /api/v1/roles/:id/permissions/:permId | SYSTEM_ADMIN        | Hủy gán Permission khỏi một Role            |
| POST   | /api/v1/users/:id/roles               | SYSTEM_ADMIN        | Gán Role cho một User cụ thể                |
| DELETE | /api/v1/users/:id/roles/:roleId       | SYSTEM_ADMIN        | Hủy gán Role khỏi một User                  |
+--------+---------------------------------------+---------------------+---------------------------------------------+
```
*(Ghi chú: Endpoint `POST /api/v1/auth/student/register` đã bị loại bỏ. Quyền `STUDENT_MASTER_IMPORT` được gán cho Role `SYSTEM_ADMIN` mặc định; Career Center có thể được cấp thêm theo quyết định của System Admin. Cấu trúc chi tiết payload của body và header phản ánh trạng thái phiên làm việc sẽ được đồng bộ chính thức sau khi quyết định kiến trúc xác thực Session vs JWT được phê duyệt.)*

---

## 11. YÊU CẦU BẢO MẬT (SECURITY REQUIREMENTS)

* **`SEC-AUTH-01` (Password Hashing):** Mật khẩu (bao gồm mật khẩu khởi tạo) phải được băm bằng thuật toán an toàn tiêu chuẩn ngành.  
  * *Yêu cầu nghiệp vụ:* Không lưu plaintext password; dùng thuật toán băm có salt.  
  * *Đề xuất kỹ thuật (Proposed):* Sử dụng `bcrypt` (salt rounds $\ge 10$) hoặc `Argon2id`.
* **`SEC-AUTH-02` (Password Complexity Standard):**  
  * *Yêu cầu nghiệp vụ:* Mật khẩu mới do người dùng đặt phải đảm bảo độ phức tạp tối thiểu để chống lại tấn công brute-force.  
  * *Đề xuất kỹ thuật (Proposed):* Độ dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt. Mật khẩu khởi tạo do hệ thống sinh được miễn quy tắc này nhưng vẫn phải được đổi ngay ở lần đăng nhập đầu.
* **`SEC-AUTH-03` (Data Leak Prevention):** Các trường thông tin nhạy cảm (`password_hash`, credential token, mật khẩu khởi tạo, `citizen_id`, `date_of_birth`) phải được lọc bỏ tuyệt đối khỏi các phản hồi API, DTO serialization và Application logs, ngoại trừ báo cáo import hiển thị `citizen_id` dạng che.
* **`SEC-AUTH-04` (Backend Enforcement):** Mọi API nhạy cảm phải được bảo vệ bởi tổ hợp Guards ở Backend:  
  `AuthenticationGuard` $\rightarrow$ `MustChangePasswordGuard` $\rightarrow$ `RolesGuard` $\rightarrow$ `PermissionsGuard` $\rightarrow$ `OwnershipGuard`.
* **`SEC-AUTH-05` (No Privilege Escalation):** Nghiêm cấm Client tự định nghĩa danh sách quyền, vai trò hoặc cờ `must_change_password` thông qua request body. Mọi phân quyền phải được đọc trực tiếp từ CSDL hoặc mã hóa trong phiên xác thực do server cấp.
* **`SEC-AUTH-06` (Account Lock Immediacy):** Tài khoản bị khóa (`LOCKED`) phải bị từ chối ngay lập tức khi đăng nhập mới. Đối với các phiên làm việc đang tồn tại, Backend Guard phải kiểm tra trạng thái tài khoản thời gian thực tại Database/Cache để từ chối truy cập trong lần kiểm tra tiếp theo.
* **`SEC-AUTH-07` (Brute-force Mitigation - Đề xuất kỹ thuật):** Áp dụng giới hạn tần suất yêu cầu (Rate Limiting) trên endpoint đăng nhập và đổi mật khẩu: tối đa 5 lần thử thất bại liên tiếp trong vòng 1 phút trên một IP/Email trước khi bị tạm khóa thử lại trong 15 phút. Ràng buộc này đặc biệt quan trọng với mật khẩu khởi tạo dựa trên CCCD hoặc ngày sinh.
* **`SEC-AUTH-08` (Data Minimization):** Thông tin sinh viên nhạy cảm chỉ được truy cập bởi chính sinh viên đó hoặc Career Center/System Admin có thẩm quyền; tuyệt đối không công khai qua các API công cộng.
* **`SEC-AUTH-09` (Bảo vệ dữ liệu định danh nhạy cảm):** `citizen_id` không được lưu dạng rõ nếu PD-01 được chấp nhận theo phương án có mã hóa; không xuất hiện trong log ứng dụng, `activity_logs`, response API hay file báo cáo import (ngoài dạng che). File import gốc không được lưu lâu hơn thời gian cần thiết cho việc xử lý và đối soát (thời hạn cụ thể do Nhà trường quy định).
* **`SEC-AUTH-10` (Phiên hạn chế):** Phiên được cấp khi `must_change_password = TRUE` không được phép truy cập bất kỳ tài nguyên nghiệp vụ nào; kiểm tra thực thi ở Guard phía server, có kiểm thử tự động cho từng endpoint nghiệp vụ.

---

## 12. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

* **`NFR-AUTH-01` (Hiệu năng - Response Time Đề xuất):** Thời gian đáp ứng của API Đăng nhập hướng tới mức $p95 \le 500\text{ ms}$; các API kiểm tra quyền đạt $p95 \le 100\text{ ms}$. Đối với import, thời gian xử lý phụ thuộc số dòng và phải được đo trên file mẫu của Nhà trường khi nghiệm thu (Cần đối soát với NFR Benchmark toàn hệ thống).
* **`NFR-AUTH-02` (Tính toàn vẹn dữ liệu - Data Integrity):** Toàn bộ các quan hệ phân quyền và liên kết tài khoản phải được thực thi ở mức Ràng buộc CSDL (PK, FK, UNIQUE Constraints); không phụ thuộc hoàn toàn vào code ứng dụng.
* **`NFR-AUTH-03` (Khả năng bảo trì - Modularity):** `AuthModule` được đóng gói độc lập theo chuẩn Modular Monolith của NestJS; giao tiếp với các module khác thông qua Public Service Interfaces đã được định nghĩa, không truy cập trực tiếp repository nội bộ của nhau.
* **`NFR-AUTH-04` (Khả năng kiểm toán - Auditability):** 100% các thao tác thay đổi vai trò, phân quyền, khóa/mở khóa tài khoản, cấp tài khoản hàng loạt và đặt lại mật khẩu phải ghi nhận đầy đủ bản ghi lịch sử phục vụ đối soát và an toàn thông tin.

---

## 13. KỊCH BẢN KIỂM THỬ CHẤP NHẬN (ACCEPTANCE TEST CASES)

| Mã kiểm thử | Phân loại | Tình huống kiểm thử (Test Scenario) | Điều kiện đầu vào | Kết quả kỳ vọng (Expected Result) |
| :--- | :--- | :--- | :--- | :--- |
| `TC-AUTH-01` | Login | Đăng nhập thành công với thông tin hợp lệ | Email và Password chính xác; `status = ACTIVE`; `must_change_password = FALSE` | HTTP `200 OK`; Thiết lập phiên đầy đủ; cập nhật `last_login_at`. |
| `TC-AUTH-02` | Login | Đăng nhập sai mật khẩu | Nhập đúng email nhưng sai mật khẩu | HTTP `401 Unauthorized`; Không tạo phiên; Không tiết lộ chi tiết lỗi. |
| `TC-AUTH-03` | Login | Đăng nhập bằng tài khoản không tồn tại | Nhập email chưa từng đăng ký | HTTP `401 Unauthorized`; Thông báo lỗi giống hệt trường hợp sai mật khẩu. |
| `TC-AUTH-04` | Login | Đăng nhập bằng tài khoản đang bị khóa (`LOCKED`) | Email và Password đúng; `status = LOCKED` | HTTP `403 Forbidden`; Thông báo tài khoản bị khóa; Không tạo phiên làm việc. |
| `TC-AUTH-05` | Login | Đăng nhập bằng tài khoản vô hiệu hóa (`INACTIVE`) | Email và Password đúng; `status = INACTIVE` | HTTP `403 Forbidden`; Từ chối đăng nhập. |
| `TC-AUTH-06` | Logout | Đăng xuất phiên làm việc thành công | Request kèm phiên xác thực hợp lệ | HTTP `200 OK`; Phiên xác thực bị thu hồi/kết thúc; không thể tiếp tục gọi API bảo vệ. |
| `TC-AUTH-07` | Password | Đổi mật khẩu thành công | Đúng mật khẩu cũ; Mật khẩu mới thỏa mãn validation | HTTP `200 OK`; Mật khẩu trong DB được cập nhật hash mới; Thu hồi các phiên cũ theo chính sách. |
| `TC-AUTH-08` | Password | Đổi mật khẩu nhưng nhập sai mật khẩu hiện tại | Nhập sai mật khẩu cũ | HTTP `400 Bad Request`; Báo lỗi mật khẩu hiện tại không khớp; Hash DB không đổi. |
| `TC-AUTH-09` | Provision | Cấp tài khoản thành công từ một dòng import hợp lệ | Dòng có `student_code`, email, và `citizen_id` (hoặc `date_of_birth`); chưa được cấp; đạt Eligibility | Tạo `users` (`ACTIVE`, `must_change_password = TRUE`), Role `STUDENT`, bản ghi `students`, liên kết `student_masters.user_id`; dòng báo `CREATED`. |
| `TC-AUTH-10` | Provision | Dòng import thiếu cả CCCD và ngày sinh | Dòng hợp lệ về các trường khác nhưng không có `citizen_id` và `date_of_birth` | Dòng bị từ chối `REJECTED_MISSING_IDENTIFIER`; không tạo `users`, `students`; các dòng khác vẫn được xử lý. |
| `TC-AUTH-11` | Provision | Nạp lại cùng một file import (idempotent) | Các dòng đã được cấp tài khoản ở lần nạp trước | Các dòng báo `SKIPPED_ALREADY_PROVISIONED`; không tạo tài khoản trùng; mật khẩu hiện tại không bị đổi. |
| `TC-AUTH-12` | Provision | Hai dòng khác MSSV nhưng cùng `citizen_id` | File có hai dòng trùng CCCD | Dòng thứ hai bị từ chối `REJECTED_DUPLICATE_CITIZEN_ID`; không tạo tài khoản thứ hai. |
| `TC-AUTH-13` | First-login | Đăng nhập lần đầu bằng mật khẩu khởi tạo đúng | Tài khoản vừa được cấp; `must_change_password = TRUE` | HTTP `200 OK`, `mustChangePassword = true`, phiên hạn chế; gọi endpoint nghiệp vụ (ví dụ `GET /users/me` ngoài danh sách cho phép) trả `403 PASSWORD_CHANGE_REQUIRED`. |
| `TC-AUTH-14` | First-login | Đổi mật khẩu lần đầu thành công | Phiên hạn chế; mật khẩu mới đạt chính sách | HTTP `200 OK`; `must_change_password = FALSE` trong cùng transaction với ghi hash; phiên được nâng lên đầy đủ quyền; đăng nhập lại bằng mật khẩu khởi tạo trả `401`. |
| `TC-AUTH-15` | First-login | Hai request đổi mật khẩu lần đầu gửi đồng thời | Cùng một phiên hạn chế; hai request khác nhau | Đúng một request thành công; request còn lại trả `409 Conflict` (điều kiện `password_hash` không còn khớp). |
| `TC-AUTH-16` | Register Com | Đăng ký Doanh nghiệp thành công | Dữ liệu đại diện và công ty hợp lệ | HTTP `201 Created`; User (ACTIVE, `must_change_password = FALSE`), Role EMPLOYER, Company (`verification_status = 'PENDING'`), Contact liên kết. |
| `TC-AUTH-17` | Register Com | Doanh nghiệp mới tạo cố gắng đăng tin tuyển dụng | Company đang ở trạng thái `verification_status = 'PENDING'` | HTTP `403 Forbidden`; Backend chặn do công ty chưa được phê duyệt (`APPROVED`). |
| `TC-AUTH-18` | RBAC | Truy cập tài nguyên bảo vệ khi không có Permission | User có Role STUDENT gọi API quản trị Role | HTTP `403 Forbidden`; Backend Guard từ chối truy cập. |
| `TC-AUTH-19` | RBAC | System Admin tạo Role với mã code bị trùng | Tạo Role mới nhưng `code` đã tồn tại | HTTP `409 Conflict` (hoặc 400); Database từ chối do vi phạm ràng buộc UNIQUE. |
| `TC-AUTH-20` | RBAC | Gán một Role cho một User hai lần liên tiếp | Thực hiện gán lặp lại cùng cặp `(user_id, role_id)` | Hệ thống từ chối hoặc trả về kết quả idempotent; Không tạo bản ghi trùng lặp. |
| `TC-AUTH-21` | Lock/Unlock | System Admin Khóa tài khoản người dùng | Gọi API Khóa tài khoản đang `ACTIVE` | HTTP `200 OK`; `users.status = LOCKED`; Thu hồi session; Ghi Activity Log. |
| `TC-AUTH-22` | Lock/Unlock | Người dùng không phải Admin cố gắng gọi API Khóa | Phiên xác thực mang Role EMPLOYER hoặc STUDENT | HTTP `403 Forbidden`; Hành động bị chặn hoàn toàn. |
| `TC-AUTH-23` | Brute-force | Nhập sai mật khẩu khởi tạo nhiều lần liên tiếp | Sai mật khẩu quá 5 lần trong 1 phút trên cùng email | HTTP `429 Too Many Requests` sau ngưỡng; tạm khóa thử lại 15 phút; không tiết lộ mật khẩu đúng hay sai. |
| `TC-AUTH-24` | Provision | Client gửi thêm cột `role` hoặc `must_change_password = false` trong file import | File có cột ngoài danh sách cho phép | Cột thừa bị loại bỏ; Role `STUDENT` và `must_change_password = TRUE` vẫn được gán cố định. |
| `TC-AUTH-25` | First-login | Sinh viên đã đổi mật khẩu cố đăng nhập lại bằng mật khẩu khởi tạo | Tài khoản đã kích hoạt; mật khẩu khởi tạo cũ | HTTP `401 Unauthorized`; Không tạo phiên. |

---

## 14. MA TRẬN TRUY VẾT YÊU CẦU (TRACEABILITY MATRIX)

| Mã FR | Quy tắc BR | Use Case | Bảng CSDL / Ràng buộc chính | Endpoint API tương ứng | Test Case kiểm chứng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FR-AUTH-01`** | `BR-AUTH-01`, `BR-AUTH-02`, `BR-AUTH-03`, `BR-AUTH-11`, `BR-AUTH-15` | UC03, UC04 | `users` (`email UNIQUE`, `status`, `password_hash`, `must_change_password`) | `POST /auth/login`, `POST /auth/logout` | `TC-AUTH-01` … `TC-AUTH-06`, `TC-AUTH-13`, `TC-AUTH-23` |
| **`FR-AUTH-02`** | `BR-AUTH-02`, `BR-AUTH-11`, `BR-AUTH-15` | UC05, UC06 | `users` (`password_hash`, `must_change_password`, `updated_at`), `activity_logs` | `PATCH /auth/password`, `GET /users/me` | `TC-AUTH-07`, `TC-AUTH-08`, `TC-AUTH-14`, `TC-AUTH-15` |
| **`FR-AUTH-03`** | `BR-AUTH-01`, `BR-AUTH-07`, `BR-AUTH-08`, `BR-AUTH-09`, `BR-AUTH-12`, `BR-AUTH-13`, `BR-AUTH-14`, `BR-AUTH-16` | UC01 (đã thay đổi: Provisioning & First-login) | `users`, `student_masters` (`student_code`, `institutional_email`, `citizen_id`, `user_id` UNIQUE), `students`, `user_roles` | `POST /admin/students/import`, `GET /admin/students/import/:jobId` | `TC-AUTH-09` … `TC-AUTH-12`, `TC-AUTH-24`, `TC-AUTH-25` |
| **`FR-AUTH-04`** | `BR-AUTH-01`, `BR-AUTH-09`, `BR-AUTH-10`, `BR-AUTH-12` | UC02 | `users`, `companies` (`verification_status = 'PENDING'`), `company_contacts` | `POST /auth/company/register` | `TC-AUTH-16`, `TC-AUTH-17` |
| **`FR-AUTH-05`** | `BR-AUTH-04`, `BR-AUTH-05`, `BR-AUTH-06`, `BR-AUTH-09` | UC43 | `roles` (`code UNIQUE`), `permissions` (`code UNIQUE`), `user_roles`, `role_permissions` | `/roles`, `/permissions`, `/roles/:id/permissions`, `/users/:id/roles` | `TC-AUTH-18`, `TC-AUTH-19`, `TC-AUTH-20` |
| **`FR-AUTH-06`** | `BR-AUTH-03`, `BR-AUTH-06`, `BR-AUTH-16` | UC44, UC45 | `users` (`status`), `activity_logs` | `PATCH /users/:id/status`, `POST /users/:id/password-reset` | `TC-AUTH-21`, `TC-AUTH-22` |

---

## 15. PHỤ THUỘC VÀ TÍCH HỢP LIÊN MODULE (MODULE DEPENDENCIES)

```text
                                  +---------------------------------------+
                                  |   MODULE 01: AUTHENTICATION & RBAC    |
                                  +-------------------+-------------------+
                                                      │
                    +---------------------------------+---------------------------------+
                    │ Cung cấp Identity & Role Context                                  │
                    ▼                                 ▼                                 ▼
+---------------------------------------+   +-----------------------------------+   +-----------------------------------+
|     MODULE 02: STUDENT PROFILE        |   |    MODULE 04/05: COMPANY CRM      |   |    MODULE 06: JOB MANAGEMENT      |
+---------------------------------------+   +-----------------------------------+   +-----------------------------------+
| - Module 02 sở hữu bảng students      |   | - Nhận User đại diện đăng ký      |   | - Kiểm tra Role 'EMPLOYER'        |
| - Tạo hồ sơ students khi provisioning |   | - Kiểm tra Role 'EMPLOYER'        |   | - Kiểm tra verification_status    |
| - Quản lý hồ sơ, GPA, Major, CV       |   | - Quản lý Contact theo User       |   | - Kiểm tra quyền sở hữu Job       |
+---------------------------------------+   +-----------------------------------+   +-----------------------------------+
                    │                                         │                                         │
                    +--------------------+                    │                    +--------------------+
                                         │                    │                    │
                                         ▼                    ▼                    ▼
                                  +-----------------------------------------------+
                                  |       MODULE 08 & 09: APPLICATION PIPELINE    |
                                  +-----------------------------------------------+
                                  | - Xác thực ứng viên nộp đơn (Student)         |
                                  | - Xác thực nhà tuyển dụng xét duyệt đơn       |
                                  | - Kiểm tra quyền chuyển trạng thái hồ sơ      |
                                  +-----------------------------------------------+
```

* **Module 01 là Module Nền móng (Core Provider):** Cung cấp định danh và ngữ cảnh phân quyền (`currentUser.id`, `currentUser.roles`, `currentUser.permissions`, `currentUser.mustChangePassword`) cho tất cả các domain nghiệp vụ.
* **Giao tiếp qua Service Interfaces (Loose Coupling):** Các module khác gọi `AuthModule` thông qua Public Service Interfaces hoặc bộ giải mã ngữ cảnh phiên làm việc được cung cấp. Không module nào được phép tự viết query chọc thẳng vào bảng `users` để chỉnh sửa mật khẩu hay trạng thái tài khoản. Ngược lại, `AuthModule` không trực tiếp thao tác các bảng nghiệp vụ nội bộ của `StudentModule` hay `CompanyModule`.
* **Module 02 và tiến trình import:** Tiến trình provisioning gọi Public Service Interface của Module 02 để tạo hồ sơ `students` trong cùng transaction với việc tạo `users`.

---

## 16. TIÊU CHÍ HOÀN THÀNH NGHIỆM THU (DEFINITION OF DONE - DOD)

Module 01 được xem là hoàn thành nghiệm thu MVP khi đáp ứng toàn bộ các tiêu chí:
- [ ] Tính năng Đăng nhập (Login) và Đăng xuất (Logout) hoạt động ổn định và chính xác.
- [ ] Mật khẩu người dùng được lưu trữ an toàn dưới dạng hash, không lộ plaintext dưới bất kỳ hình thức nào, kể cả mật khẩu khởi tạo.
- [ ] Trạng thái tài khoản `ACTIVE / LOCKED / INACTIVE` được thẩm định và enforce chặt chẽ tại Backend.
- [ ] Luồng cấp tài khoản Sinh viên qua provisioning từ file Student Master hoạt động chính xác, idempotent, và xử lý an toàn trường hợp trùng lặp, thiếu định danh, cạnh tranh giữa các tiến trình import.
- [ ] Mọi tài khoản sinh viên được cấp đều có `must_change_password = TRUE`; phiên hạn chế không truy cập được tài nguyên nghiệp vụ nào (đã kiểm thử tự động cho từng endpoint).
- [ ] Luồng đổi mật khẩu lần đầu hạ cờ nguyên tử và chặn được đổi mật khẩu đồng thời.
- [ ] Không còn endpoint hay giao diện tự đăng ký tài khoản sinh viên.
- [ ] Luồng đăng ký Doanh nghiệp tạo tài khoản User và Company ở trạng thái `verification_status = 'PENDING'`; doanh nghiệp chưa duyệt bị chặn quyền tuyển dụng.
- [ ] Role và Permission được mô hình hóa bằng RBAC đầy đủ qua 2 bảng junction.
- [ ] Quan hệ User–Role và Role–Permission được quản lý đúng quan hệ $N:N$, Composite Primary Key ngăn ngừa trùng lặp dữ liệu.
- [ ] Backend Guards enforce toàn bộ Authentication, Authorization và cung cấp context định danh cho Ownership Policy.
- [ ] System Admin có thể Khóa, Mở khóa, Vô hiệu hóa tài khoản và đặt lại mật khẩu thủ công thành công.
- [ ] Các hành động quản trị quan trọng được ghi nhận đầy đủ vào `activity_logs`, không chứa thông tin nhạy cảm.
- [ ] Tất cả 25 Acceptance Test Cases được định nghĩa trong ma trận đã được thực thi và đạt kết quả mong đợi trước khi nghiệm thu.
- [ ] Không có chức năng ngoài scope MVP (OTP SMS, Email Verification link, SSO) được đưa vào baseline nghiệm thu.

---

## 17. CÁC QUYẾT ĐỊNH KỸ THUẬT VÀ VẤN ĐỀ CẦN XÁC NHẬN (PENDING DECISIONS)

1. **Cơ chế Triển khai Phiên làm việc (Session vs JWT):**
   * *Hiện trạng:* Technical Architecture quy định: "Chọn một trong hai: JWT hoặc Session. Không sử dụng cả hai độc lập".
   * *Đề xuất kỹ thuật (Proposed):* Sử dụng Stateless JWT (Access Token ngắn hạn + Refresh Token lưu HttpOnly Cookie) kết hợp kiểm tra `users.status` và `must_change_password` trong Backend Guard.
   * *Trạng thái:* **PENDING CONFIRMATION** (Chờ Tech Lead / Kiến trúc sư phần mềm phê duyệt phương án chính thức trước khi cố định mã nguồn).
2. **Quy định cấp tài khoản đối với Tập trạng thái Sinh viên (`student_status` Eligibility):**
   * *Hiện trạng:* Enum `student_status` trong schema gồm `ACTIVE`, `GRADUATED`, `SUSPENDED`.
   * *Vấn đề mở:* Sinh viên `GRADUATED` có được cấp tài khoản để tìm việc hay không? Trạng thái `SUSPENDED` có bị cấm hoàn toàn trong mọi trường hợp hay không?
   * *Đề xuất nghiệp vụ (Proposed):* Trong giai đoạn MVP, chỉ cấp tài khoản cho sinh viên `ACTIVE`; sinh viên `GRADUATED` tham gia mạng lưới cựu sinh viên cần được kích hoạt theo quy chế riêng.
   * *Trạng thái:* **PENDING CONFIRMATION** (Chờ Hội đồng / Trưởng bộ phận nghiệp vụ xác nhận).
3. **Rủi ro lộ thông tin khởi tạo trước khi sinh viên nhận được:**
   * *Hiện trạng:* Mô hình cấp sẵn không còn rủi ro tự đăng ký bằng MSSV, nhưng mật khẩu khởi tạo có thể bị lộ trong quá trình phát thông tin đăng nhập.
   * *Đề xuất vận hành (Proposed):* Kênh phát thông tin đăng nhập do Nhà trường quản lý; ghi nhận và cảnh báo khi có đăng nhập thành công lần đầu; Admin/Career Center có thể đặt lại mật khẩu tạm và khóa tài khoản khi có khiếu nại.
   * *Trạng thái:* **PENDING CONFIRMATION** (liên quan trực tiếp đến PD-01 và PD-02).
4. **Chuẩn Độ phức tạp Mật khẩu:**
   * *Hiện trạng:* Technical Architecture yêu cầu băm mật khẩu an toàn nhưng chưa cố định bộ Regex độ phức tạp mật khẩu.
   * *Đề xuất kỹ thuật (Proposed):* Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
   * *Trạng thái:* **PENDING CONFIRMATION**.
5. **PD-01 — Dùng số CCCD/CMND làm mật khẩu khởi tạo:**
   * *Hiện trạng:* Trường chưa xác nhận có cung cấp CCCD/CMND cho từng sinh viên hay không.
   * *Rủi ro:* CCCD là định danh nhạy cảm; lưu dạng rõ làm tăng rủi ro lộ lọt; nếu CCCD bị lộ thì mật khẩu khởi tạo cũng bị lộ.
   * *Đề xuất (Proposed):* Ưu tiên phương án (b): thay bằng mã kích hoạt ngẫu nhiên 8–10 ký tự, phát cho từng sinh viên qua kênh riêng. Nếu vẫn dùng CCCD: mã hóa `citizen_id` ở tầng ứng dụng (AES-GCM) hoặc chỉ lưu băm; không hiển thị đầy đủ trong báo cáo.
   * *Trạng thái:* **CHỜ QUYẾT ĐỊNH**.
6. **PD-02 — Dùng ngày sinh DDMMYYYY làm mật khẩu khởi tạo dự phòng:**
   * *Rủi ro:* Không gian khóa nhỏ (khoảng 3.650 khả năng mỗi năm sinh), dễ đoán nếu biết năm sinh hoặc MSSV.
   * *Đề xuất (Proposed):* Chỉ chấp nhận khi kết hợp rate limit (SEC-AUTH-07), bắt buộc đổi mật khẩu lần đầu và thời hạn kích hoạt (ví dụ 7–14 ngày), sau đó Admin phải đặt lại mật khẩu tạm.
   * *Trạng thái:* **CHỜ QUYẾT ĐỊNH**.
7. **PD-03 — Định danh đăng nhập:**
   * *Vấn đề:* Dùng `institutional_email` hay `student_code` (MSSV)? MSSV gần như công khai trong lớp nên không nên là định danh đăng nhập duy nhất.
   * *Đề xuất (Proposed):* Dùng email định danh trường làm username. Nếu muốn dùng MSSV, cần thêm cột `users.username` UNIQUE.
   * *Trạng thái:* **CHỜ QUYẾT ĐỊNH**.
8. **PD-04 — Dòng import thiếu cả CCCD lẫn ngày sinh:**
   * *Đề xuất (Proposed):* Từ chối dòng và đưa vào báo cáo import để Trường bổ sung dữ liệu; hoặc sinh mã kích hoạt ngẫu nhiên phát ra ngoài (phối hợp PD-01 phương án b).
   * *Trạng thái:* **CHỜ QUYẾT ĐỊNH**.
9. **PD-05 — Xác nhận tên cột cờ bắt buộc đổi mật khẩu:**
   * *Vấn đề:* Đề xuất ban đầu ghi là `ust_change_password` (khả năng là lỗi gõ). Tài liệu này và DB spec v1.2.0 dùng `must_change_password`.
   * *Trạng thái:* **CẦN XÁC NHẬN**.

---

## 18. BÁO CÁO THAY ĐỔI VÀ ĐÁNH GIÁ TÍNH NHẤT QUÁN (AUDIT REPORT)

### 18.1. Các thay đổi trong phiên bản 1.2.0
1. **Bỏ luồng tự đăng ký sinh viên:** Loại bỏ endpoint `POST /auth/student/register`, các mã lỗi E-REG-STU-01..06, các test case TC-AUTH-09..15 phiên bản cũ và BR-AUTH-07, BR-AUTH-09 phiên bản cũ. Thay thế bằng provisioning (FR-AUTH-03, Luồng A) và kích hoạt lần đầu (Luồng B).
2. **Mật khẩu khởi tạo riêng từng sinh viên và bắt buộc đổi lần đầu:** Thêm cờ `users.must_change_password`, quy định phiên hạn chế (E-AUTH-05, E-FL-03, SEC-AUTH-10), điều kiện hạ cờ trong cùng câu lệnh (mục 9.2) và đổi mật khẩu bắt buộc trong FR-AUTH-02 (6.2.2).
3. **Bổ sung dữ liệu nguồn:** `student_masters.citizen_id` và `student_masters.date_of_birth` được ghi nhận là dữ liệu tùy chọn, có quy tắc sinh mật khẩu theo hướng dự phòng; phụ thuộc vào xác nhận của Trường (PD-01, PD-02).
4. **Bổ sung bảo vệ dữ liệu định danh:** SEC-AUTH-09 và BR-AUTH-11 mở rộng cho `citizen_id` và `date_of_birth`; báo cáo import chỉ hiển thị dạng che.
5. **Bổ sung kiểm thử:** Rate limit cho đăng nhập lần đầu (TC-AUTH-23), chống loại trừ cột thừa trong file import (TC-AUTH-24), và sinh viên đã kích hoạt không dùng lại được mật khẩu khởi tạo (TC-AUTH-25).
6. **Phân định rõ các quyết định mở:** Tách PD-01 đến PD-05 (và mục 2 về tập trạng thái sinh viên) để tách biệt khỏi yêu cầu đã thống nhất. Mã PD-01 đến PD-05 trùng nghĩa với PD-01 đến PD-05 trong Database Architecture Specification v1.2.0.
7. **Tài liệu liên quan chưa đồng bộ:** Tài liệu nghiệp vụ (mục 8, 10, 11, 33, 36) và Database Architecture Specification vẫn ở v1.1.0 cho đến khi được cập nhật; cần đồng bộ trước khi phê duyệt.

### 18.2. Kết luận
Tài liệu SRS Module 01 phiên bản `1.2.0` thay đổi mô hình cấp tài khoản sinh viên từ tự đăng ký sang cấp sẵn qua provisioning, kèm mật khẩu khởi tạo riêng và bắt buộc đổi mật khẩu lần đầu được server enforce. Các quyết định về CCCD/CMND làm mật khẩu, ngày sinh dự phòng, định danh đăng nhập và xử lý dòng thiếu định danh vẫn ở trạng thái chờ xác nhận (PD-01 đến PD-04). Tài liệu sẵn sàng để trình Hội đồng thẩm định sau khi các quyết định này được chốt và tài liệu nghiệp vụ được cập nhật đồng bộ.
