import { z } from "zod";

export const weightUnitSchema = z.enum(["KG", "LBS"]);

export type WeightUnit = z.infer<typeof weightUnitSchema>;
