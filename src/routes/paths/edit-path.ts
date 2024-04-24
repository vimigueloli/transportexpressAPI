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

        const body:any = request.body
        const {origin, suggested_price, destination} = body

        if(!origin || !suggested_price || isNaN(suggested_price) || !destination){
          reply.status(406)
          throw new Error("Envie os campos corretamente")
        }

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

      return reply.status(200).send({ message: 'Trecho editado com sucesso!' })
    })
}

