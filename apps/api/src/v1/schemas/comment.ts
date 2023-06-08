import { z } from "zod";

export const NewCommentRequestSchema = z.object({
  content: z.string().min(1).max(500),
  threadId: z.number().nonnegative().min(1),
});
