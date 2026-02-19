import { z } from "zod";

import { weightUnitSchema } from "../common/weight-unit.js";

const workoutTemplateSetSchema = z.object({
  reps: z.number().int().min(0),
  partialReps: z.number().int().min(0).optional(),
  weight: z.number().min(0),
});

const workoutTemplateExerciseSchema = z.object({
  exerciseTypeId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  comment: z.string().trim().optional(),
  weightUnit: weightUnitSchema,
  sets: z.array(workoutTemplateSetSchema).min(1),
});

export const createWorkoutTemplateSchema = z.object({
  name: z.string().trim().min(1),
  exercises: z.array(workoutTemplateExerciseSchema).min(1),
});

const workoutTemplateExerciseTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

const workoutTemplatePersistedSetSchema = z.object({
  id: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  reps: z.number().int().min(0),
  partialReps: z.number().int().nullable(),
  weight: z.string(),
});

const workoutTemplatePersistedExerciseSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  exerciseTypeId: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  comment: z.string().nullable(),
  weightUnit: weightUnitSchema,
  exerciseType: workoutTemplateExerciseTypeSchema,
  sets: z.array(workoutTemplatePersistedSetSchema),
});

const workoutTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  exercises: z.array(workoutTemplatePersistedExerciseSchema),
});

export type UpsertWorkoutTemplatePayload = z.infer<typeof createWorkoutTemplateSchema>;
export type WorkoutTemplate = z.infer<typeof workoutTemplateSchema>;
