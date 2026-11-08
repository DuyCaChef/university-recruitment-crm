import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Nghiệp vụ xác thực thông tin đăng nhập và cấp phát phiên làm việc
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

  /**
   * Hàm xử lý đăng xuất: Xóa Refresh Token Cookie và thu hồi phiên làm việc
   */
  async logout(res: Response) {
    // Xóa Refresh Token Cookie bằng cách đặt maxAge = 0 hoặc gọi clearCookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });

    return {
      statusCode: 200,
      message: 'Đăng xuất thành công. Đã thu hồi phiên làm việc.',
    };
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        status: true,
        mustChangePassword: true,
        lastLoginAt: true,
        createdAt: true,
        // Chống rò rỉ dữ liệu: Tuyệt đối KHÔNG select passwordHash
      },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại.');
    }

    return {
      statusCode: 200,
      message: 'Lấy thông tin tài khoản thành công. ',
      data: user,
    };
  }

  /*
   * Nghiệp vụ kiểm tra mật khẩu hiện tại, đổi mật khẩu mới và băm mật khẩu mới.
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu xác nhận không khớp với mật khẩu mới.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại.');
    }

    // Đối soát mật khẩu hiện tại
    const isPasswordValid = await this.passwordService.comparePassword(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      // Trả mã 400 Bad Request
      throw new BadRequestException('Mật khẩu hiện tại không chính xác.');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'Mật khẩu mới phải khác mật khẩu hiện tại.',
      );
    }

    // Băm mật khẩu mới
    const newPasswordHash = await this.passwordService.hashPassword(
      dto.newPassword,
    );

    // Cập nhật CSDL và hạ cờ mustChangePassword trong cùng 1 transaction/lệnh
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return {
      statusCode: 200,
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
    };
  }
}
