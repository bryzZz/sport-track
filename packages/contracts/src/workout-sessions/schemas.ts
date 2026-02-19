import { z } from "zod";

import { weightUnitSchema } from "../common/weight-unit.js";

const workoutSessionSetSchema = z.object({
  reps: z.number().int().min(0),
  partialReps: z.number().int().min(0).optional(),
  weight: z.number().min(0),
  isCompleted: z.boolean(),
});

const workoutSessionExerciseSchema = z.object({
  templateExerciseId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  weightUnit: weightUnitSchema,
  comment: z.string().trim().optional(),
  sets: z.array(workoutSessionSetSchema).min(1),
});

const workoutSessionTemplateUpdateSetSchema = z.object({
  orderIndex: z.number().int().min(0),
  reps: z.number().int().min(0),
  partialReps: z.number().int().min(0).optional(),
  weight: z.number().min(0),
});

const workoutSessionTemplateUpdateExerciseSchema = z.object({
  id: z.string().uuid(),
  weightUnit: weightUnitSchema,
  comment: z.string().trim().optional(),
  sets: z.array(workoutSessionTemplateUpdateSetSchema).min(1),
});

export const createWorkoutSessionSchema = z.object({
  templateId: z.string().uuid(),
  performedAt: z.string().datetime(),
  rpe: z.number().int().min(1).max(10),
  exercises: z.array(workoutSessionExerciseSchema).min(1),
  templateUpdates: z.object({
    exercises: z.array(workoutSessionTemplateUpdateExerciseSchema),
  }),
});

export type WorkoutSessionTemplateUpdateExercisePayload = z.infer<
  typeof workoutSessionTemplateUpdateExerciseSchema
>;
export type CreateWorkoutSessionPayload = z.infer<typeof createWorkoutSessionSchema>;
