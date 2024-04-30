import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/maintenances/delete-maintenance.ts
import { z } from "zod";
async function deleteMaintenance(app) {
  app.withTypeProvider().delete("/maintenances/:maintenanceId", {
    schema: {
      summary: "Deleta uma manuten\xE7\xE3o",
      tags: ["manuten\xE7\xE3o"],
      params: z.object({
        maintenanceId: z.coerce.number()
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
    await prisma.maintenance.delete({
      where: {
        id: maintenanceId
      }
    });
    return reply.status(200).send({ message: "manuten\xE7\xE3o deletada com sucesso!" });
  });
}

export {
  deleteMaintenance
};
