import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

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
      },
    }, async (request, reply) => {

        const {maintenanceId} = request.params

        const maintenance = await prisma.maintenance.findUnique({
            where:{
                id: maintenanceId
            }
        })

        if(maintenance=== null || maintenance === undefined){
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

