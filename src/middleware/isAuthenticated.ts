import {Request, Response, NextFunction} from "express"
import { Payload } from "../interfaces/User/auth/Payload"
import {verify} from "jsonwebtoken"

export function isAuthenticated(request:Request, response:Response, next:NextFunction){


    //acessar o token js no header da requisição
    const authToken = request.headers.authorization

    if(!authToken){
        return response.status(401).end()// se o token não existe envia um erro
    }

    const [, token]= authToken.split(" ")//limpa o token para descriptografar
    try {
        //validação do token
        const {sub} = verify(token,process.env.JWT_SECRET) as Payload
        request.user_id = sub
        return next()
    }catch (error){
        return response.send(401).end()
    }
}

