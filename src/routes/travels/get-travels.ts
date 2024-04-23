import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler:[authChecker]
    }, async (request, reply) => {
      const travels = await prisma.travel.findMany({
        select:{
          id:true,
          urban: true,
          number: true,
          date: true,
          prize: true,
          commission: true,
          client: true,
          tollPrize: true,
          driver:{select: {
            name: true,
            id:true
          }},
          truck:{
            select:{
              plate:true,
              id: true,
            }
          }
        }
      })
      return reply.status(201).send({travels:travels.map((item:any)=>({...item, tollPrize: undefined, toll_prize:item.tollPrize}))})
    })
}
