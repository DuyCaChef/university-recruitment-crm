import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from '../../infrastructure/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}), // Đăng ký JwtModule rỗng, cấu hình chi tiết nạp động qua TokenService
  ],
  controllers: [AuthController],
  providers: [PasswordService, TokenService, AuthService],
  exports: [
    PasswordService,
    TokenService, // Export để JwtAuthGuard ở Task S2-04 có thể tái sử dụng
  ],
})
export class AuthModule {}
