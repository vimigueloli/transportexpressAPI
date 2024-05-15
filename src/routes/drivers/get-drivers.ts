import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getDrivers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/drivers', {
      schema: {
        summary: 'Lista os motoristas',
        tags: ['motorista'],
        response: {
          200: z.object({
            drivers: z.array(z.object({
                name:z.string(),
                cpf: z.string(),
                id: z.number()
            })),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [ authChecker]
    }, async (request, reply) => {

      const drivers:any = await prisma.driver.findMany({
        orderBy:[
          {
            id: 'desc'
          }
        ]
      })
      return reply.status(201).send({drivers:drivers})

    })
}

