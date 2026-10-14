import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get()
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}