import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Edita uma manuteção',
        tags: ['manutenção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
        }),
        body: z.object({
          obs: z.string(),
          cost: z.number(),
          commission: z.number(),
          date: z.string().datetime()
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


        const body:any = request.body
        const {obs , cost, commission, date} = body

        if(obs.length < 6 || !cost || isNaN(cost) || !commission || isNaN(commission) || !date){
          reply.status(406)
          throw new Error("Envie os campos corretamente")
        }


        await prisma.maintenance.update({
          where:{
            id: maintenanceId
          },
          data:{
            obs: obs,
            cost: cost,
            commission: commission,
            date: new Date(date)
          }
        })

      return reply.status(200).send({ message: 'Manuteção editada com sucesso!' })
    })
}

