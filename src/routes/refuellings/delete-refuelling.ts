import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function deleteRefuelling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/refuellings/:refuellingId', {
      schema: {
        summary: 'Deleta um abastecimento',
        tags: ['abastecimento'],
        params: z.object({
           refuellingId: z.coerce.number() 
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

        await prisma.refuelling.delete({
            where:{
                id:refuellingId
            }
        })

      return reply.status(200).send({ message: 'abastecimento deletado com sucesso!' })
    })
}

