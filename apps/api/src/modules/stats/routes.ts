import type { FastifyPluginAsync } from "fastify";

import { statsController } from "./controller.js";

export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/workout-overview", statsController.getWorkoutOverview);
};
