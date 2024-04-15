import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getTravels(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/travels', {
      schema: {
        summary: 'Lista os transportes',
        tags: ['transporte'],
        response: {
          200: z.object({
            travels: z.array(z.object({
              id: z.number(),
              urban: z.boolean(),
              number: z.string(),
              date: z.date(),
              prize: z.number(),
              commission: z.number(),
              client: z.string(),
              toll_prize: z.number(),
              driver: z.object({
                name: z.string(),
                id: z.number()
              }),
              truck:z.object({
                plate: z.string(),
                id: z.number()
              }),
            })),
          })
        },
      },
    }, async (request, reply) => {
      const travels:any = await prisma.travel.findMany()
      return reply.status(201).send({travels:travels})
    })
}

