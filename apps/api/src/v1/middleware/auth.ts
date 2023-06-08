import { RequestHandler } from "express";

export const requiresAuthentication: RequestHandler = async (
  req,
  res,
  next
) => {
  if (!req.user) {
    res.status(401).send("unauthorized");
  } else {
    next();
  }
};
