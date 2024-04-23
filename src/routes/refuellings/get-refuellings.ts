import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getRefuellings(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/refuellings', {
      schema: {
        summary: 'Lista os abastecimentos',
        tags: ['abastecimento'],
        response: {
          200: z.object({
            refuellings: z.array(z.object({
              liters: z.number(),
              cost: z.number(),
              date: z.date(),
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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {
      const refuellings:any = await prisma.refuelling.findMany({
        select:{
          id:true,
          liters: true,
          cost:true,
          date: true,
          driver:{
            select:{
              id:true,
              name:true
            }
          },
          truck:{
            select:{
              id:true,
              plate: true
            }
          }
        }
      })
      return reply.status(201).send({refuellings:refuellings})
    })
}

