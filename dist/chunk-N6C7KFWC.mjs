import {
  authChecker
} from "./chunk-7T33RQXO.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/drivers/edit-driver.ts
import { z } from "zod";
async function editDriver(app) {
  app.withTypeProvider().put("/drivers/:driverId", {
    schema: {
      summary: "Edita um motorista",
      tags: ["motorista"],
      params: z.object({
        driverId: z.coerce.number()
      }),
      body: z.object({
        name: z.string(),
        cpf: z.string().optional()
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
    const driverId = params.driverId;
    if (isNaN(driverId)) {
      reply.status(406);
      throw new Error("O ID do motorista precisa ser um n\xFAmero");
    }
    const driver = prisma.driver.findUnique({
      where: {
        id: driverId
      }
    });
    if (!driver) {
      reply.status(404);
      throw new Error("Motorista n\xE3o localizado");
    }
    const body = request.body;
    const { name, cpf } = body;
    if (!name || name.lenght < 3) {
      reply.status(406);
      throw new Error("O nome deve ter no minimo 3 caracteres");
    }
    if (cpf ? cpf.length < 14 : false) {
      reply.status(406);
      throw new Error("O CPF deve conter no minimo 14 caracteres");
    }
    await prisma.driver.update({
      where: {
        id: driverId
      },
      data: {
        name,
        cpf
      }
    });
    return reply.status(200).send({ message: "Motorista editado com sucesso!" });
  });
}

export {
  editDriver
};
