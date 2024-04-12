import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getPaths(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/paths', {
      schema: {
        summary: 'Lista os trechos',
        tags: ['trecho'],
        response: {
          200: z.object({
            paths: z.array(z.object({
                origin: z.string(),
                destination: z.string(),
                suggested_price: z.any(),
                id: z.number()
            })),
          })
        },
      },
    }, async (request, reply) => {

      const paths:any = await prisma.route.findMany()
      return reply.status(201).send({paths:paths})
    })
}

