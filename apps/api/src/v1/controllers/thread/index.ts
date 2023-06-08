import { canManageTheatre } from "@/v1/db/theatre";
import { canManageThread, createNewThread, updateThread } from "@/v1/db/thread";
import {
  CreateThreadRequestSchema,
  UpdateThreadRequestSchema,
} from "@/v1/schemas/thread";
import { ServerError } from "@/v1/utils/errors";
import { z } from "zod";

type CreateThreadReqBody = z.infer<typeof CreateThreadRequestSchema>;
export const handleCreateNewThread: AVRequestHandler<
  CreateThreadReqBody
> = async (req, res, next) => {
  try {
    const {
      user,
      theatre: theatreId,
      name,
      identifier: threadSlug,
      contentLink,
    } = req.body;
    const hasPermissions = await canManageTheatre(user.id, theatreId);

    if (!hasPermissions) throw ServerError.INSUFFICIENT_PERMISSIONS;

    const thread = await createNewThread({
      name,
      theatreId,
      threadSlug,
      contentLink,
    });

    res.status(201).json({
      success: true,
      result: thread,
    });
  } catch (error) {
    next(error);
  }
};

type UpdateThreadReqBody = z.infer<typeof UpdateThreadRequestSchema>;

export const handleUpdateThread: AVRequestHandler<
  UpdateThreadReqBody,
  { id: string }
> = async (req, res, next) => {
  try {
    const threadID = parseInt(req.params.id);
    if (!threadID || Number.isNaN(threadID)) throw ServerError.BAD_REQUEST;
    const { user, name, contentLink, locked } = req.body;
    const hasPermissions = await canManageThread(user.id, threadID);

    if (!hasPermissions) throw ServerError.INSUFFICIENT_PERMISSIONS;

    const thread = await updateThread({
      name,
      contentLink,
      locked,
      id: threadID,
    });

    res.status(200).send({
      success: true,
      result: thread,
    });
  } catch (err) {
    next(err);
  }
};
