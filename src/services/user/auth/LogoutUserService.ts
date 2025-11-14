import { verify, JwtPayload } from "jsonwebtoken";
import prismaClient from "../../../prisma";



type Decoded = JwtPayload & {
  sub: string;
  jti?: string;   // vem do jwtid (options do sign)
  exp?: number;   // epoch seconds
};


  class LogoutUserService{

    async execute(token:string){

        if(!token){
            return;
        }

        let decoded: Decoded;
        try{
            decoded=verify (token, process.env.JWT_SECRET as string) as Decoded;
            //decodifica o token e armazena em decoded
        } catch{
            return; // se deu erro, o token já ta invalido mesmo, só voltar
        }

        const {jti, exp} = decoded;//extrai os dois campos do token decodificado
        let blacklist;
        try {
            blacklist= await prismaClient.tokenRevogado.upsert({// upsert busca um registro, se não existe faz update, se existe cria um
                where:{jti},
                create:{jti, exp:new Date(exp*1000)},//converte milisegundos em segundos, alinhando o tempo com o date esperado
                //assim a data gravada é a da expiração real do token
                update:{exp:new Date(exp*1000),}
            })

        } catch{
            return; //novamente, se deu erro não é um problema
        }


    }

  }



  export {LogoutUserService}