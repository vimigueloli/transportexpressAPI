import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"
import monthIntervalCalculator from "../../helpers/monthIntervalCalculator"

export async function getRefuellings(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/refuellings', {
      schema: {
        summary: 'Lista os abastecimentos',
        tags: ['abastecimento'],
        querystring: z.object({
          month: z.number().nullish(),
          year: z.number().nullish(),
          page: z.number().nullish()
        }),
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

      const {year, month, page}:any = request.query

      const {start,end} = monthIntervalCalculator(month,year)

      const refuellings:any = await prisma.refuelling.findMany({
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

