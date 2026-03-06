import { createWorkoutSessionSchema } from "@sport-track/contracts";
import type { FastifyReply, FastifyRequest } from "fastify";

import { InvalidTemplateExerciseIdError } from "./errors.js";
import { WorkoutSessionsService, workoutSessionsService } from "./service.js";

export class WorkoutSessionsController {
  constructor(private readonly service: WorkoutSessionsService) {}

  createWorkoutSession = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const parsedBody = createWorkoutSessionSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const createdSession = await this.service.createWorkoutSession(
        parsedBody.data,
      );

      return reply.status(201).send(createdSession);
    } catch (error) {
      if (error instanceof InvalidTemplateExerciseIdError) {
        return reply.status(400).send({
          message: "Invalid payload",
          issues: [
            {
              path: ["exercises", "templateExerciseId"],
              message: error.message,
            },
          ],
        });
      }

      throw error;
    }
  };
}

export const workoutSessionsController = new WorkoutSessionsController(
  workoutSessionsService,
);
