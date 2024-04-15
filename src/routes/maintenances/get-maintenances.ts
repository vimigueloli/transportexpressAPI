import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getMaintenances(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/maintenances', {
      schema: {
        summary: 'Lista as manutenções',
        tags: ['manutenção'],
        response: {
          200: z.object({
            maintenances: z.array(z.object({
              commission: z.number(),
              cost: z.number(),
              obs: z.string(),
              driver: z.object({
                name: z.string(),
                id: z.number()
              }),
              truck:z.object({
                plate: z.string(),
                id: z.number()
              }),
              id: z.number()
            })),
          })
        },
      },
    }, async (request, reply) => {
      const maintenances:any = await prisma.maintenance.findMany()
      return reply.status(201).send({maintenances:maintenances})
    })
}

