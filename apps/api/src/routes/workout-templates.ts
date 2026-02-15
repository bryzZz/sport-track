import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma";
import { createWorkoutTemplateSchema } from "../modules/workout-templates/schemas";

export const workoutTemplatesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return prisma.workoutTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
      },
    });
  });

  app.get("/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const template = await prisma.workoutTemplate.findUnique({
      where: {
        id: params.id,
      },
      include: {
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
      },
    });

    if (!template) {
      return reply.status(404).send({
        message: "Workout template not found",
      });
    }

    return template;
  });

  app.post("/", async (request, reply) => {
    const parsedBody = createWorkoutTemplateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    const payload = parsedBody.data;

    const template = await prisma.$transaction(async (tx) => {
      const createdTemplate = await tx.workoutTemplate.create({
        data: {
          name: payload.name,
        },
      });

      for (const exercise of payload.exercises) {
        const createdExercise = await tx.workoutTemplateExercise.create({
          data: {
            templateId: createdTemplate.id,
            exerciseTypeId: exercise.exerciseTypeId,
            orderIndex: exercise.orderIndex,
            comment: exercise.comment,
          },
        });

        for (const [setIndex, set] of exercise.sets.entries()) {
          await tx.workoutTemplateSet.create({
            data: {
              templateExerciseId: createdExercise.id,
              orderIndex: setIndex,
              reps: set.reps,
              partialReps: set.partialReps,
              weight: set.weight,
            },
          });
        }
      }

      return tx.workoutTemplate.findUniqueOrThrow({
        where: {
          id: createdTemplate.id,
        },
        include: {
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
        },
      });
    });

    return reply.status(201).send(template);
  });

};
