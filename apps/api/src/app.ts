import cors from "@fastify/cors";
import Fastify from "fastify";

import { exerciseTypesRoutes } from "./modules/exercise-types/routes.js";
import { statsRoutes } from "./modules/stats/routes.js";
import { workoutSessionsRoutes } from "./modules/workout-sessions/routes.js";
import { workoutTemplatesRoutes } from "./modules/workout-templates/routes.js";
import { env } from "./env.js";

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: env.CORS_ORIGIN,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      now: new Date().toISOString(),
    };
  });

  app.register(exerciseTypesRoutes, {
    prefix: "/exercise-types",
  });

  app.register(workoutTemplatesRoutes, {
    prefix: "/workout-templates",
  });

  app.register(workoutSessionsRoutes, {
    prefix: "/workout-sessions",
  });

  app.register(statsRoutes, {
    prefix: "/stats",
  });

  return app;
};
