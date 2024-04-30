import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/drivers/get-driver.ts
import { z } from "zod";
async function getDriver(app) {
  app.withTypeProvider().get("/drivers/:driverId", {
    schema: {
      summary: "Exibe um motorista",
      tags: ["motorista"],
      params: z.object({
        driverId: z.coerce.number()
      }),
      response: {
        200: z.object({
          cpf: z.string(),
          name: z.string(),
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
    const { driverId } = params;
    if (isNaN(driverId)) {
      reply.status(404);
      throw new Error("O ID do motorista deve ser um n\xFAmero");
    }
    const driver = await prisma.driver.findUnique({
      where: {
        id: driverId
      }
    });
    if (!driver) {
      reply.status(404);
      throw new Error("Motorista n\xE3o localizado");
    } else {
      return reply.status(201).send({
        id: driver.id,
        cpf: driver.cpf || "",
        name: driver.name
      });
    }
  });
}

export {
  getDriver
};
