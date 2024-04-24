import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"
import monthIntervalCalculator from "../../helpers/monthIntervalCalculator"

export async function getMaintenances(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/maintenances', {
      schema: {
        summary: 'Lista as manutenções',
        tags: ['manutenção'],
        querystring: z.object({
          month: z.number().nullish(),
          year: z.number().nullish(),
          page: z.number().nullish()
        }),
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

      const {month, year, page}:any = request.query

      const {start, end } = monthIntervalCalculator(month,year)

      const maintenances:any = await prisma.maintenance.findMany({
        orderBy:[
          {
            date: 'desc'
          }
        ],
        where:(!month && !year)?undefined:{
          date:{
            lte: end,
            gte: start
          }
        }, 
        take: page? 10 : undefined,
        skip: page? 10*page : undefined,
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

