import type { Prisma } from "@prisma/client";
import { createWorkoutTemplateSchema } from "@sport-track/contracts";
import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma.js";

class TemplateExercisesInUseError extends Error {
  readonly orderIndexes: number[];

  constructor(orderIndexes: number[]) {
    super("Cannot delete template exercises that are used in workout sessions");
    this.name = "TemplateExercisesInUseError";
    this.orderIndexes = orderIndexes;
  }
}

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

    const template = await prisma.$transaction(
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
          (typeof payload.exercises)[number]["sets"]
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
      },
      {
        maxWait: 10_000,
        timeout: 20_000,
      },
    );

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

    try {
      const updatedTemplate = await prisma.$transaction(
        async (tx) => {
          await tx.workoutTemplate.update({
            where: {
              id: params.id,
            },
            data: {
              name: payload.name,
            },
          });

          const existingExercises = await tx.workoutTemplateExercise.findMany({
            where: {
              templateId: params.id,
            },
            select: {
              id: true,
              orderIndex: true,
            },
          });

          const existingExerciseByOrderIndex = new Map(
            existingExercises.map((exercise) => [
              exercise.orderIndex,
              exercise,
            ]),
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
                  (orderIndex): orderIndex is number =>
                    orderIndex !== undefined,
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
                    templateId: params.id,
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
        },
        {
          maxWait: 10_000,
          timeout: 20_000,
        },
      );

      return updatedTemplate;
    } catch (error) {
      if (error instanceof TemplateExercisesInUseError) {
        return reply.status(409).send({
          message:
            "Cannot delete exercises that are already used in workout sessions",
          orderIndexes: error.orderIndexes,
        });
      }

      throw error;
    }
  });
};
