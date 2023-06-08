import prisma from "@/services/prisma";

const IdentitySelectionColumns = {
  email: true,
  id: true,
  handle: true,
};
export const getAccountByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: IdentitySelectionColumns,
  });
};

export const getAccountByHandle = async (handle: string) => {
  return await prisma.user.findUnique({
    where: {
      handle,
    },
    select: IdentitySelectionColumns,
  });
};

export const getAccountByID = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: IdentitySelectionColumns,
  });
};

export const findOrRegisterAccount = async ({ email, handle }: Identity) => {
  let account = await prisma.user.findUnique({
    where: {
      email,
    },
    select: IdentitySelectionColumns,
  });

  if (account) return account;

  account = await prisma.user.create({
    data: {
      handle,
      email,
    },
  });

  return account;
};
