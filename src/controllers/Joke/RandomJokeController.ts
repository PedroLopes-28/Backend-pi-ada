import { RandomJokeService } from "../../services/joke/RandomJokeService";
import {Request, Response} from "express"

class RandomJokeController{
    async handle(request:Request, response:Response){

        const user_id=request.query.user_id as string;//querry param que deve ser enviado
        const randomJokeService= new RandomJokeService();
        const piada= await randomJokeService.execute({user_id});
       
        
        return response.json(piada);
    }
}

export {RandomJokeController}