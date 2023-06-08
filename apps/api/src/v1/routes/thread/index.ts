import { Router } from "express";
import TheatreRouter from "../theatre";
import { createLimiter } from "@/services/ratelimiter";
import { authenticatedAndValidated } from "@/v1/middleware/schema";
import {
  CreateThreadRequestSchema,
  UpdateThreadRequestSchema,
} from "@/v1/schemas/thread";
import * as Controller from "@/v1/controllers/thread";
const ThreadRouter = Router();

/**
 * create a new thread
 */
TheatreRouter.post(
  "/create",
  [
    createLimiter({ max: 10, window: 1 }), // 10 Requests per second,
    authenticatedAndValidated(CreateThreadRequestSchema),
  ],
  Controller.handleCreateNewThread
);

/**
 * Get all threads for a specific theatre
 */
ThreadRouter.get("/list/:id");

/**
 * Get Single Thread Information
 */
ThreadRouter.get("/:id");

/**
 * Update a thread
 */
ThreadRouter.post("/:id", [
  createLimiter({ max: 3, window: 1 }),
  authenticatedAndValidated(UpdateThreadRequestSchema),
  Controller.handleUpdateThread,
]);

/**
 * Delete A thread
 */
ThreadRouter.delete(":/id");

export default ThreadRouter;
