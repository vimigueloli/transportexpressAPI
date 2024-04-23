import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getTrucks(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/trucks', {
      schema: {
        summary: 'Lista os caminhões',
        tags: ['caminhão'],
        response: {
          200: z.object({
            trucks: z.array(z.object({
                plate:z.string(),
                renavan: z.string(),
                id: z.number()
            })),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {


        const trucks:any = await prisma.truck.findMany()

      return reply.status(200).send({trucks:trucks})
    })
}

