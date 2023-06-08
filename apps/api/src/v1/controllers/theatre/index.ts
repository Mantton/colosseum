import {
  createTheatre,
  getManagedTheatres,
  isTheatreSlugUnique,
} from "@/v1/db/theatre";
import {
  CreateTheatreRequestSchema,
  TheatreIdentifierSchema,
} from "@/v1/schemas/theatre";
import { ServerError } from "@/v1/utils/errors";
import { RequestHandler } from "express";
import { z } from "zod";

type CreateTheatreReqBody = z.infer<typeof CreateTheatreRequestSchema>;
export const handleCreateTheatre: AVRequestHandler<
  CreateTheatreReqBody
> = async (req, res, next) => {
  const { user, name, website, slug } = req.body;
  try {
    const theatre = await createTheatre({
      name,
      website,
      slug,
      userId: user.id,
    });
    res.status(201).send(theatre);
  } catch (err) {
    next(err);
  }
};
type TheatreIdentifierReqBody = z.infer<typeof TheatreIdentifierSchema>;
export const handleIsIdentifierTakenFlow: AVRequestHandler<
  TheatreIdentifierReqBody
> = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    return res.json({
      available: await isTheatreSlugUnique(identifier),
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetManagedTheatres: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) throw ServerError.EXPECTED_VALIDATED_DATA;
    const id = req.user.id;
    const theatres = await getManagedTheatres(id);
    res.json({
      success: true,
      result: theatres,
    });
  } catch (err) {
    next(err);
  }
};
