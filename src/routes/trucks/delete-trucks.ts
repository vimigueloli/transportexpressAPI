import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function deleteTruck(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/trucks/:truckId', {
      schema: {
        summary: 'Deleta um caminhão',
        tags: ['caminhão'],
        params: z.object({
           truckId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {truckId} = request.params

        await prisma.truck.delete({
            where:{
                id:truckId
            }
        })

      return reply.status(201).send({ message: 'Caminhão deletado com sucesso!' })
    })
}

