import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsNotBlank } from '../../../common/validators/is-not-blank.validator';

export class UploadStudentCvDto {
  @ApiProperty({
    example: 'CV ứng tuyển vị trí Kỹ sư phần mềm',
    description: 'Tiêu đề của CV',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tiêu đề CV phải là chuỗi ký tự' })
  @IsNotBlank({ message: 'Tiêu đề CV không được chỉ chứa khoảng trắng' })
  @IsNotEmpty({ message: 'Tiêu đề CV không được để trống' })
  @MaxLength(150, { message: 'Tiêu đề CV không được vượt quá 150 ký tự' })
  title: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Đặt làm CV mặc định ngay sau khi tải lên (tự động true nếu là CV đầu tiên)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return value;
  })
  @IsBoolean({
    message: 'Trường isDefault phải là giá trị boolean (true/false)',
  })
  isDefault?: boolean;
}

export class UpdateStudentCvDto {
  @ApiProperty({
    example: 'CV ứng tuyển công ty ABC',
    description: 'Tên gợi nhớ mới cho bản CV',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tiêu đề CV phải là chuỗi ký tự' })
  @IsNotBlank({ message: 'Tiêu đề CV không được chỉ chứa khoảng trắng' })
  @IsNotEmpty({ message: 'Tiêu đề CV không được để trống' })
  @MaxLength(150, { message: 'Tiêu đề CV không được vượt quá 150 ký tự' })
  title: string;
}
