import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/drivers/delete-driver.ts
import { z } from "zod";
async function deleteDriver(app) {
  app.withTypeProvider().delete("/drivers/:driverId", {
    schema: {
      summary: "Deleta um motorista",
      tags: ["motorista"],
      params: z.object({
        driverId: z.coerce.number()
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
    const { driverId } = params;
    if (!driverId || isNaN(driverId)) {
      reply.status(406);
      throw new Error("O ID do motorista precisa ser um n\xFAmero");
    }
    const driver = await prisma.driver.findUnique({
      where: {
        id: driverId
      }
    });
    if (!driver) {
      reply.status(404);
      throw new Error("Motorista n\xE3o encontrado");
    }
    await prisma.driver.delete({
      where: {
        id: driverId
      }
    });
    return reply.status(201).send({ message: "Motorista deletado com sucesso!" });
  });
}

export {
  deleteDriver
};
