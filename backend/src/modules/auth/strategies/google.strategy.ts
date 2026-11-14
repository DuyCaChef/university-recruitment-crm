import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prisma: PrismaService) {
    console.log(
      '[DEBUG SSO] Client ID:',
      process.env.GOOGLE_CLIENT_ID ? 'ĐÃ NẠP' : 'RỖNG (UNDEFINED)',
    );
    console.log(
      '[DEBUG SSO] Secret Length:',
      process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    );

    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email: string = profile.emails?.[0]?.value?.toLowerCase();
    const hostedDomain = profile._json?.hd?.toLowerCase();

    // Chốt chặn nghiệp vụ: Chỉ cho phép tài khoản thuộc domain sinh viên AGU
    if (
      hostedDomain !== 'student.agu.edu.vn' ||
      !email?.endsWith('@student.agu.edu.vn')
    ) {
      return done(
        new UnauthorizedException(
          'Chỉ cho phép tài khoản email sinh viên AGU (@student.agu.edu.vn) đăng nhập.',
        ),
        false,
      );
    }

    const studentMaster = await this.prisma.studentMaster.findUnique({
      where: { institutionalEmail: email },
      select: { status: true },
    });

    if (studentMaster?.status === 'SUSPENDED') {
      return done(
        new ForbiddenException(
          'Hồ sơ sinh viên đang trong trạng thái đình chỉ học tập, không thể đăng nhập.',
        ),
        false,
      );
    }

    const authenticatedUser = {
      email,
      fullName: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    };

    done(null, authenticatedUser);
  }
}
