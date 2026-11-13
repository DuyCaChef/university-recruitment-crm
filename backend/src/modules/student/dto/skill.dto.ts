import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSkillDto {
  @ApiProperty({
    example: 'JavaScript',
    description: 'Tên kỹ năng',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên kỹ năng phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên kỹ năng không được để trống' })
  @MaxLength(100, { message: 'Tên kỹ năng không được vượt quá 100 ký tự' })
  skillName: string;

  @ApiPropertyOptional({
    example: 'Khá',
    description: 'Mức độ thành thạo (Cơ bản, Khá, Thành thạo, Chuyên gia)',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Mức độ thành thạo phải là chuỗi ký tự' })
  @MaxLength(30, { message: 'Mức độ thành thạo không được vượt quá 30 ký tự' })
  proficiency?: string;
}

export class UpdateSkillDto {
  @ApiPropertyOptional({
    example: 'TypeScript',
    description: 'Tên kỹ năng cập nhật',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên kỹ năng phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên kỹ năng không được để trống' })
  @MaxLength(100, { message: 'Tên kỹ năng không được vượt quá 100 ký tự' })
  skillName?: string;

  @ApiPropertyOptional({
    example: 'Thành thạo',
    description: 'Mức độ thành thạo cập nhật',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Mức độ thành thạo phải là chuỗi ký tự' })
  @MaxLength(30, { message: 'Mức độ thành thạo không được vượt quá 30 ký tự' })
  proficiency?: string;
}
