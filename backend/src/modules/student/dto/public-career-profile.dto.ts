import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublicCareerProfileQueryDto {
  @ApiPropertyOptional({ description: 'Lọc theo ngành đào tạo' })
  @IsOptional()
  @IsString({ message: 'Ngành đào tạo phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Ngành đào tạo không được vượt quá 150 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  major?: string;

  @ApiPropertyOptional({ description: 'Lọc theo kỹ năng' })
  @IsOptional()
  @IsString({ message: 'Kỹ năng phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Kỹ năng không được vượt quá 100 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  skill?: string;
}

