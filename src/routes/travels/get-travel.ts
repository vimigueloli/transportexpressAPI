import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getTravel(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/travels/:travelId', {
      schema: {
        summary: 'Exibe uma manutenção',
        tags: ['manutenção'],
        params: z.object({
           travelId: z.coerce.number() 
        }),
        response: {
          200: z.object({
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
          })
        },
      },
    }, async (request, reply) => {

        const {travelId} = request.params

        const travel = await prisma.travel.findUnique({
            where:{
                id: travelId
            }
        })

        if(travel=== null || travel === undefined){
          throw new Error("Manutenção não localizada")
        } else{
          return reply.status(200).send({
            id: travel.id,
            commission: Number(travel.commission),
            urban: travel.urban,
            number: travel.number,
            date: travel.date,
            prize: Number(travel.prize),
            client: travel.client || '',
            toll_prize: Number(travel.tollPrize),
            truck:{
              plate: '',
              id: 0
            },
            driver:{
              name: '',
              id: 0
            }
          })
        }

    })
}

