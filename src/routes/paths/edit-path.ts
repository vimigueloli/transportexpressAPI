import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editPath(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/paths/:pathId', {
      schema: {
        summary: 'Edita um motorista',
        tags: ['trecho'],
        params: z.object({
           pathId: z.coerce.number() 
        }),
        body: z.object({
          origin: z.string(),
          destination: z.string().optional(),
          suggested_price: z.number().optional()
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
        const body:any = request.body
        const {origin, suggested_price, destination} = body

        await prisma.route.update({
          where:{
            id: pathId
          },
          data:{
            origin: origin,
            destination: destination,
            suggestedPrice: suggested_price
          }
        })

      return reply.status(200).send({ message: 'trecho editado com sucesso!' })
    })
}

