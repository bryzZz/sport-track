import type { Prisma } from "@prisma/client";
import type { CreateWorkoutSessionPayload } from "@sport-track/contracts";

import { prisma } from "../../lib/prisma.js";

import { InvalidTemplateExerciseIdError } from "./errors.js";

const workoutSessionInclude = {
  exercises: {
    orderBy: {
      orderIndex: "asc",
    },
    include: {
      sets: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  },
} as const;

export class WorkoutSessionsService {
  createWorkoutSession = async (payload: CreateWorkoutSessionPayload) => {
    return prisma.$transaction(
      async (tx) => {
        const session = await tx.workoutSession.create({
          data: {
            templateId: payload.templateId,
            rpe: payload.rpe,
            performedAt: payload.performedAt,
          },
        });

        const templateExercises = await tx.workoutTemplateExercise.findMany({
          where: {
            templateId: payload.templateId,
          },
          select: {
            id: true,
            exerciseTypeId: true,
          },
        });

        const templateExerciseById = new Map(
          templateExercises.map((exercise) => [exercise.id, exercise]),
        );

        for (const exercise of payload.exercises) {
          const templateExercise = templateExerciseById.get(
            exercise.templateExerciseId,
          );

          if (!templateExercise) {
            throw new InvalidTemplateExerciseIdError(
              exercise.templateExerciseId,
            );
          }
        }

        for (const templateUpdateExercise of payload.templateUpdates
          .exercises) {
          const templateExercise = templateExerciseById.get(
            templateUpdateExercise.id,
          );

          if (!templateExercise) {
            throw new InvalidTemplateExerciseIdError(templateUpdateExercise.id);
          }
        }

        const templateExerciseUpdates: Prisma.PrismaPromise<unknown>[] = [];

        for (const templateUpdateExercise of payload.templateUpdates
          .exercises) {
          templateExerciseUpdates.push(
            tx.workoutTemplateExercise.update({
              where: {
                id: templateUpdateExercise.id,
              },
              data: {
                comment: templateUpdateExercise.comment ?? null,
                weightUnit: templateUpdateExercise.weightUnit,
              },
            }),
          );
        }

        if (templateExerciseUpdates.length > 0) {
          await Promise.all(templateExerciseUpdates);
        }

        for (const templateUpdateExercise of payload.templateUpdates
          .exercises) {
          await tx.workoutTemplateSet.deleteMany({
            where: {
              templateExerciseId: templateUpdateExercise.id,
            },
          });

          await tx.workoutTemplateSet.createMany({
            data: templateUpdateExercise.sets.map((templateUpdateSet) => ({
              templateExerciseId: templateUpdateExercise.id,
              orderIndex: templateUpdateSet.orderIndex,
              reps: templateUpdateSet.reps,
              partialReps: templateUpdateSet.partialReps,
              weight: templateUpdateSet.weight,
            })),
          });
        }

        const sessionExercisesToCreate: Prisma.WorkoutSessionExerciseCreateManyInput[] =
          [];

        for (const exercise of payload.exercises) {
          const templateExercise = templateExerciseById.get(
            exercise.templateExerciseId,
          );

          if (!templateExercise) {
            throw new InvalidTemplateExerciseIdError(
              exercise.templateExerciseId,
            );
          }

          sessionExercisesToCreate.push({
            sessionId: session.id,
            exerciseTypeId: templateExercise.exerciseTypeId,
            templateExerciseId: exercise.templateExerciseId,
            orderIndex: exercise.orderIndex,
            templateCommentSnapshot: exercise.comment,
            weightUnitSnapshot: exercise.weightUnit,
          });
        }

        const createdExercises =
          sessionExercisesToCreate.length === 0
            ? []
            : await tx.workoutSessionExercise.createManyAndReturn({
                data: sessionExercisesToCreate,
                select: {
                  id: true,
                  orderIndex: true,
                },
              });

        const setsByExerciseOrder = new Map<
          number,
          CreateWorkoutSessionPayload["exercises"][number]["sets"]
        >();

        for (const exercise of payload.exercises) {
          setsByExerciseOrder.set(exercise.orderIndex, exercise.sets);
        }

        const sessionSetsToCreate: Prisma.WorkoutSessionSetCreateManyInput[] =
          [];

        for (const createdExercise of createdExercises) {
          const exerciseSets = setsByExerciseOrder.get(
            createdExercise.orderIndex,
          );

          if (!exerciseSets) {
            continue;
          }

          sessionSetsToCreate.push(
            ...exerciseSets.map((set, setIndex) => ({
              sessionExerciseId: createdExercise.id,
              orderIndex: setIndex,
              reps: set.reps,
              partialReps: set.partialReps,
              weight: set.weight,
              isCompleted: set.isCompleted,
            })),
          );
        }

        if (sessionSetsToCreate.length > 0) {
          await tx.workoutSessionSet.createMany({
            data: sessionSetsToCreate,
          });
        }

        return tx.workoutSession.findUniqueOrThrow({
          where: {
            id: session.id,
          },
          include: workoutSessionInclude,
        });
      },
      {
        maxWait: 10_000,
        timeout: 20_000,
      },
    );
  };
}

export const workoutSessionsService = new WorkoutSessionsService();
