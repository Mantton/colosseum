import { z } from "zod";
import { AlphaNumericReg } from "../utils";
import api from "../api";

export const CreateNewTheatreFormSchema = z.object({
  name: z.string().min(1).max(120),
  website: z.string().min(1).url(),
  identifier: z
    .string()
    .min(3)
    .max(20)
    .regex(AlphaNumericReg)
    .refine(async (identifier) => {
      try {
        const { data } = await api.post("/v1/theatre/create/flow/identifier", {
          identifier,
        });
        return data.available;
      } catch {
        return false;
      }
    }, "The Identifier is already in use."),
});
