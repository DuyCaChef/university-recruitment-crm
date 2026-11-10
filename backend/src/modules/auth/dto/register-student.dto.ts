import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterStudentDto {
  @IsNotEmpty()
  @IsString()
  studentCode: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
