import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/metadata.constants';

/**
 * Decorator giới hạn quyền truy cập theo danh sách Role code.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
