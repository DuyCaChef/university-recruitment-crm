# HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC AN GIANG

<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NestJS-Dark.svg" width="45" height="45" alt="NestJS" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="45" height="45" alt="React" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="45" height="45" alt="TypeScript" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/PostgreSQL-Dark.svg" width="45" height="45" alt="PostgreSQL" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Prisma.svg" width="45" height="45" alt="Prisma" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" width="45" height="45" alt="Vite" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="45" height="45" alt="TailwindCSS" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Docker.svg" width="45" height="45" alt="Docker" />
</p>

<p align="center">
  <strong>ĐỒ ÁN KHÓA LUẬN TỐT NGHIỆP ĐẠI HỌC — NGÀNH CÔNG NGHỆ THÔNG TIN</strong><br>
  <em>Đơn vị phối hợp & triển khai thực nghiệm:</em> <strong>Trung tâm Hướng nghiệp & Hỗ trợ Sinh viên — Trường Đại học An Giang (ĐHQG-HCM)</strong>
</p>

<p align="center">
  <a href="#-giới-thiệu-tổng-quan--bài-toán-nghiệp-vụ"><img src="https://img.shields.io/badge/Status-Implementation--Ready-success?style=for-the-badge&logo=git" alt="Status"></a>
  <a href="#-kiến-trúc--công-nghệ-tech-stack-rationale"><img src="https://img.shields.io/badge/Architecture-Modular%20Monolith-blueviolet?style=for-the-badge&logo=buffer" alt="Architecture"></a>
  <a href="#-cấu-trúc-monorepo-chi-tiết"><img src="https://img.shields.io/badge/Repository-Monorepo-informational?style=for-the-badge&logo=monero" alt="Monorepo"></a>
  <a href="#-bảo-mật--quản-lý-biến-môi-trường"><img src="https://img.shields.io/badge/Security-RBAC%20%2B%20Audit%20Log-critical?style=for-the-badge&logo=auth0" alt="Security"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.x-339933?style=for-the-badge&logo=nodedotjs" alt="Node Version"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16.x-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL"></a>
</p>

---

## 📑 MỤC LỤC HỆ THỐNG

1. [Giới thiệu Tổng quan & Bài toán Nghiệp vụ](#1-giới-thiệu-tổng-quan--bài-toán-nghiệp-vụ)
2. [Các Tác nhân Hệ thống (4 Actors)](#2-các-tác-nhân-hệ-thống-4-actors)
3. [Kiến trúc & Công nghệ (Tech Stack Rationale)](#3-kiến-trúc--công-nghệ-tech-stack-rationale)
4. [Cấu trúc Monorepo Chi tiết (Source Code Structure)](#4-cấu-trúc-monorepo-chi-tiết-source-code-structure)
5. [Yêu cầu Môi trường & Cài đặt (Prerequisites)](#5-yêu-cầu-môi-trường--cài-đặt-prerequisites)
6. [Hướng dẫn Thiết lập Môi trường Phát triển (Quick Start)](#6-hướng-dẫn-thiết-lập-môi-trường-phát-triển-quick-start)
7. [Quy chuẩn Phát triển & Đóng góp Mã nguồn (Git Flow)](#7-quy-chuẩn-phát-triển--đóng-góp-mã-nguồn-git-flow)
8. [Bảo mật & Quản lý Biến môi trường](#8-bảo-mật--quản-lý-biến-môi-trường)
9. [Tài liệu Nghiệp vụ & Kỹ thuật Liên quan](#9-tài-liệu-nghiệp-vụ--kỹ-thuật-liên-quan)
10. [Hướng dẫn Cài đặt & Khởi chạy Toàn diện (Development Setup)](#10-hướng-dẫn-cài-đặt--khởi-chạy-môi-trường-phát-triển-development-setup)

---

## 1. Giới thiệu Tổng quan & Bài toán Nghiệp vụ

### 1.1. Bối cảnh Thực tiễn
Tại các cơ sở giáo dục đại học, đặc biệt là **Trường Đại học An Giang (ĐHQG-HCM)**, hoạt động kết nối sinh viên với thị trường lao động và quản lý quan hệ doanh nghiệp đóng vai trò quyết định đến tỷ lệ việc làm của sinh viên tốt nghiệp. Tuy nhiên, thực trạng vận hành hiện nay đang bộc lộ nhiều điểm nghẽn nghiêm trọng:
* **Dữ liệu phân mảnh:** Cơ hội việc làm, hồ sơ doanh nghiệp và CV sinh viên bị phân tán qua nhiều kênh không đồng nhất (Email cá nhân, mạng xã hội, Google Forms, bảng tính Excel và văn bản giấy).
* **Đứt gãy chăm sóc đối tác (CRM Deficit):** Khi nhân sự Trung tâm Hướng nghiệp & Hỗ trợ Sinh viên (Career Center) biến động, toàn bộ lịch sử tương tác, đầu mối liên hệ (Primary Contacts) và cam kết hợp tác với doanh nghiệp dễ bị gián đoạn hoặc thất lạc.
* **Quy trình tuyển dụng thiếu minh bạch:** Sinh viên khó tiếp cận nguồn tin tuyển dụng đã được thẩm định tính xác thực; doanh nghiệp thiếu công cụ điều phối hồ sơ ứng viên theo chuyên ngành đào tạo; việc theo dõi trạng thái ứng tuyển và kết quả phỏng vấn không có tính phản hồi kịp thời.
* **Thiếu hụt dữ liệu phân tích:** Nhà trường thiếu hệ số định lượng chính xác để đánh giá mức độ gắn kết của đối tác, phễu chuyển đổi tuyển dụng và nhu cầu tuyển dụng thực tế theo khối ngành đào tạo.

### 1.2. Định vị Sản phẩm
Hệ thống được định vị chuẩn xác là **University Recruitment CRM** (Hệ thống CRM Quản lý Quan hệ Doanh nghiệp & Quy trình Tuyển dụng Đặc thù cho Trường Đại học):
* **Không phải là một Job Portal tự do đại trà** (như TopCV, VietnamWorks, CareerViet) với cơ chế đăng tin thương mại không kiểm soát.
* **Không phải là mạng xã hội nghề nghiệp mở rộng** (như LinkedIn) với các kết nối đa chiều phi cấu trúc.
* **Trọng tâm cốt lõi:** Quản trị quan hệ đối tác bền vững (Company & Contact CRM, Interactions, Follow-up Tasks, Màn hình tổng hợp Company 360°), chuẩn hóa quy trình thẩm định tin tuyển dụng và điều phối ứng viên khép kín gắn liền với dữ liệu đào tạo chính quy của nhà trường.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      TRƯỜNG ĐẠI HỌC AN GIANG (AGU)                     │
 │          TRUNG TÂM HƯỚNG NGHIỆP & HỖ TRỢ SINH VIÊN (CAREER CENTER)     │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────┐                           ┌──────────────────────┐
│     SINH VIÊN        │  ◄── Ứng tuyển & Lịch PV ── │     DOANH NGHIỆP     │
│   (STUDENT TALENT)   │  ── Pipeline & Kết quả ──► │ (STRATEGIC EMPLOYER) │
└──────────────────────┘                           └──────────────────────┘
```

---

## 2. Các Tác nhân Hệ thống (4 Actors)

Hệ thống được phân quyền nghiêm ngặt với 4 tác nhân nghiệp vụ riêng biệt, đảm bảo nguyên tắc phân chia trách nhiệm (Separation of Concerns) và bảo mật dữ liệu:

| Tác nhân (Actor) | Biểu tượng | Phạm vi Nghiệp vụ & Trách nhiệm Cốt lõi |
| :--- | :---: | :--- |
| **Sinh viên**<br>*(Student)* | 🎓 | <ul><li>Đăng ký & xác thực tài khoản dựa trên đối soát dữ liệu gốc sinh viên (**Student Master Data**).</li><li>Quản lý hồ sơ năng lực số (**Career Profile**), kỹ năng, dự án, chứng chỉ và đa bản CV tải lên.</li><li>Tìm kiếm, đánh dấu (bookmark) việc làm đã qua thẩm định từ nhà trường.</li><li>Nộp đơn ứng tuyển với cơ chế **Đóng băng CV Snapshot bất biến (SHA-256)**, rút đơn và theo dõi tiến trình xét tuyển theo thời gian thực.</li><li>Tiếp nhận thư mời và xác nhận tham gia lịch phỏng vấn.</li></ul> |
| **Doanh nghiệp**<br>*(Employer / Recruiter)* | 🏢 | <ul><li>Tự đăng ký tài khoản đại diện, nộp hồ sơ thẩm định pháp nhân (Giấy phép kinh doanh, Mã số thuế).</li><li>Quản lý hồ sơ công ty và mạng lưới danh bạ người liên hệ phụ trách tuyển dụng (**Company Contacts**).</li><li>Đăng tin tuyển dụng theo biểu mẫu chuẩn hóa; quản lý đóng/mở vòng đời tuyển dụng.</li><li>Sàng lọc và điều phối ứng viên trên bảng kéo thả **Kanban Recruitment Pipeline** (Applied → Reviewing → Shortlisted → Interview → Offer → Hired/Rejected).</li><li>Thiết lập lịch phỏng vấn (Online/Offline) và ghi nhận biên bản đánh giá ứng viên.</li></ul> |
| **Cán bộ trường**<br>*(Career Center Officer)* | 🏛️ | <ul><li>Thẩm định tính hợp pháp của doanh nghiệp; phê duyệt hoặc từ chối tin tuyển dụng.</li><li>Quản trị quan hệ đối tác CRM: Thiết lập trạng thái hợp tác (`relationship_status`), ghi nhật ký tương tác (**Interactions**), phân bổ nhiệm vụ chăm sóc (**Follow-up Tasks**).</li><li>Giám sát toàn diện thông tin đối tác qua màn hình điều hành tổng hợp **Company 360°**.</li><li>Tổ chức và điều phối sự kiện hướng nghiệp, ngày hội việc làm (**Career Events / Job Fair**).</li><li>Khai thác bảng điều khiển KPI, báo cáo thống kê tỷ lệ tuyển dụng và mức độ gắn kết đối tác.</li></ul> |
| **Quản trị viên**<br>*(System Admin)* | ⚙️ | <ul><li>Quản trị kỹ thuật nền tảng: Quản lý danh mục người dùng, phân bổ vai trò và quyền hạn (**RBAC Matrix**).</li><li>Khóa, mở khóa tài khoản và thiết lập cấu hình tham số hệ thống.</li><li>Tra cứu nhật ký kiểm toán (**System Audit Log**) nhằm phát hiện bất thường và đảm bảo tính toàn vẹn hệ thống.</li><li>*Lưu ý:* Tuyệt đối không can thiệp vào ghi chú nội bộ CRM hoặc quy trình tuyển dụng của doanh nghiệp.</li></ul> |

---

## 3. Kiến trúc & Công nghệ (Tech Stack Rationale)

### 3.1. Mô hình Kiến trúc: Modular Monolith
Dự án được xây dựng theo mô hình **Modular Monolith** kết hợp tổ chức mã nguồn dạng **Monorepo**. Đây là quyết định kiến trúc chiến lược dựa trên các phân tích khoa học:
1. **Ranh giới Miền Nghiệp vụ Rõ ràng (Clear Bounded Contexts):** Các module nghiệp vụ (`Auth`, `Student`, `Company`, `Job`, `Application`, `Recruitment`, `CRM`, `Interview`, `AuditLog`...) được đóng gói độc lập theo phân tầng (Presentation - Application - Domain - Infrastructure). Các module giao tiếp qua Service Interface công khai, cấm truy vấn Database chéo bảng của module khác.
2. **Loại bỏ Overhead của Microservices:** Không gặp phải độ trễ mạng (Network Latency), bài toán phân tán giao dịch (Distributed Transactions / 2PC), phức tạp trong truy vết lỗi (Distributed Tracing) và chi phí hạ tầng DevOps đắt đỏ không phù hợp với chu kỳ thực nghiệm khóa luận 4 tháng.
3. **Khả năng mở rộng bền vững (Evolutionary Path):** Thiết kế modular cho phép tách rời bất kỳ module nào (như `Notification` hoặc `Recruitment`) thành Microservice độc lập trong tương lai mà không phải tái cấu trúc toàn bộ mã nguồn.

### 3.2. Bảng Tổng hợp Công nghệ Cốt lõi

| Tầng Hệ thống | Công nghệ / Thư viện | Phiên bản | Vai trò & Lý do Lựa chọn (Rationale) |
| :--- | :--- | :---: | :--- |
| **Cơ chế Mã nguồn** | **Monorepo** | Standard | Quản lý đồng nhất Backend, Frontend, Docs và Docker Infrastructure trên cùng một kho lưu trữ, đồng bộ Type-safety và Git Workflow. |
| **Backend Core** | **Node.js & NestJS** | 20 LTS / 10.x | Khung làm việc Backend cấp doanh nghiệp (Enterprise-grade) với TypeScript thuần nhất, hỗ trợ cơ chế Dependency Injection (DI), Module Decorators và Clean Architecture. |
| **ORM / Data Access** | **Prisma ORM** | 5.x | ORM thế hệ mới với Type-safe tuyệt đối từ Database Schema đến Controller, tự động tạo Migration, hỗ trợ quan hệ bảng phức tạp và ngăn chặn SQL Injection. |
| **Database** | **PostgreSQL** | 16 Alpine | Hệ quản trị CSDL quan hệ chuẩn mực, hỗ trợ giao dịch ACID nghiêm ngặt, chỉ mục nâng cao (B-Tree, GIN), khóa ngoại toàn vẹn và trường JSONB linh hoạt. |
| **Object Storage** | **MinIO (S3-Compatible)** | Latest | Hệ thống lưu trữ đối tượng chuẩn S3 tương thích cao, lưu trữ an toàn các tệp CV định dạng PDF, tài liệu pháp lý và Logo doanh nghiệp. |
| **Frontend Core** | **React + Vite** | 18.x / 5.x | Thư viện giao diện chuẩn công nghiệp kết hợp công cụ Build tốc độ cao (ESBuild/Rollup), hỗ trợ Hot Module Replacement (HMR) tức thì. |
| **Ngôn ngữ Lập trình** | **TypeScript** | 5.x | Đảm bảo tính nhất quán kiểu dữ liệu tĩnh (Static Typing) từ Backend Contract tới Frontend Client, triệt tiêu lỗi Runtime. |
| **State & API Cache** | **TanStack Query (v5)** | 5.x | Quản lý Server State, cơ chế Cache thông minh, tự động Refetch, Quản lý trạng thái Mutate và xử lý phân trang/bảng Kanban tối ưu. |
| **Styling Framework** | **Tailwind CSS** | 3.4.x | Utility-first CSS framework giúp xây dựng giao diện hiện đại, tính nhất quán Design Token cao, hiệu năng Render mượt mà, tối ưu kích thước Bundle CSS. |
| **Biểu tượng (Icons)** | **Lucide React** | Latest | Bộ biểu tượng SVG hiện đại, tinh gọn, thẩm mỹ cao và chuẩn hóa kích thước giao diện. |
| **Xác thực & Bảo mật** | **JWT & Argon2 / BCrypt** | - | Xác thực phi trạng thái (Stateless Authentication) qua JWT, băm mật khẩu bảo mật cao, kiểm soát truy cập RBAC và Data Ownership tại tầng Guards. |
| **API Documentation** | **Swagger / OpenAPI 3.0** | - | Tự động sinh tài liệu API tương tác trực tiếp (`/api/docs`), đồng bộ chuẩn hóa Data Transfer Objects (DTO) và Response Contracts. |
| **Đóng gói Môi trường** | **Docker & Docker Compose** | v2+ | Đóng gói môi trường đồng nhất giữa các máy lập trình, khởi tạo tức thì cụm dịch vụ PostgreSQL 16 và MinIO chỉ với một câu lệnh. |

---

## 4. Cấu trúc Monorepo Chi tiết (Source Code Structure)

Dự án được tổ chức theo chuẩn Monorepo với cấu trúc phân cấp chặt chẽ, thể hiện rõ trách nhiệm của từng thư mục và tệp mã nguồn:

```text
university-recruitment-crm/
├── .env.example                                      # Tệp mẫu khai báo biến môi trường chuẩn cho toàn bộ hệ thống
├── .gitignore                                        # Quy tắc loại trừ tệp nhạy cảm, dependencies, build artifacts và cache
├── README.md                                         # Bản đồ kiến trúc, tài liệu tổng quan và hướng dẫn vận hành dự án
│
├── infrastructure/                                   # HẠ TẦNG DEVOPS & CONTAINER HÓA CỤM DỊCH VỤ DÙNG CHUNG
│   ├── docker-compose.yml                            # Kịch bản khởi chạy multi-container môi trường Dev (PostgreSQL 16 & MinIO)
│   └── docker/                                       # Tài nguyên và scripts cấu hình chi tiết cho từng container
│       ├── postgres/                                 # Cấu hình hệ quản trị cơ sở dữ liệu PostgreSQL
│       │   ├── init.sql                              # Kịch bản SQL kích hoạt extensions (uuid-ossp, pg_trgm) khi init DB
│       │   └── postgresql.conf                       # Tham số tối ưu hóa hiệu năng và kết nối cho PostgreSQL 16
│       ├── minio/                                    # Cấu hình dịch vụ lưu trữ đối tượng MinIO S3-compatible
│       │   └── init-buckets.sh                       # Shell script tự động tạo bucket 'agu-crm-storage' và thiết lập Access Policy
│       ├── postgres_data/                            # Thư mục ánh xạ persistent volume cho PostgreSQL (bị git ignore)
│       └── minio_data/                               # Thư mục ánh xạ persistent volume cho MinIO (bị git ignore)
│
├── backend/                                          # PHÂN HỆ BACKEND — KIẾN TRÚC MODULAR MONOLITH (NESTJS + PRISMA)
│   ├── package.json                                  # Quản lý dependencies, scripts chạy dev, build, migrate và test của NestJS
│   ├── tsconfig.json                                 # Cấu hình TypeScript compiler, path aliases (@/...) cho Backend
│   ├── nest-cli.json                                 # Cấu hình công cụ dòng lệnh NestJS CLI và Swagger plugin
│   ├── .env.example                                  # Biến môi trường mẫu cục bộ dành riêng cho dịch vụ Backend
│   ├── prisma/                                       # TẦNG DỮ LIỆU & ÁNH XẠ CSDL QUAN HỆ (PRISMA ORM)
│   │   ├── schema.prisma                             # Định nghĩa toàn bộ Data Models (28 thực thể), Enums, Indexes và Relations
│   │   ├── migrations/                               # Lịch sử các bước di chuyển cấu trúc CSDL sinh ra bởi Prisma Migrate
│   │   └── seed.ts                                   # Script khởi tạo dữ liệu mẫu ban đầu (Admin, Career Center, Students, Partners)
│   ├── test/                                         # KIỂM THỬ HỆ THỐNG BACKEND
│   │   ├── app.e2e-spec.ts                           # Kịch bản kiểm thử End-to-End toàn diện các luồng nghiệp vụ API
│   │   └── jest-e2e.json                             # Cấu hình môi trường thực thi kiểm thử Jest cho E2E
│   └── src/                                          # MÃ NGUỒN CHÍNH THỨC CỦA BACKEND ỨNG DỤNG
│       ├── main.ts                                   # Điểm khởi động (Bootstrap): CORS, Global Pipes, Filters, Swagger Setup
│       ├── app.module.ts                             # Root Module liên kết toàn bộ module nghiệp vụ và hạ tầng dùng chung
│       │
│       ├── common/                                   # CÁC THÀNH PHẦN DÙNG CHUNG XUYÊN SUỐT BACKEND
│       │   ├── constants/                            # Định nghĩa hằng số hệ thống, roles, status enums và error codes
│       │   ├── decorators/                           # Custom Decorators: @CurrentUser(), @Roles(), @Public(), @AuditLog()
│       │   ├── filters/                              # Xử lý ngoại lệ tập trung: HttpExceptionFilter, PrismaClientExceptionFilter
│       │   ├── guards/                               # Lớp bảo vệ 3 tầng: JwtAuthGuard, RolesGuard (RBAC), OwnershipGuard
│       │   ├── interceptors/                         # Biến đổi dữ liệu: TransformInterceptor, LoggingInterceptor, AuditInterceptor
│       │   ├── interfaces/                           # Định nghĩa giao diện chung: RequestWithUser, PaginatedResult, ApiResponse
│       │   └── pipes/                                # Tiện ích validate dữ liệu: CustomValidationPipe, ParseUUIDPipe
│       │
│       ├── config/                                   # QUẢN TRỊ CẤU HÌNH BIẾN MÔI TRƯỜNG TẬP TRUNG
│       │   ├── configuration.ts                      # Đọc và chuẩn hóa cấu hình từ process.env vào Strongly-typed object
│       │   ├── database.config.ts                    # Tham số kết nối CSDL PostgreSQL và Connection Pooling
│       │   ├── minio.config.ts                       # Cấu hình kết nối MinIO Client (Endpoints, Port, Access/Secret Key)
│       │   └── jwt.config.ts                         # Cấu hình thời gian sống của Token và Secret Key
│       │
│       ├── infrastructure/                           # DỊCH VỤ LIÊN KẾT HẠ TẦNG VÀ LƯU TRỮ
│       │   ├── prisma/                               # Đóng gói Prisma Client dưới dạng NestJS Service và Module
│       │   │   ├── prisma.service.ts                 # Service mở rộng PrismaClient xử lý vòng đời kết nối (onModuleInit)
│       │   │   └── prisma.module.ts                  # Module Provider toàn cục cho Prisma Service
│       │   └── storage/                              # Đóng gói tương tác Object Storage MinIO / S3
│       │       ├── storage.service.ts                # Nghiệp vụ upload tệp, sinh Presigned URL an toàn và kiểm tra SHA-256
│       │       └── storage.module.ts                 # Module xuất bản StorageService cho các module nghiệp vụ sử dụng
│       │
│       └── modules/                                  # 11 PHÂN HỆ NGHIỆP VỤ CỐT LÕI (MODULAR DOMAIN CONTEXTS)
│           │                                         # Mỗi module tuân thủ Clean Layered Architecture:
│           │                                         # ├── controllers/ (Presentation: Nhận Request, trả Response, Swagger)
│           │                                         # ├── services/    (Application: Xử lý Business Logic, Transaction)
│           │                                         # ├── dto/         (Input/Output Data Transfer Objects + Class Validator)
│           │                                         # └── interfaces/  (Domain Types & Contracts)
│           ├── auth/                                 # Module 01: Xác thực JWT, đăng nhập, đổi mật khẩu, đối soát Master Data
│           ├── student/                              # Module 02: Quản lý hồ sơ sinh viên, kỹ năng, kinh nghiệm, CV đa phiên bản
│           ├── company/                              # Module 04: Đăng ký doanh nghiệp, hồ sơ công ty, danh bạ người liên hệ
│           ├── job/                                  # Module 06 & 07: Quản trị vòng đời tin tuyển dụng, duyệt tin, bookmark
│           ├── application/                          # Module 08: Nộp đơn, rút đơn, đóng băng CV Snapshot bất biến kèm SHA-256
│           ├── recruitment/                          # Module 09: Quản lý phễu tuyển dụng Kanban Pipeline, chuyển đổi trạng thái
│           ├── interview/                            # Module 10: Thiết lập lịch phỏng vấn, gửi lời mời, ghi nhận đánh giá
│           ├── crm/                                  # Module 05 & 11: CRM Quan hệ đối tác, Interactions, Follow-ups, Company 360°
│           ├── notification/                         # Module 12: Quản lý hệ thống thông báo In-app Notification cho 4 actors
│           ├── event/                                # Module 13: Quản lý sự kiện nghề nghiệp, Workshop, Job Fair và điểm danh
│           └── audit-log/                            # Module 15: Ghi vết kiểm toán hệ thống (Audit Trail) loại trừ dữ liệu nhạy cảm
│
├── frontend/                                         # PHÂN HỆ FRONTEND — SPA HIỆN ĐẠI (REACT 18 + VITE + TAILWIND CSS)
│   ├── package.json                                  # Quản lý dependencies UI: React, Vite, TanStack Query, Tailwind, Lucide
│   ├── tsconfig.json                                 # Cấu hình TypeScript compiler cho React JSX/TSX
│   ├── vite.config.ts                                # Cấu hình Vite bundler: Plugins, Aliases (@/*), Proxy Dev Server
│   ├── tailwind.config.js                            # Thiết lập Design System: Bảng màu AGU, Typography, Spacing, Breakpoints
│   ├── postcss.config.js                             # Cấu hình PostCSS nạp Tailwind CSS và Autoprefixer
│   ├── index.html                                    # Tệp HTML gốc nạp thẻ Meta SEO, Google Fonts và Root Element
│   ├── public/                                       # Tài nguyên tĩnh công khai không qua Bundler (Logo AGU, Favicon)
│   └── src/                                          # MÃ NGUỒN CHÍNH THỨC CỦA GIAO DIỆN CLIENT
│       ├── main.tsx                                  # Điểm gắn kết React DOM vào index.html, nạp CSS toàn cục
│       ├── app/                                      # CẤU TRÚC ĐIỀU HƯỚNG VÀ NHÀ CUNG CẤP NGỮ CẢNH TOÀN CỤC
│       │   ├── App.tsx                               # Thành phần gốc kết nối Layout và Router
│       │   ├── routes.tsx                            # Cấu hình định tuyến: Public, Role-Protected Routes (Guarded by Role)
│       │   └── provider.tsx                          # Tổng hợp Providers: QueryClientProvider, AuthProvider, ToastProvider
│       │
│       ├── components/                               # THÀNH PHẦN GIAO DIỆN TÁI SỬ DỤNG (REUSABLE UI COMPONENTS)
│       │   ├── ui/                                   # Các phần tử cơ bản: Button, Input, Modal, Badge, Dropdown, Table
│       │   ├── layout/                               # Khung bố cục chuẩn: Header, Sidebar, Navbar, Footer, DashboardLayout
│       │   └── feedback/                             # Trạng thái phản hồi: SkeletonLoader, EmptyState, ErrorBoundary, Alert
│       │
│       ├── features/                                 # CÁC TÍNH NĂNG NGHIỆP VỤ THEO PHÂN HỆ (FEATURE-SLICED DESIGN)
│       │   │                                         # Mỗi feature gồm: /components, /hooks, /services (API call), /types
│       │   ├── auth/                                 # Giao diện Đăng nhập, Đăng ký theo vai trò, Quên/Đổi mật khẩu
│       │   ├── students/                             # Màn hình quản lý Career Profile, danh mục kỹ năng, tải lên CV PDF
│       │   ├── companies/                            # Màn hình hồ sơ công ty, danh bạ liên hệ, gửi duyệt pháp nhân
│       │   ├── jobs/                                 # Danh sách việc làm, bộ lọc đa tiêu chí, chi tiết tin tuyển dụng
│       │   ├── applications/                         # Giao diện nộp đơn ứng tuyển, xem lại CV Snapshot, lịch sử xét duyệt
│       │   ├── recruitment/                          # Bảng điều phối Kanban kéo thả quản lý ứng viên theo từng Job
│       │   ├── interviews/                           # Lịch phỏng vấn trực quan, form đánh giá năng lực ứng viên
│       │   ├── crm/                                  # Màn hình làm việc Company 360°, nhật ký trao đổi, nhiệm vụ Follow-up
│       │   ├── notifications/                        # Trung tâm thông báo In-app, thông báo đẩy và chuông cảnh báo
│       │   └── reports/                              # Bảng điều khiển KPI điều hành của Career Center, biểu đồ thống kê
│       │
│       ├── services/                                 # TẦNG KẾT NỐI API VÀ XỬ LÝ TRUYỀN DẪN DỮ LIỆU
│       │   ├── api/                                  # Cấu hình Axios Client
│       │   │   ├── axiosClient.ts                    # Instance Axios: Tự động đính kèm JWT Bearer, xử lý Refresh/401
│       │   │   └── endpoints.ts                      # Tập trung toàn bộ hằng số đường dẫn API (REST Endpoints)
│       │   └── storage/                              # Helper tương tác tệp: Tải xuống CV Snapshot, xem trước PDF
│       │
│       ├── hooks/                                    # CUSTOM REACT HOOKS DÙNG CHUNG
│       │   ├── useAuth.ts                            # Hook truy cập phiên người dùng, kiểm tra phân quyền RBAC tức thì
│       │   ├── useDebounce.ts                        # Hook tối ưu hóa hiệu năng tìm kiếm thời gian thực
│       │   └── usePagination.ts                      # Hook đồng bộ phân trang dữ liệu với URL Search Params
│       │
│       ├── types/                                    # ĐỊNH NGHĨA KIỂU DỮ LIỆU TOÀN CỤC (GLOBAL TYPESCRIPT DEFINITIONS)
│       │   ├── user.types.ts                         # Kiểu dữ liệu thực thể User, Roles, Permissions
│       │   ├── student.types.ts                      # Kiểu dữ liệu Career Profile, Skill, Academic Info
│       │   ├── company.types.ts                      # Kiểu dữ liệu Company, Verification Status, Relationship Status
│       │   ├── job.types.ts                          # Kiểu dữ liệu Job Posting, Requirements, Job Status
│       │   ├── application.types.ts                  # Kiểu dữ liệu Application, Kanban Stages, Status Histories
│       │   └── crm.types.ts                          # Kiểu dữ liệu Interaction Log, Follow-up Task, Company 360 View
│       │
│       ├── utils/                                    # THƯ VIỆN HÀM TIỆN ÍCH TRỢ GIÚP
│       │   ├── formatters.ts                         # Định dạng ngày giờ chuẩn Việt Nam, tiền tệ VND, dung lượng tệp
│       │   └── validators.ts                         # Hàm kiểm tra định dạng email sinh viên (@agu.edu.vn), MST, SĐT
│       │
│       ├── constants/                                # DANH MỤC HẰNG SỐ TOÀN CỤC PHÍA CLIENT
│       │   ├── roles.ts                              # Khai báo các hằng số vai trò (STUDENT, EMPLOYER, CAREER_CENTER, ADMIN)
│       │   └── routes.ts                             # Khai báo cấu trúc đường dẫn điều hướng URL của hệ thống
│       │
│       └── styles/                                   # ĐỊNH KIỂU TOÀN CỤC VÀ DESIGN TOKENS
│           └── index.css                             # Nhập Tailwind Directives (@tailwind base, components, utilities)
│
└── docs/                                             # HỒ SƠ TÀI LIỆU KỸ THUẬT & NGHIỆP VỤ HOÀN CHỈNH CỦA KHÓA LUẬN
    ├── Scope_Project_WebCRM.md                       # Tài liệu đặc tả phạm vi dự án chính thức (Scope Specification v1.2)
    ├── Functional_Requirements_Web_CRM.md            # Tài liệu đặc tả chi tiết 15 module yêu cầu chức năng (FRS v1.1)
    ├── Tai_lieu_Luong_va_Nghiep-Vu.md                # Tài liệu chốt luồng nghiệp vụ end-to-end và 38 Use Cases (Flow v1.1)
    ├── DATABASE_ARCHITECTURE_SPECIFICATION.md        # Đặc tả chi tiết 28 thực thể cơ sở dữ liệu, quan hệ và từ điển dữ liệu
    ├── architecture/                                 # Tài liệu kiến trúc phần mềm, sơ đồ phân tầng Modular Monolith
    ├── database/                                     # Sơ đồ quan hệ thực thể (ERD Diagrams) định dạng SVG / PlantUML
    ├── api/                                          # Tài liệu kỹ thuật chi tiết RESTful API Contracts
    └── diagrams/                                     # Sơ đồ tuần tự (Sequence), luồng công việc (Activity) và Use Case
```

---

## 5. Yêu cầu Môi trường & Cài đặt (Prerequisites)

Trước khi tiến hành thiết lập dự án, môi trường máy trạm của lập trình viên cần đáp ứng tối thiểu các công cụ sau:

| Công cụ / Nền tảng | Phiên bản Khuyến nghị | Mục đích Sử dụng |
| :--- | :---: | :--- |
| **Node.js** | `>= 20.x LTS` (tối thiểu `18.x`) | Môi trường thực thi JavaScript/TypeScript cho Backend và Frontend. |
| **NPM** | `>= 9.x` | Trình quản lý gói thư viện đi kèm Node.js. |
| **Docker Engine** | `>= 24.x` | Nền tảng Container hóa quản lý môi trường độc lập. |
| **Docker Compose** | `>= 2.20.x` (Compose V2) | Công cụ điều phối cụm dịch vụ CSDL PostgreSQL 16 và MinIO Storage. |
| **Git** | `>= 2.40.x` | Hệ thống quản lý phiên bản phân tán. |
| **Trình duyệt Web** | Chrome / Edge / Firefox (Latest) | Trình duyệt hiện đại hỗ trợ ECMAScript 2022 và DevTools. |

> [!NOTE]
> Khuyến nghị cài đặt tiện ích mở rộng **Prisma** và **Tailwind CSS IntelliSense** trên VS Code để tối ưu hóa trải nghiệm lập trình.

---

## 6. Hướng dẫn Thiết lập Môi trường Phát triển (Quick Start)

Thực hiện lần lượt theo 3 bước tuần tự dưới đây để triển khai toàn bộ hệ thống từ mã nguồn:

### 🚀 Bước 1: Khởi động Hạ tầng Dịch vụ Docker (Database & Object Storage)

Hệ thống sử dụng Docker Compose để thiết lập tức thì PostgreSQL 16 và MinIO S3-compatible:

```bash
# 1. Di chuyển vào thư mục hạ tầng từ thư mục gốc
cd infrastructure

# 2. Khởi chạy các container chạy ngầm (-d)
docker compose up -d

# 3. Kiểm tra trạng thái hoạt động của các container
docker compose ps
```

**Thông tin truy cập dịch vụ hạ tầng mặc định:**
* **PostgreSQL 16:**
  * Địa chỉ kết nối: `localhost:5432`
  * Tên CSDL (`Database`): `university_crm`
  * Tên đăng nhập (`User`): `postgres`
  * Mật khẩu (`Password`): `postgres`
* **MinIO Object Storage:**
  * API Endpoint: `http://localhost:9000`
  * Bảng điều khiển Web (Web Console): `http://localhost:9001`
  * Tài khoản mặc định: `minioadmin` / `minioadmin`
  * Bucket lưu trữ mặc định: `agu-crm-storage`

---

### ⚙️ Bước 2: Thiết lập và Khởi chạy Phân hệ Backend (NestJS API)

Mở một cửa sổ Terminal mới tại thư mục gốc của dự án:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt toàn bộ thư viện dependencies
npm install

# 3. Thiết lập biến môi trường cục bộ
cp .env.example .env

# 4. Thực thi Prisma Migration để khởi tạo cấu trúc 28 bảng trong CSDL
npx prisma migrate dev --name init

# 5. Khởi tạo dữ liệu mẫu ban đầu (Seed Data cho kiểm thử và Demo)
npx prisma db seed

# 6. Khởi chạy Backend ở chế độ phát triển (Watch Mode - tự động tải lại khi đổi code)
npm run start:dev
```

Sau khi khởi chạy thành công:
* **Backend API Base URL:** `http://localhost:3000/api`
* **Tài liệu Swagger / OpenAPI Tương tác Trực tiếp:** `http://localhost:3000/api/docs`

---

### 🎨 Bước 3: Thiết lập và Khởi chạy Phân hệ Frontend (React SPA)

Mở thêm một cửa sổ Terminal độc lập thứ hai:

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói giao diện và client dependencies
npm install

# 3. Khởi chạy Frontend Dev Server thông qua Vite
npm run dev
```

Sau khi Vite khởi chạy thành công:
* **Giao diện Ứng dụng Web (Single Page App):** `http://localhost:5173`

---

### 🔑 Danh sách Tài khoản Kiểm thử Mặc định (Seed Data)

Hệ thống đã nạp sẵn 4 tài khoản đại diện cho 4 tác nhân nghiệp vụ để phục vụ công tác thẩm định và đánh giá:

| Vai trò Hệ thống (Role) | Địa chỉ Email Đăng nhập | Mật khẩu Mặc định | Ghi chú Trách nhiệm |
| :--- | :--- | :---: | :--- |
| **System Admin** | `admin@agu.edu.vn` | `Admin@123` | Quản trị người dùng, phân quyền RBAC, tra cứu Audit Log |
| **Career Center Officer** | `careercenter@agu.edu.vn` | `Staff@123` | Phê duyệt doanh nghiệp, duyệt tin, quản trị CRM Company 360° |
| **Employer / Recruiter** | `recruiter@fpt.com` | `Employer@123` | Đăng tin, lọc hồ sơ ứng viên trên bảng Kanban, xếp lịch PV |
| **Sinh viên (Student)** | `dca2001@agu.edu.vn` | `Student@123` | Hoàn thiện Career Profile, tải CV PDF, ứng tuyển và theo dõi |

---

## 7. Quy chuẩn Phát triển & Đóng góp Mã nguồn (Git Flow)

Để đảm bảo tính nhất quán và chất lượng mã nguồn trong suốt quá trình phát triển, toàn bộ nhóm nghiên cứu bắt buộc tuân thủ chặt chẽ các quy định sau:

### 7.1. Chiến lược Phân nhánh (Branching Strategy)
Mô hình Git Flow tinh gọn được áp dụng với các quy ước định danh nhánh:

```text
       (hotfix/*)
           ▲
           │
main ──────┴─────────────────────────────────● (Release / v1.0.0)
             ▲
             │ (Pull Request / Review)
develop ─────┴─────────────●─────────────────
               ▲           ▲
               │           │
feature/* ─────┴───────────┘
```

* `main`: Nhánh ổn định cao nhất, chứa mã nguồn sẵn sàng cho môi trường nghiệm thu (Production/Defense-ready). Tuyệt đối không commit trực tiếp lên `main`.
* `develop`: Nhánh tích hợp chính. Mọi tính năng sau khi kiểm thử đạt yêu cầu sẽ được merge vào đây thông qua Pull Request (PR).
* `feature/<tên-module>-<tính-năng>`: Nhánh phát triển tính năng mới. Ví dụ: `feature/auth-jwt`, `feature/kanban-pipeline`, `feature/crm-company-360`.
* `fix/<tên-lỗi>`: Nhánh sửa lỗi phát sinh trong quá trình kiểm thử tích hợp. Ví dụ: `fix/cv-snapshot-hash`.
* `docs/<nội-dung>`: Nhánh cập nhật tài liệu kỹ thuật, sơ đồ hoặc hướng dẫn vận hành.

### 7.2. Quy chuẩn Thông điệp Commit (Conventional Commits)
Mỗi commit bắt buộc phải theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):

$$\text{\textbf{<type>}}(\text{\textbf{<scope>}}): \text{\textbf{<description>}}$$

* **Các loại tiền tố (Type):**
  * `feat`: Bổ sung một chức năng mới cho người dùng hoặc API endpoint.
  * `fix`: Sửa lỗi phát sinh trong mã nguồn hoặc nghiệp vụ.
  * `docs`: Bổ sung hoặc chỉnh sửa tài liệu (`README.md`, tài liệu FRS, tài liệu Database).
  * `refactor`: Tái cấu trúc mã nguồn nhưng không làm thay đổi hành vi nghiệp vụ của hệ thống.
  * `test`: Viết thêm hoặc điều chỉnh các kịch bản kiểm thử (Unit test, E2E test).
  * `chore`: Cập nhật cấu hình build, dependencies, Docker hoặc file `.gitignore`.
  * `perf`: Cải tiến mã nguồn nhằm nâng cao hiệu năng thực thi hoặc tối ưu truy vấn Database.

* **Ví dụ mẫu chuẩn:**
  ```bash
  feat(recruitment): add drag-and-drop kanban board stage transition
  feat(application): implement sha-256 immutability hash for cv snapshot
  fix(auth): prevent locked user from refreshing jwt token
  docs(readme): add detailed monorepo directory tree structure
  chore(docker): configure minio bucket auto initialization
  ```

---

## 8. Bảo mật & Quản lý Biến môi trường

### 8.1. Nguyên tắc An toàn Thông tin Bất biến
> [!CAUTION]
> **Tuyệt đối không đẩy tệp `.env` hoặc bất kỳ thông tin nhạy cảm nào (Database Password, MinIO Secret, JWT Secret Key) lên GitHub / GitLab.**  
> Mọi tệp chứa cấu hình nhạy cảm đều đã được cấu hình loại trừ trong [.gitignore](file:///d:/university-recruitment-crm/.gitignore). Khi chuyển giao mã nguồn sang môi trường mới, lập trình viên phải sao chép từ `.env.example` và thiết lập giá trị riêng biệt.

### 8.2. Danh mục Biến Môi trường Cốt lõi

Tệp `.env.example` tại thư mục gốc định nghĩa các thông số chuẩn hóa:

| Tên Biến Môi trường | Kiểu Dữ liệu | Giá trị Mặc định (Local Dev) | Mục đích & Giải thích Nghiệp vụ |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | `string` | `development` | Chế độ thực thi ứng dụng (`development` / `production` / `test`). |
| `PORT` | `number` | `3000` | Cổng lắng nghe HTTP Requests của Backend NestJS. |
| `DATABASE_URL` | `string` | `postgresql://postgres:postgres@localhost:5432/university_crm?schema=public` | Chuỗi URI kết nối định danh tới PostgreSQL 16 qua Prisma. |
| `MINIO_ENDPOINT` | `string` | `http://localhost:9000` | Địa chỉ API Endpoint của dịch vụ MinIO Object Storage. |
| `MINIO_ACCESS_KEY` | `string` | `minioadmin` | Khóa định danh truy cập dịch vụ lưu trữ MinIO. |
| `MINIO_SECRET_KEY` | `string` | `minioadmin` | Khóa bí mật ủy quyền ghi/đọc dữ liệu lên MinIO. |
| `MINIO_BUCKET` | `string` | `agu-crm-storage` | Tên thùng lưu trữ chính cho CV PDF và tệp đính kèm. |
| `JWT_SECRET` | `string` | `super_secret_jwt_key_agu_crm` | Khóa bí mật dùng để ký và giải mã JSON Web Token (JWT). |
| `JWT_EXPIRES_IN` | `string` | `7d` | Thời hạn hiệu lực của phiên đăng nhập người dùng. |
| `CORS_ORIGIN` | `string` | `http://localhost:5173` | Danh sách các nguồn gốc (Origin) được phép truy cập tài nguyên API. |

### 8.3. Cơ chế Bảo mật Đa tầng Thực thi (Multi-Tier Security)
1. **Kiểm soát Truy cập Đa cấp (3-Tier Access Control):**
   * Tầng 1: `JwtAuthGuard` kiểm tra tính hợp lệ và thời hạn của JWT Token.
   * Tầng 2: `RolesGuard` xác minh vai trò người dùng theo mô hình Phân quyền Dựa trên Vai trò (**RBAC**).
   * Tầng 3: `OwnershipGuard` thẩm định quyền sở hữu dữ liệu nghiệp vụ (Data Ownership) tại tầng Services; ngăn chặn tuyệt đối lỗi truy cập ngang hàng (IDOR).
2. **Bảo toàn Tính Bất biến của CV Snapshot:**
   * Khi sinh viên nộp đơn ứng tuyển, hệ thống sao chép tệp PDF thành bản Snapshot độc lập và tính toán mã băm SHA-256 lưu trực tiếp vào bản ghi `applications`. Dù sinh viên chỉnh sửa CV gốc, bản CV đã nộp cho doanh nghiệp vẫn được bảo toàn tuyệt đối phục vụ thanh tra đào tạo.
3. **Kiểm toán Hệ thống Toàn diện (System Audit Log):**
   * Mọi hành động tác động đến dữ liệu trọng yếu (phê duyệt doanh nghiệp, xuất bản tin tuyển dụng, chuyển giai đoạn Kanban, thay đổi trạng thái quan hệ đối tác) đều được ghi nhận vào bảng `activity_logs`.
   * Hệ thống tự động lọc bỏ các trường nhạy cảm (`password`, `token`, `secret`) trước khi ghi vết vào cơ sở dữ liệu.

---

## 9. Tài liệu Nghiệp vụ & Kỹ thuật Liên quan

Dự án đi kèm bộ hồ sơ kỹ thuật và nghiệp vụ hoàn chỉnh được lưu trữ tập trung tại thư mục [`/docs`](file:///d:/university-recruitment-crm/docs):

* 📘 [Tài liệu Đặc tả Phạm vi Dự án (Scope Specification v1.2)](file:///d:/university-recruitment-crm/docs/Scope_Project_WebCRM.md): Quy định ranh giới chức năng, đối tượng nghiên cứu, phân định In-scope / Out-of-scope và kế hoạch 4 tháng.
* 📗 [Tài liệu Yêu cầu Chức năng (Functional Requirements Specification v1.1)](file:///d:/university-recruitment-crm/docs/Functional_Requirements_Web_CRM.md): Danh mục chuẩn hóa 15 Module SRS, mã yêu cầu FR-*, tiền điều kiện và tiêu chí nghiệm thu (Acceptance Criteria).
* 📙 [Tài liệu Chốt Luồng & Nghiệp vụ (Business Flow Specification v1.1)](file:///d:/university-recruitment-crm/docs/Tai_lieu_Luong_va_Nghiep-Vu.md): Phân tích chi tiết quy trình nghiệp vụ End-to-End, ma trận 38 Use Cases và các Business Rules bất biến.
* 📕 [Đặc tả Kiến trúc Cơ sở Dữ liệu Quan hệ (Database Architecture Spec)](file:///d:/university-recruitment-crm/docs/DATABASE_ARCHITECTURE_SPECIFICATION.md): Thiết kế 28 bảng dữ liệu, ràng buộc khóa ngoại, chỉ mục hiệu năng và từ điển dữ liệu kỹ thuật.

---

## 10. Hướng dẫn Cài đặt & Khởi chạy Môi trường Phát triển (Development Setup)

### 10.1. Yêu cầu Tiền điều kiện (Prerequisites)
Đảm bảo máy trạm phát triển đã cài đặt các công cụ sau:
* **Node.js**: Phiên bản `>= 18.x` hoặc `>= 20.x` (LTS khuyến nghị)
* **npm**: Phiên bản `>= 9.x`
* **Docker Desktop**: Hỗ trợ Docker Compose v2 (đang chạy nền)
* **Git**: Quản lý phiên bản mã nguồn

---

### 10.2. Khởi chạy Dịch vụ Hạ tầng (Database & Object Storage)
Dự án sử dụng Docker Compose để quản lý cơ sở dữ liệu quan hệ PostgreSQL 16 và hệ thống lưu trữ tệp MinIO S3-compatible.

1. Di chuyển vào thư mục hạ tầng:
   ```bash
   cd infrastructure
   ```

2. Khởi động các container ngầm:
   ```bash
   docker compose up -d
   ```

3. Kiểm tra trạng thái dịch vụ:
   ```bash
   docker compose ps
   ```

* **Cổng kết nối PostgreSQL**: `localhost:5432` (Database: `university_crm`)
* **MinIO S3 API Endpoint**: `http://localhost:9000`
* **MinIO Web Console**: `http://localhost:9001` (Tài khoản mặc định: `minioadmin` / `minioadmin`)

> [!TIP]
> **Lưu ý cấu hình MinIO Bucket:** Truy cập vào `http://localhost:9001`, đăng nhập và tạo bucket có tên là `agu-crm-storage` (nếu chưa có) để sẵn sàng nhận dữ liệu tệp CV và hình ảnh.

---

### 10.3. Thiết lập & Chạy Backend (NestJS Modular Monolith)

1. Mở cửa sổ dòng lệnh và di chuyển vào thư mục backend:
   ```bash
   cd ../backend
   ```

2. Tạo file biến môi trường cục bộ từ mẫu:
   ```bash
   cp .env.example .env
   ```

3. Cấu hình mẫu tối thiểu trong `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=3000

   # Database (PostgreSQL 16)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/university_crm?schema=public"

   # MinIO Object Storage
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MINIO_BUCKET=agu-crm-storage

   # JWT Secrets
   JWT_SECRET=super_secret_jwt_key_agu_crm_2026
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=super_secret_refresh_key_agu_crm_2026
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. Cài đặt các gói phụ thuộc (Dependencies):
   ```bash
   npm install
   ```

5. Đồng bộ Schema Cơ sở Dữ liệu qua Prisma ORM:
   ```bash
   # Sinh Prisma Client
   npx prisma generate

   # Thực thi migration tạo cấu trúc bảng CSDL
   npx prisma migrate dev --name init_database
   ```

6. Khởi chạy ứng dụng Backend ở chế độ phát triển:
   ```bash
   npm run start:dev
   ```

* **Backend REST API**: `http://localhost:3000/api/v1`
* **Tài liệu tương tác Swagger OpenAPI**: `http://localhost:3000/api/docs`

---

### 10.4. Thiết lập & Chạy Frontend (React + Vite + Tailwind CSS)

1. Mở một cửa sổ dòng lệnh mới và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```

2. Tạo file biến môi trường cho Frontend:
   ```bash
   cp .env.example .env
   ```

3. Cấu hình trong `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

5. Khởi chạy Frontend Development Server:
   ```bash
   npm run dev
   ```

* **Ứng dụng Client sẽ chạy tại**: `http://localhost:5173`

---

### 10.5. Kiểm tra & Vận hành Thử nghiệm (Verification Checklist)

| Dịch vụ | Địa chỉ truy cập | Tài khoản / Dữ liệu kiểm tra |
| :--- | :--- | :--- |
| **Frontend SPA** | `http://localhost:5173` | Giao diện hệ thống React Vite + Tailwind |
| **Backend REST API** | `http://localhost:3000/api/v1` | Health check: `GET /health` trả về `{ status: 'ok' }` |
| **Swagger Docs** | `http://localhost:3000/api/docs` | Danh sách schema và endpoint 15 module |
| **MinIO Console** | `http://localhost:9001` | `minioadmin` / `minioadmin` (Bucket: `agu-crm-storage`) |
| **PostgreSQL 16** | `localhost:5432` | `postgres` / `postgres` (Database: `university_crm`) |

---

<p align="center">
  <strong>KHOÁ LUẬN TỐT NGHIỆP ĐẠI HỌC — TRƯỜNG ĐẠI HỌC AN GIANG (ĐHQG-HCM)</strong><br>
  <em>Bản quyền tài liệu và mã nguồn thuộc về Nhóm Nghiên cứu & Trung tâm Hướng nghiệp & Hỗ trợ Sinh viên AGU © 2026.</em>
</p>

