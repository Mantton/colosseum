import { z } from "zod";
import { CreateTheatreRequestSchema } from "./theatre";

export const CreateThreadRequestSchema = z.object({
  theatre: z.number().nonnegative().min(1), // Request will be made with slug
  name: z.string().min(3).max(50),
  identifier: z.string().min(3).max(20),
  contentLink: z.string().url().min(5).max(2083),
});

export const UpdateThreadRequestSchema = z.object({
  name: CreateThreadRequestSchema.shape.name.optional(),
  contentLink: CreateThreadRequestSchema.shape.contentLink.optional(),
  locked: z.boolean().optional(),
});
