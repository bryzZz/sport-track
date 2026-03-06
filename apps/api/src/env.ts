import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
