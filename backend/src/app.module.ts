import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { StorageModule } from './infrastructure/storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }