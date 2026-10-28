import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/metadata.constants';

/**
 * Decorator đánh dấu endpoint không cần kiểm tra JWT Authentication.
 * Áp dụng cho: /auth/login, /auth/student/register, /health,...
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
