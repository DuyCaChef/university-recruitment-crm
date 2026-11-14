import { AuditLogService } from './audit-log.service';

describe('AuditLogService', () => {
  it('redacts sensitive values and serializes BigInt values before persisting', async () => {
    const create = jest.fn().mockResolvedValue({});
    const service = new AuditLogService({
      activityLog: { create },
    } as never);

    await service.record({
      actorUserId: 'actor-id',
      action: 'TEST_EVENT',
      resourceType: 'TEST_RESOURCE',
      oldValues: {
        passwordHash: 'secret-hash',
        sizeBytes: BigInt(5242880),
      },
      newValues: {
        authorization: 'Bearer sensitive-token',
        nested: { refreshToken: 'refresh-secret' },
      },
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        actorUserId: 'actor-id',
        action: 'TEST_EVENT',
        resourceType: 'TEST_RESOURCE',
        resourceId: null,
        oldValues: {
          passwordHash: '[REDACTED]',
          sizeBytes: '5242880',
        },
        newValues: {
          authorization: '[REDACTED]',
          nested: { refreshToken: '[REDACTED]' },
        },
        ipAddress: null,
      },
    });
  });
});
