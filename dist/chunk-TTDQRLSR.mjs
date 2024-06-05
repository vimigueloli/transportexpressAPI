import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/travels/post-travel.ts
import { z } from "zod";
async function createTravel(app) {
  app.withTypeProvider().post("/travels", {
    schema: {
      summary: "Registra um transporte",
      tags: ["transporte"],
      body: z.object({
        urban: z.boolean(),
        number: z.string().optional(),
        date: z.string().datetime(),
        prize: z.number(),
        commission: z.number(),
        client: z.string(),
        toll_prize: z.number().optional(),
        driver_id: z.number(),
        truck_plate: z.string()
      }),
      response: {
        201: z.object({
          travelId: z.number()
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const body = request.body;
    const {
      urban,
      number,
      date,
      prize,
      commission,
      client,
      toll_prize,
      driver_id,
      truck_plate
    } = body;
    if (!date || isNaN(prize) || isNaN(commission) || !client) {
      reply.status(406);
      console.log("falha");
      throw new Error("Envie os campos corretamente");
    }
    console.log({
      urban,
      number,
      date: new Date(date),
      prize,
      commission,
      client,
      tollPrize: toll_prize,
      driverId: driver_id,
      truckPlate: truck_plate
    });
    let travel;
    try {
      travel = await prisma.travel.create({
        data: {
          urban,
          number,
          date: new Date(date),
          prize,
          commission,
          client,
          tollPrize: toll_prize,
          driverId: driver_id,
          truckPlate: truck_plate
        }
      });
    } catch (e) {
      console.log("Erro ->", e);
    }
    return reply.status(201).send({ travelId: travel?.id });
  });
}

export {
  createTravel
};
