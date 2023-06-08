import { z } from "zod";
import { AlphaNumericReg } from ".";

export const VerifyTokenRequestSchema = z.object({
  token: z.string(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  handle: z.string().min(3).max(15).regex(AlphaNumericReg),
});
