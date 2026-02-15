import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "./env";
import { exerciseTypesRoutes } from "./routes/exercise-types";
import { statsRoutes } from "./routes/stats";
import { workoutSessionsRoutes } from "./routes/workout-sessions";
import { workoutTemplatesRoutes } from "./routes/workout-templates";

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
