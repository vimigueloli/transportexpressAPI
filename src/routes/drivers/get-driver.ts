import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

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
      },
    }, async (request, reply) => {

        const {driverId} = request.params

        const driver = await prisma.driver.findUnique({
            where:{
                id: driverId
            }
        })

        if(driver=== null || driver === undefined){
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

