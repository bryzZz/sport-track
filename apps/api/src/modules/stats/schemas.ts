import { z } from "zod";

const isValidDateString = (value: string) => {
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

const optionalDateStringSchema = z
  .string()
  .refine((value) => isValidDateString(value), "Invalid date value")
  .optional();

export const workoutOverviewQuerySchema = z.object({
  templateId: z.string().uuid(),
  from: optionalDateStringSchema,
  to: optionalDateStringSchema,
});

const workoutOverviewExercisePhaseSchema = z.object({
  reps: z.number().int().min(0),
  weight: z.number().min(0),
  type: z.enum(["strict", "cheating"]),
});

const workoutOverviewExerciseSetSchema = z.object({
  phases: z.array(workoutOverviewExercisePhaseSchema),
});

const workoutOverviewExerciseRecordSchema = z.object({
  date: z.string().date(),
  done: z.boolean(),
  sets: z.array(workoutOverviewExerciseSetSchema),
});

const workoutOverviewExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bestSet: z.object({
    reps: z.number().int().min(0),
    weight: z.number().min(0),
  }),
  records: z.array(workoutOverviewExerciseRecordSchema),
});

export const workoutOverviewResponseSchema = z.object({
  template: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  summary: z.object({
    sessionsCount: z.number().int().min(0),
    lastSessionDate: z.string().date().nullable(),
    totalVolume: z.object({
      value: z.number().min(0),
      unit: z.literal("kg"),
      trend: z.object({
        period: z.literal("4w"),
        deltaPercent: z.number().int().nullable(),
      }),
    }),
    averageIntensity: z.object({
      rpe: z.number().min(1).max(10).nullable(),
    }),
  }),
  exercises: z.array(workoutOverviewExerciseSchema),
});
