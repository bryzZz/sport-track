-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LBS');

-- AlterTable
ALTER TABLE "workout_session_exercises" ADD COLUMN     "weight_unit_snapshot" "WeightUnit" NOT NULL DEFAULT 'KG';

-- AlterTable
ALTER TABLE "workout_template_exercises" ADD COLUMN     "weight_unit" "WeightUnit" NOT NULL DEFAULT 'KG';
