import { createWorkoutTemplateSchema } from "@sport-track/contracts";
import type { FastifyReply, FastifyRequest } from "fastify";

import {
  TemplateExercisesInUseError,
  WorkoutTemplateNotFoundError,
} from "./errors.js";
import { WorkoutTemplatesService, workoutTemplatesService } from "./service.js";

type WorkoutTemplateParams = {
  id: string;
};

export class WorkoutTemplatesController {
  constructor(private readonly service: WorkoutTemplatesService) {}

  getWorkoutTemplates = async () => {
    return this.service.getWorkoutTemplates();
  };

  getWorkoutTemplateById = async (
    request: FastifyRequest<{ Params: WorkoutTemplateParams }>,
    reply: FastifyReply,
  ) => {
    try {
      return await this.service.getWorkoutTemplateById(request.params.id);
    } catch (error) {
      if (error instanceof WorkoutTemplateNotFoundError) {
        return reply.status(404).send({
          message: "Workout template not found",
        });
      }

      throw error;
    }
  };

  createWorkoutTemplate = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const parsedBody = createWorkoutTemplateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    const template = await this.service.createWorkoutTemplate(parsedBody.data);

    return reply.status(201).send(template);
  };

  updateWorkoutTemplate = async (
    request: FastifyRequest<{ Params: WorkoutTemplateParams }>,
    reply: FastifyReply,
  ) => {
    const parsedBody = createWorkoutTemplateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid payload",
        issues: parsedBody.error.issues,
      });
    }

    try {
      return await this.service.updateWorkoutTemplate(
        request.params.id,
        parsedBody.data,
      );
    } catch (error) {
      if (error instanceof WorkoutTemplateNotFoundError) {
        return reply.status(404).send({
          message: "Workout template not found",
        });
      }

      if (error instanceof TemplateExercisesInUseError) {
        return reply.status(409).send({
          message:
            "Cannot delete exercises that are already used in workout sessions",
          orderIndexes: error.orderIndexes,
        });
      }

      throw error;
    }
  };
}

export const workoutTemplatesController = new WorkoutTemplatesController(
  workoutTemplatesService,
);
