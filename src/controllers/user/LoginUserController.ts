import { LoginUserService } from "../../services/user/auth/LoginUserService"
import {Request, Response} from "express"

class LoginUserController{
    async handle(request:Request, response:Response){
        const {email,password}=request.body;
        const loginUserService= new LoginUserService();
        const login= await loginUserService.execute({email,password});
        return response.json(login);

    }
}

export {LoginUserController}