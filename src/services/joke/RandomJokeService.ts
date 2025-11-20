import prismaClient from "../../prisma";
import { JokeByUserRequest } from "../../interfaces/joke/JokeByUserRequest";


type JFlags = {
  nsfw: boolean;
  religious: boolean;
  political: boolean;
  racist: boolean;
  sexist: boolean;
  explicit: boolean;
};

export interface Piada {
  error: false;
  category: string;
  type: 'twopart';
  setup: string;
  delivery: string;
  flags: JFlags;
  id: number;
  safe: boolean;
  lang: 'pt';
}



class RandomJokeService{
    async execute ({user_id}:JokeByUserRequest){

        if(!user_id){
            throw new Error("Id do dono da piada deve ser enviado");
        }


        const pegaPiada = await fetch('https://v2.jokeapi.dev/joke/Any?lang=en&safe-mode');
        //o filtro pega só piadas seguras,-->type=twopart&safe-mode
        //se tirar o safe-mode, ai vem de tudo
        //pra controlar os filtros, basta colocar na url
        //pra remover, coloca depois do lang um & e coloca -->blacklistFlags=nsfw,political,sexist
        //ou usa o safe-mode, que é basicamente o mesmo de usar a blacklist completa acima
        //tem só duas piadas em portugues, que depressão


        if (!pegaPiada.ok){
            throw new Error ("Erro na api externa de piadas")
        }

        const piadaAleatoria= await pegaPiada.json();
        
        const setup=piadaAleatoria.setup;
        const punchline=piadaAleatoria.delivery;



        const piada=await prismaClient.joke.create({
            data:{
                user_id:user_id,
                setup:setup,
                punchline:punchline

            },
            select:{
                setup:true,
                punchline:true,
                id:true
            }
        })

        return piada;

    }
}


export {RandomJokeService}