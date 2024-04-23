import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function createDriver(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/drivers', {
      schema: {
        summary: 'Registra um motorista',
        tags: ['motorista'],
        body: z.object({
          name: z.string(),
          cpf: z.string().optional(),
        }),
        response: {
          201: z.object({
            eventId: z.number(),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [ authChecker]
    }, async (request, reply) => {
      const body:any = request.body

      const {name,cpf}= body

      const driver = await prisma.driver.create({
        data: {
          name,
          cpf
        },
      })

      return reply.status(201).send({ eventId: driver.id })
    })
}

