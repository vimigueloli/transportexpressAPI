import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/maintenances/post-maintenance.ts
import { z } from "zod";
async function createMaintenance(app) {
  app.withTypeProvider().post("/maintenances", {
    schema: {
      summary: "Registra uma manuten\xE7\xE3o",
      tags: ["manuten\xE7\xE3o"],
      body: z.object({
        commission: z.number(),
        cost: z.number(),
        obs: z.string(),
        driver_id: z.number(),
        truck_id: z.number(),
        date: z.date()
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
    const { commission, cost, obs, driver_id, truck_id, date } = body;
    if (obs.length < 6 || !cost || isNaN(cost) || !commission || isNaN(commission) || !date) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    const maintenance = await prisma.maintenance.create({
      data: {
        commission,
        cost,
        obs,
        driverId: driver_id,
        truckId: truck_id,
        date
      }
    });
    return reply.status(201).send({ maintenanceId: maintenance.id });
  });
}

export {
  createMaintenance
};
