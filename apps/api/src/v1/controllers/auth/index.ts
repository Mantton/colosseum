import { getAccountByEmail, getAccountByHandle } from "@/v1/db";
import { LoginRequestSchema, RegisterRequestSchema } from "@/v1/schemas/auth";
import { ServerError } from "@/v1/utils/errors";
import { sendMagicLink } from "@/v1/utils/mail/postmark";
import { RequestHandler } from "express";
import {
  consumeHandleReservation,
  isHandleReserved,
  reserveHandle,
} from "../redis";
import { z } from "zod";

export const handleLogin: RequestHandler = async (req, res, next) => {
  // Request Guard
  if (
    req.method !== "POST" ||
    req.headers["content-type"] !== "application/json"
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const { email } = await LoginRequestSchema.parseAsync(req.body);
    const user = await getAccountByEmail(email);
    if (!user) return res.json({ success: true }); // "Fake" Positive Result
    await sendMagicLink({ email, handle: user.handle });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const handleRegister: RequestHandler = async (req, res, next) => {
  // Request Guard
  if (
    req.method !== "POST" ||
    req.headers["content-type"] !== "application/json"
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const { email, handle } = await RegisterRequestSchema.parseAsync(req.body);
    const emailAccount = await getAccountByEmail(email);

    // Check if Email is already Attributed to Account
    if (emailAccount) throw ServerError.EMAIL_ALREADY_ATTRIBUTED;

    // Email not attributed, check if handle is taken or reserved
    const handleAccount = await getAccountByHandle(handle);
    if (handleAccount) throw ServerError.HANDLE_TAKEN;
    if (await isHandleReserved(handle)) throw ServerError.HANDLE_RESERVED;

    // TODO: Handle Is Free, do safety check on handle

    // Reserve Handle to email
    await reserveHandle(email, handle);
    // Send magic link, consume if email fails to send
    try {
      await sendMagicLink({ email, handle }, true);
    } catch (err) {
      consumeHandleReservation(handle);
      throw err;
    }

    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const handleCheckHandleValidityFlow: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { handle } = await z
      .object({
        handle: RegisterRequestSchema.shape.handle,
      })
      .parseAsync(req.body);

    if (await isHandleReserved(handle))
      return res.status(200).send({ available: false });
    if (await getAccountByHandle(handle))
      return res.status(200).send({ available: false });

    return res.json({ available: true });
  } catch (err) {
    next(err);
  }
};
