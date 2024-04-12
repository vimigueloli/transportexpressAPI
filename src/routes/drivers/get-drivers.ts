import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getDrivers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/drivers', {
      schema: {
        summary: 'Lista os motoristas',
        tags: ['motoristas'],
        response: {
          200: z.object({
            drivers: z.array(z.object({
                name:z.string(),
                cpf: z.string(),
                id: z.number()
            })),
          })
        },
      },
    }, async (request, reply) => {


        const drivers:any = await prisma.driver.findMany()

      return reply.status(201).send({drivers:drivers})
    })
}

