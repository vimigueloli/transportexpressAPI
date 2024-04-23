import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import bcrypt from 'bcrypt'
import { FastifyInstance } from "fastify"

export async function createHash(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/trucks', {
      schema: {
        summary: 'transforma uma senha em hash',
        tags: ['usuário'],
        security: [{ apiKey: [] }],
        body: z.object({
          password: z.string(),
        }),
        response: {
          201: z.object({
            hash: z.string(),
          })
        },
      },
    }, async (request, reply) => {
      const {
        password,
      } = request.body

      // ? salt is an extra string to get the hash more dificult to break
      const salt = await bcrypt.genSalt(16)
      const hash = await bcrypt.hash(password, salt)
      

      return reply.status(201).send({ hash: hash })
    })
}

