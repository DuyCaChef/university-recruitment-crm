import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from '../../modules/auth/strategies/jwt.strategy';
import { PrismaService } from '../../infrastructure/database/prisma.service';

type RequestContextOptions = {
  user?: {
    roles?: string[];
    permissions?: string[];
  };
  requiredRoles?: string[];
  requiredPermissions?: string[];
  isPublic?: boolean;
};

function createContext(options: RequestContextOptions): ExecutionContext {
  const handler = jest.fn();
  const controller = jest.fn();
  const request = { user: options.user };

  return {
    getHandler: () => handler,
    getClass: () => controller,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function createReflector(options: RequestContextOptions): Reflector {
  return {
    getAllAndOverride: jest.fn((key: string) => {
      if (key === 'isPublic') return options.isPublic;
      if (key === 'roles') return options.requiredRoles;
      return options.requiredPermissions;
    }),
  } as unknown as Reflector;
}

describe('security guards', () => {
  describe('JwtAuthGuard', () => {
    it('rejects a missing authenticated user with 401', () => {
      const guard = new JwtAuthGuard(createReflector({}));

      expect(() =>
        guard.handleRequest(null, null, null, createContext({})),
      ).toThrow(UnauthorizedException);
    });

    it('rejects an expired token with 401', () => {
      const guard = new JwtAuthGuard(createReflector({}));

      expect(() =>
        guard.handleRequest(
          null,
          null,
          { name: 'TokenExpiredError' },
          createContext({}),
        ),
      ).toThrow(UnauthorizedException);
    });
  });

  describe('PermissionsGuard', () => {
    it('rejects ADMIN when the required permission is missing', () => {
      const options = {
        user: { roles: ['ADMIN'], permissions: [] },
        requiredPermissions: ['USER_STATUS_UPDATE'],
      };
      const guard = new PermissionsGuard(createReflector(options));
      const context = createContext(options);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('allows a user with every required permission', () => {
      const options = {
        user: {
          roles: ['ADMIN'],
          permissions: ['USER_STATUS_UPDATE', 'RBAC_MANAGE'],
        },
        requiredPermissions: ['USER_STATUS_UPDATE'],
      };
      const guard = new PermissionsGuard(createReflector(options));
      const context = createContext(options);

      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('RolesGuard', () => {
    it('rejects a user without the required role', () => {
      const options = {
        user: { roles: ['STUDENT'], permissions: [] },
        requiredRoles: ['ADMIN'],
      };
      const guard = new RolesGuard(createReflector(options));
      const context = createContext(options);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('JwtStrategy', () => {
    it.each(['LOCKED', 'INACTIVE'])(
      'rejects a user with status %s',
      async (status) => {
        const prisma = {
          user: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'user-id',
              email: 'user@example.com',
              status,
              mustChangePassword: false,
            }),
          },
        } as unknown as PrismaService;
        const strategy = new JwtStrategy(prisma);

        await expect(
          strategy.validate({
            sub: 'user-id',
            email: 'user@example.com',
            roles: [],
            permissions: [],
          }),
        ).rejects.toThrow(ForbiddenException);
      },
    );

    it('accepts only an ACTIVE user and preserves server-issued RBAC claims', async () => {
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'user-id',
            email: 'user@example.com',
            status: 'ACTIVE',
            mustChangePassword: false,
          }),
        },
      } as unknown as PrismaService;
      const strategy = new JwtStrategy(prisma);

      await expect(
        strategy.validate({
          sub: 'user-id',
          email: 'user@example.com',
          roles: ['ADMIN'],
          permissions: ['USER_STATUS_UPDATE'],
        }),
      ).resolves.toMatchObject({
        id: 'user-id',
        status: 'ACTIVE',
        roles: ['ADMIN'],
        permissions: ['USER_STATUS_UPDATE'],
      });
    });
  });
});
