declare namespace Express{
    export interface Request{
        user_id:string
    }
}
//já coloca direto o user_id como campo da requisição
//assim previne erro de não existir o user_id na hora de pegar o token pra identificar 
