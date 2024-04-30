import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trucks/delete-trucks.ts
import { z } from "zod";
async function deleteTruck(app) {
  app.withTypeProvider().delete("/trucks/:truckId", {
    preHandler: [authChecker],
    schema: {
      summary: "Deleta um caminh\xE3o",
      tags: ["caminh\xE3o"],
      params: z.object({
        truckId: z.coerce.number()
      }),
      response: {
        200: z.object({
          message: z.string()
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    }
  }, async (request, reply) => {
    const params = request.params;
    const { truckId } = params;
    if (isNaN(truckId)) {
      reply.status(406);
      throw new Error("O ID do caminh\xE3o deve ser um n\xFAmero");
    }
    const truck = await prisma.truck.findUnique({
      where: {
        id: truckId
      }
    });
    if (!truck) {
      reply.status(404);
      throw new Error("Caminh\xE3o n\xE3o localizado");
    }
    await prisma.truck.delete({
      where: {
        id: truckId
      }
    });
    return reply.status(201).send({ message: "Caminh\xE3o deletado com sucesso!" });
  });
}

export {
  deleteTruck
};
