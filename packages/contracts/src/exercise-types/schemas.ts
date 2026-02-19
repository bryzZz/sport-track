import { z } from "zod";

const exerciseTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export type ExerciseType = z.infer<typeof exerciseTypeSchema>;
