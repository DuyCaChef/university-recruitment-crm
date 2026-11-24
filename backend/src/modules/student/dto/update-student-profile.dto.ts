import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  VN_PHONE_MESSAGE,
  VN_PHONE_REGEX,
} from '../../../common/constants/validation.constants';

export class UpdateStudentProfileDto {
  @ApiPropertyOptional({
    example: 'Phan Khánh Duy',
    description:
      'Tên hiển thị tùy chỉnh trên hồ sơ (gửi null hoặc chuỗi rỗng để khôi phục theo họ tên gốc AGU)',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed;
    }
    return value;
  })
  @IsString({ message: 'Tên hiển thị phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên hiển thị phải có ít nhất 2 ký tự' })
  @MaxLength(150, { message: 'Tên hiển thị không được vượt quá 150 ký tự' })
  displayName?: string | null;

  @ApiPropertyOptional({
    example: '0912345678',
    description: 'Số điện thoại Việt Nam chứa 10 số hoặc 11 số',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[\s.-]/g, '');
      return cleaned.length === 0 ? null : cleaned;
    }
    return value;
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Matches(VN_PHONE_REGEX, { message: VN_PHONE_MESSAGE })
  phone?: string | null;

  @ApiPropertyOptional({
    example: 'Sinh viên năm cuối ngành CNTT đam mê phát triển Backend NestJS.',
    description:
      'Giới thiệu bản thân và mục tiêu nghề nghiệp (tối đa 2000 ký tự)',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return value;
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString({ message: 'Tiểu sử bản thân phải là chuỗi ký tự' })
  @MaxLength(2000, {
    message: 'Tiểu sử bản thân không được vượt quá 2000 ký tự',
  })
  bio?: string | null;

  @ApiPropertyOptional({
    example: 'Phường Mỹ Xuyên, TP. Long Xuyên, An Giang',
    description: 'Địa chỉ cư trú hiện tại',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return value;
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ không được vượt quá 255 ký tự' })
  address?: string | null;

  @ApiPropertyOptional({
    example: '2003-05-15',
    description: 'Ngày sinh theo định dạng YYYY-MM-DD',
    nullable: true,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh phải đúng định dạng ISO (YYYY-MM-DD)' },
  )
  dateOfBirth?: string | null;

  @ApiPropertyOptional({
    example: 'Nam',
    enum: ['Nam', 'Nữ', 'Khác'],
    description: 'Giới tính',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsIn(['Nam', 'Nữ', 'Khác'], {
    message: 'Giới tính chỉ chấp nhận các giá trị: Nam, Nữ, Khác',
  })
  gender?: string | null;

  @ApiPropertyOptional({
    example: 3.65,
    description: 'Điểm trung bình tích lũy hệ 4.00 (từ 0.00 đến 4.00)',
    nullable: true,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'GPA phải là số thập phân tối đa 2 chữ số sau dấu phẩy' },
  )
  @Min(0, { message: 'GPA không được nhỏ hơn 0.00' })
  @Max(4, { message: 'GPA không được lớn hơn 4.00' })
  gpa?: number | null;
}