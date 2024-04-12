import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createTruck(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/trucks', {
      schema: {
        summary: 'Registra um caminhão',
        tags: ['caminhão'],
        body: z.object({
          plate: z.string(),
          renavan: z.string().optional(),
        }),
        response: {
          201: z.object({
            truckId: z.number(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        plate,
        renavan,
      } = request.body

      const truck = await prisma.truck.create({
        data: {
          plate,
          renavan
        },
      })

      return reply.status(201).send({ truckId: truck.id })
    })
}

