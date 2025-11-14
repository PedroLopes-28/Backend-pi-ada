import { GetInvestmentsByUserRequest } from "../../interfaces/investments/GetInvestmentsByUserRequest";
import prismaClient from "../../prisma";


type BrapiQuoteResponse = {
  results?: BrapiQuoteItem[];
};// resposta da api


type BrapiQuoteItem = {
  symbol?: string;
  shortName?: string;
  regularMarketPrice?: number;
};// dado dentro da resposta da api

class GetInvestmentsByUserService{
    private readonly token= process.env.BRAPI_TOKEN;
    private readonly brappiUrl=process.env.BRAPI_URL;

    async execute({user_id}:GetInvestmentsByUserRequest){

        if (!user_id){
            throw new Error("O id do usuário precisa ser enviada");
        }
        const investments = await prismaClient.investment.findMany({
            where:{
                user_id:user_id//pega todos os investimentos de um dado usuário por id
            },
            select:{
                id:true,
                name:true,
                ticker:true,
                investedValue:true,
                quantity:true,
                user_id:true
            }

        });

        if(!investments){
            throw new Error("Investmento não encontrado")
        }

         if (!this.token) {
      throw new Error("Token da brapi não configurado. Defina BRAPI_TOKEN no ambiente.");
        }

        for(let n of investments){

            const url=new URL(`${this.brappiUrl}/quote/${encodeURIComponent(n.ticker)}`);

        url.searchParams.set("token", this.token);

        const resp = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${this.token}` },
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            if (resp.status === 401) {
            throw new Error("Falha de autenticação na brapi (401), verifique o token.");
            }
            throw new Error(`Erro ao consultar a brapi (status ${resp.status}). ${text?.slice(0, 200)}`);
        }

        const data = (await resp.json()) as BrapiQuoteResponse;
        const quote = data?.results?.[0];

        let valorMercado=Number(quote.regularMarketPrice);
        console.log(valorMercado)
        let novoValorInvestido = valorMercado * n.quantity;
        n.investedValue=novoValorInvestido;

        const newN= await prismaClient.investment.update({
            where:{
                id:n.id
            },
            data:{
                investedValue:novoValorInvestido,
                updated_at: new Date(),
            }
        })


        }

        return investments;

    }
}

export {GetInvestmentsByUserService}


