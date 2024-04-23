import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editDriver(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/drivers/:driverId', {
      schema: {
        summary: 'Edita um motorista',
        tags: ['motorista'],
        params: z.object({
           driverId: z.coerce.number() 
        }),
        body: z.object({
          name: z.string(),
          cpf: z.string().optional(),
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
        const driverId = params.driverId

        const body:any = request.body
        const {name , cpf} = body

        await prisma.driver.update({
          where:{
            id: driverId
          },
          data:{
            name: name,
            cpf: cpf
          }
        })

      return reply.status(200).send({ message: 'Motorista editado com sucesso!' })
    })
}

