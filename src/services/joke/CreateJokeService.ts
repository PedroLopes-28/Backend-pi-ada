import prismaClient from "../../prisma";
import { JokeRequest } from "../../interfaces/joke/JokeRequest";

class CreateJokeService{
    async execute ({user_id,setup, punchline}:JokeRequest){

        if(!user_id){
            throw new Error("Id do dono da piada deve ser enviado");
        }
        if(!setup || !punchline){
            throw new Error("Os dados da piada devem ser enviados");
        }
        const piada=await prismaClient.joke.create({
            data:{
                user_id:user_id,
                setup:setup,
                punchline:punchline

            },
            select:{
                setup:true,
                punchline:true,
                id:true
            }
        })

        return piada;

    }
}


export {CreateJokeService}