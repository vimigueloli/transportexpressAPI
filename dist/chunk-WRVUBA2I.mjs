import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/travels/delete-travel.ts
import { z } from "zod";
async function deleteTravel(app) {
  app.withTypeProvider().delete("/travels/:travelId", {
    schema: {
      summary: "Deleta um transporte",
      tags: ["transporte"],
      params: z.object({
        travelId: z.coerce.number()
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
    const { travelId } = params;
    if (isNaN(travelId)) {
      reply.status(406);
      throw new Error("O ID da viagem deve ser um n\xFAmero");
    }
    const travel = await prisma.travel.findUnique({
      where: {
        id: travelId
      }
    });
    if (!travel) {
      reply.status(404);
      throw new Error("Viagem n\xE3o localizada");
    }
    await prisma.travel.delete({
      where: {
        id: travelId
      }
    });
    return reply.status(200).send({ message: "transporte deletado com sucesso!" });
  });
}

export {
  deleteTravel
};
