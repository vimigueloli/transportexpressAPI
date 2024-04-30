import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/maintenances/get-maintenance.ts
import { z } from "zod";
async function getMaintenance(app) {
  app.withTypeProvider().get("/maintenances/:maintenanceId", {
    schema: {
      summary: "Exibe uma manuten\xE7\xE3o",
      tags: ["manuten\xE7\xE3o"],
      params: z.object({
        maintenanceId: z.coerce.number()
      }),
      response: {
        200: z.object({
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
    const maintenance = await prisma.maintenance.findUnique({
      where: {
        id: maintenanceId
      },
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
    if (!maintenance) {
      reply.status(404);
      throw new Error("Manuten\xE7\xE3o n\xE3o localizada");
    } else {
      return reply.status(200).send({
        id: maintenance.id,
        commission: Number(maintenance.commission),
        cost: Number(maintenance.cost),
        obs: maintenance.obs,
        truck: {
          plate: "",
          id: 0
        },
        driver: {
          name: "",
          id: 0
        }
      });
    }
  });
}

export {
  getMaintenance
};
