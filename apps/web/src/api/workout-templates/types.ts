import type { WorkoutTemplate } from "@sport-track/contracts";

export type {
  UpsertWorkoutTemplatePayload,
  WeightUnit,
  WorkoutTemplate,
} from "@sport-track/contracts";

export type WorkoutTemplateListItem = Pick<WorkoutTemplate, "id" | "name">;
