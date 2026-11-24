// backend/src/modules/student/services/student.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { StorageService } from '../../../infrastructure/storage/storage.service';
import { AuditLogService } from '../../../infrastructure/audit/audit-log.service';
import {
  AVATAR_MIME_TO_EXT,
  type AllowedAvatarMimeType,
} from '../../../common/pipes/image-file-validation.pipe';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { UpdateStudentCvDto, UploadStudentCvDto } from '../dto/student-cv.dto';
import { PublicCareerProfileQueryDto } from '../dto/public-career-profile.dto';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  private readonly defaultBucket =
    process.env.MINIO_DEFAULT_BUCKET || 'agu-crm-storage';

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly auditLogService: AuditLogService,
  ) { }

  // =========================================================================
  // 1. HỒ SƠ CÁ NHÂN, HIỂN THỊ CÔNG KHAI & ẢNH ĐẠI DIỆN
  // =========================================================================

  /** Lấy hồ sơ đầy đủ của sinh viên đang đăng nhập (GET /api/v1/students/me) */
  async getMyProfile(actorId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId: actorId },
      include: {
        studentMaster: true,
        avatarFile: true,
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

    const { studentMaster, avatarFile, _count } = student;
    const avatarUrl = await this.resolveAvatarUrl(avatarFile?.storageKey);

    return {
      statusCode: 200,
      message: 'Lấy thông tin hồ sơ sinh viên thành công.',
      data: {
        id: student.id,
        // Dữ liệu học thuật gốc (Read-only từ student_masters)
        studentCode: studentMaster.studentCode,
        fullName: student.displayName ?? studentMaster.fullName,
        originalFullName: studentMaster.fullName,
        displayName: student.displayName,
        avatarUrl,
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

  /** Cập nhật thông tin cá nhân & tên hiển thị (PATCH /api/v1/students/me) */
  async updateMyProfile(actorId: string, dto: UpdateStudentProfileDto) {
    const student = await this.resolveStudentByActorId(actorId);
    const previousDisplayName = student.displayName;

    const updated = await this.prisma.student.update({
      where: { id: student.id },
      data: {
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
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

    if (
      dto.displayName !== undefined &&
      dto.displayName !== previousDisplayName
    ) {
      await this.auditLogService.record({
        actorUserId: actorId,
        action: 'STUDENT_DISPLAY_NAME_UPDATED',
        resourceType: 'STUDENT',
        resourceId: student.id,
        oldValues: { displayName: previousDisplayName },
        newValues: { displayName: updated.displayName },
      });
    }

    return {
      statusCode: 200,
      message: 'Cập nhật hồ sơ cá nhân thành công.',
      data: {
        id: updated.id,
        fullName: updated.displayName ?? student.studentMaster.fullName,
        originalFullName: student.studentMaster.fullName,
        displayName: updated.displayName,
        phone: updated.phone,
        bio: updated.bio,
        address: updated.address,
        dateOfBirth: updated.dateOfBirth
          ? updated.dateOfBirth.toISOString().split('T')[0]
          : null,
        gender: updated.gender,
        gpa: updated.gpa !== null ? Number(updated.gpa) : null,
        updatedAt: updated.updatedAt,
      },
    };
  }

  /** Bật/tắt hiển thị hồ sơ nghề nghiệp công khai (PATCH /api/v1/students/me/visibility) */
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

  /** Tải lên hoặc thay đổi ảnh đại diện (POST /api/v1/students/me/avatar) */
  async uploadAvatar(actorId: string, file: Express.Multer.File) {
    const student = await this.resolveStudentByActorId(actorId);
    const ext = AVATAR_MIME_TO_EXT[file.mimetype as AllowedAvatarMimeType];
    const storageKey = `avatars/${student.id}/${randomUUID()}.${ext}`;
    const safeOriginalName = path.basename(file.originalname).slice(0, 255);

    // Bước 1: Tải ảnh mới lên MinIO
    await this.storageService.uploadFile(
      this.defaultBucket,
      storageKey,
      file.buffer,
      file.mimetype,
    );

    let oldStorageKey: string | null = null;

    try {
      // Bước 2: Cập nhật nguyên tử bảng files và students.avatar_file_id
      const savedFile = await this.prisma.$transaction(async (tx) => {
        const current = await tx.student.findUniqueOrThrow({
          where: { id: student.id },
          include: { avatarFile: true },
        });

        const oldFile = current.avatarFile;
        oldStorageKey = oldFile?.storageKey ?? null;

        const createdFile = await tx.file.create({
          data: {
            ownerUserId: actorId,
            originalName: safeOriginalName,
            storageKey,
            mimeType: file.mimetype,
            sizeBytes: BigInt(file.size),
          },
        });

        await tx.student.update({
          where: { id: student.id },
          data: { avatarFileId: createdFile.id },
        });

        // Xóa bản ghi File cũ nếu không còn tham chiếu ở bảng student_cvs
        if (oldFile) {
          const cvRefs = await tx.studentCv.count({
            where: { fileId: oldFile.id },
          });
          if (cvRefs === 0) {
            await tx.file.delete({ where: { id: oldFile.id } });
          } else {
            oldStorageKey = null;
          }
        }

        return createdFile;
      });

      // Bước 3: Dọn tệp ảnh cũ trên MinIO sau khi DB commit thành công
      if (oldStorageKey) {
        const deletedOld = await this.storageService.deleteFile(
          this.defaultBucket,
          oldStorageKey,
        );
        if (!deletedOld) {
          this.logger.warn(
            `Không thể xóa ảnh đại diện cũ trên MinIO [${this.defaultBucket}] ${oldStorageKey}`,
          );
        }
      }

      await this.auditLogService.record({
        actorUserId: actorId,
        action: 'STUDENT_AVATAR_UPDATED',
        resourceType: 'STUDENT',
        resourceId: student.id,
        newValues: {
          fileId: savedFile.id,
          originalName: savedFile.originalName,
          mimeType: savedFile.mimeType,
          sizeBytes: Number(savedFile.sizeBytes),
        },
      });

      const avatarUrl = await this.resolveAvatarUrl(savedFile.storageKey);

      return {
        statusCode: 200,
        message: 'Cập nhật ảnh đại diện thành công.',
        data: {
          avatarUrl,
          file: {
            id: savedFile.id,
            originalName: savedFile.originalName,
            mimeType: savedFile.mimeType,
            sizeBytes: Number(savedFile.sizeBytes),
            createdAt: savedFile.createdAt,
          },
        },
      };
    } catch (error) {
      // Cơ chế bù trừ (Compensating Cleanup) nếu giao dịch DB thất bại
      this.logger.error(
        `Giao dịch DB thất bại khi lưu avatar, tiến hành cleanup [${storageKey}]`,
        error,
      );
      await this.storageService.deleteFile(this.defaultBucket, storageKey);
      throw new InternalServerErrorException(
        'Không thể lưu ảnh đại diện. Vui lòng thử lại.',
      );
    }
  }

  /** Gỡ ảnh đại diện hiện tại (DELETE /api/v1/students/me/avatar) */
  async deleteAvatar(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const current = await this.prisma.student.findUniqueOrThrow({
      where: { id: student.id },
      include: { avatarFile: true },
    });

    if (!current.avatarFile) {
      return {
        statusCode: 200,
        message: 'Hồ sơ hiện chưa có ảnh đại diện.',
        data: { avatarUrl: null },
      };
    }

    const oldFile = current.avatarFile;
    let shouldDeleteObject = true;

    await this.prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: student.id },
        data: { avatarFileId: null },
      });

      const cvRefs = await tx.studentCv.count({
        where: { fileId: oldFile.id },
      });
      if (cvRefs === 0) {
        await tx.file.delete({ where: { id: oldFile.id } });
      } else {
        shouldDeleteObject = false;
      }
    });

    if (shouldDeleteObject) {
      await this.storageService.deleteFile(
        this.defaultBucket,
        oldFile.storageKey,
      );
    }

    await this.auditLogService.record({
      actorUserId: actorId,
      action: 'STUDENT_AVATAR_DELETED',
      resourceType: 'STUDENT',
      resourceId: student.id,
      oldValues: {
        fileId: oldFile.id,
        originalName: oldFile.originalName,
      },
      newValues: { avatarFileId: null },
    });

    return {
      statusCode: 200,
      message: 'Đã gỡ ảnh đại diện thành công.',
      data: { avatarUrl: null },
    };
  }

  // =========================================================================
  // 2. QUẢN LÝ KỸ NĂNG CHUYÊN MÔN (CRUD /api/v1/students/me/skills)
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

  async createSkill(actorId: string, dto: CreateSkillDto) {
    const student = await this.resolveStudentByActorId(actorId);

    // Kiểm tra trùng lặp không phân biệt chữ hoa/thường (BR-STU-08)
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
      orderBy: { startDate: 'desc' },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách kinh nghiệm làm việc thành công.',
      data: experiences,
    };
  }

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

  async updateExperience(
    actorId: string,
    experienceId: string,
    dto: UpdateExperienceDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);

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

  async updateProject(
    actorId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);

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
  // 5. QUẢN LÝ ĐA PHIÊN BẢN CV (CRUD /api/v1/students/me/cvs)
  // =========================================================================

  async getMyCvs(actorId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const cvs = await this.prisma.studentCv.findMany({
      where: { studentId: student.id },
      include: { file: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return cvs.map((cv) => this.formatCvResponse(cv));
  }

  async uploadStudentCv(
    actorId: string,
    file: Express.Multer.File,
    dto: UploadStudentCvDto,
  ) {
    const student = await this.resolveStudentByActorId(actorId);
    const storageKey = `resumes/${student.id}/${randomUUID()}.pdf`;
    const safeOriginalName = path.basename(file.originalname).slice(0, 255);

    // Bước 1: Tải tệp PDF lên MinIO
    await this.storageService.uploadFile(
      this.defaultBucket,
      storageKey,
      file.buffer,
      file.mimetype,
    );

    try {
      // Bước 2: Lưu metadata và đảm bảo duy nhất 01 CV mặc định (BR-STU-10)
      const createdCv = await this.prisma.$transaction(async (tx) => {
        const existingCount = await tx.studentCv.count({
          where: { studentId: student.id },
        });

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
      // Bước 3: Compensating Cleanup xóa tệp mồ côi trên MinIO nếu DB lỗi
      this.logger.error(
        `Giao dịch CSDL thất bại khi lưu CV, tiến hành cleanup object [${storageKey}]`,
        error,
      );

      const cleanupSucceeded = await this.storageService.deleteFile(
        this.defaultBucket,
        storageKey,
      );
      if (!cleanupSucceeded) {
        this.logger.error(
          `Không thể cleanup object MinIO mồ côi [${this.defaultBucket}] ${storageKey}`,
        );
      }

      throw new InternalServerErrorException(
        'Không thể lưu thông tin CV vào cơ sở dữ liệu. Vui lòng thử lại.',
      );
    }
  }

  async getMyCvDownloadUrl(actorId: string, cvId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const cv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
      include: { file: true },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    const url = await this.storageService.getFileUrl(
      this.defaultBucket,
      cv.file.storageKey,
      900, // Presigned URL có hiệu lực 15 phút
    );

    return {
      cvId: cv.id,
      title: cv.title,
      originalName: cv.file.originalName,
      url,
      expiresInSeconds: 900,
    };
  }

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
      await tx.studentCv.updateMany({
        where: { studentId: student.id, isDefault: true },
        data: { isDefault: false },
      });

      return await tx.studentCv.update({
        where: { id: cvId },
        data: { isDefault: true },
        include: { file: true },
      });
    });

    return this.formatCvResponse(updatedCv);
  }

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

  async deleteMyCv(actorId: string, cvId: string) {
    const student = await this.resolveStudentByActorId(actorId);

    const targetCv = await this.prisma.studentCv.findFirst({
      where: { id: cvId, studentId: student.id },
      include: { file: true },
    });

    if (!targetCv) {
      throw new NotFoundException('Không tìm thấy bản CV yêu cầu');
    }

    let shouldDeleteObject = false;

    await this.prisma.$transaction(async (tx) => {
      await tx.studentCv.delete({
        where: { id: cvId },
      });

      // Nếu xóa CV mặc định, tự động chuyển mặc định sang bản CV mới nhất còn lại
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

      const [remainingCvRefs, remainingAvatarRefs] = await Promise.all([
        tx.studentCv.count({ where: { fileId: targetCv.fileId } }),
        tx.student.count({ where: { avatarFileId: targetCv.fileId } }),
      ]);

      if (remainingCvRefs === 0 && remainingAvatarRefs === 0) {
        await tx.file.delete({
          where: { id: targetCv.fileId },
        });
        shouldDeleteObject = true;
      }
    });

    if (shouldDeleteObject) {
      await this.storageService.deleteFile(
        this.defaultBucket,
        targetCv.file.storageKey,
      );
    }

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
        sizeBytes: Number(targetCv.file.sizeBytes),
      },
      newValues: { deleted: true },
    });

    return {
      deletedId: cvId,
      message: 'Đã xóa bản CV thành công',
    };
  }

  // =========================================================================
  // 6. HỒ SƠ NGHỀ NGHIỆP CÔNG KHAI (PUBLIC CAREER PROFILE — MODULE 03)
  // =========================================================================

  /** Tìm kiếm hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles) */
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

    const items = await Promise.all(
      students.map((student) => this.formatPublicCareerProfile(student)),
    );

    return {
      statusCode: 200,
      message: 'Tìm kiếm hồ sơ nghề nghiệp công khai thành công.',
      data: {
        total: items.length,
        items,
      },
    };
  }

  /** Xem chi tiết hồ sơ nghề nghiệp công khai (GET /api/v1/career-profiles/:studentId) */
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
      data: await this.formatPublicCareerProfile(student),
    };
  }

  // =========================================================================
  // 7. CÁC HÀM HỖ TRỢ NỘI BỘ (PRIVATE HELPERS)
  // =========================================================================

  /**
   * Chốt chặn cốt lõi: Ánh xạ actor.id (users.id từ JWT) -> hồ sơ Student thuộc sở hữu.
   * Đồng thời kiểm tra trạng thái học tập từ bảng gốc student_masters (BR-STU-01, BR-STU-14).
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
        'Không tìm thấy hồ sơ sinh viên liên kết với tài khoản hiện tại.',
      );
    }

    if (student.studentMaster.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Hồ sơ sinh viên đang trong trạng thái đình chỉ học tập, không thể thao tác.',
      );
    }

    return student;
  }

  /** Lấy chuỗi ngày hiện tại theo múi giờ Việt Nam (YYYY-MM-DD) */
  private getTodayVietnamDateString(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  /**
   * Kiểm tra tính hợp lệ của mốc thời gian:
   * 1. Ngày bắt đầu không được ở trong tương lai
   * 2. Ngày kết thúc (nếu có) không được ở trong tương lai
   * 3. Ngày kết thúc không được nhỏ hơn ngày bắt đầu
   */
  private validateDateRange(
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    const todayStr = this.getTodayVietnamDateString();

    if (startDate) {
      const startStr = startDate.toISOString().split('T')[0];
      if (startStr > todayStr) {
        throw new BadRequestException(
          'Ngày bắt đầu không được lớn hơn ngày hiện tại.',
        );
      }
    }

    if (endDate) {
      const endStr = endDate.toISOString().split('T')[0];
      if (endStr > todayStr) {
        throw new BadRequestException(
          'Ngày kết thúc không được lớn hơn ngày hiện tại. Nếu chưa kết thúc, vui lòng để trống.',
        );
      }
    }

    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.',
      );
    }
  }

  /**
   * Sinh Presigned URL tạm thời (1 giờ) cho ảnh đại diện từ bucket MinIO private.
   * Không để lộ storageKey ra ngoài response.
   */
  private async resolveAvatarUrl(
    storageKey?: string | null,
  ): Promise<string | null> {
    if (!storageKey) return null;
    try {
      return await this.storageService.getFileUrl(
        this.defaultBucket,
        storageKey,
        3600,
      );
    } catch (error) {
      this.logger.warn(
        `Không thể tạo Presigned URL cho avatar [${storageKey}]:`,
        error,
      );
      return null;
    }
  }

  /** Cấu hình include dữ liệu công khai cho Module 03 (loại bỏ dữ liệu nhạy cảm — BR-STU-13) */
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
      avatarFile: {
        select: { storageKey: true },
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

  /** Chuẩn hóa DTO trả về cho hồ sơ nghề nghiệp công khai */
  private async formatPublicCareerProfile(student: any) {
    const avatarUrl = await this.resolveAvatarUrl(
      student.avatarFile?.storageKey,
    );
    return {
      studentId: student.id,
      fullName: student.displayName ?? student.studentMaster.fullName,
      avatarUrl,
      major: student.studentMaster.major,
      faculty: student.studentMaster.faculty,
      academicYear: student.studentMaster.academicYear,
      bio: student.bio,
      skills: student.skills,
      experiences: student.experiences,
      projects: student.projects,
    };
  }

  /** Chuẩn hóa DTO trả về cho CV (chuyển đổi BigInt -> Number) */
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
}