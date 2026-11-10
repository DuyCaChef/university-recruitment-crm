import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RegisterStudentDto } from '../dto/register-student.dto';

@ApiTags('Authentication (Xác thực & Phiên làm việc)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ===========================================================================
  // 1. ENDPOINT ĐĂNG NHẬP (PUBLIC - KHÔNG YÊU CẦU TOKEN)
  // ===========================================================================
  @Public() // Bỏ qua JwtAuthGuard
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
    description: 'Tài khoản đã bị khóa (LOCKED) hoặc ngừng hoạt động.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  // Endpoint đăng xuất (Xóa HttpOnly Cookie) - Yêu cầu Token hợp lệ
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng xuất hệ thống (Xóa HttpOnly Cookie)' })
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công.',
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  // Endpoint lấy thông tin người dùng hiện tại (Yêu cầu Token hợp lệ)
  @Get('current-user')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  @ApiResponse({
    status: 200,
    description:
      'Trả về context thông tin người dùng đang đăng nhập (không bao gồm passwordHash)',
  })
  async getCurrentUser(@CurrentUser('id') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  // Endpoint đổi mật khẩu cá nhân (Yêu cầu Token hợp lệ)
  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu cá nhân' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công.' })
  @ApiResponse({
    status: 400,
    description: 'Sai mật khẩu hiện tại hoặc xác nhận không khớp.',
  })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  // Endpoint đăng ký tài khoản sinh viên (PUBLIC - KHÔNG YÊU CẦU TOKEN)
  @Public()
  @Post('register-student')
  @HttpCode(HttpStatus.CREATED) // Trả về 201 Created theo chuẩn RESTful
  async registerStudent(@Body() dto: RegisterStudentDto) {
    return this.authService.registerStudent(dto);
  }

  // ===========================================================================
  // 2. ENDPOINT KIỂM THỬ TẦNG 1 & @CurrentUser()
  // ===========================================================================
  @Get('test-current-user')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Kiểm thử Tầng 1: Xác thực JWT và lấy dữ liệu @CurrentUser()',
    description:
      'Chỉ yêu cầu gửi Bearer Token hợp lệ. Trích xuất thông tin người dùng đang thực hiện request.',
  })
  @ApiResponse({
    status: 200,
    description: 'Xác thực Token thành công, trả về thông tin user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập, thiếu Token hoặc Token không hợp lệ/hết hạn.',
  })
  @ApiResponse({
    status: 403,
    description: 'Tài khoản bị khóa hoặc đang chờ bắt buộc đổi mật khẩu.',
  })
  testCurrentUser(@CurrentUser() user: any) {
    return {
      statusCode: 200,
      message: 'Vượt qua chốt chặn Tầng 1 (JwtAuthGuard) thành công!',
      data: user,
    };
  }

  // ===========================================================================
  // 3. ENDPOINT KIỂM THỬ TẦNG 2a: PHÂN QUYỀN VAI TRÒ (@Roles)
  // ===========================================================================
  @Get('test-role-admin')
  @ApiBearerAuth('JWT-auth')
  @Roles('ADMIN') // Chỉ cho phép tài khoản mang vai trò ADMIN
  @ApiOperation({
    summary: 'Kiểm thử Tầng 2a: Yêu cầu vai trò ADMIN (@Roles)',
    description:
      'Yêu cầu Bearer Token hợp lệ VÀ người dùng phải có Role ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'User có vai trò ADMIN, truy cập thành công.',
  })
  @ApiResponse({
    status: 403,
    description: 'Bị RolesGuard từ chối truy cập do không phải ADMIN.',
  })
  testRoleAdmin(@CurrentUser('email') email: string) {
    return {
      statusCode: 200,
      message: 'Vượt qua chốt chặn RolesGuard thành công!',
      actorEmail: email,
      requiredRole: 'ADMIN',
    };
  }

  // ===========================================================================
  // 4. ENDPOINT KIỂM THỬ TẦNG 2b: PHÂN QUYỀN HẠT NHÂN (@RequirePermissions)
  // ===========================================================================
  @Get('test-permission-rbac')
  @ApiBearerAuth('JWT-auth')
  @RequirePermissions('USER_STATUS_UPDATE') // Yêu cầu quyền khóa/mở khóa tài khoản
  @ApiOperation({
    summary: 'Kiểm thử Tầng 2b: Yêu cầu quyền hạt nhân (@RequirePermissions)',
    description:
      'Yêu cầu Token hợp lệ VÀ quyền hạn USER_STATUS_UPDATE (dựa trên ma trận RBAC đã nạp từ CSDL).',
  })
  @ApiResponse({
    status: 200,
    description: 'User có quyền USER_STATUS_UPDATE, truy cập thành công.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Bị PermissionsGuard từ chối truy cập do thiếu quyền hạt nhân.',
  })
  testPermissionRbac(@CurrentUser() user: any) {
    return {
      statusCode: 200,
      message: 'Vượt qua chốt chặn PermissionsGuard thành công!',
      userId: user.id,
      grantedPermissions: user.permissions,
    };
  }
}
