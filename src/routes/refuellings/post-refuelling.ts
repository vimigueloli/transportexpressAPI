import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createPath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/refuellings', {
      schema: {
        summary: 'Registra um abastecimento',
        tags: ['abastecimento'],
        body: z.object({
              liters: z.number(),
              cost: z.number(),
              date: z.date(),
              driver_id: z.number(),
              truck_id: z.number(),
            }),
        response: {
          201: z.object({
            refuellingId: z.number(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        liters,
        cost,
        date,
        driver_id,
        truck_id,
      } = request.body

      const refuelling = await prisma.refuelling.create({
        data: {
          liters,
          cost,
          date,
          driverId: driver_id,
          truckId: truck_id
        },
      })

      return reply.status(201).send({ refuellingId: refuelling.id })
    })
}

