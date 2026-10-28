import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  IS_PUBLIC_KEY,
} from '../constants/metadata.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Bỏ qua nếu là endpoint công khai
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 2. Lấy danh sách mã quyền bắt buộc được định nghĩa bởi @RequirePermissions(...)
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu endpoint không yêu cầu quyền hạn hạt nhân -> Cho qua Tầng 2b
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện thao tác này (Thiếu danh sách quyền hạn).',
      );
    }

    // 3. Kiểm tra User phải sở hữu ĐỦ TẤT CẢ các permissions được chỉ định.
    // Role không được dùng để bypass permission; quyền phải được cấp explicit.
    const hasAllPermissions = requiredPermissions.every((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Từ chối truy cập: Thiếu quyền hạn hạt nhân [${requiredPermissions.join(', ')}].`,
      );
    }

    return true;
  }
}
