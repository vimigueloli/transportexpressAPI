import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/refuellings/get-refuelling.ts
import { z } from "zod";
async function getRefuelling(app) {
  app.withTypeProvider().get("/refuellings/:refuellingId", {
    schema: {
      summary: "Exibe um abastecimento",
      tags: ["abastecimento"],
      params: z.object({
        refuellingId: z.coerce.number()
      }),
      response: {
        200: z.object({
          liters: z.number(),
          cost: z.number(),
          date: z.date(),
          driver: z.object({
            name: z.string(),
            id: z.number()
          }),
          truck: z.object({
            plate: z.string(),
            id: z.number()
          }),
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
    const { refuellingId } = params;
    if (isNaN(refuellingId)) {
      reply.status(406);
      throw new Error("O ID do abastecimento deve ser um n\xFAmero");
    }
    const refuelling = await prisma.refuelling.findUnique({
      where: {
        id: refuellingId
      },
      select: {
        id: true,
        liters: true,
        cost: true,
        date: true,
        driver: {
          select: {
            id: true,
            name: true
          }
        },
        truck: {
          select: {
            id: true,
            plate: true
          }
        }
      }
    });
    if (!refuelling) {
      throw new Error("Abastecimento n\xE3o localizado");
    } else {
      return reply.status(200).send({
        id: refuelling.id,
        liters: Number(refuelling.liters),
        cost: Number(refuelling.cost),
        date: refuelling.date,
        truck: {
          plate: "",
          id: 0
        },
        driver: {
          name: "",
          id: 0
        }
      });
    }
  });
}

export {
  getRefuelling
};
