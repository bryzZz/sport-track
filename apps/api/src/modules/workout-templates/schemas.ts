import { z } from "zod";

export const workoutTemplateSetSchema = z.object({
  reps: z.number().int().min(0),
  partialReps: z.number().int().min(0).optional(),
  weight: z.number().min(0),
});

export const workoutTemplateExerciseSchema = z.object({
  exerciseTypeId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  comment: z.string().trim().optional(),
  sets: z.array(workoutTemplateSetSchema).min(1),
});

export const createWorkoutTemplateSchema = z.object({
  name: z.string().trim().min(1),
  exercises: z.array(workoutTemplateExerciseSchema).min(1),
});

export const updateWorkoutTemplateExerciseCommentSchema = z.object({
  comment: z.string().trim().nullable(),
});
