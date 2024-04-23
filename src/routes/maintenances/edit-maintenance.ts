import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Edita uma manuteção',
        tags: ['manutenção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
        }),
        body: z.object({
          obs: z.string(),
          cost: z.number(),
          commission: z.number(),
          date: z.date()
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {

        const params:any = request.params
        const {maintenanceId} = params
        const body:any = request.body
        const {obs , cost, commission, date} = body

        await prisma.maintenance.update({
          where:{
            id: maintenanceId
          },
          data:{
            obs: obs,
            cost: cost,
            commission: commission,
            date: date
          }
        })

      return reply.status(200).send({ message: 'manuteção editada com sucesso!' })
    })
}

