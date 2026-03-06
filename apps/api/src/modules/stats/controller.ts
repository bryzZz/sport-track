import { workoutOverviewQuerySchema } from "@sport-track/contracts";
import type { FastifyReply, FastifyRequest } from "fastify";

import {
  InvalidWorkoutOverviewResponsePayloadError,
  WorkoutTemplateNotFoundError,
} from "./errors.js";
import { StatsService, statsService } from "./service.js";

export class StatsController {
  constructor(private readonly service: StatsService) {}

  getWorkoutOverview = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsedQuery = workoutOverviewQuerySchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return reply.status(400).send({
        message: "Invalid query params",
        issues: parsedQuery.error.issues,
      });
    }

    try {
      return await this.service.getWorkoutOverview(parsedQuery.data);
    } catch (error) {
      if (error instanceof WorkoutTemplateNotFoundError) {
        return reply.status(404).send({
          message: "Workout template not found",
        });
      }

      if (error instanceof InvalidWorkoutOverviewResponsePayloadError) {
        request.log.error(
          { issues: error.issues },
          "Invalid workout overview response payload",
        );

        return reply.status(500).send({
          message: "Invalid workout overview response payload",
        });
      }

      throw error;
    }
  };
}

export const statsController = new StatsController(statsService);
