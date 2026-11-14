import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { StorageService } from '../../../infrastructure/storage/storage.service';
import { UpdateStudentCvDto, UploadStudentCvDto } from '../dto/student-cv.dto';
import { PublicCareerProfileQueryDto } from '../dto/public-career-profile.dto';
import { AuditLogService } from '../../../infrastructure/audit/audit-log.service';
import { randomUUID } from 'crypto';
import path from 'path/win32';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Chốt chặn cốt lõi: Ánh xạ actor.id (users.id từ JWT) -> hồ sơ Student thuộc sở hữu.
   * Đồng thời kiểm tra trạng thái học tập từ bảng gốc student_masters.
   */
  private async resolveStudentByActorId(actorId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId: actorId },
      include: {
        studentMaster: true,
      },
    });

    if (!student) {
      throw new NotFoundException(
        `Không tìm thấy hồ sơ sinh viên liên kết với tài khoản hiện tại`,
      );
    }
    if (student.studentMaster.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Hồ sơ sinh viên đang trong trạng thái đình chỉ học tập, không thể thao tác.',
      );
    }
    return student;
  }

  /**
   * Kiểm tra tính hợp lệ của mốc thời gian (endDate >= startDate)
   */
  private validateDateRange(
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.',
      );
    }
  }

  // =========================================================================
  // 1. HỒ SƠ CÁ NHÂN (GET / PATCH /api/v1/students/me)
  // =========================================================================
  async getMyProfile(actorId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId: actorId },
      include: {
        studentMaster: true,
        _count: {
          select: {
            skills: true,
            experiences: true,
            projects: true,
            cvs: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy hồ sơ sinh viên.');
    }

    const { studentMaster, _count } = student;

    return {
      statusCode: 200,
      message: 'Lấy thông tin hồ sơ sinh viên thành công.',
      data: {
        id: student.id,
        // Dữ liệu học thuật gốc (Read-only từ student_masters)
        studentCode: studentMaster.studentCode,
        fullName: studentMaster.fullName,
        institutionalEmail: studentMaster.institutionalEmail,
        major: studentMaster.major,
        faculty: studentMaster.faculty,
        academicYear: studentMaster.academicYear,
        status: studentMaster.status,
        // Dữ liệu cá nhân (Editable trên students)
        phone: student.phone,
        bio: student.bio,
        address: student.address,
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.toISOString().split('T')[0]
          : null,
        gender: student.gender,
        gpa: student.gpa !== null ? Number(student.gpa) : null,
        careerProfileVisibility: student.careerProfileVisibility,
        // Thống kê tổng quan thành phần hồ sơ
        skillsCount: _count.skills,
        experiencesCount: _count.experiences,
        projectsCount: _count.projects,
        cvsCount: _count.cvs,
        updatedAt: student.updatedAt,
      },
    };
  }
  // Cập nhật trạng thái hiển thị hồ sơ nghề nghiệp công khai (PATCH /api/v1/students/me/career-profile/visibility)
  async updateCareerProfileVisibility(actorId: string, visibility: boolean) {
    const student = await this.resolveStudentByActorId(actorId);
    const previousVisibility = student.careerProfileVisibility;
    const updated = await this.prisma.student.update({
      where: { id: student.id },
      data: { careerProfileVisibility: visibility },
      select: {
        id: true,
        careerProfileVisibility: true,
        updatedAt: true,
      },
    });

    // Ghi lại sự kiện thay đổi trạng thái hiển thị hồ sơ nghề nghiệp công khai vào Audit Log
    await this.auditLogService.record({
      actorUserId: actorId,
      action: 'STUDENT_CAREER_PROFILE_VISIBILITY_CHANGED',
      resourceType: 'STUDENT',
      resourceId: student.id,
      oldValues: { careerProfileVisibility: previousVisibility },
      newValues: { careerProfileVisibility: visibility },
    });

    return {
      statusCode: 200,
      message: visibility
        ? 'Đã bật hồ sơ nghề nghiệp công khai.'
        : 'Đã tắt hồ sơ nghề nghiệp công khai.',
      data: updated,
    };
  }

  // Tìm kiếm hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles?major=&skill=)
  async searchPublicCareerProfiles(query: PublicCareerProfileQueryDto) {
    const students = await this.prisma.student.findMany({
      where: {
        careerProfileVisibility: true,
        user: { status: 'ACTIVE' },
        studentMaster: {
          status: 'ACTIVE',
          ...(query.major && {
            major: { contains: query.major, mode: 'insensitive' },
          }),
        },
        ...(query.skill && {
          skills: {
            some: {
              skillName: { contains: query.skill, mode: 'insensitive' },
            },
          },
        }),
      },
      include: this.publicCareerProfileInclude(),
      orderBy: { updatedAt: 'desc' },
    });

    return {
      statusCode: 200,
      message: 'Tìm kiếm hồ sơ nghề nghiệp công khai thành công.',
      data: {
        total: students.length,
        items: students.map((student) =>
          this.formatPublicCareerProfile(student),
        ),
      },
    };
  }

  // Xem chi tiết hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles/:studentId)
  async getPublicCareerProfile(studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        careerProfileVisibility: true,
        user: { status: 'ACTIVE' },
        studentMaster: { status: 'ACTIVE' },
      },
      include: this.publicCareerProfileInclude(),
    });

    if (!student) {
      throw new NotFoundException(
        'Không tìm thấy hồ sơ nghề nghiệp công khai.',
      );
    }

    return {
      statusCode: 200,
      message: 'Lấy hồ sơ nghề nghiệp công khai thành công.',
      data: this.formatPublicCareerProfile(student),
    };
  }

  // Hàm include để lấy dữ liệu liên quan của hồ sơ nghề nghiệp công khai
  private publicCareerProfileInclude() {
    return {
      studentMaster: {
        select: {
          fullName: true,
          major: true,
          faculty: true,
          academicYear: true,
        },
      },
      skills: {
        orderBy: { createdAt: 'asc' as const },
        select: { skillName: true, proficiency: true },
      },
      experiences: {
        orderBy: { startDate: 'desc' as const },
        select: {
          companyName: true,
          position: true,
          startDate: true,
          endDate: true,
          description: true,
        },
      },
      projects: {
        orderBy: [
          { startDate: 'desc' as const },
          { createdAt: 'desc' as const },
        ],
        select: {
          name: true,
          description: true,
          role: true,
          technologies: true,
          projectUrl: true,
          startDate: true,
          endDate: true,
        },
      },
    };
  }

  // Chuẩn hóa dữ liệu hồ sơ nghề nghiệp công khai trả về Client (Chuyển đổi BigInt -> Number, loại bỏ các trường nhạy cảm)
  private formatPublicCareerProfile(student: any) {
    return {
      studentId: student.id,
      fullName: student.studentMaster.fullName,
      major: student.studentMaster.major,
      faculty: student.studentMaster.faculty,
      academicYear: student.studentMaster.academicYear,
      bio: student.bio,
      skills: student.skills,
      experiences: student.experiences,
      projects: student.projects,
    };
  }

  // Cập nhật hồ sơ cá nhân (PATCH /api/v1/students/me)
  async updateMyProfile(actorId: string, dto: UpdateStudentProfileDto) {
    const student = await this.resolveStudentByActorId(actorId);

    const update = await this.prisma.student.update({
      where: { id: student.id },
      data: {
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.dateOfBirth !== undefined && {
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.gpa !== undefined && { gpa: dto.gpa }),
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật hồ sơ cá nhân thành công.',
      data: {
        id: update.id,
        phone: update.phone,
        bio: update.bio,
        address: update.address,
        dateOfBirth: update.dateOfBirth
          ? update.dateOfBirth.toISOString().split('T')[0]
          : null,
        gender: update.gender,
        gpa: update.gpa !== null ? Number(update.gpa) : null,
        updatedAt: update.updatedAt,
      },
    };
  }

  // =========================================================================
  // 2. QUẢN LÝ KỸ NĂNG (CRUD /api/v1/students/me/skills)
  // =========================================================================
  async getMySkills(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const skills = await this.prisma.studentSkill.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách kỹ năng thành công.',
      data: skills,
    };
  }

  // Thêm kỹ năng mới (POST /api/v1/students/me/skills)
  async createSkill(actorId: string, dto: CreateSkillDto) {
    const student = await this.resolveStudentByActorId(actorId);

    // Kiểm tra trùng lặp không phân biệt chữ hoa/thường
    const duplicated = await this.prisma.studentSkill.findFirst({
      where: {
        studentId: student.id,
        skillName: { equals: dto.skillName, mode: 'insensitive' },
      },
    });

    if (duplicated) {
      throw new ConflictException(
        `Kỹ năng "${dto.skillName}" đã tồn tại trong hồ sơ của bạn.`,
      );
    }

    try {
      const created = await this.prisma.studentSkill.create({
        data: {
          studentId: student.id,
          skillName: dto.skillName,
          proficiency: dto.proficiency ?? null,
        },
      });

      return {
        statusCode: 201,
        message: 'Thêm kỹ năng chuyên môn thành công.',
        data: created,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Kỹ năng "${dto.skillName}" đã tồn tại trong hồ sơ của bạn.`,
        );
      }
      throw error;
    }
  }

  // Cập nhật kỹ năng (PATCH /api/v1/students/me/skills/:skillId)
  async updateSkill(actorId: string, skillId: string, dto: UpdateSkillDto) {
    const student = await this.resolveStudentByActorId(actorId);

    // Data Ownership Enforcement: Bắt buộc kiểm tra cả id và studentId
    const existingSkill = await this.prisma.studentSkill.findFirst({
      where: { id: skillId, studentId: student.id },
    });

    if (!existingSkill) {
      throw new NotFoundException(
        'Không tìm thấy kỹ năng hoặc bạn không có quyền chỉnh sửa tài nguyên này.',
      );
    }

    // Kiểm tra trùng lặp tên kỹ năng (nếu skillName được cung cấp)
    if (
      dto.skillName &&
      dto.skillName.toLowerCase() !== existingSkill.skillName.toLowerCase()
    ) {
      const duplicated = await this.prisma.studentSkill.findFirst({
        where: {
          studentId: student.id,
          id: { not: skillId },
          skillName: { equals: dto.skillName, mode: 'insensitive' },
        },
      });

      if (duplicated) {
        throw new ConflictException(
          `Kỹ năng "${dto.skillName}" đã tồn tại trong hồ sơ của bạn.`,
        );
      }
    }

    const updated = await this.prisma.studentSkill.update({
      where: { id: existingSkill.id },
      data: {
        ...(dto.skillName !== undefined && { skillName: dto.skillName }),
        ...(dto.proficiency !== undefined && { proficiency: dto.proficiency }),
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật kỹ năng thành công.',
      data: updated,
    };
  }

  // Xóa kỹ năng (DELETE /api/v1/students/me/skills/:skillId)
  async deleteSkill(actorId: string, skillId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    // Dùng deleteMany kèm điều kiện studentId để đảm bảo tính nguyên tử và chống IDOR
    const result = await this.prisma.studentSkill.deleteMany({
      where: { id: skillId, studentId: student.id },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        'Không tìm thấy kỹ năng hoặc bạn không có quyền xóa tài nguyên này.',
      );
    }

    return {
      statusCode: 200,
      message: 'Xóa kỹ năng thành công.',
    };
  }

  // =========================================================================
  // 3. QUẢN LÝ KINH NGHIỆM LÀM VIỆC (CRUD /api/v1/students/me/experiences)
  // =========================================================================
  async getMyExperiences(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const experiences = await this.prisma.studentExperience.findMany({
      where: { studentId: student.id },
      orderBy: { startDate: 'desc' }, // Khớp với index @@index([studentId, startDate(sort: Desc)])
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách kinh nghiệm làm việc thành công.',
      data: experiences,
    };
  }

  // Thêm kinh nghiệm làm việc mới (POST /api/v1/students/me/experiences)
  async createExperience(actorId: string, dto: CreateExperienceDto) {
    const student = await this.resolveStudentByActorId(actorId);

    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    this.validateDateRange(startDate, endDate);

    const created = await this.prisma.studentExperience.create({
      data: {
        studentId: student.id,
        companyName: dto.companyName.trim(),
        position: dto.position.trim(),
        startDate,
        endDate,
        description: dto.description ?? null,
      },
    });

    return {
      statusCode: 201,
      message: 'Thêm kinh nghiệm làm việc thành công.',
      data: created,
    };
  }

  // Cập nhật kinh nghiệm làm việc (PATCH /api/v1/students/me/experiences/:experienceId)
  async updateExperience(
    actorId: string,
    experienceId: string,
    dto: UpdateExperienceDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);

    // Data Ownership Enforcement
    const existing = await this.prisma.studentExperience.findFirst({
      where: { id: experienceId, studentId: student.id },
    });

    if (!existing) {
      throw new NotFoundException(
        'Không tìm thấy kinh nghiệm làm việc hoặc bạn không có quyền chỉnh sửa.',
      );
    }

    const effectiveStartDate = dto.startDate
      ? new Date(dto.startDate)
      : existing.startDate;
    const effectiveEndDate =
      dto.endDate !== undefined
        ? dto.endDate
          ? new Date(dto.endDate)
          : null
        : existing.endDate;

    this.validateDateRange(effectiveStartDate, effectiveEndDate);

    const updated = await this.prisma.studentExperience.update({
      where: { id: existing.id },
      data: {
        ...(dto.companyName !== undefined && {
          companyName: dto.companyName.trim(),
        }),
        ...(dto.position !== undefined && { position: dto.position.trim() }),
        ...(dto.startDate !== undefined && { startDate: effectiveStartDate }),
        ...(dto.endDate !== undefined && { endDate: effectiveEndDate }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật kinh nghiệm làm việc thành công.',
      data: updated,
    };
  }

  // Xóa kinh nghiệm làm việc (DELETE /api/v1/students/me/experiences/:experienceId)
  async deleteExperience(actorId: string, experienceId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const result = await this.prisma.studentExperience.deleteMany({
      where: { id: experienceId, studentId: student.id },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        'Không tìm thấy kinh nghiệm làm việc hoặc bạn không có quyền xóa.',
      );
    }

    return {
      statusCode: 200,
      message: 'Xóa kinh nghiệm làm việc thành công.',
    };
  }

  // =========================================================================
  // 4. QUẢN LÝ DỰ ÁN CÁ NHÂN (CRUD /api/v1/students/me/projects)
  // =========================================================================
  async getMyProjects(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const projects = await this.prisma.studentProject.findMany({
      where: { studentId: student.id },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách dự án cá nhân thành công.',
      data: projects,
    };
  }

  // Thêm dự án cá nhân mới (POST /api/v1/students/me/projects)
  async createProject(actorId: string, dto: CreateProjectDto) {
    const student = await this.resolveStudentByActorId(actorId);

    const startDate = dto.startDate ? new Date(dto.startDate) : null;
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    this.validateDateRange(startDate, endDate);

    const created = await this.prisma.studentProject.create({
      data: {
        studentId: student.id,
        name: dto.name.trim(),
        description: dto.description ?? null,
        role: dto.role?.trim() ?? null,
        technologies: dto.technologies?.trim() ?? null,
        projectUrl: dto.projectUrl?.trim() ?? null,
        startDate,
        endDate,
      },
    });

    return {
      statusCode: 201,
      message: 'Thêm dự án cá nhân thành công.',
      data: created,
    };
  }

  // Cập nhật dự án cá nhân (PATCH /api/v1/students/me/projects/:projectId)
  async updateProject(
    actorId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);

    // Data Ownership Enforcement
    const existing = await this.prisma.studentProject.findFirst({
      where: { id: projectId, studentId: student.id },
    });

    if (!existing) {
      throw new NotFoundException(
        'Không tìm thấy dự án hoặc bạn không có quyền chỉnh sửa.',
      );
    }

    const effectiveStartDate =
      dto.startDate !== undefined
        ? dto.startDate
          ? new Date(dto.startDate)
          : null
        : existing.startDate;
    const effectiveEndDate =
      dto.endDate !== undefined
        ? dto.endDate
          ? new Date(dto.endDate)
          : null
        : existing.endDate;

    this.validateDateRange(effectiveStartDate, effectiveEndDate);

    const updated = await this.prisma.studentProject.update({
      where: { id: existing.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.role !== undefined && { role: dto.role?.trim() ?? null }),
        ...(dto.technologies !== undefined && {
          technologies: dto.technologies?.trim() ?? null,
        }),
        ...(dto.projectUrl !== undefined && {
          projectUrl: dto.projectUrl?.trim() ?? null,
        }),
        ...(dto.startDate !== undefined && { startDate: effectiveStartDate }),
        ...(dto.endDate !== undefined && { endDate: effectiveEndDate }),
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật dự án cá nhân thành công.',
      data: updated,
    };
  }

  // Xóa dự án cá nhân (DELETE /api/v1/students/me/projects/:projectId)
  async deleteProject(actorId: string, projectId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const result = await this.prisma.studentProject.deleteMany({
      where: { id: projectId, studentId: student.id },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        'Không tìm thấy dự án hoặc bạn không có quyền xóa.',
      );
    }

    return {
      statusCode: 200,
      message: 'Xóa dự án cá nhân thành công.',
    };
  }

  // =========================================================================
  // 5. Quản lý CV (CRUD /api/v1/students/me/cvs)
  // =========================================================================
  // Chuẩn hóa dữ liệu CV trả về Client (Chuyển đổi BigInt -> Number, loại bỏ các trường nhạy cảm)
  private formatCvResponse(cv: any) {
    return {
      id: cv.id,
      title: cv.title,
      isDefault: cv.isDefault,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
      file: cv.file
        ? {
            id: cv.file.id,
            originalName: cv.file.originalName,
            mimeType: cv.file.mimeType,
            sizeBytes: Number(cv.file.sizeBytes),
            createdAt: cv.file.createdAt,
          }
        : null,
    };
  }

  // Upload CV mới lên MinIO và lưu metadata vào DB (POST /api/v1/students/me/cvs)
  async uploadStudentCv(
    actorId: string,
    file: Express.Multer.File,
    dto: UploadStudentCvDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);
    const bucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';

    // Tạo storageKey an toàn do Backend kiểm soát, chống Path Traversal
    const storageKey = `resumes/${student.id}/${randomUUID()}.pdf`;

    // Làm sạch tên file gốc trước khi lưu metadata
    const safeOriginalName = path.basename(file.originalname).slice(0, 255);

    // Bước 1: Tải binary lên MinIO Object Storage
    await this.storageService.uploadFile(
      bucket,
      storageKey,
      file.buffer,
      file.mimetype,
    );

    try {
      // Bước 2: Mở Prisma Atomic Transaction lưu metadata và xử lý Default CV
      const createdCv = await this.prisma.$transaction(async (tx) => {
        const existingCount = await tx.studentCv.count({
          where: { studentId: student.id },
        });

        // Nếu là CV đầu tiên hoặc người dùng yêu cầu đặt làm mặc định
        const shouldBeDefault = existingCount === 0 || Boolean(dto.isDefault);

        if (shouldBeDefault && existingCount > 0) {
          await tx.studentCv.updateMany({
            where: { studentId: student.id, isDefault: true },
            data: { isDefault: false },
          });
        }

        const savedFile = await tx.file.create({
          data: {
            ownerUserId: actorId,
            originalName: safeOriginalName,
            storageKey,
            mimeType: file.mimetype,
            sizeBytes: BigInt(file.size),
          },
        });

        return await tx.studentCv.create({
          data: {
            studentId: student.id,
            fileId: savedFile.id,
            title: dto.title.trim(),
            isDefault: shouldBeDefault,
          },
          include: { file: true },
        });
      });

      return this.formatCvResponse(createdCv);
    } catch (error) {
      // Bước 3: Cơ chế bù trừ (Compensating Cleanup) xóa tệp mồ côi trên MinIO nếu DB thất bại
      this.logger.error(
        `Giao dịch CSDL thất bại khi lưu CV, tiến hành cleanup object [${storageKey}]`,
        error,
      );
      await this.storageService.deleteFile(bucket, storageKey);
      throw new InternalServerErrorException(
        'Không thể lưu thông tin CV vào cơ sở dữ liệu. Vui lòng thử lại.',
      );
    }
  }

  // Lấy toàn bộ danh sách CV của sinh viên hiện tại (GET /api/v1/students/me/cvs)
  async getMyCvs(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const cvs = await this.prisma.studentCv.findMany({
      where: { studentId: student.id },
      include: { file: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return cvs.map((cv) => this.formatCvResponse(cv));
  }

  // Sinh Presigned URL tạm thời (15 phút) để xem trước / tải CV của chính mình (GET /api/v1/students/me/cvs/:cvId/download-url)
  async getMyCvDownloadUrl(actorId: string, cvId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    // Scoped Query: Kiểm tra đồng thời cvId và studentId chống IDOR
    const cv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
      include: { file: true },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    const bucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';
    const url = await this.storageService.getFileUrl(
      bucket,
      cv.file.storageKey,
      900, // Hết hạn sau 15 phút
    );

    return {
      cvId: cv.id,
      title: cv.title,
      originalName: cv.file.originalName,
      url,
      expiresInSeconds: 900,
    };
  }

  // Chuyển đổi CV mặc định (Enforce duy nhất 1 CV default) (PATCH /api/v1/students/me/cvs/:cvId/default)
  async setDefaultCv(actorId: string, cvId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const targetCv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
    });

    if (!targetCv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    if (targetCv.isDefault) {
      const current = await this.prisma.studentCv.findUnique({
        where: { id: cvId },
        include: { file: true },
      });
      return this.formatCvResponse(current);
    }

    const updatedCv = await this.prisma.$transaction(async (tx) => {
      // Hạ cờ mặc định của các CV khác thuộc sinh viên này
      await tx.studentCv.updateMany({
        where: { studentId: student.id, isDefault: true },
        data: { isDefault: false },
      });

      // Bật cờ mặc định cho CV được chọn
      return await tx.studentCv.update({
        where: { id: cvId },
        data: { isDefault: true },
        include: { file: true },
      });
    });

    return this.formatCvResponse(updatedCv);
  }

  // Đổi tên gợi nhớ của CV (PATCH /api/v1/students/me/cvs/:cvId)
  async updateMyCvTitle(
    actorId: string,
    cvId: string,
    dto: UpdateStudentCvDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);

    const targetCv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
    });

    if (!targetCv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    const updated = await this.prisma.studentCv.update({
      where: { id: cvId },
      data: { title: dto.title.trim() },
      include: { file: true },
    });

    return this.formatCvResponse(updated);
  }

  // Xóa bản CV và dọn dẹp tệp trên MinIO (nếu không còn snapshot tham chiếu) (DELETE /api/v1/students/me/cvs/:cvId)
  async deleteMyCv(actorId: string, cvId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const targetCv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
      include: { file: true },
    });

    if (!targetCv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    await this.prisma.$transaction(async (tx) => {
      // Xóa bản ghi trong student_cvs (applications.cv_id sẽ tự động SET NULL theo thiết kế)
      await tx.studentCv.delete({
        where: { id: cvId },
      });

      // Nếu CV bị xóa là CV mặc định, tự động chọn CV mới nhất còn lại làm mặc định
      if (targetCv.isDefault) {
        const nextCv = await tx.studentCv.findFirst({
          where: { studentId: student.id },
          orderBy: { createdAt: 'desc' },
        });
        if (nextCv) {
          await tx.studentCv.update({
            where: { id: nextCv.id },
            data: { isDefault: true },
          });
        }
      }

      // Kiểm tra xem bản ghi File còn bị tham chiếu bởi bảng nào khác không trước khi xóa
      const remainingRefs = await tx.studentCv.count({
        where: { fileId: targetCv.fileId },
      });

      if (remainingRefs === 0) {
        await tx.file.delete({
          where: { id: targetCv.fileId },
        });
      }
    });

    // Dọn dẹp vật lý trên MinIO sau khi CSDL đã commit thành công
    const bucket = process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';
    await this.storageService.deleteFile(bucket, targetCv.file.storageKey);

    // Ghi lại sự kiện xóa CV vào Audit Log
    await this.auditLogService.record({
      actorUserId: actorId,
      action: 'STUDENT_CV_DELETED',
      resourceType: 'STUDENT_CV',
      resourceId: cvId,
      oldValues: {
        studentId: student.id,
        title: targetCv.title,
        isDefault: targetCv.isDefault,
        fileId: targetCv.fileId,
        originalName: targetCv.file.originalName,
        mimeType: targetCv.file.mimeType,
        sizeBytes: targetCv.file.sizeBytes,
      },
      newValues: { deleted: true },
    });

    return {
      deletedId: cvId,
      message: 'Đã xóa bản CV thành công',
    };
  }
}
