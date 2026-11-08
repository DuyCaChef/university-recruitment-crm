-- CreateEnum
CREATE TYPE "student_status" AS ENUM ('ACTIVE', 'GRADUATED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "student_masters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_code" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "institutional_email" VARCHAR(255) NOT NULL,
    "major" VARCHAR(150) NOT NULL,
    "faculty" VARCHAR(150),
    "academic_year" INTEGER,
    "citizen_id" VARCHAR(20),
    "date_of_birth" DATE,
    "status" "student_status" NOT NULL DEFAULT 'ACTIVE',
    "user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_master_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "phone" VARCHAR(30),
    "bio" TEXT,
    "address" TEXT,
    "date_of_birth" DATE,
    "gender" VARCHAR(30),
    "gpa" DECIMAL(3,2),
    "career_profile_visibility" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "skill_name" VARCHAR(100) NOT NULL,
    "proficiency" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "position" VARCHAR(150) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "role" VARCHAR(100),
    "technologies" TEXT,
    "project_url" VARCHAR(500),
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_cvs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_user_id" UUID,
    "original_name" VARCHAR(255) NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_masters_code" ON "student_masters"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_masters_inst_email" ON "student_masters"("institutional_email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_masters_citizen_id" ON "student_masters"("citizen_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_masters_user" ON "student_masters"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_students_master" ON "students"("student_master_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_students_user" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_skills_name" ON "student_skills"("student_id", "skill_name");

-- CreateIndex
CREATE INDEX "student_experiences_student_id_start_date_idx" ON "student_experiences"("student_id", "start_date" DESC);

-- CreateIndex
CREATE INDEX "student_projects_student_id_idx" ON "student_projects"("student_id");

-- CreateIndex
CREATE INDEX "student_cvs_student_id_idx" ON "student_cvs"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_files_storage_key" ON "files"("storage_key");

-- AddForeignKey
ALTER TABLE "student_masters" ADD CONSTRAINT "student_masters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_student_master_id_fkey" FOREIGN KEY ("student_master_id") REFERENCES "student_masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_experiences" ADD CONSTRAINT "student_experiences_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_cvs" ADD CONSTRAINT "student_cvs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_cvs" ADD CONSTRAINT "student_cvs_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
