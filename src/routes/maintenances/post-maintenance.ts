import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function createMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/maintenances', {
      schema: {
        summary: 'Registra uma manutenção',
        tags: ['manutenção'],
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
            maintenanceId: z.number(),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [ authChecker]
    }, async (request, reply) => {
      const body:any = request.body

      const {commission, cost, obs, driver_id, truck_id, date} = body

      const maintenance = await prisma.maintenance.create({
        data: {
          commission,
          cost,
          obs,
          driverId: driver_id,
          truckId: truck_id,
          date: date
        },
      })

      return reply.status(201).send({ maintenanceId: maintenance.id })
    })
}

