import type { FastifyPluginAsync } from "fastify";

import { exerciseTypesController } from "./controller.js";

export const exerciseTypesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", exerciseTypesController.getExerciseTypes);
};
