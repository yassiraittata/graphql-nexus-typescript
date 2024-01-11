import { extendType, nonNull, objectType, stringArg } from "nexus";
import argon from "argon2";
import * as jwt from "jsonwebtoken";

import { context } from "../../types";

export const Authtype = objectType({
  name: "Auth",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("register", {
      type: "Auth",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }: context) {
        const { name, email, password } = args;
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) throw new Error("Email already exists!");

        const hash = await argon.hash(password);

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hash,
          },
        });

        const token = jwt.sign(
          {
            userId: newUser.id,
            email: newUser.email,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );

        const returedObject = Object.assign(newUser, { password: null });

        return {
          token: token,
          user: returedObject,
        };
      },
    });

    t.nonNull.field("login", {
      type: "Auth",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, { prisma }: context) {
        const { email, password } = args;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("No user was found!");

        const isPwMatch = await argon.verify(user.password, password);

        if (!isPwMatch) throw new Error("Password is incorrect!");

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );

        const returedObject = Object.assign(user, { password: null });

        return {
          token: token,
          user: returedObject,
        };
      },
    });
  },
});
