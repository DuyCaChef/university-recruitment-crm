import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

@Module({
  imports: [PrismaModule, StorageModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 1. Guard Tầng 1: Chạy đầu tiên để xác thực  JWT và kiểm tra trạng thái ACTIVE
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 2. Guard Tầng 2a: Chạy tiếp theo để kiểm tra vai trò Role
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // 3. Guard Tầng 2b: Chạy cuối cùng để kiểm tra quyền hạn chi tiết Permission
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
