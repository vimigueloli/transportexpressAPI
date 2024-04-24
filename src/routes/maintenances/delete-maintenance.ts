import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function deleteMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Deleta uma manutenção',
        tags: ['manutenção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
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
        const {maintenanceId} = params

        if(isNaN(maintenanceId)){
          reply.status(406)
          throw new Error("O ID da manutenção deve ser um número")
        }

        const maintanance = await prisma.maintenance.findUnique({
          where:{
            id: maintenanceId
          }
        })

        if(!maintanance){
          reply.status(404)
          throw new Error("Manutenção não localizada")
        }

        await prisma.maintenance.delete({
            where:{
                id:maintenanceId
            }
        })

      return reply.status(200).send({ message: 'manutenção deletada com sucesso!' })
    })
}

