import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { StorageService } from './infrastructure/storage/storage.service';

@Controller('health')
export class AppController {
  constructor(private readonly prisma: PrismaService,
    private readonly storage: StorageService,

  ) { }

  @Get()
  async getHealthCheck() {
    // Ping truy vấn thực tế tới PostgreSQL để xác nhận kết nối CSDL còn sống
    const dbStatus = await this.prisma.$queryRaw`SELECT 1 as result`
      .then(() => 'UP')
      .catch(() => 'DOWN');

    return {
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }

  // Kiểm tra kết nối MinIO    
  @Get('storage-test')
  async testStorageIntegration() {
    const bucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';
    const testKey = `tests/sample-${Date.now()}.txt`;
    const sampleBuffer = Buffer.from('MinIO integration test for AGU University Recruitment CRM');
    const mimeType = 'text/plain';

    // 1. Upload file mẫu lên MinIO
    await this.storage.uploadFile(bucket, testKey, sampleBuffer, mimeType);

    // 2. Sinh Presigned URL truy cập hợp lệ (15 phút)
    const accessUrl = await this.storage.getFileUrl(bucket, testKey, 900);

    return {
      status: 'success',
      message: 'MinIO S3 Client integrated successfully!',
      bucket,
      storageKey: testKey,
      fileUrl: accessUrl,
    };
  }
}