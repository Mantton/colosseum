import { ServerError } from "@/v1/utils/errors";
import { UnsupportedEmailService } from "@/v1/utils/mail";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const ErrorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (Object.values(ServerError).includes(err)) {
    switch (err) {
      case ServerError.EMAIL_ALREADY_ATTRIBUTED:
        res
          .status(401)
          .send({ msg: "email is already attributed to another account" });
        break;
      case ServerError.HANDLE_RESERVED:
        res
          .status(401)
          .send({ msg: "handle is already reserved by another user." });
        break;
      case ServerError.HANDLE_TAKEN:
        res
          .status(401)
          .send({ msg: "handle is already taken by another user" });
        break;
      case ServerError.INSUFFICIENT_PERMISSIONS:
        res.status(403).send({ msg: "forbidden" });
        break;
      default:
        res.status(500).send("Internal Server Error");
        return;
    }
  } else if (err instanceof UnsupportedEmailService) {
    // Unsupported Provider Error
    res.status(400).json({
      msg: "Colosseum does not support mailboxes from the provided email service.",
    });
  } else if (err instanceof ZodError) {
    res.status(400).send("bad request");
  } else {
    res.status(500).send("internal server error");
    // TODO: Log Error
    console.log(err);
  }
};
