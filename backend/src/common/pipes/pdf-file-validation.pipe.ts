//==============================================================
// Pipe kiểm tra tính hợp lệ của tệp PDF được tải lên (CV) trong NestJS
//==============================================================
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import 'multer';
import * as path from 'path';

export const MAX_CV_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PDF_MAGIC_HEADER = '%PDF-'; // 5 bytes đầu chuẩn định dạng PDF

@Injectable()
export class PdfFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Vui lòng đính kèm tệp CV định dạng PDF');
    }

    // 1. Kiểm tra kích thước tệp (0 < size <= 5MB)
    if (file.size <= 0) {
      throw new BadRequestException('Tệp tải lên rỗng, không hợp lệ');
    }
    if (file.size > MAX_CV_FILE_SIZE) {
      throw new BadRequestException(
        'Dung lượng tệp CV không được vượt quá 5MB',
      );
    }

    // 2. Kiểm tra phần mở rộng tệp (.pdf)
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (ext !== '.pdf') {
      throw new BadRequestException('Chỉ chấp nhận tệp có phần mở rộng .pdf');
    }

    // 3. Kiểm tra MIME type khai báo
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Định dạng MIME không hợp lệ, hệ thống chỉ hỗ trợ tệp PDF',
      );
    }

    // 4. Kiểm tra Magic Bytes thực tế của nội dung tệp
    const fileHeader = file.buffer?.subarray(0, 5).toString('ascii');
    if (fileHeader !== PDF_MAGIC_HEADER) {
      throw new BadRequestException(
        'Nội dung tệp không phải cấu trúc PDF hợp lệ (sai chữ ký nhị phân)',
      );
    }

    return file;
  }
}
