import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisibilityDto {
  @ApiProperty({
    example: true,
    description: 'Bật hoặc tắt hiển thị hồ sơ nghề nghiệp công khai',
  })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return value;
  })
  @IsBoolean({ message: 'visibility phải là giá trị boolean' })
  visibility: boolean;
}

