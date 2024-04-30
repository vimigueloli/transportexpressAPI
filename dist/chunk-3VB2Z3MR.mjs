import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trucks/edit-trucks.ts
import { z } from "zod";
async function editTruck(app) {
  app.withTypeProvider().put("/trucks/:truckId", {
    schema: {
      summary: "Edita um caminh\xE3o",
      tags: ["caminh\xE3o"],
      params: z.object({
        truckId: z.coerce.number()
      }),
      body: z.object({
        plate: z.string(),
        renavan: z.string().optional()
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
    const body = request.body;
    const { plate, renavan } = body;
    if (plate.length < 8) {
      reply.status(406);
      throw new Error("A placa do caminh\xE3o deve conter 8caracteres contando com o caracter especial");
    }
    await prisma.truck.update({
      where: {
        id: truckId
      },
      data: {
        plate,
        renavan
      }
    });
    return reply.status(200).send({ message: "Caminh\xE3o editado com sucesso!" });
  });
}

export {
  editTruck
};
