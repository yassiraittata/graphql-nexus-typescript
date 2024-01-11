import { PrismaClient } from "@prisma/client";

export type context = {
  prisma: PrismaClient;
};
