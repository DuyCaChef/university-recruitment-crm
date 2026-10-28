import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Nghiệp vụ xác thực thông tin đăng nhập và cấp phát phiên làm việc (FR-AUTH-01)
   */
  async login(loginDto: LoginDto, res: Response) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();

    // 1. Tìm tài khoản người dùng theo email (kèm roles và permissions)
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    // 2. Bảo vệ chống dò quét danh tính (Anti-Enumeration): Trả 401 chung nếu không tìm thấy
    if (!user) {
      throw new UnauthorizedException(
        'Thông tin email hoặc mật khẩu không chính xác.',
      );
    }

    // 3. So khớp mật khẩu băm qua PasswordService
    const isPasswordValid = await this.passwordService.comparePassword(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Thông tin email hoặc mật khẩu không chính xác.',
      );
    }

    // 4. Tầng 1: Kiểm tra trạng thái tài khoản (users.status)
    if (user.status === 'LOCKED') {
      throw new ForbiddenException(
        'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Career Center.',
      );
    }
    if (user.status === 'INACTIVE') {
      throw new ForbiddenException('Tài khoản hiện không còn hoạt động.');
    }

    // 5. Thu thập danh sách Role và Permission phân phẳng (Flat list)
    const roles: string[] = [];
    const permissionsSet = new Set<string>();

    for (const ur of user.userRoles) {
      roles.push(ur.role.code);
      for (const rp of ur.role.rolePermissions) {
        permissionsSet.add(rp.permission.code);
      }
    }
    const permissions = Array.from(permissionsSet);

    // 6. Cấp phát cặp Token thông qua TokenService
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      roles,
      permissions,
      mustChangePassword: user.mustChangePassword,
    });

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
    });

    // 7. Ghi Refresh Token an toàn vào HttpOnly Cookie
    this.tokenService.setRefreshTokenCookie(res, refreshToken);

    // 8. Cập nhật mốc thời gian đăng nhập gần nhất
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 9. Trả Access Token trong Body JSON (Tuyệt đối không trả passwordHash)
    return {
      statusCode: 200,
      message: 'Đăng nhập thành công.',
      data: {
        accessToken,
        mustChangePassword: user.mustChangePassword,
        user: {
          id: user.id,
          email: user.email,
          roles,
          permissions,
        },
      },
    };
  }
}
