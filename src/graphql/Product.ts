import {
  extendType,
  floatArg,
  nonNull,
  objectType,
  stringArg,
  nullable,
} from "nexus";

import type { Product, User } from "@prisma/client";

import { NexusGenObjects } from "../../nexus-typegen";
import { context } from "../../types";

export const ProductType = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.float("price");
  },
});

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("products", {
      type: "Product",
      async resolve(
        _parent,
        _args,
        { prisma }: context,
        _info
      ): Promise<Product[]> {
        const products = await prisma.product.findMany();
        return products;
      },
    });

    t.nullable.field("product", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(
        _parent,
        args,
        { prisma }: context
      ): Promise<Product | null> {
        const { id } = args;
        const product = await prisma.product.findFirst({
          where: {
            id,
          },
        });

        return product;
      },
    });
  },
});

export const productMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProduct", {
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        price: nonNull(floatArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }: context): Promise<Product> {
        const { name, price, description } = args;

        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price,
          },
        });

        return newProduct;
      },
    });

    t.nonNull.boolean("deleteProduct", {
      args: {
        id: nonNull(stringArg()),
      },

      async resolve(_parent, { id }, { prisma }: context) {
        const product = await prisma.product.findFirst({
          where: {
            id,
          },
        });

        if (!product) throw new Error("product was not found!");

        await prisma.product.delete({ where: { id } });

        return true;
      },
    });
  },
});
