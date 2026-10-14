import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';

@Controller('health')
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

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
}