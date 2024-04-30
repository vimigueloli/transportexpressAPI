import {
  monthIntervalCalculator
} from "./chunk-EWYDLNHP.mjs";
import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/maintenances/get-maintenances.ts
import { z } from "zod";
async function getMaintenances(app) {
  app.withTypeProvider().get("/maintenances", {
    schema: {
      summary: "Lista as manuten\xE7\xF5es",
      tags: ["manuten\xE7\xE3o"],
      querystring: z.object({
        month: z.number().nullish(),
        year: z.number().nullish(),
        page: z.number().nullish()
      }),
      response: {
        200: z.object({
          maintenances: z.array(z.object({
            commission: z.number(),
            cost: z.number(),
            obs: z.string(),
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
    const { month, year, page } = request.query;
    const { start, end } = monthIntervalCalculator(month, year);
    const maintenances = await prisma.maintenance.findMany({
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
        commission: true,
        cost: true,
        obs: true,
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
    return reply.status(201).send({ maintenances });
  });
}

export {
  getMaintenances
};
