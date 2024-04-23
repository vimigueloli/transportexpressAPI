import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getTruck(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/trucks/:truckId', {
      schema: {
        summary: 'Exibe um caminhão',
        tags: ['caminhão'],
        params: z.object({
           truckId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            plate: z.string(),
            renavan: z.string(),
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
        const {truckId} = params

        const truck = await prisma.truck.findUnique({
            where:{
                id: truckId
            }
        })

        if(truck === null || truck === undefined){
            throw new Error("Caminhão não localizado")
        }else{
            return reply.status(200).send({
                plate: truck.plate,
                renavan: truck.renavan || '',
                id: truck.id
            })
        }
    })
}

