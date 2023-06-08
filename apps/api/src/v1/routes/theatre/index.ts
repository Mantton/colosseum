import { createLimiter } from "@/services/ratelimiter";
import * as Controller from "@/v1/controllers/theatre";
import { requiresAuthentication } from "@/v1/middleware/auth";
import { authenticatedAndValidated } from "@/v1/middleware/schema";
import {
  CreateTheatreRequestSchema,
  TheatreIdentifierSchema,
} from "@/v1/schemas/theatre";
import { Router } from "express";
import { z } from "zod";
const TheatreRouter = Router();

// Get Managed Theatres
TheatreRouter.get(
  "/managed",
  [createLimiter({ max: 5, window: 1 }), requiresAuthentication],
  Controller.handleGetManagedTheatres
);
// Create A Theatre
/**
 * Create A New Theatre
 * Limited to 2 Requests per hour
 * Requires users to be authenticated
 */
TheatreRouter.post(
  "/create",
  [
    createLimiter({ max: 3, window: 3600 }),
    authenticatedAndValidated(CreateTheatreRequestSchema),
  ],
  Controller.handleCreateTheatre
);

TheatreRouter.post(
  "/create/flow/identifier",
  [
    createLimiter({ max: 3, window: 1 }),
    authenticatedAndValidated(TheatreIdentifierSchema),
  ],
  Controller.handleIsIdentifierTakenFlow
);

// Update Theatre Settings
TheatreRouter.post("/:id");

// Delete Theatre
TheatreRouter.delete("/:id");

export default TheatreRouter;
