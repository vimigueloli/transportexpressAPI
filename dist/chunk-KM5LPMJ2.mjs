import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/refuellings/edit-refuelling.ts
import { z } from "zod";
async function editRefuelling(app) {
  app.withTypeProvider().put("/refuellings/:refuellingId", {
    schema: {
      summary: "Edita um abstecimento",
      tags: ["abastecimento"],
      params: z.object({
        refuellingId: z.coerce.number()
      }),
      body: z.object({
        liters: z.number(),
        cost: z.number(),
        date: z.string().datetime()
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
    const body = request.body;
    const { liters, cost, date } = body;
    console.log("dados ->", {
      liters,
      cost,
      date
    });
    if (isNaN(liters) || isNaN(cost) || !date) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    await prisma.refuelling.update({
      where: {
        id: refuellingId
      },
      data: {
        liters,
        cost,
        date: new Date(date)
      }
    });
    return reply.status(200).send({ message: "abastecimento editado com sucesso!" });
  });
}

export {
  editRefuelling
};
