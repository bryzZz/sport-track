export class InvalidTemplateExerciseIdError extends Error {
  constructor(templateExerciseId: string) {
    super(
      `Template exercise ${templateExerciseId} does not belong to template`,
    );
    this.name = "InvalidTemplateExerciseIdError";
  }
}
