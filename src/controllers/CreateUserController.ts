import { UserRequest } from "../interfaces/User/UserRequest"
import { CreateUserService } from "../services/user/CreateUserService";
import {Request, Response} from "express"

class CreateUserController{

    async handle(request:Request, response:Response){
        const {email,password, name}=request.body;
        const userController= new CreateUserService();
        const usuario= await userController.execute({name,password,email});
        console.log(usuario);
        return response.json(usuario);
    }
}

export {CreateUserController}