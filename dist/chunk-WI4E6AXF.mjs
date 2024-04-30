import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/paths/get-path.ts
import { z } from "zod";
async function getPath(app) {
  app.withTypeProvider().get("/paths/:pathId", {
    schema: {
      summary: "Exibe um trecho",
      tags: ["trecho"],
      params: z.object({
        pathId: z.coerce.number()
      }),
      response: {
        200: z.object({
          origin: z.string(),
          destination: z.string(),
          suggested_price: z.any(),
          id: z.number()
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const params = request.params;
    const { pathId } = params;
    if (isNaN(pathId)) {
      reply.status(406);
      throw new Error("O ID do trecho deve ser um n\xFAmero");
    }
    const path = await prisma.route.findUnique({
      where: {
        id: pathId
      }
    });
    if (!path) {
      reply.status(404);
      throw new Error("trecho n\xE3o localizado");
    } else {
      return reply.status(200).send({
        id: path.id,
        suggested_price: path.suggestedPrice,
        origin: path.origin,
        destination: path.destination
      });
    }
  });
}

export {
  getPath
};
