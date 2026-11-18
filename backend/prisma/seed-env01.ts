import { PrismaClient, StudentStatus, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function hashPassword(plainText: string): Promise<string> {
  try {
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(plainText, 10);
  } catch {
    try {
      const bcryptjs = require('bcryptjs');
      return await bcryptjs.hash(plainText, 10);
    } catch {
      const argon2 = require('argon2');
      return await argon2.hash(plainText);
    }
  }
}

async function ensureUserWithRole(
  email: string,
  passwordHash: string,
  roleCode: string,
  status: UserStatus = 'ACTIVE',
) {
  const role = await prisma.role.findUnique({ where: { code: roleCode } });
  if (!role) {
    throw new Error(`Không tìm thấy Role "${roleCode}". Hãy chạy "npx prisma db seed" trước!`);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status,
      mustChangePassword: false,
    },
    create: {
      email,
      passwordHash,
      status,
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: role.id,
    },
  });

  return user;
}

async function main() {
  console.log('🚀 Bắt đầu khởi tạo dữ liệu tài khoản kiểm thử ENV-01...');
  const defaultHash = await hashPassword('Password@123');

  // 1 & 2. STUDENT_ACTIVE_01 & STUDENT_ACTIVE_02 (tận dụng 2 SV đang có trong DB)
  const activeStudents = [
    {
      email: 'duy_dth235632@student.agu.edu.vn',
      studentCode: 'DTH235632',
      fullName: 'Khánh Duy (Student Active 01)',
      major: 'Kỹ thuật phần mềm',
      phone: '0911111111',
      bio: 'Sinh viên năm 4 chuyên ngành Kỹ thuật phần mềm',
      visibility: true,
    },
    {
      email: 'a_dth215001@student.agu.edu.vn',
      studentCode: 'DTH215001',
      fullName: 'Nguyễn Văn A (Student Active 02)',
      major: 'Công nghệ thông tin',
      phone: '0922222222',
      bio: 'Sinh viên năm cuối định hướng Backend NestJS',
      visibility: false,
    },
  ];

  for (const sv of activeStudents) {
    const user = await ensureUserWithRole(sv.email, defaultHash, 'STUDENT', 'ACTIVE');

    let master = await prisma.studentMaster.findUnique({
      where: { institutionalEmail: sv.email },
    });
    if (master) {
      master = await prisma.studentMaster.update({
        where: { id: master.id },
        data: { userId: user.id, status: StudentStatus.ACTIVE },
      });
    } else {
      master = await prisma.studentMaster.create({
        data: {
          studentCode: sv.studentCode,
          fullName: sv.fullName,
          institutionalEmail: sv.email,
          major: sv.major,
          faculty: 'Công nghệ thông tin',
          academicYear: 2023,
          status: StudentStatus.ACTIVE,
          userId: user.id,
        },
      });
    }

    const existingProfile = await prisma.student.findFirst({
      where: { OR: [{ userId: user.id }, { studentMasterId: master.id }] },
    });
    if (!existingProfile) {
      await prisma.student.create({
        data: {
          studentMasterId: master.id,
          userId: user.id,
          phone: sv.phone,
          bio: sv.bio,
          address: 'Long Xuyên, An Giang',
          careerProfileVisibility: sv.visibility,
        },
      });
    }
  }

  // 3. STUDENT_SUSPENDED (dữ liệu master bị đình chỉ, chưa kích hoạt user_id để test SSO-07)
  const suspendedEmail = 'suspended_dth215003@student.agu.edu.vn';
  const existingSuspended = await prisma.studentMaster.findUnique({
    where: { institutionalEmail: suspendedEmail },
  });
  if (existingSuspended) {
    await prisma.studentMaster.update({
      where: { id: existingSuspended.id },
      data: { status: StudentStatus.SUSPENDED, userId: null },
    });
  } else {
    await prisma.studentMaster.create({
      data: {
        studentCode: 'DTH215003',
        fullName: 'Trần Văn Đình Chỉ',
        institutionalEmail: suspendedEmail,
        major: 'Hệ thống thông tin',
        faculty: 'Công nghệ thông tin',
        academicYear: 2021,
        status: StudentStatus.SUSPENDED,
        userId: null,
      },
    });
  }

  // 4. EMPLOYER
  await ensureUserWithRole('employer@company.vn', defaultHash, 'EMPLOYER', 'ACTIVE');

  // 5. CAREER_CENTER
  await ensureUserWithRole('careercenter@agu.edu.vn', defaultHash, 'CAREER_CENTER', 'ACTIVE');

  // 6. User LOCKED (dùng cho AUTH-04)
  await ensureUserWithRole('locked_user@student.agu.edu.vn', defaultHash, 'STUDENT', 'LOCKED');

  // 7. User INACTIVE (dùng cho AUTH-05)
  await ensureUserWithRole('inactive_user@student.agu.edu.vn', defaultHash, 'STUDENT', 'INACTIVE');

  // Bổ sung: User STUDENT hợp lệ nhưng chưa có bản ghi trong bảng students (dùng cho PROFILE-02)
  await ensureUserWithRole('noprofile_dth215004@student.agu.edu.vn', defaultHash, 'STUDENT', 'ACTIVE');

  console.log('✅ Khởi tạo hoàn tất toàn bộ tài khoản kiểm thử (Mật khẩu chung: Password@123)!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi chạy seed ENV-01:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
