import { ZodTypeProvider } from "fastify-type-provider-zod"
import { number, z } from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import authChecker from "../../helpers/authChecker"

export async function editTravel(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put('/travels/:travelId', {
      schema: {
        summary: 'Edita um transporte',
        tags: ['transporte'],
        params: z.object({
           travelId: z.coerce.number() 
        }),
        body: z.object({
          urban: z.boolean(),
          number: z.string(),
          date: z.date(),
          prize: z.number(),
          commission: z.number(),
          client: z.string(),
          toll_prize: z.number()
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
        const travelId = params.travelId
        const body:any = request.body
        const {urban, number, date, prize, commission, client, toll_prize} = body

        await prisma.travel.update({
          where:{
            id: travelId
          },
          data:{
            urban,
            number,
            date,
            prize,
            commission: commission,
            client,
            tollPrize: toll_prize
          }
        })

      return reply.status(200).send({ message: 'Transporte editado com sucesso!' })
    })
}

