import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

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

  // Cập  nh hồ sơ cá nhân (PATCH /api/v1/students/me)
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
}
