import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editRefuelling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/refuellings/:refuellingId', {
      schema: {
        summary: 'Edita um abstecimento',
        tags: ['abastecimento'],
        params: z.object({
           refuellingId: z.coerce.number() 
        }),
        body: z.object({
          liters: z.number(),
          cost: z.number(),
          date: z.date()
        }),
        response: {
          200: z.object({
            message: z.string(),
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

        if(isNaN(refuellingId)){
          reply.status(406)
          throw new Error("O ID do abastecimento deve ser um número")
        }

        const refuelling = await prisma.refuelling.findUnique({
          where:{
            id:refuellingId
          }
        })

        if(!refuelling){
          reply.status(404)
          throw new Error("Abastecimento não localizado")
        }

        const body:any = request.body
        const {liters, cost, date} = body.date

        if(isNaN(liters) || isNaN(cost) || !date){
          reply.status(406)
          throw new Error("Envie os campos corretamente")
        }

        await prisma.refuelling.update({
          where:{
            id: refuellingId
          },
          data:{
            liters: liters,
            cost: cost,
            date: date
          }
        })

      return reply.status(200).send({ message: 'abastecimento editado com sucesso!' })
    })
}

