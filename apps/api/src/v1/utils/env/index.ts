import * as dotenv from "dotenv";
dotenv.config();

const env = process.env;
export const JWT_SECRET: string = env["JWT_SECRET"] ?? "";
export const PORT: string = env["PORT"] ?? "5000";
export const POSTMARK_TOKEN: string = env["POSTMARK_TOKEN"] ?? "";
export const POSTMARK_SENDER: string = env["POSTMARK_SENDER"] ?? "";
export const ENVIRONMENT = env["NODE_ENV"];
export const isProduction = ENVIRONMENT === "production";
export const APPLICATION_URL = isProduction
  ? "https://colosseum.mantton.com"
  : `http://localhost:${PORT}`;
export const SERVER_URL = isProduction
  ? `https://colosseum.mantton.com/api`
  : `http://localhost:${PORT}`;
export const REDIS_URL = env["REDIS_URL"];
export const SESSION_SECRET = env["SESSION_SECRET"] ?? "";
export const OPENAI_API_KEY = env["OPEN_AI_KEY"] ?? "";

if (!JWT_SECRET) throw new Error("JWT_SECRET not Set");
