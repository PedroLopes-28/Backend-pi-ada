import prismaClient from "../../prisma";
import { JokeRemoveRequest } from "../../interfaces/joke/JokeRemoveRequest";

class RemoveJokeService{
    async execute ({joke_id}:JokeRemoveRequest){

        if(!joke_id){
            throw new Error("Id da piada deve ser enviado");
        }
        
        const piadaDeletada=await prismaClient.joke.delete({
            where:{
                id:joke_id
            }
        })

        return ("Piada deletada com sucesso");

    }
}


export {RemoveJokeService}