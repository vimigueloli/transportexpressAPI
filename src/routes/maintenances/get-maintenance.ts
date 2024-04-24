import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function getMaintenance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/maintenances/:maintenanceId', {
      schema: {
        summary: 'Exibe uma manutenção',
        tags: ['manutenção'],
        params: z.object({
           maintenanceId: z.coerce.number() 
        }),
        response: {
          200: z.object({
            commission: z.number(),
            cost: z.number(),
            obs: z.string(),
            driver: z.object({
              name: z.string(),
              id: z.number()
            }),
            truck:z.object({
              plate: z.string(),
              id: z.number()
            }),
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
        const {maintenanceId} = params

        if(isNaN(maintenanceId)){
          reply.status(406)
          throw new Error("O ID da manutenção deve ser um número")
        }

        const maintenance = await prisma.maintenance.findUnique({
            where:{
                id: maintenanceId
            },
            select:{
              id:true,
              commission:true,
              cost:true,
              obs: true,
              date:true,
              driver:{
                select:{
                  id:true,
                  name:true
                }
              },
              truck:{
                select:{
                  id:true,
                  plate: true
                }
              }
            }
        })

        if(!maintenance){
          reply.status(404)
          throw new Error("Manutenção não localizada")
        } else{
          return reply.status(200).send({
            id: maintenance.id,
            commission: Number(maintenance.commission),
            cost: Number(maintenance.cost),
            obs: maintenance.obs,
            truck:{
              plate: '',
              id: 0
            },
            driver:{
              name: '',
              id: 0
            }
          })
        }

    })
}

