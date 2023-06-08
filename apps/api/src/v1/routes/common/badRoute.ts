import { RequestHandler } from "express";

const badRouteHandler: RequestHandler = (_req, res) => {
  res.status(404).send("not found");
};

export default badRouteHandler;
