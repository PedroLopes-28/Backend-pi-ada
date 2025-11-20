import prismaClient from "../../prisma";
import { JokeByUserRequest } from "../../interfaces/joke/JokeByUserRequest";

class GetJokeByUserService{
    async execute({user_id}:JokeByUserRequest){
        if(!user_id){
            throw new Error("Id do usuário deve ser enviada");
        }

        const piadasDoUsuario= await prismaClient.joke.findMany({
            where:{
                user_id:user_id
            },
            select:{
                id:true,
                setup:true,
                punchline:true
            }
        });

        return piadasDoUsuario;

    }
}

export {GetJokeByUserService}