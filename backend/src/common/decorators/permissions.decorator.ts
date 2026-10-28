import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/metadata.constants';

/**
 * Decorator kiểm soát quyền truy cập theo mã Permission hạt nhân (RBAC).
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
