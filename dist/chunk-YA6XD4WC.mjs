import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/travels/edit-travel.ts
import { z } from "zod";
async function editTravel(app) {
  app.withTypeProvider().put("/travels/:travelId", {
    schema: {
      summary: "Edita um transporte",
      tags: ["transporte"],
      params: z.object({
        travelId: z.coerce.number()
      }),
      body: z.object({
        urban: z.boolean(),
        number: z.string(),
        date: z.date(),
        prize: z.number(),
        commission: z.number(),
        client: z.string(),
        toll_prize: z.number()
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
    const travelId = params.travelId;
    if (isNaN(travelId)) {
      reply.status(406);
      throw new Error("O ID da viagem deve ser um n\xFAmero");
    }
    const travel = await prisma.travel.findUnique({
      where: {
        id: travelId
      }
    });
    if (!travel) {
      reply.status(404);
      throw new Error("Viagem n\xE3o localizada");
    }
    const body = request.body;
    const { urban, number: number2, date, prize, commission, client, toll_prize } = body;
    if (!number2 || !date || isNaN(prize) || isNaN(commission) || !client || isNaN(toll_prize)) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    await prisma.travel.update({
      where: {
        id: travelId
      },
      data: {
        urban: urban ? true : false,
        number: number2,
        date,
        prize,
        commission,
        client,
        tollPrize: toll_prize
      }
    });
    return reply.status(200).send({ message: "Transporte editado com sucesso!" });
  });
}

export {
  editTravel
};
