import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator trích xuất đối tượng User hiện tại từ request context sau khi qua JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
