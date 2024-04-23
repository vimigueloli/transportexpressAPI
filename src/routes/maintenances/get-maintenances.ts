import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {
      const maintenances:any = await prisma.maintenance.findMany({
        select:{
          id:true,
          commission:true,
          cost:true,
          obs: true,
          date:true,
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
      return reply.status(201).send({maintenances:maintenances})
    })
}

