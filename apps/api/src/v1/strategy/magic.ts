import type { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import passport from "passport";
import { Strategy } from "passport";
import { ParsedQs } from "qs";
import { VerifyTokenRequestSchema } from "../schemas/auth";
import { decodeJWT } from "../utils/jwt";
import { findOrRegisterAccount } from "../db";
import {
  consumeHandleReservation,
  isVerificationTokenValid,
  markTokenAsUsed,
} from "../controllers/redis";
import { ServerError } from "../utils/errors";

export class MagicLinkStrategy extends Strategy {
  name = "magic_link";

  async authenticate(
    this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic>,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
  ) {
    const self = this;
    try {
      const { token } = await VerifyTokenRequestSchema.parseAsync(req.query);
      if (!(await isVerificationTokenValid(token)))
        throw ServerError.INVALID_TOKEN;
      const payload = decodeJWT(token);
      try {
        const account = await findOrRegisterAccount(payload);
        self.success(account); // Complete Request flow
        markTokenAsUsed(token); // Mark Token As Used, Prevents from using same token multiple times
        consumeHandleReservation(account.handle); // Consume Handle Reservation
      } catch {
        self.error("internal server error");
      }
    } catch (err) {
      return self.fail("Unauthorized");
    }
  }
}
