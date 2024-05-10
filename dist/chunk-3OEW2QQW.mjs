import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/paths/get-paths.ts
import { z } from "zod";
async function getPaths(app) {
  app.withTypeProvider().get("/paths", {
    schema: {
      summary: "Lista os trechos",
      tags: ["trecho"],
      response: {
        200: z.object({
          paths: z.array(z.object({
            origin: z.string(),
            destination: z.string(),
            suggested_price: z.any(),
            id: z.number()
          }))
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const paths = await prisma.route.findMany();
    return reply.status(201).send({ paths: paths.map((item) => ({ ...item, suggestedPrice: void 0, suggested_price: item.suggestedPrice })) });
  });
}

export {
  getPaths
};
