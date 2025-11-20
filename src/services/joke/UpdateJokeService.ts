import prismaClient from "../../prisma";
import { JokeUpdateRequest } from "../../interfaces/joke/JokeUpdateRequest";

class UpdateJokeService{
    async execute ({joke_id,setup, punchline}:JokeUpdateRequest){

        if(!joke_id){
            throw new Error("Id da piada deve ser enviado");
        }
        if(!setup || !punchline){
            throw new Error("Os dados da piada devem ser enviados");
        }
        const piada=await prismaClient.joke.update({
            where:{
                id:joke_id
            },
            data:{
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


export {UpdateJokeService}