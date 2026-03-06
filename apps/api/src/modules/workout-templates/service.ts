import type { Prisma } from "@prisma/client";
import type { UpsertWorkoutTemplatePayload } from "@sport-track/contracts";

import { prisma } from "../../lib/prisma.js";

import {
  TemplateExercisesInUseError,
  WorkoutTemplateNotFoundError,
} from "./errors.js";

const workoutTemplateInclude = {
  exercises: {
    orderBy: {
      orderIndex: "asc",
    },
    include: {
      exerciseType: true,
      sets: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  },
} as const;

export class WorkoutTemplatesService {
  getWorkoutTemplates = async () => {
    return prisma.workoutTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
      },
    });
  };

  getWorkoutTemplateById = async (id: string) => {
    const template = await prisma.workoutTemplate.findUnique({
      where: {
        id,
      },
      include: workoutTemplateInclude,
    });

    if (!template) {
      throw new WorkoutTemplateNotFoundError();
    }

    return template;
  };

  createWorkoutTemplate = async (payload: UpsertWorkoutTemplatePayload) => {
    return prisma.$transaction(
      async (tx) => {
        const createdTemplate = await tx.workoutTemplate.create({
          data: {
            name: payload.name,
          },
        });

        const exercisesToCreate: Prisma.WorkoutTemplateExerciseCreateManyInput[] =
          payload.exercises.map((exercise) => ({
            templateId: createdTemplate.id,
            exerciseTypeId: exercise.exerciseTypeId,
            orderIndex: exercise.orderIndex,
            comment: exercise.comment,
            weightUnit: exercise.weightUnit,
          }));

        const createdExercises =
          exercisesToCreate.length === 0
            ? []
            : await tx.workoutTemplateExercise.createManyAndReturn({
                data: exercisesToCreate,
                select: {
                  id: true,
                  orderIndex: true,
                },
              });

        const setsByExerciseOrder = new Map<
          number,
          UpsertWorkoutTemplatePayload["exercises"][number]["sets"]
        >();

        for (const exercise of payload.exercises) {
          setsByExerciseOrder.set(exercise.orderIndex, exercise.sets);
        }

        const setsToCreate: Prisma.WorkoutTemplateSetCreateManyInput[] = [];

        for (const createdExercise of createdExercises) {
          const exerciseSets = setsByExerciseOrder.get(
            createdExercise.orderIndex,
          );

          if (!exerciseSets) {
            continue;
          }

          setsToCreate.push(
            ...exerciseSets.map((set, setIndex) => ({
              templateExerciseId: createdExercise.id,
              orderIndex: setIndex,
              reps: set.reps,
              partialReps: set.partialReps,
              weight: set.weight,
            })),
          );
        }

        if (setsToCreate.length > 0) {
          await tx.workoutTemplateSet.createMany({
            data: setsToCreate,
          });
        }

        return tx.workoutTemplate.findUniqueOrThrow({
          where: {
            id: createdTemplate.id,
          },
          include: workoutTemplateInclude,
        });
      },
      {
        maxWait: 10_000,
        timeout: 20_000,
      },
    );
  };

  updateWorkoutTemplate = async (
    id: string,
    payload: UpsertWorkoutTemplatePayload,
  ) => {
    const existingTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTemplate) {
      throw new WorkoutTemplateNotFoundError();
    }

    return prisma.$transaction(
      async (tx) => {
        await tx.workoutTemplate.update({
          where: {
            id,
          },
          data: {
            name: payload.name,
          },
        });

        const existingExercises = await tx.workoutTemplateExercise.findMany({
          where: {
            templateId: id,
          },
          select: {
            id: true,
            orderIndex: true,
          },
        });

        const existingExerciseByOrderIndex = new Map(
          existingExercises.map((exercise) => [exercise.orderIndex, exercise]),
        );

        const incomingOrderIndexes = new Set(
          payload.exercises.map((exercise) => exercise.orderIndex),
        );

        const exercisesToDelete = existingExercises.filter(
          (exercise) => !incomingOrderIndexes.has(exercise.orderIndex),
        );

        if (exercisesToDelete.length > 0) {
          const exerciseIdsToDelete = exercisesToDelete.map(
            (exercise) => exercise.id,
          );

          const usedExercises = await tx.workoutSessionExercise.findMany({
            where: {
              templateExerciseId: {
                in: exerciseIdsToDelete,
              },
            },
            select: {
              templateExerciseId: true,
            },
            distinct: ["templateExerciseId"],
          });

          if (usedExercises.length > 0) {
            const orderIndexByExerciseId = new Map(
              exercisesToDelete.map((exercise) => [
                exercise.id,
                exercise.orderIndex,
              ]),
            );
            const usedOrderIndexes = usedExercises
              .map((exercise) =>
                orderIndexByExerciseId.get(exercise.templateExerciseId),
              )
              .filter(
                (orderIndex): orderIndex is number => orderIndex !== undefined,
              )
              .sort((a, b) => a - b);

            throw new TemplateExercisesInUseError(usedOrderIndexes);
          }

          await tx.workoutTemplateExercise.deleteMany({
            where: {
              id: {
                in: exerciseIdsToDelete,
              },
            },
          });
        }

        for (const exercise of payload.exercises) {
          const existingExercise = existingExerciseByOrderIndex.get(
            exercise.orderIndex,
          );

          const savedExercise = existingExercise
            ? await tx.workoutTemplateExercise.update({
                where: {
                  id: existingExercise.id,
                },
                data: {
                  exerciseTypeId: exercise.exerciseTypeId,
                  comment: exercise.comment,
                  weightUnit: exercise.weightUnit,
                },
                select: {
                  id: true,
                },
              })
            : await tx.workoutTemplateExercise.create({
                data: {
                  templateId: id,
                  exerciseTypeId: exercise.exerciseTypeId,
                  orderIndex: exercise.orderIndex,
                  comment: exercise.comment,
                  weightUnit: exercise.weightUnit,
                },
                select: {
                  id: true,
                },
              });

          await tx.workoutTemplateSet.deleteMany({
            where: {
              templateExerciseId: savedExercise.id,
            },
          });

          const setsToCreate: Prisma.WorkoutTemplateSetCreateManyInput[] =
            exercise.sets.map((set, setIndex) => ({
              templateExerciseId: savedExercise.id,
              orderIndex: setIndex,
              reps: set.reps,
              partialReps: set.partialReps,
              weight: set.weight,
            }));

          if (setsToCreate.length === 0) {
            continue;
          }

          await tx.workoutTemplateSet.createMany({
            data: setsToCreate,
          });
        }

        return tx.workoutTemplate.findUniqueOrThrow({
          where: {
            id,
          },
          include: workoutTemplateInclude,
        });
      },
      {
        maxWait: 10_000,
        timeout: 20_000,
      },
    );
  };
}

export const workoutTemplatesService = new WorkoutTemplatesService();
