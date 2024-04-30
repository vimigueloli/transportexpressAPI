import {
  monthIntervalCalculator
} from "./chunk-EWYDLNHP.mjs";
import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/refuellings/get-refuellings.ts
import { z } from "zod";
async function getRefuellings(app) {
  app.withTypeProvider().get("/refuellings", {
    schema: {
      summary: "Lista os abastecimentos",
      tags: ["abastecimento"],
      querystring: z.object({
        month: z.number().nullish(),
        year: z.number().nullish(),
        page: z.number().nullish()
      }),
      response: {
        200: z.object({
          refuellings: z.array(z.object({
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
          }))
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const { year, month, page } = request.query;
    const { start, end } = monthIntervalCalculator(month, year);
    const refuellings = await prisma.refuelling.findMany({
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
    return reply.status(201).send({ refuellings });
  });
}

export {
  getRefuellings
};
