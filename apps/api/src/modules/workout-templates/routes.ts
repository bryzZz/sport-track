import type { FastifyPluginAsync } from "fastify";

import { workoutTemplatesController } from "./controller.js";

export const workoutTemplatesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", workoutTemplatesController.getWorkoutTemplates);
  app.get("/:id", workoutTemplatesController.getWorkoutTemplateById);
  app.post("/", workoutTemplatesController.createWorkoutTemplate);
  app.put("/:id", workoutTemplatesController.updateWorkoutTemplate);
};
