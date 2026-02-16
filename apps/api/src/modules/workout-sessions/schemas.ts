import { z } from "zod";

export const workoutSessionSetSchema = z.object({
  reps: z.number().int().min(0),
  partialReps: z.number().int().min(0).optional(),
  weight: z.number().min(0),
  isCompleted: z.boolean(),
});

export const workoutSessionExerciseSchema = z.object({
  exerciseTypeId: z.string().uuid(),
  templateExerciseId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  comment: z.string().trim().optional(),
  sets: z.array(workoutSessionSetSchema).min(1),
});

export const createWorkoutSessionSchema = z.object({
  templateId: z.string().uuid(),
  performedAt: z.string().datetime(),
  rpe: z.number().int().min(1).max(10),
  exercises: z.array(workoutSessionExerciseSchema).min(1),
});
