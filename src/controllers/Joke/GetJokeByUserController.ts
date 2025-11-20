import { GetJokeByUserService } from "../../services/joke/GetJokeByUserService"
import {Request, Response} from "express"

class GetJokeByUserController{
    async handle(request:Request, response:Response){

        const user_id=request.query.user_id as string;//querry param que deve ser enviad0
        const getJokeByUserService= new GetJokeByUserService();
        const mensagem= await getJokeByUserService.execute({user_id});
       
        
        return response.json(mensagem);
    }
}

export {GetJokeByUserController}