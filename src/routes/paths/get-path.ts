import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getPath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/paths/:pathId', {
      schema: {
        summary: 'Exibe um trecho',
        tags: ['trecho'],
        params: z.object({
           pathId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            origin: z.string(),
            destination: z.string(),
            suggested_price: z.any(),
            id: z.number()
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
                id: pathId
            }
        })

        if(!path){
          reply.status(404)
          throw new Error("trecho não localizado")
        } else{
          return reply.status(200).send({
            id: path.id,
            suggested_price: path.suggestedPrice,
            origin: path.origin,
            destination: path.destination
          })
        }

    })
}

