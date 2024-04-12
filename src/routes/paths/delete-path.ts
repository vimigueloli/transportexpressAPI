import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function deletePath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/paths/:pathId', {
      schema: {
        summary: 'Deleta um trecho',
        tags: ['trecho'],
        params: z.object({
           pathId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {pathId} = request.params

        await prisma.route.delete({
            where:{
                id:pathId
            }
        })

      return reply.status(200).send({ message: 'Motorista deletado com sucesso!' })
    })
}

