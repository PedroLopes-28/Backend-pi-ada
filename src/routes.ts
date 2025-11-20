import {Router, Request, Response} from "express"
import { CreateUserController } from "./controllers/user/CreateUserController";
import { LoginUserController } from "./controllers/user/LoginUserController";
import { isAuthenticated } from "./middleware/isAuthenticated";
import { CreateJokeController } from "./controllers/Joke/CreateJokeController";


const router = Router();
router.get('/test', (request:Request, response:Response)=>{
    return response.json({ok:true})
})

//rotas de usuário
router.post("/user", new CreateUserController().handle);//cadastro
router.post("/user/login", new LoginUserController().handle);//login

//rotas de piadas
router.post("/joke", isAuthenticated, new CreateJokeController().handle)//cria uma piada nova




export {router}