import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";

import { schema } from "./lib/schema";
import prisma from "./config/db";
import { context } from "../types";

const boot = () => {
  const server = new ApolloServer({
    schema,
    context: (): context => ({ prisma }),
  });

  server
    .listen()
    .then(({ url }: { url: string }) => console.log(`App running at ${url}`));
};

boot();
