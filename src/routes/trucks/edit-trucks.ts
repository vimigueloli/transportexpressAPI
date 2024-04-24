import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

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
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
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

        const body:any = request.body
        const {plate, renavan} = body

        if(plate.length < 8){
          reply.status(406)
          throw new Error("A placa do caminhão deve conter 8caracteres contando com o caracter especial")
        }

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

