import { UpdateJokeService } from "../../services/joke/UpdateJokeService"
import {Request, Response} from "express"

class UpdateJokeController{
    async handle(request:Request, response:Response){

        const joke_id=request.query.joke_id as string;//querry param que deve ser enviad0
        const {setup, punchline}= request.body;
        const updateJokeService= new UpdateJokeService();
        const piada= await updateJokeService.execute({joke_id, setup, punchline});
       
        
        return response.json(piada);
    }
}

export {UpdateJokeController}