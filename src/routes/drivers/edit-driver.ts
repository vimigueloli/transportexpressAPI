import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function editDriver(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/drivers/:driverId', {
      schema: {
        summary: 'Edita um motorista',
        tags: ['motoristas'],
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
      },
    }, async (request, reply) => {

        const {driverId} = request.params
        const {name, cpf} = request.body

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

