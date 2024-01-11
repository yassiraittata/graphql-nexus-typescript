import {
  extendType,
  floatArg,
  nonNull,
  objectType,
  stringArg,
  nullable,
} from "nexus";

import type { Product, User } from "@prisma/client";

import { context } from "../../types";

export const ProductType = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.float("price");
    t.nonNull.field("creator", { type: "User" });
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
        const products = await prisma.product.findMany({
          include: { creator: true },
        });
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
    // create product
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
            creatorId: "clr9huj6o0000tequk0uvewnn",
          },
        });

        return newProduct;
      },
    });

    // delete product
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

    // update product
    t.nonNull.field("updateProduct", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
        name: nullable(stringArg()),
        price: nullable(floatArg()),
        description: nullable(stringArg()),
      },
      async resolve(_parent, args, { prisma }: context): Promise<Product> {
        const { id, name, description, price } = args;

        const product = await prisma.product.findFirst({ where: { id } });

        if (!product) throw new Error("Product was not found!");

        await prisma.product.update({
          data: {
            name: name ? name : product.name,
            price: price ? price : product.price,
            description: description ? description : product.description,
          },
          where: { id },
        });

        return product;
      },
    });
  },
});
