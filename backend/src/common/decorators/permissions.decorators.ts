import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants/metadata.constants';

/**
 * Decorator kiểm soát quyền truy cập theo mã Permission hạt nhân (RBAC).
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
