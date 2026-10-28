import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'super_secret_jwt_access_key_agu_crm_2026',
    });
  }

  /**
   * Phương thức validate được Passport tự động gọi sau khi giải mã chữ ký JWT hợp lệ.
   * Kiểm tra trực tiếp vào CSDL để ngăn chặn token của user đã bị xóa hoặc bị khóa.
   */
  async validate(payload: JwtPayload) {
    // 1. Kiểm tra tài khoản tồn tại trong Database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
        mustChangePassword: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Phiên đăng nhập không hợp lệ hoặc tài khoản không tồn tại.',
      );
    }

    // 2. Chốt chặn Tầng 1: Kiểm tra trạng thái tài khoản
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Tài khoản hiện không hoạt động hoặc đã bị khóa.',
      );
    }

    // 3. Trả về thông tin gắn vào Request (req.user)
    return {
      id: user.id,
      email: user.email,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };
  }
}
