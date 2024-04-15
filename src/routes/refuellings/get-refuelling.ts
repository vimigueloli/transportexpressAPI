import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getPath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/refuellings/:refuellingId', {
      schema: {
        summary: 'Exibe um abastecimento',
        tags: ['abastecimento'],
        params: z.object({
           refuellingId: z.coerce.number() 
        }),
        response: {
          200: z.object({
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
          })
        },
      },
    }, async (request, reply) => {

        const {refuellingId} = request.params

        const refuelling = await prisma.refuelling.findUnique({
            where:{
                id: refuellingId
            }
        })

        if(refuelling=== null || refuelling === undefined){
          throw new Error("Abastecimento não localizado")
        } else{
          return reply.status(200).send({
            id: refuelling.id,
            liters: Number(refuelling.liters),
            cost: Number(refuelling.cost),
            date: refuelling.date,
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

