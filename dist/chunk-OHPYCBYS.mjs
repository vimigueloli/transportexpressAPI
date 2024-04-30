import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/users/login.ts
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
async function login(app) {
  app.withTypeProvider().post("/login", {
    schema: {
      summary: "faz login",
      tags: ["usu\xE1rio"],
      body: z.object({
        email: z.string(),
        password: z.string()
      }),
      response: {
        200: z.object({
          token: z.string(),
          id: z.number(),
          email: z.string()
        }),
        406: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      reply.status(406);
      return {
        message: "usu\xE1rio inexistente"
      };
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      reply.status(406);
      return {
        message: "senha inv\xE1lida"
      };
    }
    const token = await jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email
    }, `${process.env.JWT_SECRET}`);
    reply.status(200);
    return {
      token,
      id: user.id,
      email: user.email
    };
  });
}

export {
  login
};
