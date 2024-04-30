import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/paths/edit-path.ts
import { z } from "zod";
async function editPath(app) {
  app.withTypeProvider().put("/paths/:pathId", {
    schema: {
      summary: "Edita um motorista",
      tags: ["trecho"],
      params: z.object({
        pathId: z.coerce.number()
      }),
      body: z.object({
        origin: z.string(),
        destination: z.string().optional(),
        suggested_price: z.number().optional()
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
    const body = request.body;
    const { origin, suggested_price, destination } = body;
    if (!origin || !suggested_price || isNaN(suggested_price) || !destination) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    await prisma.route.update({
      where: {
        id: pathId
      },
      data: {
        origin,
        destination,
        suggestedPrice: suggested_price
      }
    });
    return reply.status(200).send({ message: "Trecho editado com sucesso!" });
  });
}

export {
  editPath
};
