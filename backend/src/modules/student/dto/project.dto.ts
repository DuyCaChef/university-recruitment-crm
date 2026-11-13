import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Hệ thống IOT tưới tiêu tự động',
    description: 'Tên dự án học tập, nghiên cứu khoa học hoặc sản phẩm thực tế',
  })
  @IsString({ message: 'Tên dự án phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên dự án không được để trống' })
  @MaxLength(200, { message: 'Tên dự án không được vượt quá 200 ký tự' })
  name: string;

  @ApiPropertyOptional({
    example:
      'Hệ thống IOT giúp tự động tưới tiêu cho cây trồng dựa trên cảm biến độ ẩm đất.',
    description: 'Mô tả chi tiết dự án',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả dự án phải là chuỗi ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'Lead Developer',
    description: 'Vai trò trong dự án',
  })
  @IsOptional()
  @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Vai trò không được vượt quá 100 ký tự' })
  role?: string;

  @ApiPropertyOptional({
    example: 'NestJS, TypeScript, PostgreSQL, Prisma, MinIO, React',
    description: 'Công nghệ sử dụng',
  })
  @IsOptional()
  @IsString({ message: 'Danh sách công nghệ phải là chuỗi ký tự' })
  technologies?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/agu-crm/recruitment-crm',
    description:
      'Liên kết dự án (URL hợp lệ bắt đầu bằng http:// hoặc https://)',
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    {
      message:
        'Đường dẫn dự án phải là URL hợp lệ bắt đầu bằng http:// hoặc https://',
    },
  )
  @MaxLength(500, { message: 'Đường dẫn dự án không được vượt quá 500 ký tự' })
  projectUrl?: string;

  @ApiPropertyOptional({
    example: '2026-08-01',
    description: 'Ngày bắt đầu dự án (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu phải đúng định dạng YYYY-MM-DD' })
  startDate?: string | null;

  @ApiPropertyOptional({
    example: '2026-12-15',
    description: 'Ngày hoàn thành dự án (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải đúng định dạng YYYY-MM-DD' })
  endDate?: string | null;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
