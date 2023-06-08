import prisma from "@/services/prisma";
import { UpdateThreadRequestSchema } from "@/v1/schemas/thread";
import { ServerError } from "@/v1/utils/errors";
import { z } from "zod";
import { canManageTheatre } from "../theatre";

export const isThreadIdentifierUnique = async (
  threadId: string,
  theatreId: string
) => {
  const thtr = await prisma.theatre.findUnique({
    where: {
      slug: theatreId,
    },
    select: {
      id: true,
    },
  });

  if (!thtr) throw ServerError.THEATRE_DNE;
  return !prisma.thread.findUnique({
    where: {
      theatreId_slug: {
        theatreId: thtr.id,
        slug: threadId,
      },
    },
    select: {
      id: true,
    },
  });
};

type CreateNewThreadProps = {
  name: string;
  theatreId: number;
  threadSlug: string;
  contentLink: string;
};
export const createNewThread = async ({
  name,
  theatreId,
  threadSlug,
  contentLink,
}: CreateNewThreadProps) => {
  const thtr = await prisma.theatre.findUnique({
    where: {
      id: theatreId,
    },
    select: {
      id: true,
    },
  });

  if (!thtr) throw ServerError.THEATRE_DNE;
  const _ = await prisma.thread.create({
    data: {
      name,
      slug: threadSlug,
      theatreId: thtr.id,
      contentLink,
    },
    select: {
      slug: true,
    },
  });

  return {
    name,
    theatre: theatreId,
    slug: threadSlug,
    contentLink,
  };
};

export const updateThread = async ({
  name,
  contentLink,
  locked,
  id,
}: z.infer<typeof UpdateThreadRequestSchema> & { id: number }) => {
  const target = await prisma.thread.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!target) throw ServerError.THREAD_DNE;
  const changeMade = name || contentLink || locked;
  const { slug, theatreId, dateCreated, dateUpdated } =
    await prisma.thread.update({
      where: {
        id,
      },
      data: {
        ...(name && {
          name,
        }),
        ...(contentLink && {
          contentLink,
        }),
        ...(locked && {
          locked,
        }),
        ...(changeMade && {
          dateUpdated: new Date(),
        }),
      },
      select: {
        id: true,
        slug: true,
        theatreId: true,
        dateCreated: true,
        dateUpdated: true,
      },
    });

  return {
    name,
    contentLink,
    locked,
    id,
    slug,
    theatreId,
    dateCreated,
    dateUpdated,
  };
};

export const canManageThread = async (userId: number, id: number) => {
  const theatreId = (
    await prisma.thread.findUnique({
      where: {
        id,
      },
      select: {
        theatreId: true,
      },
    })
  )?.theatreId;

  if (!theatreId) throw ServerError.THREAD_DNE;

  return canManageTheatre(userId, theatreId);
};
