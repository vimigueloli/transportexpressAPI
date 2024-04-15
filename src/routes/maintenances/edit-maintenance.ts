import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function editMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Edita uma manuteção',
        tags: ['manuteção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
        }),
        body: z.object({
          obs: z.string(),
          cost: z.number(),
          commission: z.number(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {maintenanceId} = request.params
        const {obs, cost, commission} = request.body

        await prisma.maintenance.update({
          where:{
            id: maintenanceId
          },
          data:{
            obs: obs,
            cost: cost,
            commission: commission,
          }
        })

      return reply.status(200).send({ message: 'manuteção editada com sucesso!' })
    })
}

