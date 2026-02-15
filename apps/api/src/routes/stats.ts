import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma";

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/completions", async (request, reply) => {
    const query = request.query as {
      templateId?: string;
      from?: string;
      to?: string;
    };

    if (!query.templateId) {
      return reply.status(400).send({
        message: "templateId is required",
      });
    }

    const from = parseDate(query.from);
    const to = parseDate(query.to);

    const sessions = await prisma.workoutSession.findMany({
      where: {
        templateId: query.templateId,
        ...(from || to
          ? {
              performedAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      select: {
        performedAt: true,
      },
      orderBy: {
        performedAt: "asc",
      },
    });

    return sessions.map((session) => ({
      date: session.performedAt.toISOString().slice(0, 10),
      done: true,
    }));
  });

  app.get("/exercise-progress", async (request, reply) => {
    const query = request.query as {
      templateId?: string;
      exerciseTypeId?: string;
      from?: string;
      to?: string;
    };

    if (!query.templateId || !query.exerciseTypeId) {
      return reply.status(400).send({
        message: "templateId and exerciseTypeId are required",
      });
    }

    const from = parseDate(query.from);
    const to = parseDate(query.to);

    const sessionExercises = await prisma.workoutSessionExercise.findMany({
      where: {
        exerciseTypeId: query.exerciseTypeId,
        session: {
          templateId: query.templateId,
          ...(from || to
            ? {
                performedAt: {
                  ...(from ? { gte: from } : {}),
                  ...(to ? { lte: to } : {}),
                },
              }
            : {}),
        },
      },
      include: {
        session: {
          select: {
            performedAt: true,
          },
        },
        sets: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        session: {
          performedAt: "asc",
        },
      },
    });

    return sessionExercises.map((exercise) => ({
      sessionDate: exercise.session.performedAt.toISOString(),
      sets: exercise.sets.map((set) => ({
        orderIndex: set.orderIndex,
        reps: set.reps,
        partialReps: set.partialReps,
        weight: Number(set.weight),
        isCompleted: set.isCompleted,
      })),
    }));
  });
};
