import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/drivers/get-drivers.ts
import { z } from "zod";
async function getDrivers(app) {
  app.withTypeProvider().get("/drivers", {
    schema: {
      summary: "Lista os motoristas",
      tags: ["motorista"],
      response: {
        200: z.object({
          drivers: z.array(z.object({
            name: z.string(),
            cpf: z.string(),
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
    const drivers = await prisma.driver.findMany();
    return reply.status(201).send({ drivers });
  });
}

export {
  getDrivers
};
