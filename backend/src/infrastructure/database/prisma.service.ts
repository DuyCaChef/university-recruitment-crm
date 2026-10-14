import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Đã kết nối thành công tới PostgreSQL (university_crm)!');
        } catch (error) {
            this.logger.error('Lỗi kết nối cơ sở dữ liệu PostgreSQL:', error);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Đã ngắt kết nối PostgreSQL an toàn.');
    }
}