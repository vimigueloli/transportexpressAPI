import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trucks/get-truck.ts
import { z } from "zod";
async function getTruck(app) {
  app.withTypeProvider().get("/trucks/:truckId", {
    schema: {
      summary: "Exibe um caminh\xE3o",
      tags: ["caminh\xE3o"],
      params: z.object({
        truckId: z.coerce.number()
      }),
      response: {
        200: z.object({
          plate: z.string(),
          renavan: z.string(),
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
    const { truckId } = params;
    if (isNaN(truckId)) {
      reply.status(406);
      throw new Error("O ID do camin\xE3o deve ser um n\xFAmero");
    }
    const truck = await prisma.truck.findUnique({
      where: {
        id: truckId
      }
    });
    if (!truck) {
      throw new Error("Caminh\xE3o n\xE3o localizado");
    } else {
      return reply.status(200).send({
        plate: truck.plate,
        renavan: truck.renavan || "",
        id: truck.id
      });
    }
  });
}

export {
  getTruck
};
