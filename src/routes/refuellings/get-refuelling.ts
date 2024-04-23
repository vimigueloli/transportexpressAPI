import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getRefuelling(app: FastifyInstance) {
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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {

        const params:any = request.params
        const {refuellingId} = params

        const refuelling = await prisma.refuelling.findUnique({
            where:{
                id: refuellingId
            },
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

