import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma";
import { createWorkoutSessionSchema } from "../modules/workout-sessions/schemas";

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

    const createdSession = await prisma.$transaction(async (tx) => {
      const session = await tx.workoutSession.create({
        data: {
          templateId: payload.templateId,
          rpe: payload.rpe,
          performedAt: payload.performedAt ?? new Date().toISOString(),
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

      for (const exercise of payload.exercises) {
        const templateExercise = exercise.templateExerciseId
          ? templateExerciseById.get(exercise.templateExerciseId)
          : undefined;

        const createdExercise = await tx.workoutSessionExercise.create({
          data: {
            sessionId: session.id,
            exerciseTypeId: exercise.exerciseTypeId,
            templateExerciseId: exercise.templateExerciseId,
            orderIndex: exercise.orderIndex,
            templateCommentSnapshot: templateExercise?.comment,
          },
        });

        for (const [setIndex, set] of exercise.sets.entries()) {
          await tx.workoutSessionSet.create({
            data: {
              sessionExerciseId: createdExercise.id,
              orderIndex: setIndex,
              reps: set.reps,
              partialReps: set.partialReps,
              weight: set.weight,
              isCompleted: set.isCompleted,
            },
          });
        }
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
    });

    return reply.status(201).send(createdSession);
  });
};
