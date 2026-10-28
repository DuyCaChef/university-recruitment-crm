import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants/metadata.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Kiểm tra xem endpoint hoặc class controller có gắn @Public() không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Cho phép truy cập mà không cần xác thực
    }

    // Thực thi giải mã Passport JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 1. Nếu có lỗi giải mã hoặc không tìm thấy user -> 401 Unauthorized
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        );
      }
      throw (
        err ||
        new UnauthorizedException(
          'Yêu cầu xác thực danh tính để truy cập tài nguyên này.',
        )
      );
    }

    // 2. Kiểm tra nghiệp vụ: Bắt buộc đổi mật khẩu lần đầu (mustChangePassword)
    if (user.mustChangePassword) {
      const request = context.switchToHttp().getRequest();
      const currentPath = request.url;

      // Chỉ mở đường cho API đổi mật khẩu và đăng xuất
      const isAllowedEndpoint =
        currentPath.includes('/auth/change-password') ||
        currentPath.includes('/auth/password') ||
        currentPath.includes('/auth/logout');

      if (!isAllowedEndpoint) {
        throw new ForbiddenException(
          'Yêu cầu bắt buộc đổi mật khẩu trong lần đầu đăng nhập trước khi tiếp tục thao tác.',
        );
      }
    }
    return user; // Trả về thông tin user đã xác thực để gắn vào req.user
  }
}
