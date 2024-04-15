import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createTravel(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/maintenances', {
      schema: {
        summary: 'Registra uma manutenção',
        tags: ['manutenção'],
        body: z.object({
            urban: z.boolean(),
            number: z.string(),
            date: z.date(),
            prize: z.number(),
            commission: z.number(),
            client: z.string(),
            toll_prize: z.number(),
            driver_id: z.number(),
            truck_plate: z.string(),
          }),
        response: {
          201: z.object({
            maintenanceId: z.number(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        urban,
        number,
        date,
        prize,
        commission,
        client,
        toll_prize,
        driver_id,
        truck_plate,
      } = request.body

      const maintenance = await prisma.travel.create({
        data: {
          urban,
          number,
          date,
          prize,
          commission,
          client,
          tollPrize: toll_prize,
          driverId: driver_id,
          truckPlate: truck_plate,
        },
      })

      return reply.status(201).send({ maintenanceId: maintenance.id })
    })
}

