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
import prisma from "../config/db";

let products: NexusGenObjects["Product"][] = [];

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
      async resolve(_parent, _args, _context, _info): Promise<Product[]> {
        const products = await prisma.product.findMany();
        return products;
      },
    });
  },
});

export const createProduct = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProduct", {
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        price: nonNull(floatArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args): Promise<Product> {
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
  },
});
