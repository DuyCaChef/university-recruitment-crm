import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Authentication (Xác thực & Phiên làm việc)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập hệ thống (Cấp Access Token & HttpOnly Refresh Cookie)',
    description:
      'Xác thực tài khoản qua email/mật khẩu, trả về Access Token trong Body JSON và Refresh Token trong HttpOnly Cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về Access Token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  @ApiResponse({
    status: 403,
    description: 'Tài khoản đã bị khóa hoặc ngừng hoạt động.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }
}
