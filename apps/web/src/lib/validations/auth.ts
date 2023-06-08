import * as z from "zod";
import { AlphaNumericReg } from "../utils";

export const SignInFormSchema = z.object({
  email: z.string().email(),
});

export const SignUpFormSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  handle: z
    .string()
    .min(3, "Your handle must be at least 3 characters.")
    .max(15, "Your handle must be at most 15 characters.")
    .regex(
      AlphaNumericReg,
      "Your handle must contain only alphanumeric characters"
    ),
});
