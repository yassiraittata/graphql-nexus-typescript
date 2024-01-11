import * as jwt from "jsonwebtoken";

type Token = { userId: string };

export const auth = (header: string): Token => {
  try {
    const token = header.split(" ")[1];

    let decodedToken: Token | jwt.JwtPayload | undefined;

    if (!token) throw new Error("Not autentacated!");

    jwt.verify(token, "secret", (_err, decoded) => {
      decodedToken = decoded as Token | undefined;
    });

    if (!decodedToken) throw new Error("Not autentacated!");

    return { userId: decodedToken.userId } as Token;
  } catch (err: any) {
    throw new Error(err);
  }
};
