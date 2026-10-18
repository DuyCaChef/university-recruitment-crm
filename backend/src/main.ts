import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Thiết lập tiền tố toàn cục (Global Prefix): /api/v1 theo chuẩn kiến trúc
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Bật CORS cho phép kết nối từ Frontend React Vite
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Cấu hình Global ValidationPipe (Chống Mass Assignment & Ép kiểu an toàn)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các trường không khai báo trong DTO
      forbidNonWhitelisted: true, // Ném lỗi 400 nếu client cố tình gửi trường lạ
      transform: true, // Tự động convert kiểu dữ liệu tương ứng trong DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Đăng ký Global Exception Filter chuẩn hóa lỗi
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cấu hình Swagger OpenAPI UI tại /api/docs
  const config = new DocumentBuilder()
    .setTitle('AGU Recruitment CRM API')
    .setDescription(
      'Hệ sinh thái API Web CRM Hỗ trợ Kết nối Sinh viên và Doanh nghiệp - Trường Đại học An Giang',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Nhập JWT Access Token vào đây',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Giữ token khi F5 trình duyệt
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Ứng dụng đang chạy tại: http://localhost:${port}/${apiPrefix}`);
  logger.log(
    `Tài liệu Swagger OpenAPI sẵn sàng tại: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
