import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function deletePath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/refuellings/:refuellingId', {
      schema: {
        summary: 'Deleta um trecho',
        tags: ['abastecimento'],
        params: z.object({
           refuellingId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {refuellingId} = request.params

        await prisma.refuelling.delete({
            where:{
                id:refuellingId
            }
        })

      return reply.status(200).send({ message: 'abastecimento deletado com sucesso!' })
    })
}

