import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PublicCareerProfileQueryDto } from '../dto/public-career-profile.dto';
import { StudentService } from '../services/student.service';

@ApiTags('Public Career Profiles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EMPLOYER', 'CAREER_CENTER')
@Controller('career-profiles')
export class CareerProfileController {
  constructor(private readonly studentService: StudentService) {}

  //Endpoint Tìm kiếm hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles?major=&skill=)
  @Get()
  @ApiOperation({ summary: 'Tìm kiếm hồ sơ nghề nghiệp công khai' })
  @ApiQuery({
    name: 'major',
    required: false,
    description: 'Lọc theo ngành đào tạo',
  })
  @ApiQuery({ name: 'skill', required: false, description: 'Lọc theo kỹ năng' })
  @ApiResponse({ status: 200, description: 'Danh sách hồ sơ công khai.' })
  search(@Query() query: PublicCareerProfileQueryDto) {
    return this.studentService.searchPublicCareerProfiles(query);
  }

  //Endpoint Xem chi tiết hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles/:studentId)
  @Get(':studentId')
  @ApiOperation({ summary: 'Xem hồ sơ nghề nghiệp công khai' })
  @ApiParam({ name: 'studentId', description: 'UUID hồ sơ sinh viên' })
  @ApiResponse({
    status: 404,
    description: 'Hồ sơ không tồn tại hoặc không công khai.',
  })
  getDetail(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    return this.studentService.getPublicCareerProfile(studentId);
  }
}
