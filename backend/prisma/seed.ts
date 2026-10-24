import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===================================================================
// 1. ĐỊNH NGHĨA DANH MỤC 4 ROLES CHUẨN THEO ĐẶC TẢ SRS
// ===================================================================
const ROLES = [
  {
    code: 'STUDENT',
    name: 'Sinh viên',
    description:
      'Sinh viên tìm việc, tạo hồ sơ năng lực và ứng tuyển tin tuyển dụng',
  },
  {
    code: 'EMPLOYER',
    name: 'Đại diện Doanh nghiệp',
    description:
      'Nhà tuyển dụng đăng tin, quản lý phễu ứng viên và lên lịch phỏng vấn',
  },
  {
    code: 'CAREER_CENTER',
    name: 'Cán bộ Trung tâm Hướng nghiệp',
    description:
      'Cán bộ nhà trường quản lý đối tác CRM, duyệt doanh nghiệp và duyệt tin tuyển dụng',
  },
  {
    code: 'ADMIN',
    name: 'Quản trị viên Hệ thống',
    description:
      'Quản trị viên kỹ thuật quản lý tài khoản, trạng thái và ma trận phân quyền',
  },
];

// ===================================================================
// 2. ĐỊNH NGHĨA DANH MỤC QUYỀN HẠN HẠT NHÂN (PERMISSIONS CATALOG)
// ===================================================================
const PERMISSIONS = [
  // Phân hệ AUTH & RBAC (Module 01)
  {
    code: 'AUTH_PROFILE_READ',
    name: 'Xem thông tin tài khoản cá nhân',
    module: 'AUTH',
  },
  {
    code: 'AUTH_PASSWORD_CHANGE',
    name: 'Đổi mật khẩu tài khoản',
    module: 'AUTH',
  },
  {
    code: 'USER_READ',
    name: 'Xem danh sách tài khoản người dùng',
    module: 'AUTH',
  },
  {
    code: 'USER_STATUS_UPDATE',
    name: 'Khóa hoặc mở khóa tài khoản',
    module: 'AUTH',
  },
  {
    code: 'RBAC_MANAGE',
    name: 'Quản lý ma trận Role và Permission',
    module: 'AUTH',
  },

  // Phân hệ STUDENT (Module 02)
  {
    code: 'STUDENT_MASTER_IMPORT',
    name: 'Import dữ liệu danh sách sinh viên',
    module: 'STUDENT',
  },
  {
    code: 'STUDENT_PROFILE_READ',
    name: 'Xem hồ sơ sinh viên',
    module: 'STUDENT',
  },
  {
    code: 'STUDENT_PROFILE_UPDATE',
    name: 'Cập nhật hồ sơ sinh viên cá nhân',
    module: 'STUDENT',
  },
  {
    code: 'STUDENT_CV_MANAGE',
    name: 'Quản lý các bản CV tải lên',
    module: 'STUDENT',
  },

  // Phân hệ JOB & DISCOVERY (Module 06 & 07)
  {
    code: 'JOB_SEARCH',
    name: 'Tìm kiếm và xem chi tiết việc làm',
    module: 'JOB',
  },
  { code: 'JOB_BOOKMARK', name: 'Lưu việc làm yêu thích', module: 'JOB' },
  { code: 'JOB_CREATE', name: 'Tạo tin tuyển dụng mới', module: 'JOB' },
  {
    code: 'JOB_UPDATE',
    name: 'Cập nhật tin tuyển dụng công ty',
    module: 'JOB',
  },
  {
    code: 'JOB_APPROVE',
    name: 'Duyệt hoặc từ chối tin tuyển dụng',
    module: 'JOB',
  },

  // Phân hệ COMPANY & CRM (Module 04, 05 & 11)
  {
    code: 'COMPANY_PROFILE_UPDATE',
    name: 'Cập nhật hồ sơ doanh nghiệp',
    module: 'COMPANY',
  },
  {
    code: 'COMPANY_VERIFY_REQUEST',
    name: 'Gửi yêu cầu thẩm định công ty',
    module: 'COMPANY',
  },
  {
    code: 'COMPANY_VERIFY_REVIEW',
    name: 'Thẩm định duyệt/từ chối công ty',
    module: 'COMPANY',
  },
  {
    code: 'COMPANY_CRM_MANAGE',
    name: 'Quản lý thông tin quan hệ hợp tác CRM',
    module: 'CRM',
  },

  // Phân hệ APPLICATION & RECRUITMENT PIPELINE (Module 08, 09 & 10)
  {
    code: 'APPLICATION_APPLY',
    name: 'Nộp đơn ứng tuyển việc làm',
    module: 'APPLICATION',
  },
  {
    code: 'APPLICATION_WITHDRAW',
    name: 'Rút đơn ứng tuyển',
    module: 'APPLICATION',
  },
  {
    code: 'APPLICATION_REVIEW',
    name: 'Duyệt ứng viên trên phễu Kanban',
    module: 'APPLICATION',
  },
  {
    code: 'INTERVIEW_MANAGE',
    name: 'Quản lý và cập nhật lịch phỏng vấn',
    module: 'INTERVIEW',
  },

  // Phân hệ AUDIT LOG (Module 15)
  {
    code: 'AUDIT_LOG_READ',
    name: 'Xem nhật ký kiểm toán hệ thống',
    module: 'AUDIT',
  },
];

// ===================================================================
// 3. MA TRẬN ÁNH XẠ ROLE -> DANH SÁCH PERMISSIONS TƯƠNG ỨNG
// ===================================================================
const ROLE_PERMISSIONS_MAPPING: Record<string, string[]> = {
  STUDENT: [
    'AUTH_PROFILE_READ',
    'AUTH_PASSWORD_CHANGE',
    'STUDENT_PROFILE_READ',
    'STUDENT_PROFILE_UPDATE',
    'STUDENT_CV_MANAGE',
    'JOB_SEARCH',
    'JOB_BOOKMARK',
    'APPLICATION_APPLY',
    'APPLICATION_WITHDRAW',
  ],
  EMPLOYER: [
    'AUTH_PROFILE_READ',
    'AUTH_PASSWORD_CHANGE',
    'COMPANY_PROFILE_UPDATE',
    'COMPANY_VERIFY_REQUEST',
    'JOB_CREATE',
    'JOB_UPDATE',
    'STUDENT_PROFILE_READ',
    'APPLICATION_REVIEW',
    'INTERVIEW_MANAGE',
  ],
  CAREER_CENTER: [
    'AUTH_PROFILE_READ',
    'AUTH_PASSWORD_CHANGE',
    'STUDENT_MASTER_IMPORT',
    'STUDENT_PROFILE_READ',
    'JOB_SEARCH',
    'JOB_APPROVE',
    'COMPANY_VERIFY_REVIEW',
    'COMPANY_CRM_MANAGE',
    'APPLICATION_REVIEW',
  ],
  ADMIN: [
    'AUTH_PROFILE_READ',
    'AUTH_PASSWORD_CHANGE',
    'USER_READ',
    'USER_STATUS_UPDATE',
    'RBAC_MANAGE',
    'STUDENT_MASTER_IMPORT',
    'AUDIT_LOG_READ',
  ],
};

// ===================================================================
// HÀM CHÍNH THỰC THI SEEDING (ĐẢM BẢO TÍNH LŨY ĐẲNG - IDEMPOTENCY)
// ===================================================================
async function main() {
  console.log(
    '🚀 Bắt đầu quá trình nạp dữ liệu phân quyền RBAC (TASK-S2-02)...',
  );

  // Bước 1: Nạp danh mục Permissions bằng upsert
  console.log('📦 Đang nạp danh mục Permissions...');
  const permissionMap = new Map<string, string>(); // code -> id

  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {
        name: perm.name,
        module: perm.module,
      },
      create: {
        code: perm.code,
        name: perm.name,
        module: perm.module,
      },
    });
    permissionMap.set(record.code, record.id);
  }
  console.log(`✅ Đã nạp thành công ${permissionMap.size} permissions.`);

  // Bước 2: Nạp danh mục Roles bằng upsert
  console.log('🛡️  Đang nạp danh mục 4 Roles chuẩn...');
  const roleMap = new Map<string, string>(); // code -> id

  for (const role of ROLES) {
    const record = await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });
    roleMap.set(record.code, record.id);
  }
  console.log(`✅ Đã nạp thành công ${roleMap.size} roles.`);

  // Bước 3: Thiết lập liên kết trong bảng role_permissions (Composite PK)
  console.log('🔗 Đang thiết lập liên kết ma trận Role - Permission...');
  let totalLinks = 0;

  for (const [roleCode, permCodes] of Object.entries(
    ROLE_PERMISSIONS_MAPPING,
  )) {
    const roleId = roleMap.get(roleCode);
    if (!roleId) continue;

    for (const permCode of permCodes) {
      const permissionId = permissionMap.get(permCode);
      if (!permissionId) continue;

      // Upsert dựa trên Composite Primary Key: @@id([roleId, permissionId])
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {}, // Không thay đổi gì nếu đã liên kết
        create: {
          roleId,
          permissionId,
        },
      });
      totalLinks++;
    }
  }

  console.log(`🎉 Hoàn tất gán ${totalLinks} quyền cho 4 Roles hệ thống!`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi thực thi seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Đã đóng kết nối Prisma an toàn.');
  });
