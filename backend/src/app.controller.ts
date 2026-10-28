import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { PrismaService } from './infrastructure/database/prisma.service';
import { StorageService } from './infrastructure/storage/storage.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Hệ thống & Kiểm thử (System & Health)')
@Public() // Mở công khai endpoint Health check và MinIO test
@Controller('health')
// DTO mẫu dùng để kiểm thử ValidationPipe toàn cục
export class SampleValidationDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ và tên người dùng kiểm thử',
  })
  @IsString({ message: 'Tên phải là một chuỗi ký tự hợp lệ' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({
    example: 'test@student.agu.edu.vn',
    description: 'Địa chỉ email người dùng kiểm thử',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

@ApiTags('Hệ thống & Kiểm thử (System & Health)')
@Controller('health')
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Kiểm tra trạng thái máy chủ NestJS và kết nối PostgreSQL',
    description:
      'Thực hiện truy vấn ping trực tiếp vào PostgreSQL để đảm bảo cơ sở dữ liệu đang hoạt động bình thường.',
  })
  @ApiResponse({
    status: 200,
    description: 'Hệ thống và cơ sở dữ liệu hoạt động bình thường (UP).',
  })
  async getHealthCheck() {
    const dbStatus = await this.prisma.$queryRaw`SELECT 1 as result`
      .then(() => 'UP')
      .catch(() => 'DOWN');

    return {
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('storage-test')
  @ApiOperation({
    summary: 'Kiểm thử kết nối MinIO S3 Client',
    description:
      'Tải thử 1 tệp tin mẫu lên MinIO bucket và tạo Presigned URL có thời hạn để nghiệm thu TASK-S1-07.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload tệp thành công và sinh Presigned URL hợp lệ.',
  })
  async testStorageIntegration() {
    const bucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';
    const testKey = `tests/sample-${Date.now()}.txt`;
    const sampleBuffer = Buffer.from(
      'MinIO integration test for AGU University Recruitment CRM',
    );
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

  @Post('validation-test')
  @ApiOperation({
    summary: 'Kiểm thử bộ lọc dữ liệu ValidationPipe và HttpExceptionFilter',
    description:
      'Tiếp nhận body JSON kiểm tra cơ chế whitelist, forbidNonWhitelisted và chuẩn hóa JSON Envelope khi có lỗi.',
  })
  @ApiResponse({
    status: 201,
    description: 'Dữ liệu đầu vào hợp lệ, vượt qua ValidationPipe.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu sai định dạng hoặc chứa trường lạ bị cấm.',
  })
  testValidation(@Body() body: SampleValidationDto) {
    return {
      status: 'success',
      message: 'Dữ liệu đã vượt qua bộ lọc ValidationPipe an toàn!',
      receivedData: body,
      timestamp: new Date().toISOString(),
    };
  }
}
