import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  // Cost factor 10: Chuẩn cân bằng tối ưu giữa bảo mật và hiệu năng CPU
  private readonly SALT_ROUNDS = 10;

  /**
   * Băm mật khẩu thô (plaintext) thành chuỗi băm an toàn
   * @param rawPassword Mật khẩu người dùng nhập
   * @returns Chuỗi băm Bcrypt kèm salt
   */
  async hashPassword(rawPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(rawPassword, salt);
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi xảy ra trong quá trình mã hóa mật khẩu.',
      );
    }
  }

  /**
   * So khớp mật khẩu người dùng gửi lên với chuỗi băm trong CSDL
   * @param rawPassword Mật khẩu người dùng nhập khi đăng nhập/đổi mật khẩu
   * @param hashedPassword Chuỗi băm lấy từ bảng users.password_hash
   * @returns true nếu trùng khớp, false nếu sai mật khẩu
   */
  async comparePassword(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(rawPassword, hashedPassword);
    } catch (error) {
      return false;
    }
  }
}
