import prisma from "@/services/prisma";
import { CreateTheatreRequestSchema } from "@/v1/schemas/theatre";
import { ServerError } from "@/v1/utils/errors";
import { z } from "zod";

export const isTheatreSlugUnique = async (slug: string) => {
  const theatre = await prisma.theatre.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });

  return !theatre;
};

type CreateTheatreProps = z.infer<typeof CreateTheatreRequestSchema> & {
  userId: number;
};
export const createTheatre = async ({
  slug,
  name,
  userId: ownerId,
  website,
}: CreateTheatreProps) => {
  const slugIsUnique = await isTheatreSlugUnique(slug);
  if (!slugIsUnique) throw ServerError.THEATRE_SLUG_NOT_UNIQUE;

  const theatre = prisma.theatre.create({
    data: {
      slug,
      name,
      website,
      ownerId,
    },
    select: {
      slug: true,
    },
  });

  return theatre;
};

export const getManagedTheatres = (userId: number) => {
  const theatres = prisma.theatre.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      name: true,
      slug: true,
      dateCreated: true,
      website: true,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });

  return theatres;
};

export const canManageTheatre = async (userId: number, id: number) => {
  const theatre = await prisma.theatre.findUnique({
    where: {
      id,
    },
    select: {
      ownerId: true,
      moderators: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!theatre) throw ServerError.THEATRE_DNE;

  return (
    theatre.ownerId === userId ||
    theatre.moderators.some((v) => v.userId === userId)
  );
};
