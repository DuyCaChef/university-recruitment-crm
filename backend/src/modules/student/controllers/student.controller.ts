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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  MAX_CV_FILE_SIZE,
  PdfFileValidationPipe,
} from '../../../common/pipes/pdf-file-validation.pipe';
import { StudentService } from '../services/student.service';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { UpdateStudentCvDto, UploadStudentCvDto } from '../dto/student-cv.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Student - Prfile, Skills, Experiences, Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
@Controller('students')
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
  @Get('me')
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
  @Patch('me')
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
  @Get('me/skills')
  @ApiOperation({ summary: 'Lấy danh sách kỹ năng của sinh viên' })
  getMySkills(@Req() req: any) {
    return this.studentService.getMySkills(this.extractActorId(req));
  }

  //Endpoint Thêm mới một kỹ năng chuyên môn (POST /api/v1/students/me/skills)
  @Post('me/skills')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm mới một kỹ năng chuyên môn' })
  @ApiResponse({ status: 201, description: 'Thêm kỹ năng thành công.' })
  @ApiResponse({ status: 409, description: 'Kỹ năng đã tồn tại trong hồ sơ.' })
  createSkill(@Req() req: any, @Body() dto: CreateSkillDto) {
    return this.studentService.createSkill(this.extractActorId(req), dto);
  }

  //Endpoint Cập nhật kỹ năng thuộc quyền sở hữu (PATCH /api/v1/students/me/skills/:id)
  @Patch('me/skills/:id')
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
  @Delete('me/skills/:id')
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
  @Get('me/experiences')
  @ApiOperation({ summary: 'Lấy danh sách kinh nghiệm làm việc/thực tập' })
  getMyExperiences(@Req() req: any) {
    return this.studentService.getMyExperiences(this.extractActorId(req));
  }

  //Endpoint Thêm mới kinh nghiệm làm việc/thực tập (POST /api/v1/students/me/experiences)
  @Post('me/experiences')
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
  @Patch('me/experiences/:id')
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
  @Delete('me/experiences/:id')
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
  @Get('me/projects')
  @ApiOperation({ summary: 'Lấy danh sách dự án cá nhân của sinh viên' })
  getMyProjects(@Req() req: any) {
    return this.studentService.getMyProjects(this.extractActorId(req));
  }

  //Endpoint Thêm mới dự án học tập/thực tế (POST /api/v1/students/me/projects)
  @Post('me/projects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm mới dự án học tập/thực tế' })
  createProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.studentService.createProject(this.extractActorId(req), dto);
  }

  //Endpoint Cập nhật dự án thuộc quyền sở hữu (PATCH /api/v1/students/me/projects/:id)
  @Patch('me/projects/:id')
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
  @Delete('me/projects/:id')
  @ApiOperation({ summary: 'Xóa dự án thuộc quyền sở hữu' })
  @ApiParam({ name: 'id', description: 'UUID của bản ghi student_projects' })
  deleteProject(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.studentService.deleteProject(this.extractActorId(req), id);
  }

  // =========================================================================
  // 5. STUDENT CVs (CRUD /api/v1/students/me/cvs)
  // =========================================================================
  @Post(['me/cvs', 'cvs'])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_CV_FILE_SIZE }, // Chặn sớm luồng stream nếu vượt 5MB[cite: 1, 2]
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Tải lên bản CV mới (PDF <= 5MB)',
    description:
      'Kiểm tra định dạng PDF thực tế (Magic Bytes), lưu tệp vào MinIO bucket agu-crm-storage/resumes/ và cập nhật danh sách CV cá nhân.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'title'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp CV định dạng PDF (tối đa 5MB)',
        },
        title: {
          type: 'string',
          example: 'CV Backend Developer NestJS',
          description: 'Tên gợi nhớ cho bản CV',
        },
        isDefault: {
          type: 'boolean',
          example: true,
          description: 'Đặt làm CV mặc định',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tải lên CV thành công, trả về ID và metadata bản ghi.',
  })
  @ApiResponse({
    status: 400,
    description: 'Tệp không phải PDF hoặc vượt quá 5MB.',
  })
  async uploadCv(
    @CurrentUser('id') actorId: string,
    @UploadedFile(new PdfFileValidationPipe()) file: Express.Multer.File,
    @Body() dto: UploadStudentCvDto,
  ) {
    return this.studentService.uploadStudentCv(actorId, file, dto);
  }

  //Endpoint Lấy danh sách CV của sinh viên hiện tại (GET /api/v1/students/me/cvs)
  @Get(['me/cvs', 'cvs'])
  @ApiOperation({ summary: 'Lấy danh sách CV của sinh viên hiện tại' })
  async getMyCvs(@CurrentUser('id') actorId: string) {
    return this.studentService.getMyCvs(actorId);
  }

  //Endpoint Lấy Presigned URL tạm thời (15 phút) để xem/tải CV (GET /api/v1/students/me/cvs/:cvId/download-url)
  @Get(['me/cvs/:cvId/download-url', 'cvs/:cvId/download-url'])
  @ApiOperation({
    summary: 'Lấy Presigned URL tạm thời (15 phút) để xem/tải CV',
  })
  async getMyCvDownloadUrl(
    @CurrentUser('id') actorId: string,
    @Param('cvId', new ParseUUIDPipe()) cvId: string,
  ) {
    return this.studentService.getMyCvDownloadUrl(actorId, cvId);
  }

  //Endpoint Đặt bản CV làm CV mặc định (PATCH /api/v1/students/me/cvs/:cvId/default)
  @Patch(['me/cvs/:cvId/default', 'cvs/:cvId/default'])
  @ApiOperation({
    summary: 'Đặt bản CV làm CV mặc định (duy nhất 01 CV default)',
  })
  async setDefaultCv(
    @CurrentUser('id') actorId: string,
    @Param('cvId', new ParseUUIDPipe()) cvId: string,
  ) {
    return this.studentService.setDefaultCv(actorId, cvId);
  }

  //Endpoint Cập nhật tiêu đề gợi nhớ của bản CV (PATCH /api/v1/students/me/cvs/:cvId)
  @Patch(['me/cvs/:cvId', 'cvs/:cvId'])
  @ApiOperation({ summary: 'Đổi tên gợi nhớ của bản CV' })
  async updateMyCvTitle(
    @CurrentUser('id') actorId: string,
    @Param('cvId', new ParseUUIDPipe()) cvId: string,
    @Body() dto: UpdateStudentCvDto,
  ) {
    return this.studentService.updateMyCvTitle(actorId, cvId, dto);
  }

  //Endpoint Xóa bản CV khỏi kho cá nhân và MinIO (DELETE /api/v1/students/me/cvs/:cvId)
  @Delete(['me/cvs/:cvId', 'cvs/:cvId'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa bản CV khỏi kho cá nhân và MinIO' })
  async deleteMyCv(
    @CurrentUser('id') actorId: string,
    @Param('cvId', new ParseUUIDPipe()) cvId: string,
  ) {
    return this.studentService.deleteMyCv(actorId, cvId);
  }
}
