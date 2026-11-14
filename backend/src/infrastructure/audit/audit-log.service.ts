import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface AuditLogInput {
  actorUserId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditLogInput): Promise<void> {
    await this.prisma.activityLog.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? null,
        oldValues: this.scrub(input.oldValues),
        newValues: this.scrub(input.newValues),
        ipAddress: input.ipAddress ?? null,
      },
    });
  }

  private scrub(
    values: Record<string, unknown> | null | undefined,
  ): Prisma.InputJsonValue | undefined {
    if (values === null || values === undefined) {
      return undefined;
    }

    return this.scrubValue(values) as Prisma.InputJsonValue;
  }

  private scrubValue(value: unknown, key?: string): unknown {
    if (key && /(password|token|secret|hash|authorization)/i.test(key)) {
      return '[REDACTED]';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.scrubValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [
          entryKey,
          this.scrubValue(entryValue, entryKey),
        ]),
      );
    }

    return value;
  }
}
