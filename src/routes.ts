import {Router, Request, Response} from "express"
import { CreateUserController } from "./controllers/user/CreateUserController";
import { LoginUserController } from "./controllers/user/LoginUserController";
import { isAuthenticated } from "./middleware/isAuthenticated";
import { CreateJokeController } from "./controllers/Joke/CreateJokeController";
import { UpdateJokeController } from "./controllers/Joke/UpdateJokeController";
import { RemoveJokeController } from "./controllers/Joke/RemoveJokeController";
import { GetJokeByUserController } from "./controllers/Joke/GetJokeByUserController";
import { RandomJokeService } from "./services/joke/RandomJokeService";
import { RandomJokeController } from "./controllers/Joke/RandomJokeController";


const router = Router();
router.get('/test', (request:Request, response:Response)=>{
    return response.json({ok:true})
})

//rotas de usuário
router.post("/user", new CreateUserController().handle);//cadastro
router.post("/user/login", new LoginUserController().handle);//login

//rotas de piadas
router.post("/joke", isAuthenticated, new CreateJokeController().handle);//cria uma piada 
router.put("/joke/edit", isAuthenticated, new UpdateJokeController().handle);//atualiza uma piada por id, recebe query param de joke_id
router.delete("/joke/remove", isAuthenticated, new RemoveJokeController().handle);//remove uma piada, recebe query param de joke_id
router.get("/joke/user", isAuthenticated, new GetJokeByUserController().handle);//pega todas as piadas de um usuário
router.get("/joke/random", isAuthenticated, new RandomJokeController().handle);//pega uma piada aleatoria do banco de dados
// https://v2.jokesAPI





export {router}