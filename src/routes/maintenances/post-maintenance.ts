import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

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
          }),
        response: {
          201: z.object({
            maintenanceId: z.number(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        commission,
        cost,
        obs,
        driver_id,
        truck_id,
      } = request.body

      const maintenance = await prisma.maintenance.create({
        data: {
          commission,
          cost,
          obs,
          driverId: driver_id,
          truckId: truck_id
        },
      })

      return reply.status(201).send({ maintenanceId: maintenance.id })
    })
}

