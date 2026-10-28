import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import {
  JwtPayload,
  JwtRefreshPayload,
} from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Tạo Access Token ngắn hạn (15 phút) chứa context phân quyền
   */
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      '15m') as JwtSignOptions['expiresIn'];

    return this.jwtService.signAsync(payload, {
      secret:
        process.env.JWT_SECRET || 'super_secret_jwt_access_key_agu_crm_2026',
      expiresIn,
    });
  }

  /**
   * Tạo Refresh Token dài hạn (7 ngày) dùng để xin cấp lại Access Token
   */
  async generateRefreshToken(payload: JwtRefreshPayload): Promise<string> {
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d') as JwtSignOptions['expiresIn'];

    return this.jwtService.signAsync(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'super_secret_jwt_refresh_key_agu_crm_2026',
      expiresIn,
    });
  }

  /**
   * Đính kèm Refresh Token vào HttpOnly Cookie của HTTP Response
   * Bảo đảm các cờ an toàn: httpOnly, sameSite, secure, maxAge
   */
  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 ngày tính bằng mili giây

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Chống JavaScript truy cập (chống XSS)
      secure: isProduction, // Chỉ gửi qua HTTPS khi ở production
      sameSite: isProduction ? 'strict' : 'lax', // Chống tấn công Cross-Site Request Forgery (CSRF)
      maxAge: sevenDaysInMs, // Thời hạn sống: 7 ngày (tính theo milliseconds)
      path: '/', // Cookie có hiệu lực trên toàn bộ API
    });
  }

  /**
   * Xóa sạch Refresh Token khỏi Cookie của trình duyệt khi người dùng Logout
   */
  clearRefreshTokenCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });
  }
}
