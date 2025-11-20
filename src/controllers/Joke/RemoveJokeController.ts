import { RemoveJokeService } from "../../services/joke/RemoveJokeService"
import {Request, Response} from "express"

class RemoveJokeController{
    async handle(request:Request, response:Response){

        const joke_id=request.query.joke_id as string;//querry param que deve ser enviad0
        const removeJokeService= new RemoveJokeService();
        const mensagem= await removeJokeService.execute({joke_id});
       
        
        return response.json(mensagem);
    }
}

export {RemoveJokeController}