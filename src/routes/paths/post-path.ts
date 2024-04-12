import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createPath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/paths', {
      schema: {
        summary: 'Registra um trecho',
        tags: ['trecho'],
        body: z.object({
          origin: z.string(),
          destination: z.string(),
          suggested_price: z.number()
        }),
        response: {
          201: z.object({
            pathId: z.number(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        origin,
        destination,
        suggested_price
      } = request.body

      const path = await prisma.route.create({
        data: {
          origin,
          destination,
          suggestedPrice:suggested_price
        },
      })

      return reply.status(201).send({ pathId: path.id })
    })
}

