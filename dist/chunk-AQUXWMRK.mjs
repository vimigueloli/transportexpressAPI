import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/travels/get-travel.ts
import { z } from "zod";
async function getTravel(app) {
  app.withTypeProvider().get("/travels/:travelId", {
    schema: {
      summary: "Exibe um transporte",
      tags: ["transporte"],
      params: z.object({
        travelId: z.coerce.number()
      }),
      response: {
        200: z.object({
          id: z.number(),
          urban: z.boolean(),
          number: z.string(),
          date: z.date(),
          prize: z.number(),
          commission: z.number(),
          client: z.string(),
          toll_prize: z.number(),
          driver: z.object({
            name: z.string(),
            id: z.number()
          }),
          truck: z.object({
            plate: z.string(),
            id: z.number()
          })
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const params = request.params;
    const { travelId } = params;
    if (isNaN(travelId)) {
      reply.status(406);
      throw new Error("O ID da viagem deve ser um n\xFAmero");
    }
    const travel = await prisma.travel.findUnique({
      where: {
        id: travelId
      },
      select: {
        id: true,
        commission: true,
        urban: true,
        number: true,
        date: true,
        prize: true,
        client: true,
        tollPrize: true,
        truck: { select: {
          plate: true,
          id: true
        } },
        driver: { select: {
          name: true,
          id: true
        } }
      }
    });
    if (!travel) {
      throw new Error("Manuten\xE7\xE3o n\xE3o localizada");
    } else {
      return reply.status(200).send({
        id: travel.id,
        commission: Number(travel.commission),
        urban: travel.urban,
        number: travel.number,
        date: travel.date,
        prize: Number(travel.prize),
        client: travel.client || "",
        toll_prize: Number(travel.tollPrize),
        truck: travel.truck,
        driver: travel.driver
      });
    }
  });
}

export {
  getTravel
};
