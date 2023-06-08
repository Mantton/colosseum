import { RequestHandler } from "express";
import { type AnyZodObject } from "zod";

export const bodyMatchesSchema = (schema: AnyZodObject) => {
  const handler: RequestHandler = async (req, _res, next) => {
    try {
      const data = await schema.parseAsync(req.body);
      req.body = data;
      next();
    } catch (err) {
      next(err);
    }
  };
  return handler;
};

export const authenticatedAndValidated = (schema: AnyZodObject) => {
  const handler: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send("unauthorized");
      const data = await schema.parseAsync(req.body);
      req.body = {
        ...data,
        user: req.user,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
  return handler;
};
