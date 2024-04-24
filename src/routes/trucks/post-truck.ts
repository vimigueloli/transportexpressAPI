import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {
      const body:any = request.body
      const {
        plate,
        renavan,
      } = body

      if(plate.length < 8){
        reply.status(406)
        throw new Error("A placa do caminhão deve conter 8caracteres contando com o caracter especial")
      }

      const truck = await prisma.truck.create({
        data: {
          plate,
          renavan
        },
      })

      return reply.status(201).send({ truckId: truck.id })
    })
}

