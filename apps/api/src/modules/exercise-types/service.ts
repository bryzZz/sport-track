import { prisma } from "../../lib/prisma.js";

export class ExerciseTypesService {
  getExerciseTypes = async () => {
    return prisma.exerciseType.findMany({
      orderBy: {
        name: "asc",
      },
    });
  };
}

export const exerciseTypesService = new ExerciseTypesService();
