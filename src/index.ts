import { ApolloServer } from "apollo-server";
import { schema } from "./lib/schema";

const boot = () => {
  const server = new ApolloServer({
    schema,
  });

  server
    .listen()
    .then(({ url }: { url: string }) => console.log(`App running at ${url}`));
};

boot();
