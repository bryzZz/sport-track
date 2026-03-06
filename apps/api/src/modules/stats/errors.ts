export class WorkoutTemplateNotFoundError extends Error {
  constructor() {
    super("Workout template not found");
    this.name = "WorkoutTemplateNotFoundError";
  }
}

export class InvalidWorkoutOverviewResponsePayloadError extends Error {
  readonly issues: unknown[];

  constructor(issues: unknown[]) {
    super("Invalid workout overview response payload");
    this.name = "InvalidWorkoutOverviewResponsePayloadError";
    this.issues = issues;
  }
}
