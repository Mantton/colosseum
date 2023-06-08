import RedisStore from "connect-redis";
import redis from "./redis";
import session from "express-session";
import { SESSION_SECRET, isProduction } from "@/v1/utils/env";

const store = new RedisStore({ client: redis });

const sessionStore = session({
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "___clsm__session",
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  },
});

export default sessionStore;
