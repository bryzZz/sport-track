export class WorkoutTemplateNotFoundError extends Error {
  constructor() {
    super("Workout template not found");
    this.name = "WorkoutTemplateNotFoundError";
  }
}

export class TemplateExercisesInUseError extends Error {
  readonly orderIndexes: number[];

  constructor(orderIndexes: number[]) {
    super("Cannot delete template exercises that are used in workout sessions");
    this.name = "TemplateExercisesInUseError";
    this.orderIndexes = orderIndexes;
  }
}
