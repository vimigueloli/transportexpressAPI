import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function deleteTruck(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/trucks/:truckId', {
      
      preHandler: [authChecker],
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
        headers: z.object({
          authorization: z.string()
        }),
        
      },
    }, async (request, reply) => {

        const params:any = request.params
        const {truckId} = params

        if(isNaN(truckId)){
          reply.status(406)
          throw new Error("O ID do caminhão deve ser um número")
        }

        const truck = await prisma.truck.findUnique({
          where:{
            id: truckId
          }
        })

        if(!truck){
          reply.status(404)
          throw new Error("Caminhão não localizado")
        }

        await prisma.truck.delete({
            where:{
                id:truckId
            }
        })

      return reply.status(201).send({ message: 'Caminhão deletado com sucesso!' })
    })
}

