import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler:[authChecker]
    }, async (request, reply) => {

        const params:any = request.params

        const {driverId} = params

        await prisma.driver.delete({
            where:{
                id:driverId
            }
        })

      return reply.status(201).send({ message: 'Motorista deletado com sucesso!' })
    })
}

