import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StudentService } from '../services/student.service';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Student - Prfile, Skills, Experiences, Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
@Controller('students/me')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Trích xuất actor.id (users.id) từ Request đã qua JwtAuthGuard
   */
  private extractActorId(req: any): string {
    return req.user?.id ?? req.user?.sub;
  }

  // =========================================================================
  // 1. STUDENT PROFILE (GET / PATCH /api/v1/students/me)
  // =========================================================================
  //Endpoint Lấy thông tin hồ sơ cá nhân và học thuật của sinh viên đang đăng nhập (GET /api/v1/students/me)
  @Get()
  @ApiOperation({
    summary:
      'Lấy thông tin hồ sơ cá nhân và học thuật của sinh viên đang đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hồ sơ cá nhân và học thuật của sinh viên.',
  })
  async getMyProfile(@Req() req: any) {
    return this.studentService.getMyProfile(this.extractActorId(req));
  }

  //Endpoint Cập nhật thông tin cá nhân được phép (phone, bio, address, gpa...) (PATCH /api/v1/students/me)
  @Patch()
  @ApiOperation({
    summary:
      'Cập nhật thông tin cá nhân được phép (phone, bio, address, gpa...)',
    description:
      'Không cho phép sửa thông tin học thuật gốc (MSSV, Họ tên, Ngành, Khoa).',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật hồ sơ thành công.' })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu sai định dạng hoặc chứa trường bị cấm.',
  })
  updateMyProfile(@Req() req: any, @Body() dto: UpdateStudentProfileDto) {
    return this.studentService.updateMyProfile(this.extractActorId(req), dto);
  }

  // =========================================================================
  // 2. SKILLS (CRUD /api/v1/students/me/skills)
  // =========================================================================
  //Endpoint Lấy danh sách kỹ năng của sinh viên (GET /api/v1/students/me/skills)
  @Get('skills')
  @ApiOperation({ summary: 'Lấy danh sách kỹ năng của sinh viên' })
  getMySkills(@Req() req: any) {
    return this.studentService.getMySkills(this.extractActorId(req));
  }

  //Endpoint Thêm mới một kỹ năng chuyên môn (POST /api/v1/students/me/skills)
  @Post('skills')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm mới một kỹ năng chuyên môn' })
  @ApiResponse({ status: 201, description: 'Thêm kỹ năng thành công.' })
  @ApiResponse({ status: 409, description: 'Kỹ năng đã tồn tại trong hồ sơ.' })
  createSkill(@Req() req: any, @Body() dto: CreateSkillDto) {
    return this.studentService.createSkill(this.extractActorId(req), dto);
  }

  //Endpoint Cập nhật kỹ năng thuộc quyền sở hữu (PATCH /api/v1/students/me/skills/:id)
  @Patch('skills/:id')
  @ApiOperation({ summary: 'Cập nhật kỹ năng thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_skills' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy hoặc không thuộc quyền sở hữu.',
  })
  updateSkill(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.studentService.updateSkill(this.extractActorId(req), id, dto);
  }

  //Endpoint Xóa kỹ năng thuộc quyền sở hữu (DELETE /api/v1/students/me/skills/:id)
  @Delete('skills/:id')
  @ApiOperation({ summary: 'Xóa kỹ năng thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_skills' })
  deleteSkill(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.studentService.deleteSkill(this.extractActorId(req), id);
  }

  // =========================================================================
  // 3. EXPERIENCES (CRUD /api/v1/students/me/experiences)
  // =========================================================================
  //Endpoint Lấy danh sách kinh nghiệm làm việc/thực tập (GET /api/v1/students/me/experiences)
  @Get('experiences')
  @ApiOperation({ summary: 'Lấy danh sách kinh nghiệm làm việc/thực tập' })
  getMyExperiences(@Req() req: any) {
    return this.studentService.getMyExperiences(this.extractActorId(req));
  }

  //Endpoint Thêm mới kinh nghiệm làm việc/thực tập (POST /api/v1/students/me/experiences)
  @Post('experiences')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm mới kinh nghiệm làm việc/thực tập' })
  @ApiResponse({
    status: 400,
    description: 'Ngày kết thúc nhỏ hơn ngày bắt đầu.',
  })
  createExperience(@Req() req: any, @Body() dto: CreateExperienceDto) {
    return this.studentService.createExperience(this.extractActorId(req), dto);
  }

  //Endpoint Cập nhật kinh nghiệm làm việc/thực tập thuộc quyền sở hữu (PATCH /api/v1/students/me/experiences/:id)
  @Patch('experiences/:id')
  @ApiOperation({ summary: 'Cập nhật kinh nghiệm làm việc thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_experiences' })
  updateExperience(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.studentService.updateExperience(
      this.extractActorId(req),
      id,
      dto,
    );
  }

  //Endpoint Xóa kinh nghiệm làm việc/thực tập thuộc quyền sở hữu (DELETE /api/v1/students/me/experiences/:id)
  @Delete('experiences/:id')
  @ApiOperation({ summary: 'Xóa kinh nghiệm làm việc thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_experiences' })
  deleteExperience(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.studentService.deleteExperience(this.extractActorId(req), id);
  }

  // =========================================================================
  // 4. PROJECTS (CRUD /api/v1/students/me/projects)
  // =========================================================================
  //Endpoint Lấy danh sách dự án cá nhân của sinh viên (GET /api/v1/students/me/projects)
  @Get('projects')
  @ApiOperation({ summary: 'Lấy danh sách dự án cá nhân của sinh viên' })
  getMyProjects(@Req() req: any) {
    return this.studentService.getMyProjects(this.extractActorId(req));
  }

  //Endpoint Thêm mới dự án học tập/thực tế (POST /api/v1/students/me/projects)
  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm mới dự án học tập/thực tế' })
  createProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.studentService.createProject(this.extractActorId(req), dto);
  }

  //Endpoint Cập nhật dự án thuộc quyền sở hữu (PATCH /api/v1/students/me/projects/:id)
  @Patch('projects/:id')
  @ApiOperation({ summary: 'Cập nhật dự án thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_projects' })
  updateProject(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.studentService.updateProject(this.extractActorId(req), id, dto);
  }

  //Endpoint Xóa dự án thuộc quyền sở hữu (DELETE /api/v1/students/me/projects/:id)
  @Delete('projects/:id')
  @ApiOperation({ summary: 'Xóa dự án thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_projects' })
  deleteProject(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.studentService.deleteProject(this.extractActorId(req), id);
  }
}
