import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'dca2001@agu.edu.vn',
    description:
      'Địa chỉ email đăng nhập hệ thống (không phân biệt hoa thường)',
  })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @ApiProperty({
    example: 'Student@123',
    description: 'Mật khẩu tài khoản (tối thiểu 6 ký tự)',
  })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @MinLength(6, { message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' })
  password: string;
}
