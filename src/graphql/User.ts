import { extendType, objectType, inputObjectType } from "nexus";

import { context } from "../../types";


export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nullable.string("password");
    t.nonNull.list.nonNull.field("products", {
      type: "Product",
      async resolve(parent, _args, { prisma }: context) {
        console.log({ parent });
        const products = await prisma.product.findMany({
          where: {
            creator: {
              id: parent.id,
            },
          },
        });

        return products;
      },
    });
  },
});

export const userQueries = extendType({
  type: "Query",
  definition(t) {},
});
