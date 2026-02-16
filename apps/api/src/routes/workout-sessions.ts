import type { FastifyPluginAsync } from "fastify";
import type { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createWorkoutSessionSchema } from "../modules/workout-sessions/schemas";

class InvalidTemplateExerciseIdError extends Error {
  constructor(templateExerciseId: string) {
    super(`Template exercise ${templateExerciseId} does not belong to template`);
    this.name = "InvalidTemplateExerciseIdError";
  }
}

export const workoutSessionsRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (request, reply) => {
    const parsedBody = createWorkoutSessionSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    const payload = parsedBody.data;

    try {
      const createdSession = await prisma.$transaction(async (tx) => {
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
            comment: true,
          },
        });

        const templateExerciseById = new Map(
          templateExercises.map((exercise) => [exercise.id, exercise]),
        );

        // 1) Валидируем, что все templateExerciseId принадлежат текущему templateId.
        for (const exercise of payload.exercises) {
          const templateExercise = templateExerciseById.get(exercise.templateExerciseId);

          if (!templateExercise) {
            throw new InvalidTemplateExerciseIdError(exercise.templateExerciseId);
          }
        }

        // 2) Обновляем комментарии template exercises, если значение реально изменилось.
        const templateCommentUpdates: Prisma.PrismaPromise<unknown>[] = [];

        for (const exercise of payload.exercises) {
          const templateExercise = templateExerciseById.get(exercise.templateExerciseId)!;

          const templateComment = templateExercise.comment ?? undefined;

          if (templateComment === exercise.comment) {
            continue;
          }

          templateCommentUpdates.push(
            tx.workoutTemplateExercise.update({
              where: {
                id: templateExercise.id,
              },
              data: {
                comment: exercise.comment,
              },
            }),
          );
        }

        if (templateCommentUpdates.length > 0) {
          await Promise.all(templateCommentUpdates);
        }

        // 3) Готовим batch-вставку упражнений в сессию.
        const sessionExercisesToCreate: Prisma.WorkoutSessionExerciseCreateManyInput[] = [];

        for (const exercise of payload.exercises) {
          sessionExercisesToCreate.push({
            sessionId: session.id,
            exerciseTypeId: exercise.exerciseTypeId,
            templateExerciseId: exercise.templateExerciseId,
            orderIndex: exercise.orderIndex,
            templateCommentSnapshot: exercise.comment,
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

        // 4) Готовим lookup сетов по orderIndex упражнения.
        const setsByExerciseOrder = new Map<number, typeof payload.exercises[number]["sets"]>();

        for (const exercise of payload.exercises) {
          setsByExerciseOrder.set(exercise.orderIndex, exercise.sets);
        }

        // 5) Готовим batch-вставку сетов для уже созданных session exercises.
        const sessionSetsToCreate: Prisma.WorkoutSessionSetCreateManyInput[] = [];

        for (const createdExercise of createdExercises) {
          const exerciseSets = setsByExerciseOrder.get(createdExercise.orderIndex);

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
          include: {
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
          },
        });
      }, {
        maxWait: 10_000,
        timeout: 20_000,
      });

      return reply.status(201).send(createdSession);
    } catch (error) {
      if (error instanceof InvalidTemplateExerciseIdError) {
        return reply.status(400).send({
          message: "Invalid payload",
          issues: [{
            path: ["exercises", "templateExerciseId"],
            message: error.message,
          }],
        });
      }

      throw error;
    }
  });
};
