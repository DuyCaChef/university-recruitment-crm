DROP INDEX IF EXISTS "uq_student_skills_name";

CREATE UNIQUE INDEX "uq_student_skills_name"
ON "student_skills" ("student_id", LOWER("skill_name"));
