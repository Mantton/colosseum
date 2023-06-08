import { verify, sign, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../env";

export type Payload = JwtPayload & Identity;

export const decodeJWT = (token: string): Payload => {
  const data = verify(token, JWT_SECRET);
  if (typeof data === "string") throw new Error("Failed to Decode JWT");
  return data as Payload;
};

export const generateJWT = (payload: Record<string, string>) =>
  sign(payload, JWT_SECRET, { expiresIn: "60min" });
