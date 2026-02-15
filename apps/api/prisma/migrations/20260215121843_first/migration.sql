-- CreateTable
CREATE TABLE "exercise_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "exercise_type_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_template_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_exercise_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "partial_reps" INTEGER,
    "weight" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workout_template_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ(6) NOT NULL,
    "rpe" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_session_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "exercise_type_id" UUID NOT NULL,
    "template_exercise_id" UUID,
    "order_index" INTEGER NOT NULL,
    "template_comment_snapshot" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_session_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_exercise_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "partial_reps" INTEGER,
    "weight" DECIMAL(8,2) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_session_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercise_types_name_key" ON "exercise_types"("name");

-- CreateIndex
CREATE INDEX "workout_templates_created_at_idx" ON "workout_templates"("created_at");

-- CreateIndex
CREATE INDEX "workout_template_exercises_template_id_idx" ON "workout_template_exercises"("template_id");

-- CreateIndex
CREATE INDEX "workout_template_exercises_exercise_type_id_idx" ON "workout_template_exercises"("exercise_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_template_exercises_template_id_order_index_key" ON "workout_template_exercises"("template_id", "order_index");

-- CreateIndex
CREATE INDEX "workout_template_sets_template_exercise_id_idx" ON "workout_template_sets"("template_exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_template_sets_template_exercise_id_order_index_key" ON "workout_template_sets"("template_exercise_id", "order_index");

-- CreateIndex
CREATE INDEX "workout_sessions_template_id_performed_at_idx" ON "workout_sessions"("template_id", "performed_at");

-- CreateIndex
CREATE INDEX "workout_sessions_performed_at_idx" ON "workout_sessions"("performed_at");

-- CreateIndex
CREATE INDEX "workout_session_exercises_session_id_idx" ON "workout_session_exercises"("session_id");

-- CreateIndex
CREATE INDEX "workout_session_exercises_exercise_type_id_idx" ON "workout_session_exercises"("exercise_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_session_exercises_session_id_order_index_key" ON "workout_session_exercises"("session_id", "order_index");

-- CreateIndex
CREATE INDEX "workout_session_sets_session_exercise_id_idx" ON "workout_session_sets"("session_exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_session_sets_session_exercise_id_order_index_key" ON "workout_session_sets"("session_exercise_id", "order_index");

-- AddForeignKey
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "workout_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_exercise_type_id_fkey" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_sets" ADD CONSTRAINT "workout_template_sets_template_exercise_id_fkey" FOREIGN KEY ("template_exercise_id") REFERENCES "workout_template_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "workout_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_exercise_type_id_fkey" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_template_exercise_id_fkey" FOREIGN KEY ("template_exercise_id") REFERENCES "workout_template_exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_sets" ADD CONSTRAINT "workout_session_sets_session_exercise_id_fkey" FOREIGN KEY ("session_exercise_id") REFERENCES "workout_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
