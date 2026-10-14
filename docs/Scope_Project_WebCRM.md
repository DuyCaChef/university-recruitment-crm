# TÀI LIỆU MÔ TẢ PHẠM VI DỰ ÁN (SCOPE SPECIFICATION)
## XÂY DỰNG HỆ THỐNG WEB CRM HỖ TRỢ KẾT NỐI SINH VIÊN VÀ DOANH NGHIỆP TRONG QUY TRÌNH TUYỂN DỤNG TẠI TRƯỜNG ĐẠI HỌC

* **Tài liệu:** Scope / System Analysis / Business Requirements — Standardized v1.2  
* **Tình trạng:** Implementation Ready (Đã đồng bộ 100% với 15 SRS Module cốt lõi)  
* **Phạm vi triển khai:** Một trường đại học cụ thể  
* **Đối tượng chính:** Sinh viên – Doanh nghiệp – Đơn vị hỗ trợ việc làm của trường (Career Center)  
* **Loại hệ thống:** Web CRM quản lý quan hệ và quy trình tuyển dụng (University Recruitment CRM)  
* **Định hướng thời gian:** Hoàn thành hệ thống lõi trong khoảng 4 tháng  
* **Định hướng mở rộng:** Chừa khả năng mở rộng kiến trúc trong tương lai, không triển khai multi-university trong khóa luận  

---

## MỤC LỤC NỘI DUNG
1. [Tổng quan và định nghĩa phạm vi](#1-t%E1%BB%95ng-quan-v%C3%A0-%C4%91%E1%BB%8Bnh-ngh%C4%A9a-ph%E1%BA%A1m-vi)
2. [Bối cảnh và vấn đề cần giải quyết](#2-b%E1%BB%91i-c%E1%BA%A3nh-v%C3%A0-v%E1%BA%A5n-%C4%91%E1%BB%81-c%E1%BA%A7n-gi%E1%BA%A3i-quy%E1%BA%BFt)
3. [Mục tiêu dự án](#3-m%E1%BB%A5c-ti%C3%AAu-d%E1%BB%B1-%C3%A1n)
4. [Định hướng sản phẩm và giá trị của hệ thống](#4-%C4%91%E1%BB%8Bnh-h%C6%B0%E1%BB%9Bng-s%E1%BA%A3n-ph%E1%BA%A9m-v%C3%A0-gi%C3%A1-tr%E1%BB%8B-c%E1%BB%A7a-h%E1%BB%87-th%E1%BB%91ng)
5. [Phạm vi triển khai và các giới hạn](#5-ph%E1%BA%A1m-vi-tri%E1%BB%83n-khai-v%C3%A0-c%C3%A1c-gi%E1%BB%9Bi-h%E1%BA%A1n)
6. [Đối tượng sử dụng và vai trò](#6-%C4%91%E1%BB%91i-t%C6%B0%E1%BB%A3ng-s%E1%BB%AD-d%E1%BB%A5ng-v%C3%A0-vai-tr%C3%B2)
7. [Mô hình nghiệp vụ tổng thể](#7-m%C3%B4-h%C3%ACnh-nghi%E1%BB%87p-v%E1%BB%A5-t%E1%BB%95ng-th%E1%BB%83)
8. [Phân tích các nghiệp vụ chính](#8-ph%C3%A2n-t%C3%ADch-c%C3%A1c-nghi%E1%BB%87p-v%E1%BB%A5-ch%C3%ADnh)
9. [Các module chức năng cốt lõi (15 Modules)](#9-c%C3%A1c-module-ch%E1%BB%A9c-n%C4%83ng-c%E1%BB%91t-l%C3%B5i-15-modules)
10. [Quy trình tuyển dụng end-to-end](#10-quy-tr%C3%ACnh-tuy%E1%BB%83n-d%E1%BB%A5ng-end-to-end)
11. [Quy trình CRM quan hệ doanh nghiệp](#11-quy-tr%C3%ACnh-crm-quan-h%E1%BB%87-doanh-nghi%E1%BB%87p)
12. [Phân quyền và kiểm soát truy cập (RBAC & Ownership)](#12-ph%C3%A2n-quy%E1%BB%81n-v%C3%A0-ki%E1%BB%83m-so%C3%A1t-truy-c%E1%BA%ADp-rbac--ownership)
13. [Dữ liệu và mô hình miền nghiệp vụ](#13-d%E1%BB%AF-li%E1%BB%87u-v%C3%A0-m%C3%B4-h%C3%ACnh-mi%E1%BB%81n-nghi%E1%BB%87p-v%E1%BB%A5)
14. [Định hướng cơ sở dữ liệu](#14-%C4%91%E1%BB%8Bnh-h%C6%B0%E1%BB%9Bng-c%C6%A1-s%E1%BB%9F-d%E1%BB%AF-li%E1%BB%87u)
15. [Kiến trúc hệ thống](#15-ki%E1%BA%BFn-tr%C3%BAc-h%E1%BB%87-th%E1%BB%91ng)
16. [Dashboard và báo cáo](#16-dashboard-v%C3%A0-b%C3%A1o-c%C3%A1o)
17. [Thông báo, nhật ký và truy vết](#17-th%C3%B4ng-b%C3%A1o-nh%E1%BA%ADt-k%C3%BD-v%C3%A0-truy-v%E1%BA%BFt)
18. [Yêu cầu phi chức năng](#18-y%C3%AAu-c%E1%BA%A7u-phi-ch%E1%BB%A9c-n%C4%83ng)
19. [Phạm vi MVP và ưu tiên triển khai](#19-ph%E1%BA%A1m-vi-mvp-v%C3%A0-%C6%B0u-ti%C3%AAn-tri%E1%BB%83n-khai)
20. [Các chức năng không nằm trong scope](#20-c%C3%A1c-ch%E1%BB%A9c-n%C4%83ng-kh%C3%B4ng-n%E1%BA%B1m-trong-scope)
21. [Lộ trình thực hiện 4 tháng](#21-l%E1%BB%99-tr%C3%ACnh-th%E1%BB%B1c-hi%E1%BB%87n-4-th%C3%A1ng)
22. [Tiêu chí nghiệm thu](#22-ti%C3%AAu-ch%C3%AD-nghi%E1%BB%87m-thu)
23. [Rủi ro và phương án kiểm soát](#23-r%E1%BB%A7i-ro-v%C3%A0-ph%C6%B0%C6%A1ng-%C3%A1n-ki%E1%BB%83m-so%C3%A1t)
24. [Định hướng mở rộng tương lai](#24-%C4%91%E1%BB%8Bnh-h%C6%B0%E1%BB%9Bng-m%E1%BB%9F-r%E1%BB%99ng-t%C6%B0%C6%A1ng-lai)
25. [Câu hỏi bảo vệ có thể phát sinh](#25-c%C3%A2u-h%E1%BB%8Fi-b%E1%BA%A3o-v%E1%BB%87-c%C3%B3-th%E1%BB%83-ph%C3%A1t-sinh)
26. [Kết luận phạm vi](#26-k%E1%BA%BFt-lu%E1%BA%ADn-ph%E1%BA%A1m-vi)
* [Phụ lục A – Danh sách Use Case đề xuất](#ph%E1%BB%A5-l%E1%BB%A5c-a--danh-s%C3%A1ch-use-case-%C4%91%E1%BB%81-xu%E1%BA%A5t)
* [Phụ lục B – Nguyên tắc chốt Scope](#ph%E1%BB%A5-l%E1%BB%A5c-b--nguy%C3%AAn-t%E1%BA%AFc-ch%E1%BB%91t-scope)
* [Phụ lục C – Business Rules cốt lõi](#ph%E1%BB%A5-l%E1%BB%A5c-c--business-rules-c%E1%BB%91t-l%C3%B5i)
* [Lịch sử hiệu chỉnh tài liệu](#l%E1%BB%8Bch-s%E1%BB%AD-hi%E1%BB%87u-ch%E1%BB%89nh-t%C3%A0i-li%E1%BB%87u)

---

## 1. Tổng quan và định nghĩa phạm vi
* **Tên đề tài:** “Xây dựng hệ thống Web CRM hỗ trợ kết nối sinh viên và doanh nghiệp trong quy trình tuyển dụng tại trường đại học”.
* **Bối cảnh vận hành:** Hệ thống được thiết kế, xây dựng và triển khai thực nghiệm trong phạm vi **một trường đại học cụ thể**. Mục tiêu là cung cấp một nền tảng Web tập trung quản lý mối quan hệ đối tác giữa Sinh viên, Doanh nghiệp và Trung tâm Hỗ trợ Việc làm / Hợp tác Doanh nghiệp của nhà trường (Career Center) xuyên suốt vòng đời tuyển dụng.
* **Định vị sản phẩm:** Trọng tâm của đề tài không phải là xây dựng một mạng xã hội nghề nghiệp mở rộng (như LinkedIn) hay một sàn thương mại việc làm đại trà (như TopCV, VietnamWorks). Hệ thống được định vị chính xác là **University Recruitment CRM**:
  - Quản lý hồ sơ quan hệ đối tác doanh nghiệp và mạng lưới người liên hệ (Company & Contact CRM).
  - Quản lý cơ hội tuyển dụng được thẩm định bởi nhà trường.
  - Quản lý hồ sơ ứng viên, điều phối pipeline tuyển dụng, sắp xếp lịch phỏng vấn và ghi nhận kết quả tuyển dụng.
  - Quản lý lịch sử tương tác, chăm sóc đối tác (Interaction & Follow-up Task) và màn hình tổng hợp đối tác (Company 360°).
* **Ranh giới thực nghiệm:** Trong khuôn khổ khóa luận tốt nghiệp, hệ thống không triển khai mô hình Multi-University (đa trường), Single Sign-On liên trường hoặc mô hình SaaS đa khách hàng (Multi-tenant). Cấu trúc dữ liệu có thể chừa sẵn thuộc tính mở rộng (như `university_id`), nhưng nghiệp vụ phục vụ nhiều trường cùng lúc nằm ngoài phạm vi nghiệm thu.

---

## 2. Bối cảnh và vấn đề cần giải quyết
Thực trạng công tác kết nối việc làm và quan hệ doanh nghiệp tại trường đại học hiện nay gặp nhiều bất cập do phương thức quản trị phân tán:
1. **Thông tin phân mảnh:** Cơ hội việc làm, CV ứng tuyển, hồ sơ doanh nghiệp nằm rải rác trên email cá nhân, biểu mẫu Google Forms, bảng tính Excel, mạng xã hội và văn bản giấy.
2. **Khó khăn trong chăm sóc đối tác:** Career Center khó nắm bắt kịp thời doanh nghiệp nào đang hợp tác tích cực, lịch sử trao đổi ra sao, nhu cầu thực tế là gì và khi nào cần tiếp tục liên hệ (Follow-up) để duy trì mối quan hệ. Khi cán bộ phụ trách thay đổi, toàn bộ dữ liệu lịch sử quan hệ dễ bị thất lạc.
3. **Sinh viên thiếu kênh chính thống:** Sinh viên tiếp cận thông tin tuyển dụng từ nhiều nguồn trôi nổi, khó theo dõi tập trung hành trình ứng tuyển, trạng thái xét duyệt và lịch phỏng vấn từ các đối tác tin cậy của trường.
4. **Doanh nghiệp thiếu công cụ điều phối tuyển dụng sinh viên:** Nhà tuyển dụng gặp khó khăn trong việc lọc hồ sơ theo chuyên ngành đào tạo, tổ chức quy trình tuyển dụng và phản hồi kết quả kịp thời cho sinh viên và nhà trường.
5. **Nhà trường thiếu số liệu điều hành:** Thiếu dữ liệu định lượng tập trung để trả lời các câu hỏi quản trị: tỷ lệ chuyển đổi tuyển dụng của từng khoa/ngành, số lượng doanh nghiệp hợp tác thực chất, mức độ quan tâm của thị trường lao động đối với sinh viên trường.

---

## 3. Mục tiêu dự án

### 3.1. Mục tiêu tổng quát
Xây dựng một hệ thống Web CRM tập trung, hỗ trợ trường đại học quản lý và điều phối toàn bộ vòng đời kết nối sinh viên – doanh nghiệp trong quy trình tuyển dụng: từ quản lý tài khoản, thẩm định doanh nghiệp, công bố cơ hội việc làm, tiếp nhận và sàng lọc hồ sơ, tổ chức phỏng vấn, ghi nhận kết quả cho đến chăm sóc quan hệ đối tác và báo cáo điều hành.

### 3.2. Mục tiêu cụ thể
1. **Hồ sơ sinh viên:** Quản lý tập trung hồ sơ năng lực (Career Profile), kỹ năng, kinh nghiệm, dự án và đa phiên bản CV của sinh viên.
2. **CRM Doanh nghiệp:** Quản lý định danh pháp nhân, danh bạ người liên hệ (Company Contacts), trạng thái hợp tác (`relationship_status`) và góc nhìn toàn cảnh Company 360°.
3. **Cơ hội việc làm:** Thiết lập quy trình tạo – thẩm định – công bố – đóng tin tuyển dụng (Job Lifecycle) chặt chẽ.
4. **Quy trình tuyển dụng:** Cung cấp phễu tuyển dụng (Recruitment Pipeline) trực quan, bảo toàn CV Snapshot bất biến tại thời điểm nộp và lưu vết toàn bộ lịch sử trạng thái ứng tuyển (Application Status History).
5. **Quản lý phỏng vấn:** Thiết lập lịch phỏng vấn cơ bản, thông báo lịch hẹn và ghi nhận kết quả phỏng vấn.
6. **Chăm sóc đối tác (CRM Core):** Lưu vết lịch sử tương tác (Interactions), quản lý các công việc cần theo dõi (Follow-up Tasks) và cảnh báo trực quan công việc quá hạn trên giao diện làm việc.
7. **Sự kiện nghề nghiệp:** Tổ chức và quản lý sự kiện kết nối việc làm, Job Fair, Workshop hướng nghiệp và tiếp nhận đăng ký tham gia.
8. **Báo cáo điều hành:** Cung cấp bảng điều khiển KPI và hệ thống báo cáo phục vụ công tác quản lý của Career Center.
9. **An toàn & Kiểm toán:** Thực thi bảo mật phân quyền đa tầng (RBAC + Data Ownership) tại Backend; ghi vết kiểm toán toàn diện (Audit Log) các hành vi quan trọng.
10. **Độc lập vận hành:** Hệ thống vận hành độc lập, hoàn chỉnh mà không phụ thuộc vào OTP SMS/Email hay các giải pháp AI trong phạm vi cốt lõi (Core MVP).

---

## 4. Định hướng sản phẩm và giá trị của hệ thống

| Khía cạnh | Hệ thống đề tài tập trung vào |
| :--- | :--- |
| **Trung tâm điều phối** | Career Center của trường đại học giữ vai trò điều phối chính quan hệ Sinh viên – Doanh nghiệp. |
| **Quản trị đối tác** | Quản lý Profile, Contact, Relationship, Interaction, Follow-up và góc nhìn tổng hợp Company 360°. |
| **Quản trị ứng viên** | Hồ sơ năng lực, Đa bản CV, Tìm việc, Ứng tuyển, Theo dõi phỏng vấn và Kết quả tuyển dụng. |
| **Quy trình tuyển dụng** | Phễu tuyển dụng rõ ràng: Applied → Reviewing → Shortlisted → Interview → Offer → Hired. |
| **Kiểm toán & Quản trị** | Quy trình phê duyệt minh bạch (Doanh nghiệp, Tin tuyển dụng), phân quyền chặt chẽ, Audit Trail. |
| **Khác biệt cốt lõi** | CRM hướng nghiệp sâu sắc gắn liền với bối cảnh đào tạo của trường đại học, loại bỏ tính đại trà của sàn việc làm tự do. |

---

## 5. Phạm vi triển khai và các giới hạn

### 5.1. Trong phạm vi (In Scope)
* Triển khai cho **một trường đại học duy nhất**.
* Một đơn vị điều phối trung tâm: Career Center / Phòng Hợp tác Doanh nghiệp.
* Sinh viên chính quy thuộc trường (được xác thực thông qua dữ liệu gốc MSSV do trường cung cấp).
* Doanh nghiệp tuyển dụng hợp tác và các nhà tuyển dụng đại diện (Recruiter).
* Quản trị viên hệ thống (System Admin).
* Bộ 15 module nghiệp vụ: Quản lý xác thực, hồ sơ sinh viên, khám phá ứng viên, xét duyệt doanh nghiệp, CRM đối tác, quản lý việc làm, khám phá việc làm, ứng tuyển, phễu tuyển dụng, phỏng vấn, tương tác & nhắc việc, thông báo nội bộ, sự kiện nghề nghiệp, báo cáo thống kê và nhật ký kiểm toán.
* Giao diện Web Responsive hỗ trợ các kích thước màn hình máy tính và thiết bị di động phổ biến.

### 5.2. Ngoài phạm vi khóa luận (Out of Scope)
* **Không phụ thuộc dịch vụ ngoài:** Không bắt buộc OTP SMS, liên kết xác thực email tự động hay lời mời qua email trong quy trình nghiệm thu; hệ thống chạy độc lập hoàn toàn với mail server bên ngoài.
* **Không mạng xã hội:** Không xây dựng tính năng nhắn tin thời gian thực (Realtime Chat), tường mạng xã hội, tương tác like/share/bình luận công khai.
* **Không đánh giá phỏng vấn phức tạp:** Không xây dựng bộ tiêu chí chấm điểm phỏng vấn (Scorecard/Rubric) phức tạp; không tích hợp nền tảng Video Call trực tuyến nội bộ.
* **Không đa trường / Multi-tenant:** Không hỗ trợ SSO liên trường, không tự động phân biệt mã trường từ email/MSSV, không xây dựng hạ tầng SaaS thương mại.
* **Không thay thế SIS/HRM:** Không thay thế hệ thống quản lý đào tạo, bảng điểm tín chỉ (SIS); không quản lý chấm công, tính lương, nhân sự nội bộ của doanh nghiệp.
* **Không lệ thuộc AI:** Không dùng AI/Machine Learning để tự động ra quyết định tuyển/loại ứng viên; các chức năng AI (Matching CV, Recommendation) được định hướng ở pha mở rộng P2.
* **Không ứng dụng Mobile Native:** Không phát triển ứng dụng di động riêng cho Android/iOS (tập trung 100% tài nguyên vào Web Application).
* **Kiến trúc:** Không sử dụng kiến trúc Microservices phân tán, Kubernetes hay Event Broker phức tạp trong phạm vi 4 tháng.

---

## 6. Đối tượng sử dụng và vai trò (Actors)

| Vai trò (Actor) | Mục đích sử dụng | Quyền hạn & Trách nhiệm chính |
| :--- | :--- | :--- |
| **System Admin** | Quản trị kỹ thuật nền tảng | Quản lý tài khoản User, cấu hình Role/Permission (RBAC), theo dõi Activity Log toàn hệ thống, khóa/mở khóa tài khoản. Không can thiệp nghiệp vụ tuyển dụng hay ghi chú CRM. |
| **Career Center / Staff** | Điều phối hoạt động tuyển dụng & Quản trị CRM | Thẩm định doanh nghiệp, duyệt/từ chối Job, giám sát quy trình tuyển dụng, quản lý quan hệ đối tác (`relationship_status`), ghi nhận tương tác, tạo Follow-up task, xem Company 360°, tổ chức sự kiện, xem báo cáo điều hành. |
| **Student** | Tìm kiếm việc làm & Quản lý ứng tuyển | Đăng ký tài khoản theo MSSV, quản lý Career Profile, tải lên và quản lý nhiều bản CV, tìm kiếm Job, nộp đơn ứng tuyển, rút đơn, theo dõi lịch phỏng vấn và kết quả. |
| **Employer / Recruiter** | Tiếp cận nhân lực & Thực hiện tuyển dụng | Đăng ký pháp nhân doanh nghiệp, quản lý Company Profile, quản lý người liên hệ, đăng tin tuyển dụng, sàng lọc ứng viên trên Kanban pipeline, lên lịch phỏng vấn và ghi nhận kết quả tuyển dụng. |

---

## 7. Mô hình nghiệp vụ tổng thể

```text
[DOANH NGHIỆP]
   │
   ├─► Tự đăng ký tài khoản & hồ sơ ban đầu
   ├─► Gửi yêu cầu xét duyệt (Submit Verification Request)
   │         │
   │         ▼
   │   [CAREER CENTER THẨM ĐỊNH]
   │   ├── Chấp thuận (APPROVED) ──► Trở thành đối tác chính thức
   │   └── Từ chối (REJECTED + lý do) ──► Doanh nghiệp chỉnh sửa & Resubmit
   │         │
   ├─► Tạo tin tuyển dụng (Job Draft) ──► Gửi duyệt
   │         │
   │         ▼
   │   [CAREER CENTER DUYỆT JOB]
   │   ├── Duyệt ──► Tin tuyển dụng chuyển sang PUBLISHED
   │   └── Từ chối ──► Doanh nghiệp sửa và gửi lại
   │
[SINH VIÊN]
   │
   ├─► Đối chiếu Student Master Data (MSSV) ──► Đăng ký tài khoản (ACTIVE)
   ├─► Hoàn thiện Profile, Kỹ năng, Dự án & Tải lên nhiều bản CV
   ├─► Khám phá Job công khai ──► Nộp hồ sơ (Apply Job)
   │         │
   │         ▼ [Đóng băng CV Snapshot bất biến & Lưu vết Status History]
   │
[ĐIỀU PHỐI TUYỂN DỤNG]
   │
   ├─► Employer sàng lọc ứng viên trên Kanban (Reviewing → Shortlisted)
   ├─► Employer lên lịch Interview ──► Hệ thống phát In-app Notification
   ├─► Employer chốt kết quả tuyển dụng (Offer / Hired / Rejected)
   │
[ĐIỀU PHỐI CRM & BÁO CÁO (CAREER CENTER)]
   │
   ├─► Ghi nhận lịch sử tương tác (Interaction: Call, Email, Meeting...)
   ├─► Giao nhiệm vụ chăm sóc đối tác (Follow-up Tasks có Owner & Due Date)
   ├─► Theo dõi bảng Company 360° & Cảnh báo Task quá hạn (Overdue Warning)
   └─► Theo dõi Dashboard KPI & Xuất báo cáo tuyển dụng
```

---

## 8. Phân tích các nghiệp vụ chính

### 8.1. Quản trị tài khoản, đăng ký và phân quyền (Module 01)
* **Xác thực:** Đăng nhập, đăng xuất, đổi mật khẩu an toàn (mật khẩu băm một chiều với thuật toán mạnh, không trả mật khẩu băm về client).
* **Quản trị tài khoản:** Khóa (`LOCKED`), kích hoạt (`ACTIVE`) tài khoản; kiểm tra trạng thái tài khoản trước mọi giao dịch.
* **Phân định 3 tầng kiểm soát truy cập (3-Tier Access Evaluation):**
  1. *User Status:* Tài khoản có được đăng nhập hay bị khóa?
  2. *RBAC Permission:* Vai trò của người dùng có được phép thực hiện hành động này không?
  3. *Business Status & Ownership:* Đối tượng nghiệp vụ có đủ điều kiện không (Doanh nghiệp đã được duyệt chưa? Dữ liệu có thuộc sở hữu của doanh nghiệp mình không?).
* **Đăng ký sinh viên:**
  - Nhà trường cung cấp bảng dữ liệu gốc `student_masters` (gồm MSSV, Họ tên, Ngành học).
  - Sinh viên nhập MSSV, email và mật khẩu. Backend đối soát dữ liệu gốc để xác thực danh tính và kích hoạt bản ghi hồ sơ sinh viên trong giao dịch nguyên tử (Atomic Transaction).
  - Không bắt buộc OTP; một MSSV chỉ liên kết duy nhất với một tài khoản người dùng.
* **Đăng ký doanh nghiệp:**
  - Nhà tuyển dụng tự khai báo thông tin pháp nhân ban đầu. Sau khi tạo tài khoản, doanh nghiệp chuyển trạng thái chờ xét duyệt (`PENDING`).
  - Chỉ doanh nghiệp đã được Career Center duyệt (`APPROVED`) mới được tạo và công bố tin tuyển dụng.

### 8.2. Quản lý hồ sơ sinh viên (Module 02)
* Quản lý thông tin cá nhân, định danh sinh viên, chuyên ngành đào tạo, tình trạng học tập (`ACTIVE`, `GRADUATED`, `SUSPENDED`).
* Quản lý kỹ năng (Skills), kinh nghiệm thực tế (Experiences) và dự án tiêu biểu (Projects).
* Quản lý đa bản CV (Multiple CVs): Sinh viên có thể tải lên nhiều phiên bản CV (PDF/Word), đặt CV mặc định và chỉ định bản CV cụ thể khi ứng tuyển.
* Quyền riêng tư hồ sơ nghề nghiệp: Sinh viên có quyền bật/tắt chế độ hiển thị hồ sơ năng lực công khai (Public Career Profile).

### 8.3. Khám phá ứng viên (Module 03)
* Cho phép Nhà tuyển dụng và Cán bộ Career Center tìm kiếm, lọc danh sách sinh viên đang bật hồ sơ công khai theo kỹ năng, chuyên ngành và kinh nghiệm.
* Phân tách nghiêm ngặt quyền riêng tư: Public Career Profile chỉ hiển thị họ tên, kỹ năng, dự án; các thông tin nhạy cảm (Số điện thoại, Bảng điểm chi tiết, CV riêng tư) được bảo vệ tuyệt đối và chỉ tiếp cận khi sinh viên chủ động nộp hồ sơ ứng tuyển.

### 8.4. Đăng ký & Thẩm định doanh nghiệp (Module 04)
* Vòng đời xét duyệt doanh nghiệp: `PENDING` → `APPROVED` hoặc `REJECTED` → `RESUBMIT` → `PENDING`; trạng thái vi phạm: `SUSPENDED`.
* Khi từ chối xét duyệt, Career Center bắt buộc nhập lý do cụ thể (`rejection_reason`). Doanh nghiệp được phép chỉnh sửa hồ sơ và nộp lại yêu cầu xét duyệt.
* Lưu vết toàn bộ lịch sử xét duyệt để phục vụ tra cứu kiểm toán.

### 8.5. Quản trị quan hệ doanh nghiệp - CRM (Module 05)
* Quản lý hồ sơ doanh nghiệp (Company Profile) và danh bạ người liên hệ (`company_contacts`). Hỗ trợ cấu hình người liên hệ chính (Primary Contact).
* Quản lý trạng thái quan hệ hợp tác với trường (`relationship_status`: Tiềm năng, Đang hợp tác, Đối tác chiến lược...), trạng thái này do Career Center toàn quyền đánh giá và điều chỉnh, hoàn toàn độc lập với trạng thái xác minh tài khoản.
* **Company 360°:** Giao diện điều hành tổng hợp dành riêng cho Career Center, tích hợp đồng thời: Thông tin pháp nhân, Danh bạ liên hệ, Lịch sử tin tuyển dụng, Lịch sử ứng viên nộp hồ sơ, Lịch sử tương tác CRM, Các nhiệm vụ Follow-up và Sự kiện liên quan.
* Ghi chú nội bộ (Internal Notes): Dữ liệu đánh giá riêng tư của nhà trường, chỉ hiển thị cho nhân sự Career Center có thẩm quyền, tuyệt đối không lộ sang phía doanh nghiệp hay sinh viên.

### 8.6. Quản lý tin tuyển dụng (Module 06)
* Vòng đời tin tuyển dụng: `DRAFT` → `PENDING_APPROVAL` → `PUBLISHED` → `CLOSED`; nhánh từ chối: `PENDING_APPROVAL` → `REJECTED` → `EDIT` → `RESUBMIT`.
* Chỉ doanh nghiệp ở trạng thái `APPROVED` mới có quyền tạo và gửi duyệt tin tuyển dụng.
* Tin tuyển dụng bị từ chối phải ghi rõ lý do. Tin tuyển dụng hết hạn (Deadline) hoặc đóng thủ công sẽ không tiếp nhận thêm hồ sơ mới.

### 8.7. Khám phá cơ hội việc làm (Module 07)
* Cung cấp cổng tra cứu công khai dành cho sinh viên: Tìm kiếm từ khóa theo vị trí tuyển dụng, mô tả; lọc theo kỹ năng yêu cầu, địa điểm, hình thức làm việc (Full-time, Part-time, Internship).
* Chỉ hiển thị các tin tuyển dụng đang ở trạng thái `PUBLISHED`, chưa hết hạn và thuộc các doanh nghiệp đang hoạt động hợp lệ.
* Sinh viên có thể lưu lại các công việc quan tâm (Bookmark Job - Phân hệ P1).

### 8.8. Quản lý đơn ứng tuyển (Module 08 - Single Source of Truth)
* **Quy tắc nộp đơn:** Một sinh viên không được nộp trùng đơn vào cùng một tin tuyển dụng đang mở.
* **Bảo toàn CV Snapshot bất biến:** Tại thời điểm nộp đơn, hệ thống sao chép bản tệp CV và lưu trữ metadata bất biến (`application_cv_snapshots`). Mọi thay đổi hoặc hành động xóa bản CV gốc trong hồ sơ cá nhân sau đó đều không làm biến đổi bản CV đã nộp.
* **Rút đơn ứng tuyển (Withdraw):** Sinh viên được quyền rút đơn khi hồ sơ đang ở giai đoạn đầu (`APPLIED`, `REVIEWING`, `SHORTLISTED`); không thể rút đơn khi đã bước vào vòng phỏng vấn hoặc có kết quả chính thức.
* **Lưu vết tiến trình:** Toàn bộ lịch sử thay đổi trạng thái đều được ghi nhận vào bảng `application_status_histories`.

### 8.9. Phễu tuyển dụng (Recruitment Pipeline - Module 09)
* Cung cấp giao diện bảng Kanban trực quan dành cho Nhà tuyển dụng để điều phối ứng viên qua các giai đoạn: `APPLIED` → `REVIEWING` → `SHORTLISTED` → `INTERVIEW` → `OFFER` → `HIRED`.
* Module 09 đóng vai trò là tầng giao diện điều phối; mọi hành vi cập nhật trạng thái tuyển dụng bắt buộc phải gọi thông qua Public Service Contract của Module 08 để đảm bảo toàn vẹn dữ liệu.

### 8.10. Quản lý phỏng vấn (Module 10)
* Cho phép Nhà tuyển dụng thiết lập lịch phỏng vấn gắn trực tiếp với đơn ứng tuyển: Thời gian diễn ra (`scheduled_time`), hình thức (Trực tiếp / Trực tuyến), địa điểm hoặc đường dẫn phòng họp trực tuyến (`location_url`).
* Tự động phát sinh thông báo In-app Notification cho ứng viên khi lịch hẹn được tạo mới, dời lịch hoặc hủy bỏ.
* Ghi nhận ghi chú kết quả phỏng vấn cơ bản; loại bỏ hệ thống tiêu chí chấm điểm (Scorecard) phức tạp nhằm tối ưu hóa phạm vi MVP.

### 8.11. Quản lý tương tác và nhắc việc CRM (Module 11)
* **Nhật ký tương tác (Interactions):** Career Center ghi nhận lịch sử trao đổi với doanh nghiệp (Cuộc gọi, Gặp mặt trực tiếp, Email trao đổi, Sự kiện, Hội thảo...), gắn với người liên hệ cụ thể.
* **Nhiệm vụ chăm sóc (Follow-up Tasks):** Thiết lập các công việc cần xử lý tiếp theo đối với doanh nghiệp, bắt buộc gán cán bộ phụ trách (`owner_user_id`) và thời hạn xử lý (`due_date`).
* **Cơ chế cảnh báo quá hạn:** Hệ thống tính toán động trạng thái quá hạn (`OVERDUE`) dựa trên thời gian thực tế và hiển thị nổi bật trực tiếp trên giao diện CRM / Company 360° của cán bộ quản lý (loại bỏ cơ chế gửi thông báo tự động bằng cron job trong MVP để tối ưu phạm vi triển khai).

### 8.12. Thông báo nội bộ (Module 12)
* Quản lý hòm thư thông báo nội bộ hệ thống (In-app Notification - P0) tiếp nhận các sự kiện quan trọng: Doanh nghiệp được duyệt/từ chối, Tin tuyển dụng được công bố, Đơn ứng tuyển chuyển trạng thái, Lịch phỏng vấn được thiết lập.
* Kênh thông báo qua Email bên ngoài được xếp vào nhóm mở rộng P1 và không phải là điều kiện bắt buộc để hoàn thành kịch bản kiểm thử nghiệm thu.

### 8.13. Sự kiện nghề nghiệp (Module 13 - Priority P1)
* Quản lý các ngày hội việc làm (Job Fair), hội thảo nghề nghiệp do Career Center tổ chức.
* Hỗ trợ Doanh nghiệp và Sinh viên đăng ký tham gia sự kiện trực tiếp trên hệ thống; quản lý giới hạn số lượng tham dự (Capacity).

### 8.14. Bảng điều khiển và Báo cáo (Module 14)
* **Bảng điều khiển cơ bản (KPI Widgets - P0):** Tích hợp các số liệu tổng hợp nhanh tại màn hình làm việc của từng nhóm người dùng (Số job đang tuyển, số đơn ứng tuyển mới, số cuộc phỏng vấn sắp diễn ra, số task cần xử lý).
* **Phân hệ Báo cáo chuyên sâu (Advanced Reports - P1):** Thống kê phễu chuyển đổi tuyển dụng (Recruitment Conversion), tổng hợp nhu cầu tuyển dụng theo ngành đào tạo, trích xuất dữ liệu báo cáo ra tệp CSV / Excel (XLSX).

### 8.15. Nhật ký kiểm toán hệ thống (Module 15 - Audit Log)
* Ghi nhận toàn bộ các thao tác làm biến đổi dữ liệu nghiệp vụ quan trọng vào bảng kiểm toán trung tâm `activity_logs`.
* Cung cấp thông tin truy vết: Tác nhân thực hiện (`actor_user_id`), Hành động (`action`), Đối tượng tác động (`resource_type`, `resource_id`), Dữ liệu trước và sau biến đổi (`old_values`, `new_values` dạng JSONB).
* Tuân thủ quy tắc bảo mật dữ liệu tuyệt đối: Nghiêm cấm ghi log mật khẩu băm, chuỗi token phiên hay thông tin bí mật vào hệ thống kiểm toán.

---

## 9. Các module chức năng cốt lõi (15 Modules)

| Mã Module | Tên Module Chức năng | Chức năng lõi | Mức ưu tiên |
| :---: | :--- | :--- | :---: |
| **MOD-01** | **Authentication & RBAC** | Đăng nhập, phân quyền Role/Permission, bảo mật mật khẩu, quản lý trạng thái tài khoản. | **P0** |
| **MOD-02** | **Student Registration & Profile** | Đăng ký theo Student Master Data, hồ sơ năng lực, kỹ năng, dự án, quản lý đa bản CV. | **P0** |
| **MOD-03** | **Student Career Discovery** | Tìm kiếm & lọc hồ sơ sinh viên công khai dành cho Nhà tuyển dụng và Career Center. | **P0** |
| **MOD-04** | **Company Registration & Verification** | Doanh nghiệp tự đăng ký, gửi yêu cầu xét duyệt, quy trình duyệt/từ chối/nộp lại của trường. | **P0** |
| **MOD-05** | **Company CRM** | Hồ sơ doanh nghiệp, danh bạ liên hệ, trạng thái quan hệ hợp tác, góc nhìn Company 360°. | **P0** |
| **MOD-06** | **Job Management** | Tạo, gửi duyệt, phê duyệt, công bố, chỉnh sửa và đóng tin tuyển dụng (Job Lifecycle). | **P0** |
| **MOD-07** | **Job Discovery** | Tra cứu, lọc theo tiêu chí, xem chi tiết tin tuyển dụng công khai (P0); Bookmark Job (P1). | **P0 / P1** |
| **MOD-08** | **Application Management** | Nộp hồ sơ, rút đơn, đóng băng CV Snapshot bất biến, lưu vết lịch sử trạng thái ứng tuyển. | **P0** |
| **MOD-09** | **Recruitment Pipeline** | Giao diện Kanban điều phối ứng viên, liên kết thực thi trạng thái qua Module 08. | **P0** |
| **MOD-10** | **Interview** | Thiết lập lịch hẹn phỏng vấn, liên kết đơn ứng tuyển, ghi nhận kết quả phỏng vấn cơ bản. | **P0** |
| **MOD-11** | **Interaction & Follow-up** | Ghi nhận tương tác đối tác, giao nhiệm vụ Follow-up có hạn xử lý, cảnh báo Overdue trên UI. | **P0** |
| **MOD-12** | **Notification** | Hộp thư thông báo nội bộ (In-app Notification - P0); Kênh gửi email mở rộng (P1). | **P0 / P1** |
| **MOD-13** | **Career Event** | Tạo sự kiện nghề nghiệp/Job Fair, tiếp nhận đăng ký tham dự của sinh viên và doanh nghiệp. | **P1** |
| **MOD-14** | **Dashboard & Report** | Widget KPI cơ bản tại màn hình làm việc (P0); Phân hệ báo cáo nâng cao & Export CSV/XLSX (P1). | **P0 / P1** |
| **MOD-15** | **Audit Log** | Ghi nhận nhật ký kiểm toán hệ thống (`activity_logs`), truy vết biến đổi dữ liệu trọng yếu. | **P0** |

*Ghi chú phân tầng ưu tiên:*
* **P0 (Bắt buộc hoàn thành):** Các thành phần cốt lõi chứng minh tính toàn vẹn của nghiệp vụ tuyển dụng và CRM trường đại học.
* **P1 (Nên hoàn thành):** Các phân hệ mở rộng giá trị gia tăng (Sự kiện, Bookmark, Báo cáo nâng cao, Xuất file).
* **P2 (Nghiên cứu mở rộng tương lai):** Các tính năng AI, tích hợp hệ thống bên thứ ba; tuyệt đối không để ảnh hưởng tiến độ của P0.

---

## 10. Quy trình tuyển dụng end-to-end
1. **Gia nhập:** Doanh nghiệp tự đăng ký tài khoản đại diện và khai báo pháp nhân trên hệ thống.
2. **Thẩm định:** Career Center kiểm tra thông tin pháp nhân, quyết định Approve hoặc Reject (kèm lý do cụ thể). Doanh nghiệp được phép chỉnh sửa và nộp lại nếu bị từ chối.
3. **Đăng tin:** Doanh nghiệp đã được duyệt (`APPROVED`) tạo tin tuyển dụng và gửi yêu cầu phê duyệt.
4. **Kiểm duyệt tin:** Career Center thẩm định nội dung tin tuyển dụng. Khi được phê duyệt, tin tuyển dụng chuyển trạng thái `PUBLISHED`.
5. **Kích hoạt tài khoản sinh viên:** Sinh viên đối soát thông tin với dữ liệu gốc `student_masters`, hoàn tất đăng ký tài khoản, xây dựng hồ sơ năng lực và tải lên các bản CV.
6. **Ứng tuyển:** Sinh viên tìm kiếm tin tuyển dụng phù hợp, chỉ định bản CV mong muốn và gửi đơn ứng tuyển (`APPLIED`). Hệ thống lập tức sao chép và đóng băng bản CV Snapshot độc lập, đồng thời ghi nhận bản ghi đầu tiên vào lịch sử trạng thái.
7. **Sàng lọc & Điều phối:** Nhà tuyển dụng theo dõi danh sách ứng viên trên bảng Kanban, thực hiện chuyển trạng thái sàng lọc (`REVIEWING` → `SHORTLISTED`).
8. **Tổ chức phỏng vấn:** Nhà tuyển dụng tạo lịch phỏng vấn (`INTERVIEW`). Hệ thống phát thông báo In-app cho sinh viên.
9. **Chốt kết quả:** Nhà tuyển dụng cập nhật kết quả tuyển dụng cuối cùng (`OFFER` → `HIRED` hoặc `REJECTED`).
10. **Lưu vết & Báo cáo:** Mọi sự thay đổi trạng thái đều được lưu vết đầy đủ trong `application_status_histories`. Career Center theo dõi toàn bộ diễn biến tuyển dụng và cập nhật thông tin chăm sóc đối tác.

---

## 11. Quy trình CRM quan hệ doanh nghiệp
1. **Thiết lập quan hệ:** Doanh nghiệp gia nhập hệ thống thông qua xét duyệt chính thức từ Career Center.
2. **Quản trị danh bạ:** Ghi nhận và phân loại thông tin liên hệ của các nhân sự tuyển dụng đại diện (Contacts), thiết lập Người liên hệ chính (Primary Contact).
3. **Phân loại đối tác:** Career Center đánh giá và gán mức độ hợp tác (`relationship_status`: Tiếp cận, Tiềm năng, Đối tác ký kết MOU, Nhà tài trợ...).
4. **Ghi nhận tương tác (Interaction Logging):** Sau mỗi cuộc trao đổi (Điện thoại, Email, Họp trực tiếp, Hội thảo), chuyên viên Career Center tạo bản ghi tương tác đính kèm nội dung và người phụ trách.
5. **Thiết lập việc cần làm (Follow-up Tasks):** Khi có phát sinh công việc cần theo dõi (ví dụ: gửi lại công văn, liên hệ xác nhận gian hàng hội chợ việc làm), chuyên viên tạo task, chỉ định người phụ trách và ngày hết hạn (`due_date`).
6. **Giám sát tổng thể (Company 360°):** Cán bộ lãnh đạo và chuyên viên Career Center truy cập giao diện Company 360° để nắm bắt toàn diện lịch sử hợp tác, tương tác, việc làm, ứng viên và các cảnh báo task quá hạn.
7. **Bảo mật ghi chú:** Các ghi chú đánh giá nội bộ của trường được phân quyền hiển thị nghiêm ngặt, bảo vệ tuyệt đối tính riêng tư nghiệp vụ.

---

## 12. Phân quyền và kiểm soát truy cập (RBAC & Ownership)

| Nhóm đối tượng | Khả năng xem dữ liệu | Khả năng tạo / cập nhật dữ liệu | Quyền quản trị / Phê duyệt |
| :--- | :--- | :--- | :--- |
| **Student** | Tin tuyển dụng công khai; Hồ sơ nghề nghiệp công khai của sinh viên khác; Hồ sơ cá nhân, Đơn ứng tuyển và Lịch phỏng vấn của chính mình. | Tạo và cập nhật Hồ sơ cá nhân, Kỹ năng, Dự án, CV; Nộp đơn ứng tuyển; Rút đơn ứng tuyển của chính mình. | Không có quyền quản trị. |
| **Employer / Recruiter** | Hồ sơ doanh nghiệp của mình; Tin tuyển dụng của mình; Danh sách ứng viên nộp vào tin của mình; Hồ sơ sinh viên công khai. | Cập nhật hồ sơ doanh nghiệp; Tạo/sửa tin tuyển dụng của mình; Sàng lọc ứng viên, tạo lịch phỏng vấn và chốt kết quả ứng viên của mình. | Quản lý người liên hệ và điều phối tuyển dụng trong phạm vi doanh nghiệp mình đại diện. |
| **Career Center** | Toàn bộ dữ liệu doanh nghiệp, tin tuyển dụng, đơn ứng tuyển, sự kiện, báo cáo và dữ liệu phân hệ CRM toàn trường. | Tạo/sửa dữ liệu CRM (Tương tác, Follow-up, Quan hệ đối tác); Quản lý sự kiện nghề nghiệp; Cập nhật thông tin hỗ trợ. | Phê duyệt/từ chối Doanh nghiệp; Phê duyệt/từ chối Tin tuyển dụng; Quản trị quan hệ đối tác toàn trường. |
| **System Admin** | Danh mục tài khoản người dùng, vai trò, quyền hạn và toàn bộ nhật ký hệ thống (Activity Logs). | Tạo/khóa tài khoản; Gán vai trò, cấu hình hệ thống. Không chỉnh sửa nội dung hồ sơ tuyển dụng. | Toàn quyền quản trị kỹ thuật và giám sát an toàn thông tin hệ thống. |

*Nguyên tắc bảo vệ dữ liệu (Data Isolation):* Toàn bộ các kiểm tra phân quyền (RBAC) và quan hệ sở hữu (Data Ownership) bắt buộc phải thực thi tại tầng **Backend Service**. Tuyệt đối không chỉ kiểm tra ẩn/hiện nút bấm tại giao diện Frontend.

---

## 13. Dữ liệu và mô hình miền nghiệp vụ
Các thực thể dữ liệu cốt lõi phản ánh chính xác cấu trúc CSDL chuẩn của dự án:
1. `users`: Tài khoản định danh, lưu trữ email đăng nhập, mật khẩu băm, trạng thái tài khoản (`ACTIVE`, `LOCKED`).
2. `roles`, `permissions`, `user_roles`, `role_permissions`: Hệ thống bảng phân quyền vai trò người dùng (RBAC).
3. `student_masters`: Dữ liệu gốc sinh viên do nhà trường nạp trước (MSSV, Họ tên, Ngành học) làm căn cứ đối soát đăng ký.
4. `students`: Hồ sơ năng lực sinh viên sau khi tạo tài khoản thành công, liên kết với `users` qua khóa ngoại `user_id`.
5. `student_skills`, `student_experiences`, `student_projects`: Chi tiết năng lực, kinh nghiệm thực tế và dự án của sinh viên.
6. `student_cvs`: Danh mục các bản CV do sinh viên tải lên hệ thống.
7. `companies`: Pháp nhân doanh nghiệp, trạng thái xét duyệt (`verification_status`), trạng thái quan hệ đối tác (`relationship_status`).
8. `company_contacts`: Danh bạ nhân sự đại diện và người phụ trách tuyển dụng của doanh nghiệp.
9. `jobs`, `job_skills`: Tin tuyển dụng và các kỹ năng chuyên môn yêu cầu.
10. `applications`: Đơn ứng tuyển kết nối giữa Sinh viên và Tin tuyển dụng, lưu trữ trạng thái hiện tại.
11. `application_cv_snapshots`: Bản sao lưu metadata và tệp CV bất biến tại thời điểm sinh viên nộp hồ sơ.
12. `application_status_histories`: Nhật ký lưu vết từng bước thay đổi trạng thái của đơn ứng tuyển.
13. `interviews`: Thông tin lịch hẹn phỏng vấn, liên kết trực tiếp với đơn ứng tuyển.
14. `crm_interactions`: Lịch sử các hoạt động trao đổi, chăm sóc đối tác giữa Career Center và Doanh nghiệp.
15. `crm_follow_ups`: Danh mục nhiệm vụ theo dõi, chăm sóc doanh nghiệp có phân công người phụ trách và kỳ hạn.
16. `career_events`, `event_registrations`: Sự kiện hướng nghiệp và danh sách đăng ký tham dự (P1).
17. `notifications`: Thông báo nội bộ hệ thống gửi tới từng người dùng cụ thể.
18. `activity_logs`: Nhật ký kiểm toán hệ thống ghi vết các biến động dữ liệu quan trọng.

---

## 14. Định hướng cơ sở dữ liệu
* Hệ thống được triển khai cho **một trường đại học duy nhất**. Mã số sinh viên (MSSV) và email được xem là thuộc tính định danh theo quy chuẩn nội bộ của trường, không xử lý phân tách cấu trúc đa trường phức tạp.
* Thiết kế bảng dữ liệu gốc `student_masters` tách biệt hoàn toàn với bảng hồ sơ cá nhân `students`. Cơ chế này đảm bảo dữ liệu sinh viên nhà trường cấp ban đầu luôn nguyên vẹn, đồng thời bảo vệ toàn vẹn dữ liệu khi sinh viên tự thực hiện đăng ký tài khoản.
* Phân tách rạch ròi hai khái niệm trạng thái trong bảng `companies`:
  - `verification_status` (`company_verification_status` ENUM: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`): Quản lý vòng đời xét duyệt pháp nhân do Career Center thẩm định.
  - `relationship_status` (ENUM: `POTENTIAL`, `ACTIVE_PARTNER`, `STRATEGIC`...): Quản lý mức độ quan hệ hợp tác theo nghiệp vụ CRM.
* Áp dụng khóa ngoại, chỉ mục (Index) hiệu năng cao và ràng buộc kiểm tra toàn vẹn (CHECK constraint, UNIQUE constraint) trên hệ quản trị cơ sở dữ liệu quan hệ PostgreSQL 16.

---

## 15. Kiến trúc hệ thống
Hệ thống tuân thủ mô hình kiến trúc **Modular Monolith** nhằm tối ưu hóa năng suất phát triển trong thời gian 4 tháng của khóa luận tốt nghiệp, đồng thời đảm bảo sự rành mạch giữa các ranh giới nghiệp vụ:
* **Frontend Web Application:** Xây dựng bằng React / Next.js kết hợp TypeScript và Tailwind CSS; tổ chức component rõ ràng, responsive đa thiết bị.
* **Backend Application:** Xây dựng bằng **NestJS + TypeScript** theo kiến trúc Modular Monolith. Mỗi module nghiệp vụ sở hữu controller, service và ranh giới logic riêng biệt; giao tiếp liên module thông qua Public Interface/Contract, nghiêm cấm truy cập repository chéo trái phép.
* **Database Layer:** Cơ sở dữ liệu quan hệ **PostgreSQL 16**, quản lý lược đồ dữ liệu và truy vấn an toàn thông qua **Prisma ORM**.
* **Object Storage:** Sử dụng **MinIO** (tương thích hoàn toàn giao thức AWS S3) để lưu trữ tệp nhị phân độc lập (CV sinh viên, Logo doanh nghiệp). Database chỉ lưu trữ siêu dữ liệu (Metadata) và đường dẫn tham chiếu.
* **Authentication & Authorization:** Hệ thống phát hành phiên làm việc an toàn (Stateless JWT kết hợp HTTP-only Cookie hoặc Session được kiểm soát); phân quyền chặt chẽ thông qua hệ thống NestJS Guards ở tầng Backend.
* **Kiểm thử giao diện lập trình:** Tài liệu hóa chuẩn mực qua Swagger / OpenAPI; kiểm thử tự động và thủ công bằng Postman.

---

## 16. Dashboard và báo cáo

| Nhóm Dashboard / Báo cáo | Chỉ số & Nội dung thể hiện | Đối tượng sử dụng | Ưu tiên |
| :--- | :--- | :--- | :---: |
| **Tổng quan Career Center** | Tổng số đối tác doanh nghiệp, số tin tuyển dụng đang mở, số đơn ứng tuyển mới, số sinh viên được tuyển dụng thành công. | Career Center | P0 |
| **Bảng điều phối Tuyển dụng** | Tiến độ phễu tuyển dụng Kanban, tỷ lệ hồ sơ ở từng trạng thái, số lịch phỏng vấn trong tuần. | Employer, Career Center | P0 |
| **Bảng theo dõi CRM Đối tác** | Số lượng tương tác trong tháng, danh sách nhiệm vụ Follow-up chưa hoàn thành và cảnh báo công việc quá hạn. | Career Center | P0 |
| **Hành trình Sinh viên** | Số việc làm đã ứng tuyển, trạng thái xử lý hồ sơ, lịch hẹn phỏng vấn sắp tới. | Student | P0 |
| **Báo cáo Phễu chuyển đổi (Conversion)** | Phân tích tỷ lệ chuyển đổi qua các vòng: Applied → Reviewing → Interview → Offer → Hired theo từng tin tuyển dụng. | Career Center | P1 |
| **Báo cáo Nhu cầu Doanh nghiệp** | Thống kê số lượng việc làm và mức độ tuyển dụng phân bổ theo từng chuyên ngành đào tạo của nhà trường. | Career Center | P1 |
| **Trích xuất dữ liệu (Data Export)** | Xuất danh sách báo cáo ứng viên, báo cáo đối tác ra định dạng bảng tính CSV và Excel (XLSX). | Career Center | P1 |

---

## 17. Thông báo, nhật ký và truy vết
* **Hộp thư thông báo nội bộ (In-app Notification - P0):**
  - Thông báo cho Doanh nghiệp khi tài khoản hoặc tin tuyển dụng được Career Center phê duyệt hoặc yêu cầu chỉnh sửa/từ chối (kèm lý do).
  - Thông báo cho Sinh viên khi đơn ứng tuyển được chuyển bước trạng thái quan trọng hoặc khi nhận được lịch mời phỏng vấn mới.
  - Thông báo cho Nhà tuyển dụng khi có sinh viên mới nộp hồ sơ vào tin tuyển dụng đang mở.
* **Theo dõi công việc CRM (Follow-up Tasks):**
  - Công việc chăm sóc đối tác đến hạn hoặc quá hạn được tính toán động và hiển thị trực quan thông qua huy hiệu cảnh báo (Warning Badge) tại màn hình CRM của Career Center (không dùng notification tự động bằng cron job trong MVP để tối ưu phạm vi triển khai).
* **Nhật ký kiểm toán (Audit Trail - Module 15):**
  - Ghi nhận bắt buộc các hành vi nhạy cảm: Đăng nhập hệ thống, duyệt/từ chối doanh nghiệp, duyệt/đóng tin tuyển dụng, thay đổi trạng thái tuyển dụng, phân bổ vai trò quyền hạn và thay đổi cấu hình hệ thống.
  - Bảo đảm nguyên tắc bất biến ở cấp ứng dụng đối với bảng `activity_logs`.

---

## 18. Yêu cầu phi chức năng (NFRs)
* **Bảo mật (Security):** Mật khẩu người dùng được băm an toàn bằng thuật toán tiêu chuẩn; Backend kiểm tra quyền và quyền sở hữu (Ownership) trên 100% các endpoint nghiệp vụ; ngăn chặn truy cập chéo dữ liệu giữa các doanh nghiệp hoặc sinh viên.
* **Toàn vẹn dữ liệu (Data Integrity):** Thực thi nghiêm ngặt các ràng buộc khóa ngoại, quan hệ bảng và cơ chế giao dịch nguyên tử (Atomic Database Transactions) khi xử lý các chuỗi thao tác phức tạp (Đăng ký tài khoản, Nộp hồ sơ ứng tuyển, Cập nhật trạng thái).
* **Hiệu năng & Khả năng mở rộng (Performance):** 100% các API danh sách bắt buộc hỗ trợ phân trang (Pagination), lọc và sắp xếp; thiết lập chỉ mục (Indexes) hợp lý trên các khóa ngoại và trường tìm kiếm thường xuyên; triệt tiêu hoàn toàn vấn đề truy vấn N+1.
* **Tính khả dụng (Usability):** Giao diện thao tác thân thiện, bảng Kanban trực quan, thông báo phản hồi thao tác rõ ràng, phân biệt rõ các mã màu trạng thái.
* **Khả năng bảo trì (Maintainability):** Kiến trúc Modular Monolith phân tách mã nguồn rõ ràng theo ranh giới nghiệp vụ; quy ước đặt tên (Naming Convention) đồng nhất; mã lỗi chuẩn hóa; tài liệu hóa API đầy đủ.
* **Khả năng triển khai (Deployment):** Đóng gói nhất quán môi trường phát triển và demo thông qua Docker Compose (PostgreSQL, MinIO, Backend, Frontend).

---

## 19. Phạm vi MVP và ưu tiên triển khai

### 19.1. P0 — Bắt buộc hoàn thành để nghiệm thu đề tài
1. Xác thực người dùng, bảo mật mật khẩu và phân quyền RBAC đa tầng (Module 01).
2. Đối soát dữ liệu gốc `student_masters`, kích hoạt tài khoản và quản lý hồ sơ năng lực sinh viên (Module 02).
3. Tìm kiếm và hiển thị hồ sơ năng lực sinh viên công khai (Module 03).
4. Quy trình tự đăng ký pháp nhân và xét duyệt doanh nghiệp từ Career Center (Module 04).
5. Quản trị hồ sơ doanh nghiệp, danh bạ người liên hệ, trạng thái hợp tác và góc nhìn Company 360° cơ bản (Module 05).
6. Quy trình quản lý, phê duyệt và công bố tin tuyển dụng (Module 06).
7. Cổng tìm kiếm, lọc và xem chi tiết cơ hội việc làm công khai (Module 07).
8. Quy trình nộp đơn ứng tuyển, rút đơn, đóng băng CV Snapshot bất biến và lưu vết Status History (Module 08).
9. Phễu tuyển dụng Kanban điều phối ứng viên (Module 09).
10. Thiết lập lịch hẹn phỏng vấn và ghi nhận kết quả tuyển dụng (Module 10).
11. Nhật ký tương tác CRM và quản lý nhiệm vụ Follow-up Task có cảnh báo quá hạn trên giao diện (Module 11).
12. Hộp thư thông báo nội bộ In-app Notification theo dòng sự kiện (Module 12).
13. Bảng điều khiển KPI cơ bản gắn với không gian làm việc của từng Actor (Module 14 - Basic Widgets).
14. Ghi nhận nhật ký kiểm toán hệ thống `activity_logs` (Module 15).

### 19.2. P1 — Hoàn thành nâng cao khi tiến độ P0 ổn định
1. Lưu tin tuyển dụng quan tâm (Bookmark Job - Module 07).
2. Kênh thông báo bổ trợ qua Email (Email Notification - Module 12).
3. Quản lý sự kiện nghề nghiệp, Job Fair và tiếp nhận đăng ký tham dự (Module 13).
4. Phân hệ báo cáo thống kê chuyên sâu (Recruitment Conversion, Báo cáo theo ngành đào tạo) và chức năng xuất dữ liệu ra file CSV / Excel (Module 14 - Advanced Reports & Export).
5. Tải lên và quản lý bảng điểm (Transcript), tài liệu xác thực doanh nghiệp bổ sung.

### 19.3. P2 — Định hướng nghiên cứu mở rộng trong tương lai
1. Trí tuệ nhân tạo so khớp mức độ phù hợp giữa CV và Tin tuyển dụng (AI CV–Job Matching).
2. Gợi ý cơ hội việc làm thông minh dựa trên hành vi sinh viên (Job Recommendation).
3. Phân tích khoảng trống kỹ năng của sinh viên so với yêu cầu thị trường (Skill Gap Analysis).
4. Trợ lý ảo hỏi đáp quy chế, hướng nghiệp của nhà trường (RAG Career Assistant).
5. Tìm kiếm ngữ nghĩa nâng cao (Semantic Search).

---

## 20. Các chức năng không nằm trong scope (Out of Scope)
1. Không bắt buộc OTP SMS hoặc Email Verification link để kích hoạt tài khoản trong môi trường nghiệm thu.
2. Không xây dựng tính năng trò chuyện trực tuyến (Realtime Chat) giữa Sinh viên và Nhà tuyển dụng.
3. Không xây dựng bảng tiêu chí chấm điểm phỏng vấn (Interview Scorecard/Rubric) phức tạp.
4. Không xây dựng hệ thống quản lý đào tạo, điểm số chính khóa toàn diện như phần mềm Quản lý đào tạo (SIS).
5. Không xây dựng mạng xã hội nghề nghiệp mở rộng cho cộng đồng ngoài trường.
6. Không quản lý chấm công, tính lương hoặc vận hành nhân sự nội bộ (HRM) của doanh nghiệp.
7. Không để AI tự động đưa ra quyết định tuyển dụng hay loại bỏ hồ sơ của sinh viên.
8. Không bắt buộc tích hợp cơ chế đăng nhập một lần Google/Microsoft SSO trong phạm vi cốt lõi.
9. Không triển khai hạ tầng đa trường (Multi-university) trong môi trường đánh giá khóa luận.

---

## 21. Lộ trình thực hiện 4 tháng

| Mốc thời gian | Trọng tâm công việc | Kết quả bàn giao (Deliverables) |
| :--- | :--- | :--- |
| **Tuần 1 – 2** | Thống nhất Scope, chuẩn hóa 15 bộ SRS Module, thiết kế ERD chuẩn, hoàn thiện Technical Architecture. | Bộ hồ sơ phân tích yêu cầu phần mềm và kiến trúc hệ thống chính thức. |
| **Tuần 3 – 4** | Thiết lập dự án (NestJS, React, PostgreSQL, Docker), triển khai Module 01 (Auth & RBAC), nạp Master Data và Module 02 (Student Profile), Module 04 (Company Verification). | Nền tảng định danh, phân quyền và dữ liệu gốc hoạt động ổn định. |
| **Tuần 5 – 7** | Xây dựng Module 05 (Company CRM core), Module 06 (Job Management), Module 07 (Job Discovery) và Module 08 (Application Core & MinIO CV Snapshot). | Luồng việc làm và ứng tuyển cơ bản vận hành end-to-end. |
| **Tuần 8 – 9** | Hoàn thiện Module 09 (Kanban Pipeline), Module 10 (Interview), Module 12 (In-app Notification) và Module 15 (Audit Log). | Hoàn tất toàn bộ chu trình tuyển dụng từ nộp đơn đến ghi nhận kết quả. |
| **Tuần 10 – 11** | Triển khai Module 11 (Interaction & Follow-up, Company 360°); triển khai Module 13 (Career Event - P1) nếu tiến độ đúng hạn. | Hoàn thiện lớp nghiệp vụ CRM đối tác chuyên sâu. |
| **Tuần 12** | Tích hợp Dashboard KPI cơ bản (P0); xây dựng Báo cáo chuyên sâu và Export CSV/XLSX (P1) nếu tiến độ cho phép. | Hệ thống báo cáo và bảng điều khiển quản trị hoàn tất. |
| **Tuần 13** | Kiểm thử tích hợp toàn diện, rà soát lỗ hổng bảo mật, kiểm tra phân quyền Backend và khắc phục lỗi (Bug Fixing). | Hệ thống ổn định, bảo đảm tiêu chuẩn an toàn dữ liệu. |
| **Tuần 14** | Nạp dữ liệu thực nghiệm mẫu (Seed Data đầy đủ các kịch bản), đóng gói triển khai Docker Compose demo, viết tài liệu hướng dẫn. | Môi trường Demo hoàn chỉnh sẵn sàng vận hành thử nghiệm. |
| **Tuần 15 – 16** | Viết và hoàn thiện báo cáo khóa luận tốt nghiệp, chuẩn bị Slide thuyết trình; xây dựng prototype AI thử nghiệm nếu còn dư thời gian. | Bộ tài liệu khóa luận và slide bảo vệ trước hội đồng. |

*Nguyên tắc quản trị tiến độ:* Nếu xảy ra rủi ro chậm tiến độ, lập tức cắt giảm các tính năng thuộc phân hệ P2 trước, sau đó hoãn các tính năng P1; **tuyệt đối không lấy thời gian của phân hệ cốt lõi P0** để làm các tính năng phụ hoặc nghiên cứu AI.

---

## 22. Tiêu chí nghiệm thu hệ thống (Acceptance Criteria)
1. Người dùng thuộc 4 nhóm Actor đăng nhập thành công và được phân quyền chính xác theo ma trận RBAC.
2. Sinh viên có mã số hợp lệ trong `student_masters` và chưa có tài khoản có thể tự đăng ký tài khoản thành công.
3. Doanh nghiệp có thể tự đăng ký tài khoản và gửi hồ sơ xét duyệt đến trường.
4. Career Center duyệt hoặc từ chối doanh nghiệp; trường hợp từ chối bắt buộc có lý do và doanh nghiệp được phép nộp lại.
5. Doanh nghiệp được duyệt (`APPROVED`) có thể quản lý thông tin pháp nhân và danh bạ nhân sự đại diện.
6. Doanh nghiệp tạo tin tuyển dụng và gửi Career Center kiểm duyệt.
7. Career Center duyệt hoặc từ chối tin tuyển dụng; tin được duyệt chuyển sang trạng thái `PUBLISHED` và hiển thị trên cổng tìm việc.
8. Sinh viên tìm kiếm, lọc và xem được thông tin chi tiết của tin tuyển dụng hợp lệ.
9. Sinh viên nộp đơn ứng tuyển bằng một bản CV cụ thể; hệ thống ngăn chặn nộp trùng đơn vào cùng một công việc.
10. Đơn ứng tuyển phản ánh chính xác trạng thái hiện tại và lưu vết lịch sử biến đổi trong `application_status_histories`.
11. Bản CV dùng khi nộp hồ sơ được đóng băng an toàn dưới dạng CV Snapshot độc lập, không bị ảnh hưởng khi sinh viên đổi/xóa CV gốc.
12. Nhà tuyển dụng quản lý và chuyển bước hồ sơ ứng viên trên bảng Kanban trong đúng phạm vi công việc của doanh nghiệp mình.
13. Nhà tuyển dụng thiết lập và cập nhật lịch phỏng vấn thành công; hệ thống gửi thông báo In-app đến sinh viên.
14. Ghi nhận kết quả tuyển dụng cuối cùng của ứng viên.
15. Career Center truy cập và xem được bức tranh toàn cảnh Company 360° cùng lịch sử tương tác đối tác.
16. Career Center tạo được nhật ký tương tác và phân công nhiệm vụ Follow-up có kỳ hạn xử lý; các task quá hạn hiển thị cảnh báo nổi bật trên màn hình.
17. Bảng điều khiển Dashboard hiển thị các số liệu KPI nghiệp vụ chính xác và nhất quán.
18. Backend ngăn chặn triệt để mọi hành vi truy cập dữ liệu trái quyền hoặc truy cập chéo giữa các doanh nghiệp (kiểm thử IDOR thành công).
19. Mọi thao tác làm biến đổi dữ liệu quan trọng đều được ghi nhận đầy đủ vào bảng `activity_logs`.
20. Hệ thống có sẵn bộ dữ liệu mẫu (Seed Data) chuẩn mực để chứng minh trọn vẹn ít nhất 02 kịch bản tuyển dụng và chăm sóc đối tác hoàn chỉnh từ đầu đến cuối.

---

## 23. Rủi ro và phương án kiểm soát

| Rủi ro tiềm ẩn | Mức độ ảnh hưởng | Phương án kiểm soát kỹ thuật & quản trị |
| :--- | :---: | :--- |
| **Phình to phạm vi (Scope Creep)** | Rất cao | Khóa chặt danh mục P0/P1/P2; mọi đề xuất tính năng mới đều phải đánh giá dựa trên khung thời gian 4 tháng trước khi chấp thuận. |
| **Nguy cơ biến hệ thống thành sàn việc làm thuần túy** | Rất cao | Bắt buộc hoàn thiện các module CRM cốt lõi: Company Profile, Contacts, Relationship, Interaction, Follow-up và Company 360°. |
| **Trở ngại demo do phụ thuộc Email/OTP** | Cao | Loại bỏ triệt để ràng buộc OTP SMS và Email Verification bên ngoài; sử dụng đối soát dữ liệu gốc MSSV và quy trình phê duyệt nội bộ. |
| **Sa đà vào nghiên cứu AI** | Cao | Định vị AI là phân hệ mở rộng P2; hệ thống Web CRM tuyển dụng phải chạy hoàn chỉnh và độc lập mà không cần AI. |
| **Lỗ hổng bảo mật và phân quyền lỏng lẻo** | Cao | Kiểm soát phân quyền đa tầng (RBAC + Data Ownership) tại Backend NestJS Guards; xây dựng kịch bản kiểm thử tiêu cực (Negative Test Cases) chống truy cập chéo. |
| **Dữ liệu demo thiếu tính thuyết phục** | Trung bình | Xây dựng bộ kịch bản Seed Data phong phú gồm đầy đủ sinh viên, doanh nghiệp, tin tuyển dụng, đơn ứng tuyển qua nhiều trạng thái, tương tác và follow-up. |
| **Kiến trúc quá phức tạp gây vỡ tiến độ** | Rất cao | Kiên quyết lựa chọn kiến trúc **Modular Monolith**, triển khai cơ sở dữ liệu duy nhất PostgreSQL; không chia tách Microservices. |

---

## 24. Định hướng mở rộng tương lai (Roadmap)
1. **Mô hình Đa trường (Multi-university Platform):** Kiến trúc Multi-tenant cho phép nhiều trường đại học sử dụng chung một nền tảng với dữ liệu phân lập hoàn toàn.
2. **Xác thực tích hợp (Enterprise SSO):** Hỗ trợ đăng nhập một lần thông qua hệ thống cổng thông tin đào tạo của nhà trường (Microsoft 365 / Google Workspace / SAML).
3. **Mạng lưới cơ hội việc làm liên trường:** Cho phép doanh nghiệp tiếp cận và đăng tin tuyển dụng hướng đến nhiều trường đại học thành viên cùng lúc.
4. **Trí tuệ nhân tạo nâng cao:** Triển khai mô hình AI Matching tự động chấm điểm độ tương thích giữa CV và Job; RAG Career Assistant hỗ trợ giải đáp chính sách thực tập và hướng nghiệp.
5. **Tích hợp kênh truyền thông ngoài:** Đồng bộ lịch phỏng vấn với Google Calendar / Outlook Calendar; tự động gửi thông báo qua Zalo ZNS hoặc SMS Brandname.
6. **Ứng dụng di động (Mobile App):** Phát triển ứng dụng Flutter hoặc React Native dành riêng cho Sinh viên nhằm nâng cao trải nghiệm nhận thông báo và tìm việc làm.

*Lưu ý:* Các định hướng mở rộng trên được ghi nhận nhằm chứng minh tầm nhìn phát triển lâu dài của đề tài, hoàn toàn **không thuộc tiêu chí đánh giá nghiệm thu** trong phạm vi 4 tháng của khóa luận tốt nghiệp.

---

## 25. Câu hỏi bảo vệ có thể phát sinh trước hội đồng

* **Q1: Tại sao hệ thống chỉ triển khai cho một trường đại học mà không làm cho nhiều trường cùng lúc?**  
  *Trả lời:* Để kiểm soát chặt chẽ phạm vi nghiệp vụ và tập trung hoàn thiện chiều sâu của bài toán quản trị quan hệ (CRM) trong thời gian 4 tháng của khóa luận. Mỗi trường có quy chuẩn mã sinh viên, cơ cấu tổ chức và quy trình quan hệ doanh nghiệp rất khác nhau. Việc làm multi-university quá sớm sẽ làm tăng độ phức tạp về Tenant Isolation, SSO và phân quyền mà không làm tăng giá trị nghiệp vụ cốt lõi của đề tài.

* **Q2: Hệ thống này khác gì các trang web tuyển dụng thông thường như TopCV, VietnamWorks?**  
  *Trả lời:* Điểm khác biệt sống còn là hệ thống này lấy **CRM làm trung tâm** và đặt trong bối cảnh **trường đại học điều phối**. Hệ thống không chỉ kết nối ứng tuyển đơn thuần mà còn quản lý hồ sơ đối tác doanh nghiệp, danh bạ nhân sự, lịch sử tương tác của trường, phân công nhiệm vụ chăm sóc đối tác, thẩm định chất lượng tin tuyển dụng theo ngành đào tạo và cung cấp góc nhìn toàn cảnh Company 360° cho ban giám hiệu và đơn vị việc làm.

* **Q3: Trí tuệ nhân tạo (AI) có phải là yêu cầu bắt buộc của khóa luận này không?**  
  *Trả lời:* Không. Đề tài tập trung giải quyết trọn vẹn bài toán Phân tích thiết kế hệ thống thông tin, Quy trình nghiệp vụ tuyển dụng và CRM trường học. Toàn bộ hệ thống lõi hoạt động độc lập và hoàn chỉnh 100% không cần AI. AI chỉ đóng vai trò là phân hệ nghiên cứu mở rộng P2 sau khi hệ thống cốt lõi đã được nghiệm thu đạt chuẩn.

* **Q4: Vì sao cần phải lưu trữ bản CV Snapshot bất biến mà không dùng trực tiếp CV của sinh viên?**  
  *Trả lời:* Trong quy trình tuyển dụng, đơn ứng tuyển là một bằng chứng pháp lý và nghiệp vụ tại thời điểm nộp đơn. Sinh viên có thể cập nhật, chỉnh sửa kỹ năng hoặc xóa bản CV trong trang cá nhân sau khi nộp. Việc tạo bản CV Snapshot độc lập bảo đảm nhà tuyển dụng luôn nhìn thấy đúng bản CV mà sinh viên đã nộp tại thời điểm đó, bảo toàn tính bất biến và lịch sử của quy trình tuyển dụng.

* **Q5: Kiến trúc Modular Monolith có phù hợp với thời gian thực hiện 4 tháng không?**  
  *Trả lời:* Rất phù hợp. Kiến trúc Modular Monolith trên nền tảng NestJS + TypeScript và PostgreSQL cho phép nhóm phát triển phân tách rõ ràng ranh giới giữa 15 module nghiệp vụ, dễ dàng kiểm thử, bảo trì và quản lý giao dịch CSDL nguyên tử mà không phải chịu chi phí vận hành hạ tầng phức tạp, rủi ro phân tán mạng hay vấn đề tính nhất quán dữ liệu của kiến trúc Microservices.

---

## 26. Kết luận phạm vi
Tài liệu phạm vi phiên bản **v1.2** đã chuẩn hóa và đóng gói hoàn chỉnh bài toán xây dựng Hệ thống Web CRM kết nối Sinh viên – Doanh nghiệp trong quy trình tuyển dụng tại trường đại học:
1. **Ranh giới công nghệ thống nhất:** Frontend sử dụng React / Next.js + TypeScript; Backend sử dụng **NestJS + TypeScript** (Modular Monolith); Cơ sở dữ liệu sử dụng **PostgreSQL 16** truy cập qua **Prisma ORM**; Lưu trữ tệp trên **MinIO / S3**.
2. **Trọng tâm nghiệp vụ:** Định vị sắc nét một hệ thống University Recruitment CRM xoay quanh 3 trụ cột: Quản trị quan hệ đối tác của trường (CRM Core), Quy trình tuyển dụng minh bạch (Job & Recruitment Pipeline) và Quản lý ứng viên đáng tin cậy dựa trên dữ liệu sinh viên nhà trường cấp sẵn.
3. **Phân bổ khả thi:** 15 module nghiệp vụ được phân tầng thứ bậc rõ ràng: hoàn thành dứt điểm phân hệ cốt lõi **P0** trong 4 tháng; mở rộng phân hệ **P1** khi tiến độ cho phép; đưa các ý tưởng AI và kiến trúc đa trường vào lộ trình nghiên cứu tương lai **P2**.

Bản tài liệu này là căn cứ tối cao, đồng bộ 100% với 15 bộ tài liệu SRS Module chi tiết, Tài liệu Kiến trúc Kỹ thuật (Technical Architecture Specification) và Tài liệu Kiến trúc Cơ sở Dữ liệu (Database Architecture Specification) của toàn bộ dự án.

---

## PHỤ LỤC A – DANH SÁCH USE CASE ĐỀ XUẤT (38 USE CASES)
* **Nhóm Xác thực & Quản trị Hệ thống:**
  - `UC01`: Đăng nhập / Đăng xuất hệ thống
  - `UC02`: Quản lý thông tin tài khoản cá nhân
  - `UC03`: Cấu hình Phân quyền Vai trò (RBAC)
  - `UC35`: Ghi nhận và tra cứu Nhật ký kiểm toán (Activity Log)
  - `UC36`: Quản lý Người dùng và Vai trò
* **Nhóm Sinh viên & Hồ sơ Năng lực:**
  - `UC04`: Đăng ký tài khoản Sinh viên
  - `UC05`: Đối soát định danh với Student Master Data
  - `UC06`: Quản lý Hồ sơ năng lực sinh viên
  - `UC07`: Quản lý Kỹ năng, Kinh nghiệm, Dự án
  - `UC08`: Tải lên và Quản lý nhiều bản CV
  - `UC09`: Tìm kiếm và xem Hồ sơ năng lực sinh viên công khai
  - `UC38`: Quản lý quyền hiển thị dữ liệu sinh viên
* **Nhóm Doanh nghiệp & CRM Đối tác:**
  - `UC10`: Đăng ký tài khoản Doanh nghiệp ban đầu
  - `UC11`: Gửi yêu cầu thẩm định Doanh nghiệp
  - `UC12`: Thẩm định / Từ chối hồ sơ Doanh nghiệp (Career Center)
  - `UC13`: Quản lý Hồ sơ pháp nhân Doanh nghiệp
  - `UC14`: Quản lý Danh bạ Người liên hệ (Company Contacts)
  - `UC28`: Ghi nhận Nhật ký tương tác CRM (Interactions)
  - `UC29`: Tạo, phân công và hoàn thành nhiệm vụ Follow-up Task
  - `UC37`: Điều hành toàn cảnh qua màn hình Company 360°
* **Nhóm Cơ hội Việc làm:**
  - `UC15`: Tạo tin tuyển dụng (Job Draft)
  - `UC16`: Gửi tin tuyển dụng yêu cầu xét duyệt
  - `UC17`: Thẩm định / Từ chối tin tuyển dụng (Career Center)
  - `UC18`: Công bố / Đóng tin tuyển dụng
  - `UC19`: Tìm kiếm và lọc cơ hội việc làm công khai
  - `UC20`: Lưu tin tuyển dụng yêu thích (Bookmark Job - P1)
* **Nhóm Ứng tuyển & Điều phối Tuyển dụng:**
  - `UC21`: Nộp đơn ứng tuyển kèm bản sao lưu CV Snapshot
  - `UC22`: Rút đơn ứng tuyển (Withdraw Application)
  - `UC23`: Xem danh sách ứng viên nộp hồ sơ theo từng vị trí
  - `UC24`: Chuyển trạng thái tuyển dụng trên Kanban Pipeline
  - `UC25`: Tra cứu Lịch sử biến đổi trạng thái ứng tuyển
  - `UC26`: Thiết lập và cập nhật Lịch phỏng vấn (Interview)
  - `UC27`: Ghi nhận Kết quả tuyển dụng cuối cùng
* **Nhóm Sự kiện, Thông báo & Báo cáo:**
  - `UC30`: Tạo và quản lý Sự kiện nghề nghiệp (P1)
  - `UC31`: Đăng ký tham gia Sự kiện hướng nghiệp (P1)
  - `UC32`: Tiếp nhận và xem Thông báo nội bộ (In-app Notification)
  - `UC33`: Theo dõi Bảng điều khiển KPI (Dashboard)
  - `UC34`: Xem và xuất Báo cáo tuyển dụng chuyên sâu (Report - P1)

---

## PHỤ LỤC B – NGUYÊN TẮC CHỐT SCOPE
1. Doanh nghiệp tự đăng ký pháp nhân; Career Center là chốt chặn thẩm định và phê duyệt duy nhất.
2. Sinh viên đăng ký tài khoản dựa trên đối soát dữ liệu gốc MSSV (`student_masters`) của nhà trường; không phụ thuộc OTP SMS/Email.
3. Tin tuyển dụng bắt buộc phải qua khâu kiểm duyệt của Career Center trước khi được công bố công khai (`PUBLISHED`).
4. Phân tách rõ ràng giữa Hồ sơ nghề nghiệp công khai (Public Career Profile) và Dữ liệu cá nhân riêng tư của sinh viên.
5. Đơn ứng tuyển bắt buộc sở hữu trạng thái hiện tại, lưu vết toàn bộ lịch sử trạng thái và bảo toàn bản sao CV Snapshot bất biến.
6. Module Phỏng vấn được tối ưu hóa ở mức đơn giản (Lịch hẹn, hình thức, liên kết phòng họp, kết quả); không xây dựng tiêu chí chấm điểm (Scorecard) phức tạp.
7. CRM đối tác là phân hệ thực chất của hệ thống, bao gồm Company Profile, Contacts, Relationship Status, Interactions, Follow-up Tasks và Company 360°.
8. Cảnh báo Follow-up quá hạn hiển thị trực tiếp trên giao diện CRM; không triển khai notification reminder tự động bằng cron job trong MVP.
9. Kiến trúc kỹ thuật bắt buộc là **Modular Monolith** triển khai trên **NestJS + TypeScript** và **PostgreSQL + Prisma**; không triển khai Microservices.
10. Hệ thống vận hành độc lập hoàn chỉnh; không coi AI là điều kiện bắt buộc để vận hành hệ thống cốt lõi.
11. Triển khai gói gọn trong phạm vi một trường đại học cụ thể trong phiên bản nghiệm thu.
12. Phân hệ cốt lõi P0 phải hoàn thành và kiểm thử đạt chuẩn trước khi phân bổ nguồn lực sang P1 và P2.

---

## PHỤ LỤC C – BUSINESS RULES CỐT LÕI (BR)
* `BR-01`: Doanh nghiệp mới đăng ký luôn khởi tạo ở trạng thái xét duyệt `PENDING`.
* `BR-02`: Chỉ cán bộ thuộc Career Center mới có quyền phê duyệt (`APPROVE`) hoặc từ chối (`REJECT`) doanh nghiệp.
* `BR-03`: Khi từ chối doanh nghiệp, bắt buộc phải nhập lý do từ chối (`rejection_reason`); doanh nghiệp được phép sửa hồ sơ và nộp lại (`RESUBMIT`).
* `BR-04`: Chỉ doanh nghiệp đã được xét duyệt hợp lệ (`APPROVED`) mới được tạo và gửi duyệt tin tuyển dụng.
* `BR-05`: Tin tuyển dụng chỉ được hiển thị công khai cho sinh viên khi đã được Career Center duyệt và chuyển sang `PUBLISHED`.
* `BR-06`: Tin tuyển dụng khi đã hết hạn nộp hồ sơ (`deadline`) hoặc đã đóng (`CLOSED`) thì hệ thống tự động từ chối nhận đơn ứng tuyển mới.
* `BR-07`: Một sinh viên không được nộp trùng nhiều đơn ứng tuyển vào cùng một tin tuyển dụng đang mở.
* `BR-08`: Mọi đơn ứng tuyển bắt buộc phải có trạng thái hiện tại và được ghi vết đầy đủ vào bảng lịch sử trạng thái (`application_status_histories`).
* `BR-09`: Bản CV đính kèm khi nộp đơn phải được sao chép độc lập thành bản CV Snapshot bất biến; không bị ảnh hưởng khi sinh viên sửa hoặc xóa CV gốc.
* `BR-10`: Nhà tuyển dụng chỉ được xem, sàng lọc và xử lý hồ sơ ứng viên nộp vào các tin tuyển dụng thuộc phạm vi doanh nghiệp mà mình đại diện.
* `BR-11`: Mọi lịch hẹn phỏng vấn bắt buộc phải gắn kết với một đơn ứng tuyển cụ thể.
* `BR-12`: Hoạt động tương tác CRM bắt buộc gắn với một doanh nghiệp cụ thể, có thể liên kết tùy chọn với người liên hệ, việc làm hoặc sự kiện.
* `BR-13`: Nhiệm vụ Follow-up bắt buộc phải chỉ định cán bộ phụ trách (`owner_user_id`) và thời hạn hoàn thành (`due_date`).
* `BR-14`: Ghi chú nội bộ (Internal Notes) của Career Center chỉ hiển thị cho nhân sự nhà trường có thẩm quyền, tuyệt đối không trả về cho doanh nghiệp hoặc sinh viên.
* `BR-15`: Dữ liệu riêng tư của sinh viên (Số điện thoại, email cá nhân, bảng điểm) không được công khai mặc định.
* `BR-16`: Mật khẩu người dùng bắt buộc phải được băm an toàn một chiều, không bao giờ được lưu trữ dạng thô (plaintext) hay gửi kèm trong phản hồi API.
* `BR-17`: Toàn bộ các quy tắc phân quyền (RBAC) và kiểm tra sở hữu dữ liệu (Ownership) bắt buộc phải thực thi tại Backend.
* `BR-18`: Mọi thao tác làm biến đổi dữ liệu nghiệp vụ quan trọng bắt buộc phải được ghi vết vào bảng kiểm toán `activity_logs`.
* `BR-19`: Đăng ký tài khoản sinh viên dựa trên đối soát dữ liệu gốc MSSV (`student_masters`) của nhà trường; không bắt buộc OTP SMS/Email.
* `BR-20`: Trí tuệ nhân tạo (AI) tuyệt đối không được tự động ra quyết định tuyển dụng hay loại bỏ hồ sơ của sinh viên.

---

## LỊCH SỬ HIỆU CHỈNH TÀI LIỆU

| Phiên bản | Ngày hiệu chỉnh | Người thực hiện | Nội dung tóm tắt | Mục đích hiệu chỉnh |
| :---: | :---: | :---: | :--- | :--- |
| **v1.0** | 2026-05-10 | BA Team | Khởi tạo tài liệu phạm vi ban đầu. | Định vị hệ thống University Recruitment CRM và giới hạn thời gian 4 tháng. |
| **v1.1** | 2026-09-20 | BA Team | Bổ sung quy trình đăng ký doanh nghiệp, đối soát MSSV không OTP, CRM core, rút gọn phỏng vấn và phân tầng P0/P1/P2. | Bổ sung các quyết định nghiệp vụ trước khi thẩm định đề tài. |
| **v1.2** | 2026-10-11 | Senior BA & Software Architect | **Chuẩn hóa toàn diện:**<br>1. Thống nhất 100% Backend là **NestJS + TypeScript** (Modular Monolith), loại bỏ mọi đề cập sai lệch về Go.<br>2. Bổ sung thực thể bảng gốc `student_masters` tách biệt với `students`.<br>3. Điều chỉnh chính sách Follow-up: Cảnh báo Overdue trực tiếp trên UI CRM, bỏ notification reminder tự động bằng cron job trong MVP (khớp Module 11 & 12).<br>4. Đồng bộ phân tầng Module 14: KPI widget cơ bản (P0) và Phân hệ Báo cáo nâng cao / Export (P1).<br>5. Chuẩn hóa danh mục 15 module cốt lõi và ma trận Use Case, đảm bảo tính truy vết tuyệt đối. | **Implementation Ready:** Đồng bộ 100% với 15 bộ tài liệu SRS Module, Technical Architecture và Database Architecture Specification. |