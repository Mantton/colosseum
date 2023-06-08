import express, { RequestHandler } from "express";
import badRouteHandler from "./v1/routes/common/badRoute";
import V1_ROUTER from "./v1/routes";
import { ErrorHandler } from "./v1/routes/common/ErrorHandler";
import sessionStore from "./services/session";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import passport from "passport";
import { APPLICATION_URL, isProduction } from "./v1/utils/env";

const app = express();

// Core Middleware
app.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      if (!isProduction) {
        cb(null, true);
        return;
      }

      if (origin !== APPLICATION_URL) {
        cb(new Error("DENIED"));
        return;
      }

      cb(null, true);
    },
  })
);
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());
app.use(sessionStore);
app.use(passport.session());
app.set("trust proxy", 1); // trust first proxy

// Routes
app.use("/v1", V1_ROUTER);
app.use("*", badRouteHandler);
app.use(ErrorHandler);

//
declare module "express-session" {
  interface SessionData {
    user: VerifiedIdentity;
  }
}

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface User extends VerifiedIdentity {}
  }

  // Authenticated and Validated
  interface AVRequestHandler<
    ReqBody,
    ReqParams = any,
    ReqQuery = any,
    ResBody = any
  > extends RequestHandler<
      ReqParams,
      ResBody,
      ReqBody & { user: VerifiedIdentity },
      ReqQuery
    > {}
}

export default app;
