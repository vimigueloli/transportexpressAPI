import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

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
      },
    }, async (request, reply) => {

        const {pathId} = request.params

        const path = await prisma.route.findUnique({
            where:{
                id: pathId
            }
        })

        if(path=== null || path === undefined){
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

