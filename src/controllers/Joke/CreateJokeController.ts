import { CreateJokeService } from "../../services/joke/CreateJokeService"
import {Request, Response} from "express"

class CreateJokeController{
    async handle(request:Request, response:Response){

        const {user_id, setup, punchline}= request.body;
        const createJokeService= new CreateJokeService();
        const piada= await createJokeService.execute({user_id, setup, punchline});
       
        
        return response.json(piada);
    }
}

export {CreateJokeController}