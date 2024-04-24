import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken"
import {z} from 'zod'
import { prisma } from "../../lib/prisma";
import bcrypt from  'bcrypt'


export default async function login(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/login', {
      schema: {
        summary: 'faz login',
        tags: ['usuário'],
        body: z.object({
            email: z.string(),
            password: z.string()
        }),
        response: {
            200: z.object({
                token: z.string(),
                id: z.number(),
                email: z.string(),
            }),
            406: z.object({
                message: z.string()
            })
        }
      },
    }, async (request, reply) => {
        const {email, password}= request.body
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            reply.status(406)
            return({
                message:'usuário inexistente'
            })
        }
      
        const check = await bcrypt.compare(password, user.password)

        if(!check){
                reply.status(406)
                return({
                    message: "senha inválida"
                })
            }

        const token = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, `${process.env.JWT_SECRET}`)

        reply.status(200)
        return({
            token: token,
            id: user.id,
            email: user.email
        })
    })
}
