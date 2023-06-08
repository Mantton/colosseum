import { z } from "zod";
import { AlphaNumericReg } from ".";

export const CreateTheatreRequestSchema = z.object({
  name: z.string().min(1).max(120),
  website: z.string().min(1).url(),
  slug: z.string().min(3).max(20).regex(AlphaNumericReg),
});

export const TheatreIdentifierSchema = z.object({
  identifier: CreateTheatreRequestSchema.shape.slug,
});
