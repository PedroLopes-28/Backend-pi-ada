import {compare} from "bcryptjs"
import {sign} from "jsonwebtoken"
import prismaClient from "../../../prisma/index"
import { LoginRequest } from "../../../interfaces/User/auth/LoginRequest"






class LoginUserService{

    async execute ({email,password}: LoginRequest){


        //verifica se vierarm os dados
        const emailNormalizado=email?.trim().toLowerCase()
        if(!emailNormalizado || !password){
            throw new Error ("Se precisa enviar o email e a senha para fazer o login")
        }
        const usuario= await prismaClient.user.findFirst({
            where:{
                email:email
            },
            select:{
                id:true,
                name:true,
                email:true,
                password:true
            }
        })

        if(!usuario){
            throw new Error ("Email ou senha incorretos");
        }

        const senhaCerta= await compare(password, usuario.password);
        if(!senhaCerta){
            throw new Error ("Email ou senha incorretos")
        }

        const token= sign(
            {
                name:usuario.name,
                email:usuario.email
            },
            process.env.JWT_SECRET as string,
            {
                subject:usuario.id,
                expiresIn:'30d'
            }
        )

        return {
            id:usuario.id,
            name:usuario.name,
            email:usuario.email,
            token:token
        }



    }

}

export {LoginUserService}