import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function hashPassword(plainText: string): Promise<string> {
  try {
    const argon2 = require('argon2');
    return await argon2.hash(plainText);
  } catch {
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(plainText, 10);
  }
}

async function main() {
  const email = 'admin@agu.edu.vn';
  const rawPassword = 'Password@123';

  // Tự động tìm Role Admin (hỗ trợ cả mã ADMIN hoặc SYSTEM_ADMIN trong DB)
  const adminRole = await prisma.role.findFirst({
    where: { code: { in: ['SYSTEM_ADMIN', 'ADMIN'] } },
  });

  if (!adminRole) {
    throw new Error('Không tìm thấy Role ADMIN/SYSTEM_ADMIN. Hãy chạy `npx prisma db seed` trước!');
  }

  const passwordHash = await hashPassword(rawPassword);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status: 'ACTIVE',
      mustChangePassword: false,
    },
    create: {
      email,
      passwordHash,
      status: 'ACTIVE',
      mustChangePassword: false,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log(`✅ Đã khởi tạo tài khoản Admin thành công!`);
  console.log(`   - Email:    ${email}`);
  console.log(`   - Password: ${rawPassword}`);
  console.log(`   - Role:     ${adminRole.code}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
