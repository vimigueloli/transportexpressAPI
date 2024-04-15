import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function deleteMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Deleta uma manutenção',
        tags: ['manutenção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {maintenanceId} = request.params

        await prisma.maintenance.delete({
            where:{
                id:maintenanceId
            }
        })

      return reply.status(200).send({ message: 'manutenção deletada com sucesso!' })
    })
}

