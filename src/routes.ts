import {Router, Request, Response} from "express"
import { CreateUserController } from "./controllers/CreateUserController";
import { LoginUserController } from "./controllers/LoginUserController";


const router = Router();
router.get('/test', (request:Request, response:Response)=>{
    return response.json({ok:true})
})

//rotas de usuário
router.post("/user", new CreateUserController().handle);//cadastro
router.post("/user/login", new LoginUserController().handle);//login



export {router}