import prismaClient from "../../prisma";
import { CreateUserRequest } from "../../interfaces/user/CreateUserRequest";
import {hash} from "bcryptjs"

class CreateUserService {
    async execute ({name,email,password}:CreateUserRequest){
        const normalizedEmail = email?.trim().toLowerCase();//normaliza o email para o padrão

        const alreadyExists= await prismaClient.user.findUnique({
            where:{
                email:normalizedEmail
            }
        });

        if(alreadyExists){
            throw new Error("Uma conta com esse email já existe");
        }

        const criptPassword = await hash(password, 8)

        const newUser= await prismaClient.user.create({
            data:{
                email:normalizedEmail,
                name:name,
                password:criptPassword,
            },
            select:{
                id:true,
                name:true,
                email:true,
            }
        });
        return newUser;
        

    }
}


export {CreateUserService};

