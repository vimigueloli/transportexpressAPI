import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {

        const params:any = request.params
        const {pathId} = params

        if(isNaN(pathId)){
          reply.status(406)
          throw new Error("O ID do trecho deve ser um número")
        }

        const path = await prisma.route.findUnique({
          where:{
            id:pathId
          }
        })

        if(!path){
          reply.status(404)
          throw new Error("Trecho não localizado")
        }

        await prisma.route.delete({
            where:{
                id:pathId
            }
        })

      return reply.status(200).send({ message: 'Trecho deletado com sucesso!' })
    })
}

