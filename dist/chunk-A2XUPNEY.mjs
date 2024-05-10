import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/refuellings/post-refuelling.ts
import { z } from "zod";
async function createRefuelling(app) {
  app.withTypeProvider().post("/refuellings", {
    schema: {
      summary: "Registra um abastecimento",
      tags: ["abastecimento"],
      body: z.object({
        liters: z.number(),
        cost: z.number(),
        date: z.string().datetime(),
        driver_id: z.number(),
        truck_id: z.number()
      }),
      response: {
        201: z.object({
          refuellingId: z.number()
        })
      },
      headers: z.object({
        authorization: z.string()
      })
    },
    preHandler: [authChecker]
  }, async (request, reply) => {
    const body = request.body;
    const { liters, cost, date, driver_id, truck_id } = body;
    if (isNaN(liters) || isNaN(cost) || !date || isNaN(truck_id) || isNaN(driver_id)) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    const refuelling = await prisma.refuelling.create({
      data: {
        liters,
        cost,
        date: new Date(date),
        driverId: driver_id,
        truckId: truck_id
      }
    });
    return reply.status(201).send({ refuellingId: refuelling.id });
  });
}

export {
  createRefuelling
};
