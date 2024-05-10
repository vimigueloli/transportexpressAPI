import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/maintenances/edit-maintenance.ts
import { z } from "zod";
async function editMaintenance(app) {
  app.withTypeProvider().put("/maintenances/:maintenanceId", {
    schema: {
      summary: "Edita uma manute\xE7\xE3o",
      tags: ["manuten\xE7\xE3o"],
      params: z.object({
        maintenanceId: z.coerce.number()
      }),
      body: z.object({
        obs: z.string(),
        cost: z.number(),
        commission: z.number(),
        date: z.string().datetime()
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
    const { maintenanceId } = params;
    if (isNaN(maintenanceId)) {
      reply.status(406);
      throw new Error("O ID da manuten\xE7\xE3o deve ser um n\xFAmero");
    }
    const maintanance = await prisma.maintenance.findUnique({
      where: {
        id: maintenanceId
      }
    });
    if (!maintanance) {
      reply.status(404);
      throw new Error("Manuten\xE7\xE3o n\xE3o localizada");
    }
    const body = request.body;
    const { obs, cost, commission, date } = body;
    if (obs.length < 6 || !cost || isNaN(cost) || !commission || isNaN(commission) || !date) {
      reply.status(406);
      throw new Error("Envie os campos corretamente");
    }
    await prisma.maintenance.update({
      where: {
        id: maintenanceId
      },
      data: {
        obs,
        cost,
        commission,
        date: new Date(date)
      }
    });
    return reply.status(200).send({ message: "Manute\xE7\xE3o editada com sucesso!" });
  });
}

export {
  editMaintenance
};
