import type { FastifyPluginAsync } from "fastify";

import { prisma } from "../lib/prisma.js";

export const exerciseTypesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return prisma.exerciseType.findMany({
      orderBy: {
        name: "asc",
      },
    });
  });
};
