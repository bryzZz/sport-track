import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./env.js";
import { exerciseTypesRoutes } from "./routes/exercise-types.js";
import { statsRoutes } from "./routes/stats.js";
import { workoutSessionsRoutes } from "./routes/workout-sessions.js";
import { workoutTemplatesRoutes } from "./routes/workout-templates.js";

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
