import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trucks/get-trucks.ts
import { z } from "zod";
async function getTrucks(app) {
  app.withTypeProvider().get("/trucks", {
    schema: {
      summary: "Lista os caminh\xF5es",
      tags: ["caminh\xE3o"],
      response: {
        200: z.object({
          trucks: z.array(z.object({
            plate: z.string(),
            renavan: z.string(),
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
    const trucks = await prisma.truck.findMany();
    return reply.status(200).send({ trucks });
  });
}

export {
  getTrucks
};
