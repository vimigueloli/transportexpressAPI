import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

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
      },
    }, async (request, reply) => {

        const {refuellingId} = request.params
        const {liters, cost, date} = request.body

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

