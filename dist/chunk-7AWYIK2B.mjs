import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trucks/post-truck.ts
import { z } from "zod";
async function createTruck(app) {
  app.withTypeProvider().post("/trucks", {
    schema: {
      summary: "Registra um caminh\xE3o",
      tags: ["caminh\xE3o"],
      body: z.object({
        plate: z.string(),
        renavan: z.string().optional()
      }),
      response: {
        201: z.object({
          truckId: z.number()
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const body = request.body;
    const {
      plate,
      renavan
    } = body;
    if (plate.length < 8) {
      reply.status(406);
      throw new Error("A placa do caminh\xE3o deve conter 8caracteres contando com o caracter especial");
    }
    const truck = await prisma.truck.create({
      data: {
        plate,
        renavan
      }
    });
    return reply.status(201).send({ truckId: truck.id });
  });
}

export {
  createTruck
};
