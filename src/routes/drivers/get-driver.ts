import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getDriver(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/drivers/:driverId', {
      schema: {
        summary: 'Exibe um motorista',
        tags: ['motorista'],
        params: z.object({
           driverId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            cpf: z.string(),
            name: z.string(),
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
        const {driverId} = params

        if(isNaN(driverId)){
          reply.status(404)
          throw new Error("O ID do motorista deve ser um número")
        }

        const driver = await prisma.driver.findUnique({
            where:{
                id: driverId
            }
        })

        if(!driver){
          reply.status(404)
          throw new Error("Motorista não localizado")
        } else{
          return reply.status(201).send({
            id: driver.id,
            cpf: driver.cpf || '',
            name: driver.name
          })
        }

    })
}

