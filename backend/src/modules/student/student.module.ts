import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { CareerProfileController } from './controllers/career-profile.controller';
import { StudentService } from './services/student.service';

@Module({
  controllers: [StudentController, CareerProfileController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
