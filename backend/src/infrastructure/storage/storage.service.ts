import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly logger = new Logger(StorageService.name);
    private minioClient: Minio.Client;
    private readonly defaultBucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';

    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '9000', 10),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
            secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        });
    }

    // Tự động kiểm tra và khởi tạo bucket mặc định khi NestJS boot
    async onModuleInit() {
        try {
            const exists = await this.minioClient.bucketExists(this.defaultBucket);
            if (!exists) {
                await this.minioClient.makeBucket(this.defaultBucket, 'us-east-1');
                this.logger.log(`Bucket '${this.defaultBucket}' chưa có, đã tự động khởi tạo thành công!`);
            } else {
                this.logger.log(`MinIO Client đã kết nối. Bucket '${this.defaultBucket}' sẵn sàng.`);
            }
        } catch (error) {
            this.logger.error(`Lỗi khi khởi tạo bucket MinIO '${this.defaultBucket}':`, error);
        }
    }

    /**
     * Tải tệp tin lên MinIO bucket
     * @param bucket Tên bucket (mặc định lấy từ cấu hình hệ thống)
     * @param key Đường dẫn object storage (storage_key)
     * @param buffer Nội dung nhị phân của tệp
     * @param mimeType Định dạng MIME đã validate
     */
    async uploadFile(
        bucket: string = this.defaultBucket,
        key: string,
        buffer: Buffer,
        mimeType: string,
    ): Promise<string> {
        const metaData = {
            'Content-Type': mimeType,
        };

        await this.minioClient.putObject(bucket, key, buffer, buffer.length, metaData);
        this.logger.log(`Upload file thành công: [${bucket}] ${key}`);
        return key;
    }

    /**
     * Sinh Presigned URL an toàn để truy cập / tải file (Thời hạn mặc định: 15 phút)
     * @param bucket Tên bucket
     * @param key Khóa object storage
     * @param expirySeconds Thời hạn URL (giây), mặc định 900 giây (15 phút)
     */
    async getFileUrl(
        bucket: string = this.defaultBucket,
        key: string,
        expirySeconds = 900,
    ): Promise<string> {
        return await this.minioClient.presignedGetObject(bucket, key, expirySeconds);
    }

    /**
     * Xóa tệp tin trên MinIO (dùng khi cleanup snapshot lỗi hoặc xóa CV)
     * @param bucket Tên bucket
     * @param key Khóa object storage
     */
    async deleteFile(bucket: string = this.defaultBucket, key: string): Promise<boolean> {
        try {
            await this.minioClient.removeObject(bucket, key);
            this.logger.log(`Đã xóa object storage: [${bucket}] ${key}`);
            return true;
        } catch (error) {
            this.logger.error(`Lỗi xóa object [${bucket}] ${key}:`, error);
            return false;
        }
    }
}