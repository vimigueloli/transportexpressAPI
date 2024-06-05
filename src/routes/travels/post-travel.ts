import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function createTravel(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/travels', {
      schema: {
        summary: 'Registra um transporte',
        tags: ['transporte'],
        body: z.object({
            urban: z.boolean(),
            number: z.string().optional(),
            date: z.string().datetime(),
            prize: z.number(),
            commission: z.number(),
            client: z.string(),
            toll_prize: z.number().optional(),
            driver_id: z.number(),
            truck_plate: z.string(),
          }),
        response: {
          201: z.object({
            travelId: z.number(),
          })
        },
        headers: z.object({
          authorization: z.string()
        }),
      },
      preHandler: [authChecker]
    }, async (request, reply) => {
      const body:any = request.body
      const {
        urban,
        number,
        date,
        prize,
        commission,
        client,
        toll_prize,
        driver_id,
        truck_plate,
      } = body

      if(!date || isNaN(prize) || isNaN(commission) || !client){
        reply.status(406)
        console.log('falha')
        throw new Error("Envie os campos corretamente")
      }

      console.log({
          urban,
          number,
          date: new Date(date),
          prize,
          commission,
          client,
          tollPrize: toll_prize,
          driverId: driver_id,
          truckPlate: truck_plate,
        })

      let travel 
      
      try{
        travel = await prisma.travel.create({
          data: {
            urban,
            number,
            date: new Date(date),
            prize,
            commission,
            client,
            tollPrize: toll_prize,
            driverId: driver_id,
            truckPlate: truck_plate,
          },
        })
      }catch(e:any){
        console.log('Erro ->', e)
      }

      return reply.status(201).send({ travelId: travel?.id })
    })
}

