/*
  Warnings:

  - Made the column `template_exercise_id` on table `workout_session_exercises` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "workout_session_exercises" DROP CONSTRAINT "workout_session_exercises_template_exercise_id_fkey";

-- AlterTable
ALTER TABLE "workout_session_exercises" ALTER COLUMN "template_exercise_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_template_exercise_id_fkey" FOREIGN KEY ("template_exercise_id") REFERENCES "workout_template_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
