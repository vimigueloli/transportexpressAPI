import {
  monthIntervalCalculator
} from "./chunk-EWYDLNHP.mjs";
import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/travels/get-travels.ts
import { z } from "zod";
async function getTravels(app) {
  app.withTypeProvider().get("/travels", {
    schema: {
      summary: "Lista os transportes",
      tags: ["transporte"],
      querystring: z.object({
        page: z.number().nullish(),
        month: z.number().nullish(),
        year: z.number().nullish()
      }),
      response: {
        200: z.object({
          travels: z.array(z.object({
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
          }))
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const { page, month, year } = request.query;
    const { start, end } = monthIntervalCalculator(month, year);
    const travels = await prisma.travel.findMany({
      orderBy: [
        {
          date: "desc"
        }
      ],
      where: !month && !year ? void 0 : {
        date: {
          lte: end,
          gte: start
        }
      },
      take: page ? 10 : void 0,
      skip: page ? 10 * page : void 0,
      select: {
        id: true,
        urban: true,
        number: true,
        date: true,
        prize: true,
        commission: true,
        client: true,
        tollPrize: true,
        driver: { select: {
          name: true,
          id: true
        } },
        truck: {
          select: {
            plate: true,
            id: true
          }
        }
      }
    });
    return reply.status(201).send({ travels: travels.map((item) => ({ ...item, tollPrize: void 0, toll_prize: item.tollPrize })) });
  });
}

export {
  getTravels
};
