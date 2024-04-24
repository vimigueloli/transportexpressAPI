import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma";


export default function authChecker(req: FastifyRequest,res: FastifyReply, next: Function){
    
    const token =  req.headers?.authorization?.split(' ')[1] 

    console.log('oi', token)
    
    if(!token){
        res.status(401)
        throw Error('token necessário para proseeguir')
    }

    

    //todo colocar a secret no .env
    const data:any = jwt.verify(token,`${process.env.JWT_SECRET}`)

    if(!data){
        res.status(401)
        throw Error('token inválido')
    }

    

    const user = prisma.user.findUnique({
        where:{
            id: data.id
        }
    })

    if(!user){
        res.status(401)
        throw Error('token inválido')
    }
    
    next()
}