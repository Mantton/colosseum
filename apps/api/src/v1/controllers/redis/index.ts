import redis from "@/services/redis";
import { ServerError } from "@/v1/utils/errors";

// * Reservation
const genReservationKey = (handle: string) => `reserve:${handle}`;
export const isHandleReserved = async (handle: string) => {
  return !!(await redis.get(genReservationKey(handle)));
};

export const reserveHandle = async (email: string, handle: string) => {
  if (await isHandleReserved(handle)) throw ServerError.HANDLE_RESERVED;
  await redis.setEx(genReservationKey(handle), 3600, email); // Reserves handle for an hour
};

export const consumeHandleReservation = async (handle: string) => {
  await redis.del(genReservationKey(handle));
};
// Token
const genVerificationKey = (token: string) => `verify:${token}`;

export const isVerificationTokenValid = async (token: string) =>
  !(await redis.get(genVerificationKey(token)));

export const markTokenAsUsed = async (token: string) =>
  await redis.setEx(genVerificationKey(token), 36060, "u"); // marks token as used for an hour (token will expire within that same hour always)
