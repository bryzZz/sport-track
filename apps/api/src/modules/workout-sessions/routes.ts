import type { FastifyPluginAsync } from "fastify";

import { workoutSessionsController } from "./controller.js";

export const workoutSessionsRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", workoutSessionsController.createWorkoutSession);
};
