import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IS_ALPHA,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  VN_PHONE_MESSAGE,
  VN_PHONE_REGEX,
} from '../../../common/constants/validation.constants';

export class UpdateStudentProfileDto {
  @ApiPropertyOptional({
    example: '0912345678',
    description: 'Số điện thoại Việt Nam chứa 10 số hoặc 11 số',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/[\s.-]/g, '') : value,
  )
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Matches(VN_PHONE_REGEX, { message: VN_PHONE_MESSAGE })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Sinh viên năm cuối ngành CNTT đam mê phát triển Backend NestJS.',
    description:
      'Giới thiệu bản thân và mục tiêu nghề nghiệp (tối đa 2000 ký tự)',
  })
  @IsOptional()
  @IsString({ message: 'Tiểu sử bản thân phải là chuỗi ký tự' })
  @MaxLength(2000, {
    message: 'Tiểu sử bản thân không được vượt quá 2000 ký tự',
  })
  bio?: string;

  @ApiPropertyOptional({
    example: 'Phường Mỹ Xuyên, TP. Long Xuyên, An Giang',
    description: 'Địa chỉ cư trú hiện tại',
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ không được vượt quá 255 ký tự' })
  address?: string;

  @ApiPropertyOptional({
    example: '2003-05-15',
    description: 'Ngày sinh theo định dạng YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh phải đúng định dạng ISO (YYYY-MM-DD)' },
  )
  dateOfBirth?: string;

  @ApiPropertyOptional({
    example: 'Nam',
    enum: ['Nam', 'Nữ', 'Khác'],
    description: 'Giới tính',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Nam', 'Nữ', 'Khác'], {
    message: 'Giới tính chỉ chấp nhận các giá trị: Nam, Nữ, Khác',
  })
  gender?: string;

  @ApiPropertyOptional({
    example: 3.65,
    description: 'Điểm trung bình tích lũy hệ 4.00 (từ 0.00 đến 4.00)',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'GPA phải là số thập phân tối đa 2 chữ số sau dấu phẩy' },
  )
  @Min(0, { message: 'GPA không được nhỏ hơn 0.00' })
  @Max(4, { message: 'GPA không được lớn hơn 4.00' })
  gpa?: number;
}
