import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function deleteDriver(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/drivers/:driverId', {
      schema: {
        summary: 'Deleta um motorista',
        tags: ['motorista'],
        params: z.object({
           driverId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {driverId} = request.params

        await prisma.driver.delete({
            where:{
                id:driverId
            }
        })

      return reply.status(201).send({ message: 'Motorista deletado com sucesso!' })
    })
}

