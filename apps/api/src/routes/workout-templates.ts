import type { FastifyPluginAsync } from "fastify";
import type { Prisma } from "@prisma/client";
import { createWorkoutTemplateSchema } from "@sport-track/contracts";

import { prisma } from "../lib/prisma.js";

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

      const setsByExerciseOrder = new Map<number, typeof payload.exercises[number]["sets"]>();

      for (const exercise of payload.exercises) {
        setsByExerciseOrder.set(exercise.orderIndex, exercise.sets);
      }

      const setsToCreate: Prisma.WorkoutTemplateSetCreateManyInput[] = [];

      for (const createdExercise of createdExercises) {
        const exerciseSets = setsByExerciseOrder.get(createdExercise.orderIndex);

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
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    });

    return reply.status(201).send(template);
  });

  app.put("/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const parsedBody = createWorkoutTemplateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    const existingTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTemplate) {
      return reply.status(404).send({
        message: "Workout template not found",
      });
    }

    const payload = parsedBody.data;

    const updatedTemplate = await prisma.$transaction(async (tx) => {
      await tx.workoutTemplate.update({
        where: {
          id: params.id,
        },
        data: {
          name: payload.name,
        },
      });

      await tx.workoutTemplateExercise.deleteMany({
        where: {
          templateId: params.id,
        },
      });

      const exercisesToCreate: Prisma.WorkoutTemplateExerciseCreateManyInput[] =
        payload.exercises.map((exercise) => ({
          templateId: params.id,
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

      const setsByExerciseOrder = new Map<number, typeof payload.exercises[number]["sets"]>();

      for (const exercise of payload.exercises) {
        setsByExerciseOrder.set(exercise.orderIndex, exercise.sets);
      }

      const setsToCreate: Prisma.WorkoutTemplateSetCreateManyInput[] = [];

      for (const createdExercise of createdExercises) {
        const exerciseSets = setsByExerciseOrder.get(createdExercise.orderIndex);

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
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    });

    return updatedTemplate;
  });
};
