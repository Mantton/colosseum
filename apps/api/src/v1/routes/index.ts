import { Router } from "express";
import AuthRouter from "./auth";
import TheatreRouter from "./theatre";
import passport from "passport";
import { getAccountByID } from "../db";
import { MagicLinkStrategy } from "../strategy/magic";
import { ServerError } from "../utils/errors";
import ThreadRouter from "./thread";
import CommentRouter from "./comment";

const V1_ROUTER = Router();

V1_ROUTER.use("/auth", AuthRouter);
V1_ROUTER.use("/theatre", TheatreRouter);
V1_ROUTER.use("/thread", ThreadRouter);
V1_ROUTER.use("/comment", CommentRouter);

// Passport
passport.use("magic_link", new MagicLinkStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser<number>(async function (id, done) {
  const user = await getAccountByID(id);
  if (!user) done(ServerError.USER_DNE);
  done(null, user);
});
export default V1_ROUTER;
