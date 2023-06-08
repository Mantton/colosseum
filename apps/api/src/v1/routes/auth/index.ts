import { createLimiter } from "@/services/ratelimiter";
import {
  handleCheckHandleValidityFlow,
  handleLogin,
  handleRegister,
} from "@/v1/controllers/auth";
import { requiresAuthentication } from "@/v1/middleware/auth";
import { APPLICATION_URL } from "@/v1/utils/env";
import { Router } from "express";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.get("/me", requiresAuthentication, (req, res) => {
  res.json({ handle: req.user?.handle });
});

AuthRouter.get(
  "/verify",
  createLimiter({ max: 5, window: 3600 }), // 5 Requests every Hour Matching Login Limit
  passport.authenticate("magic_link", {
    successRedirect: APPLICATION_URL,
    failureRedirect: "/login",
  })
);

AuthRouter.post("/login", createLimiter({ max: 5, window: 3600 }), handleLogin); // 5 Requests every Hour
AuthRouter.post(
  "/register",
  createLimiter({ max: 2, window: 7200 }), // 2 Requests Every 2 Hours
  handleRegister
);

AuthRouter.post(
  "/flow/handle",
  createLimiter({ max: 4, window: 1 }), //  4 Requests per second
  handleCheckHandleValidityFlow
);

export default AuthRouter;
