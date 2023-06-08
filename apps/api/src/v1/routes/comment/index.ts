import { createLimiter } from "@/services/ratelimiter";
import { authenticatedAndValidated } from "@/v1/middleware/schema";
import { NewCommentRequestSchema } from "@/v1/schemas/comment";
import { Router } from "express";

const CommentRouter = Router();
let r = CommentRouter;

r.post("/create", [
  createLimiter({ max: 1, window: 5 }),
  authenticatedAndValidated(NewCommentRequestSchema),
]);
r.delete("/:id"); // Delete Comment
r.post("/:id"); // Edit Comment
r.post("/report/:id");

export default CommentRouter;
