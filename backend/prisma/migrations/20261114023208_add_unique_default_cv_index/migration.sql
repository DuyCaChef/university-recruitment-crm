CREATE UNIQUE INDEX IF NOT EXISTS uq_student_cvs_single_default
ON student_cvs (student_id)
WHERE is_default = TRUE;
