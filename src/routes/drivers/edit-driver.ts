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

      if(isNaN(driverId)){
        reply.status(406)
        throw new Error("O ID do motorista precisa ser um número")
      }

      const driver = prisma.driver.findUnique({
        where:{
          id:driverId
        }
      })

      if(!driver){
        reply.status(404)
        throw new Error("Motorista não localizado")
      }


      const body:any = request.body
      const {name , cpf} = body

      if(!name || name.lenght < 3){
        reply.status(406)
        throw new Error("O nome deve ter no minimo 3 caracteres")
      }

      if(!cpf || cpf.length < 14){
        reply.status(406)
        throw new Error("O CPF deve conter no minimo 14 caracteres")
      }

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

