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
        number: z.string(),
        date: z.date(),
        prize: z.number(),
        commission: z.number(),
        client: z.string(),
        toll_prize: z.number(),
        driver_id: z.number(),
        truck_plate: z.string()
      }),
      response: {
        201: z.object({
          maintenanceId: z.number()
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
    if (!number || !date || isNaN(prize) || isNaN(commission) || !client || isNaN(toll_prize)) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    const maintenance = await prisma.travel.create({
      data: {
        urban,
        number,
        date,
        prize,
        commission,
        client,
        tollPrize: toll_prize,
        driverId: driver_id,
        truckPlate: truck_plate
      }
    });
    return reply.status(201).send({ maintenanceId: maintenance.id });
  });
}

export {
  createTravel
};
