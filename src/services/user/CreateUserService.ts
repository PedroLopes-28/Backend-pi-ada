import prismaClient from "../../prisma";
import { UserRequest } from "../../interfaces/User/UserRequest";
import {hash} from "bcryptjs"

class CreateUserService{
    async execute({name,email,password}:UserRequest){
        const emailNormalizado = email?.trim().toLowerCase();//remove espaços desnecessário e letras maiusculas
        if(!emailNormalizado){
            throw new Error("O email deve ser enviado para fazer o cadastro");
        }
        const jaExiste= await prismaClient.user.findUnique({
            where:{
                email:email
            }


        })

        if(jaExiste){
            throw new Error("Já existe um usuário com esse email")
        }
        const HashSenha= await hash(password, 8); //criptografa a senha

        const usuario= await prismaClient.user.create({
            data:{
                name:name,
                email:email,
                password:HashSenha
            },
            select:{
                id:true,
                name:true,
                email:true,
            }
        })

        return usuario





    }
}

export {CreateUserService}
