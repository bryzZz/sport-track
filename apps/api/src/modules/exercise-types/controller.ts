import { ExerciseTypesService, exerciseTypesService } from "./service.js";

export class ExerciseTypesController {
  constructor(private readonly service: ExerciseTypesService) {}

  getExerciseTypes = async () => {
    return this.service.getExerciseTypes();
  };
}

export const exerciseTypesController = new ExerciseTypesController(
  exerciseTypesService,
);
