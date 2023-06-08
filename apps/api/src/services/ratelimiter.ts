import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "./redis";

type RateLimitOptions = {
  window: number;
  max: number;
};
export const createLimiter = ({ window, max }: RateLimitOptions) => {
  return rateLimit({
    windowMs: window,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    }),
  });
};
