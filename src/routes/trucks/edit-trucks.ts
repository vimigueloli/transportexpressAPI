import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function editTruck(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/trucks/:truckId', {
      schema: {
        summary: 'Edita um caminhão',
        tags: ['caminhão'],
        params: z.object({
           truckId: z.coerce.number() 
        }),
        body: z.object({
          plate: z.string(),
          renavan: z.string().optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          })
        },
      },
    }, async (request, reply) => {

        const {truckId} = request.params
        const {plate, renavan} = request.body

        await prisma.truck.update({
            where:{
                id: truckId
            },
            data:{
                plate: plate,
                renavan: renavan
            }
        })

      return reply.status(200).send({ message: 'Caminhão editado com sucesso!' })
    })
}

