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
  app.withTypeProvider().get("/drivers-travels/:driverId", {
    schema: {
      summary: "Lista os transportes",
      tags: ["transporte"],
      params: z.object({
        driverId: z.coerce.number()
      }),
      querystring: z.object({
        page: z.number().nullish(),
        month: z.string().nullish(),
        year: z.string().nullish()
      }),
      response: {
        200: z.object({
          travels: z.array(z.any())
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const { page, month, year } = request.query;
    const { driverId } = request.params;
    const { start, end } = monthIntervalCalculator(Number(month), Number(year));
    const travels = await prisma.travel.findMany({
      orderBy: [
        {
          date: "asc"
        }
      ],
      where: {
        date: !month && !year ? void 0 : {
          lte: end,
          gte: start
        },
        driverId
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
    const refuellings = await prisma.refuelling.findMany({
      orderBy: [
        {
          date: "asc"
        }
      ],
      where: {
        date: !month && !year ? void 0 : {
          lte: end,
          gte: start
        },
        driverId
      },
      select: {
        id: true,
        liters: true,
        date: true,
        cost: true,
        driver: {
          select: {
            name: true,
            id: true
          }
        },
        truck: {
          select: {
            plate: true,
            id: true
          }
        }
      }
    });
    const maintenances = await prisma.maintenance.findMany({
      orderBy: [
        {
          date: "asc"
        }
      ],
      where: {
        date: !month && !year ? void 0 : {
          lte: end,
          gte: start
        },
        driverId
      },
      select: {
        id: true,
        date: true,
        cost: true,
        obs: true,
        commission: true,
        driver: {
          select: {
            name: true,
            id: true
          }
        },
        truck: {
          select: {
            plate: true,
            id: true
          }
        }
      }
    });
    const output = [
      ...travels.map((item) => ({ ...item, tollPrize: void 0, toll_prize: item.tollPrize })),
      ...refuellings,
      ...maintenances
    ];
    return reply.status(201).send({ travels: output.sort((a, b) => a.date - b.date) });
  });
}

export {
  getTravels
};
