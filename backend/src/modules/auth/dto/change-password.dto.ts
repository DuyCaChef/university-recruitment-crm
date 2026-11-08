import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Student@123', description: 'Mật khẩu hiện tại' })
  @IsString({ message: 'Mật khẩu hiện tại phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại.' })
  currentPassword: string;

  @ApiProperty({
    example: 'Strudent@123',
    description: 'Mật khẩu mới (Tối thiểu 6 ký tự)',
  })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới.' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword: string;

  @ApiProperty({
    example: 'NewPass@2026',
    description: 'Xác nhận lại mật khẩu mới',
  })
  @IsString({ message: 'Mật khẩu xác nhận phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng xác nhận lại mật khẩu mới.' })
  confirmPassword: string;
}
