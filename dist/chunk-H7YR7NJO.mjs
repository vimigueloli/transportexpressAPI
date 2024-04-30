import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/refuellings/delete-refuelling.ts
import { z } from "zod";
async function deleteRefuelling(app) {
  app.withTypeProvider().delete("/refuellings/:refuellingId", {
    schema: {
      summary: "Deleta um abastecimento",
      tags: ["abastecimento"],
      params: z.object({
        refuellingId: z.coerce.number()
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
    const { refuellingId } = params;
    if (isNaN(refuellingId)) {
      reply.status(406);
      throw new Error("O ID do abastecimento deve ser um n\xFAmero");
    }
    const refuelling = await prisma.refuelling.findUnique({
      where: {
        id: refuellingId
      }
    });
    if (!refuelling) {
      reply.status(404);
      throw new Error("Abastecimento n\xE3o localizado");
    }
    await prisma.refuelling.delete({
      where: {
        id: refuellingId
      }
    });
    return reply.status(200).send({ message: "abastecimento deletado com sucesso!" });
  });
}

export {
  deleteRefuelling
};
