// src/routes/users/hash-creator.ts
import { z } from "zod";
import bcrypt from "bcrypt";
async function createHash(app) {
  app.withTypeProvider().post("/hash", {
    schema: {
      summary: "transforma uma senha em hash",
      tags: ["usu\xE1rio"],
      body: z.object({
        password: z.string()
      }),
      response: {
        201: z.object({
          hash: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const {
      password
    } = request.body;
    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(password, salt);
    return reply.status(201).send({ hash });
  });
}

export {
  createHash
};
