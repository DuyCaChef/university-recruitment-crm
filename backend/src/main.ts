import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Thiết lập tiền tố toàn cục /api/v1 theo chuẩn kiến trúc
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Bật CORS cho phép kết nối từ Frontend React Vite
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend Application is running on: http://localhost:${port}/${apiPrefix}`);
}
void bootstrap();