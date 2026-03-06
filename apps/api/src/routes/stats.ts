import {
  workoutOverviewQuerySchema,
  workoutOverviewResponseSchema,
} from "@sport-track/contracts";
import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma.js";

const FOUR_WEEKS_DAYS = 28;
const DAY_MS = 24 * 60 * 60 * 1000;

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

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

const getSetVolume = (set: {
  reps: number;
  weight: number;
  isCompleted: boolean;
}) => {
  if (!set.isCompleted) {
    return 0;
  }

  return set.reps * set.weight;
};

export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/workout-overview", async (request, reply) => {
    const parsedQuery = workoutOverviewQuerySchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return reply.status(400).send({
        message: "Invalid query params",
        issues: parsedQuery.error.issues,
      });
    }

    const query = parsedQuery.data;

    const from = parseDate(query.from);
    const to = parseDate(query.to);

    const template = await prisma.workoutTemplate.findUnique({
      where: {
        id: query.templateId,
      },
      include: {
        exercises: {
          orderBy: {
            orderIndex: "asc",
          },
          include: {
            exerciseType: {
              select: {
                name: true,
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
      orderBy: {
        performedAt: "asc",
      },
      select: {
        performedAt: true,
        rpe: true,
        exercises: {
          select: {
            templateExerciseId: true,
            sets: {
              orderBy: {
                orderIndex: "asc",
              },
              select: {
                reps: true,
                weight: true,
                isCompleted: true,
              },
            },
          },
        },
      },
    });

    const normalizedSessions = sessions.map((session) => ({
      performedAt: session.performedAt,
      rpe: session.rpe,
      exercises: session.exercises.map((exercise) => ({
        templateExerciseId: exercise.templateExerciseId,
        sets: exercise.sets.map((set) => ({
          reps: set.reps,
          weight: Number(set.weight),
          isCompleted: set.isCompleted,
        })),
      })),
    }));

    const sessionVolumes = normalizedSessions.map((session) => ({
      performedAt: session.performedAt,
      volume: session.exercises.reduce((exerciseAcc, exercise) => {
        return (
          exerciseAcc +
          exercise.sets.reduce((setAcc, set) => setAcc + getSetVolume(set), 0)
        );
      }, 0),
    }));

    const sessionsCount = normalizedSessions.length;
    const lastSession = normalizedSessions[sessionsCount - 1];
    const totalVolumeValue = sessionVolumes.reduce(
      (acc, session) => acc + session.volume,
      0,
    );

    const averageRpe =
      sessionsCount === 0
        ? null
        : roundToOneDecimal(
            normalizedSessions.reduce((acc, session) => acc + session.rpe, 0) /
              sessionsCount,
          );

    const trendEndDate = to ?? lastSession?.performedAt ?? new Date();
    const currentPeriodStart = new Date(
      trendEndDate.getTime() - (FOUR_WEEKS_DAYS - 1) * DAY_MS,
    );
    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - DAY_MS);
    const previousPeriodStart = new Date(
      previousPeriodEnd.getTime() - (FOUR_WEEKS_DAYS - 1) * DAY_MS,
    );

    const currentPeriodVolume = sessionVolumes.reduce((acc, session) => {
      const inCurrentPeriod =
        session.performedAt >= currentPeriodStart &&
        session.performedAt <= trendEndDate;

      if (!inCurrentPeriod) {
        return acc;
      }

      return acc + session.volume;
    }, 0);

    const previousPeriodVolume = sessionVolumes.reduce((acc, session) => {
      const inPreviousPeriod =
        session.performedAt >= previousPeriodStart &&
        session.performedAt <= previousPeriodEnd;

      if (!inPreviousPeriod) {
        return acc;
      }

      return acc + session.volume;
    }, 0);

    const trendDeltaPercent =
      previousPeriodVolume === 0
        ? null
        : Math.round(
            ((currentPeriodVolume - previousPeriodVolume) /
              previousPeriodVolume) *
              100,
          );

    const exercises = template.exercises.map((templateExercise) => {
      const records = normalizedSessions.map((session) => {
        const sessionExercise = session.exercises.find(
          (exercise) => exercise.templateExerciseId === templateExercise.id,
        );

        if (!sessionExercise) {
          return {
            date: formatDate(session.performedAt),
            done: false,
            sets: [],
          };
        }

        const completedSets = sessionExercise.sets.filter(
          (set) => set.isCompleted,
        );

        if (completedSets.length === 0) {
          return {
            date: formatDate(session.performedAt),
            done: false,
            sets: [],
          };
        }

        return {
          date: formatDate(session.performedAt),
          done: true,
          sets: completedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })),
        };
      });

      const completedSets = records.flatMap((record) =>
        record.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          volume: set.reps * set.weight,
        })),
      );

      const bestSet = completedSets.reduce<{
        reps: number;
        weight: number;
      } | null>((currentBest, set) => {
        if (!currentBest) {
          return { reps: set.reps, weight: set.weight };
        }

        const currentBestVolume = currentBest.reps * currentBest.weight;

        if (set.volume > currentBestVolume) {
          return { reps: set.reps, weight: set.weight };
        }

        if (
          set.volume === currentBestVolume &&
          set.weight > currentBest.weight
        ) {
          return { reps: set.reps, weight: set.weight };
        }

        if (
          set.volume === currentBestVolume &&
          set.weight === currentBest.weight &&
          set.reps > currentBest.reps
        ) {
          return { reps: set.reps, weight: set.weight };
        }

        return currentBest;
      }, null);

      return {
        id: templateExercise.id,
        name: templateExercise.exerciseType.name,
        bestSet: bestSet ?? {
          reps: 0,
          weight: 0,
        },
        records,
      };
    });

    const responsePayload = {
      template: {
        id: template.id,
        name: template.name,
      },
      summary: {
        sessionsCount,
        lastSessionDate: lastSession
          ? formatDate(lastSession.performedAt)
          : null,
        totalVolume: {
          value: totalVolumeValue,
          unit: "kg" as const,
          trend: {
            period: "4w" as const,
            deltaPercent: trendDeltaPercent,
          },
        },
        averageIntensity: {
          rpe: averageRpe,
        },
      },
      exercises,
    };

    const parsedResponse =
      workoutOverviewResponseSchema.safeParse(responsePayload);

    if (!parsedResponse.success) {
      request.log.error(
        { issues: parsedResponse.error.issues },
        "Invalid workout overview response payload",
      );

      return reply.status(500).send({
        message: "Invalid workout overview response payload",
      });
    }

    return parsedResponse.data;
  });
};
