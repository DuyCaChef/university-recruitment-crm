CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "resource_type" VARCHAR(100) NOT NULL,
    "resource_id" VARCHAR(100),
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "activity_logs_resource_type_resource_id_created_at_idx"
ON "activity_logs"("resource_type", "resource_id", "created_at" DESC);

CREATE INDEX "activity_logs_actor_user_id_created_at_idx"
ON "activity_logs"("actor_user_id", "created_at" DESC);

CREATE INDEX "activity_logs_created_at_idx"
ON "activity_logs"("created_at" DESC);

ALTER TABLE "activity_logs"
ADD CONSTRAINT "activity_logs_actor_user_id_fkey"
FOREIGN KEY ("actor_user_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
