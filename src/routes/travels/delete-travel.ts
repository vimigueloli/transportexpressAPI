import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function deleteTravel(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/travels/:travelId', {
      schema: {
        summary: 'Deleta um transporte',
        tags: ['transporte'],
        params: z.object({
           travelId: z.coerce.number() 
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
        const {travelId} = params

        if(isNaN(travelId)){
          reply.status(406)
          throw new Error("O ID da viagem deve ser um número")
        }

        const travel = await prisma.travel.findUnique({
          where:{
            id:travelId
          }
        })

        if(!travel){
          reply.status(404)
          throw new Error("Viagem não localizada")
        }

        await prisma.travel.delete({
            where:{
                id:travelId
            }
        })

      return reply.status(200).send({ message: 'transporte deletado com sucesso!' })
    })
}

