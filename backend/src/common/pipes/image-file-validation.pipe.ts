import {
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export const ALLOWED_AVATAR_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
] as const;

export type AllowedAvatarMimeType = (typeof ALLOWED_AVATAR_MIME_TYPES)[number];

export const AVATAR_MIME_TO_EXT: Record<AllowedAvatarMimeType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File): Express.Multer.File {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn tệp ảnh đại diện.');
        }

        if (file.size === 0) {
            throw new BadRequestException('Tệp ảnh đại diện không được rỗng.');
        }

        if (file.size > MAX_AVATAR_FILE_SIZE) {
            throw new BadRequestException(
                'Dung lượng ảnh đại diện không được vượt quá 2 MB.',
            );
        }

        if (
            !ALLOWED_AVATAR_MIME_TYPES.includes(
                file.mimetype as AllowedAvatarMimeType,
            )
        ) {
            throw new BadRequestException(
                'Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WebP.',
            );
        }

        const buffer = file.buffer;
        if (!buffer || buffer.length < 12) {
            throw new BadRequestException('Dữ liệu tệp ảnh không hợp lệ.');
        }

        // Kiểm tra Magic Bytes thực tế để chống giả mạo đuôi tệp / MIME type
        const isJpeg =
            buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        const isPng =
            buffer[0] === 0x89 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x4e &&
            buffer[3] === 0x47 &&
            buffer[4] === 0x0d &&
            buffer[5] === 0x0a &&
            buffer[6] === 0x1a &&
            buffer[7] === 0x0a;
        const isWebp =
            buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
            buffer.subarray(8, 12).toString('ascii') === 'WEBP';

        const matchesDeclaredMime =
            (file.mimetype === 'image/jpeg' && isJpeg) ||
            (file.mimetype === 'image/png' && isPng) ||
            (file.mimetype === 'image/webp' && isWebp);

        if (!matchesDeclaredMime) {
            throw new BadRequestException(
                'Nội dung tệp không khớp với định dạng ảnh hợp lệ (JPG, PNG, WebP).',
            );
        }

        return file;
    }
}