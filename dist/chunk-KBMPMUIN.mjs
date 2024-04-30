import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/paths/delete-path.ts
import { z } from "zod";
async function deletePath(app) {
  app.withTypeProvider().delete("/paths/:pathId", {
    schema: {
      summary: "Deleta um trecho",
      tags: ["trecho"],
      params: z.object({
        pathId: z.coerce.number()
      }),
      response: {
        200: z.object({
          message: z.string()
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
      throw new Error("Trecho n\xE3o localizado");
    }
    await prisma.route.delete({
      where: {
        id: pathId
      }
    });
    return reply.status(200).send({ message: "Trecho deletado com sucesso!" });
  });
}

export {
  deletePath
};
