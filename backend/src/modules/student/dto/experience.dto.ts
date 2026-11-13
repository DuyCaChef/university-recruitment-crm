import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    example: 'Công ty Phần mềm AGU Tech',
    description: 'Tên công ty hoặc tổ chức từng làm việc/thực tập',
  })
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  @MaxLength(150, { message: 'Tên công ty không được vượt quá 150 ký tự' })
  companyName: string;

  @ApiProperty({
    example: 'Thực tập sinh Backend Developer',
    description: 'Vị trí đảm nhiệm',
  })
  @IsString({ message: 'Vị trí công việc phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Vị trí công việc không được để trống' })
  @MaxLength(150, { message: 'Vị trí công việc không được vượt quá 150 ký tự' })
  position: string;

  @ApiProperty({
    example: '2025-06-01',
    description: 'Ngày bắt đầu làm việc (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'Ngày bắt đầu phải đúng định dạng YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  startDate: string;

  @ApiPropertyOptional({
    example: '2025-09-30',
    description: 'Ngày kết thúc (để trống hoặc null nếu đang làm việc tại đây)',
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải đúng định dạng YYYY-MM-DD' })
  endDate?: string | null;

  @ApiPropertyOptional({
    example: 'Phát triển RESTful API với NestJS và tối ưu truy vấn PostgreSQL.',
    description: 'Mô tả chi tiết công việc và thành tích',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả công việc phải là chuỗi ký tự' })
  description?: string;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
