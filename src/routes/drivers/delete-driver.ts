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

        if(!driverId || isNaN(driverId)){
          reply.status(406)
          throw new Error("O ID do motorista precisa ser um número")
        }

        const driver = await prisma.driver.findUnique({
          where:{
            id: driverId
          }
        })

        if(!driver){
          reply.status(404)
          throw new Error("Motorista não encontrado")
        }


        await prisma.driver.delete({
            where:{
                id:driverId
            }
        })

      return reply.status(201).send({ message: 'Motorista deletado com sucesso!' })
    })
}

