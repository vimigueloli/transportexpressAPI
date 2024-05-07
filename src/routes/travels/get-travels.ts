import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"
import monthIntervalCalculator from "../../helpers/monthIntervalCalculator"

export async function getTravels(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/drivers-travels/:driverId', {
      schema: {
        summary: 'Lista os transportes',
        tags: ['transporte'],
        params: z.object({
           driverId: z.coerce.number() 
        }),
        querystring: z.object({
          page: z.number().nullish(),
          month: z.string().nullish(),
          year: z.string().nullish()
        }),
        response: {
          200: z.object({
            travels: z.array(z.any()),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler:[authChecker]
    }, async (request, reply) => {
      const {page, month, year}:any = request.query
      const {driverId}:any = request.params
      
      const {start, end} = monthIntervalCalculator(Number(month),Number(year))

      const travels = await prisma.travel.findMany({
        orderBy:[
          {
            date: 'asc'
          }
        ],
        where:{
          date:(!month && !year)?undefined:{
            lte: end,
            gte: start
          },
          driverId: driverId
        }, 
        take: page? 10 : undefined,
        skip: page? 10*page : undefined,
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

      const refuellings = await prisma.refuelling.findMany({
        orderBy:[
          {
            date: 'asc'
          }
        ],
        where:{
          date:(!month && !year)?undefined:{
            lte: end,
            gte: start
          },
          driverId: driverId
        }, 
        select:{
          id: true,
          liters: true,
          date: true,
          cost: true,
          driver:{
            select:{
              name: true, 
              id: true
            }
          },
          truck:{
            select:{
              plate: true,
              id: true
            }
          }
        }
      })

      const maintenances = await prisma.maintenance.findMany({
        orderBy:[
          {
            date: 'asc'
          }
        ],
        where:{
          date:(!month && !year)?undefined:{
            lte: end,
            gte: start
          },
          driverId: driverId
        }, 
        select:{
          id: true,
          date: true,
          cost: true,
          obs: true,
          commission: true,
          driver:{
            select:{
              name: true, 
              id: true
            }
          },
          truck:{
            select:{
              plate: true,
              id: true
            }
          }
        }
      })

      const output =  [
        ...travels.map((item:any)=>({...item, tollPrize: undefined, toll_prize:item.tollPrize})),
        ...refuellings,
        ...maintenances
      ]

      

      return reply.status(201).send({travels: output.sort((a, b) => a.date - b.date)})
    })
}

