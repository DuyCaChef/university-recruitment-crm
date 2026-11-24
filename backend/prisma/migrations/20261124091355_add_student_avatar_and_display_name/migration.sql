/*
  Warnings:

  - A unique constraint covering the columns `[avatar_file_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "avatar_file_id" UUID,
ADD COLUMN     "display_name" VARCHAR(150);

-- CreateIndex
CREATE UNIQUE INDEX "uq_students_avatar_file" ON "students"("avatar_file_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_avatar_file_id_fkey" FOREIGN KEY ("avatar_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
