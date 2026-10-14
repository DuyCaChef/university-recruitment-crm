-- CreateTable
CREATE TABLE "health_check_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" VARCHAR(20) NOT NULL DEFAULT 'UP',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_check_logs_pkey" PRIMARY KEY ("id")
);
