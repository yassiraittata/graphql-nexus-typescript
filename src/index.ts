import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";

import { schema } from "./lib/schema";
import prisma from "./config/db";
import { context } from "../types";
import { auth } from "./middlewares/auth";

const boot = () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }): context => {
      const token = req?.headers.authorization
        ? auth(req?.headers?.authorization)
        : null;

      return { prisma, userId: token?.userId };
    },
  });

  server
    .listen()
    .then(({ url }: { url: string }) => console.log(`App running at ${url}`));
};

boot();
