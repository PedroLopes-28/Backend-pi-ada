import { GetInvestmentRequest } from "../../interfaces/investments/GetInvesmentRequest";
import prismaClient from "../../prisma";


type BrapiQuoteResponse = {
  results?: BrapiQuoteItem[];
};// resposta da api


type BrapiQuoteItem = {
  symbol?: string;
  shortName?: string;
  regularMarketPrice?: number;
};// dado dentro da resposta da api

class GetInvestmentService{
    private readonly token= process.env.BRAPI_TOKEN;
    private readonly brappiUrl=process.env.BRAPI_URL;

    async execute({investment_id}:GetInvestmentRequest){

        if (!investment_id){
            throw new Error("O id do investimento precisa ser enviado");
        }
        const investment = await prismaClient.investment.findFirst({
            where:{
                id:investment_id
            },
            select:{
                id:true,
                ticker:true,
                investedValue:true,
                quantity:true,
                user_id:true
            }

        });

        if(!investment){
            throw new Error("Investmento não encontrado")
        }

         if (!this.token) {
      throw new Error("Token da brapi não configurado. Defina BRAPI_TOKEN no ambiente.");
        }

        const url=new URL(`${this.brappiUrl}/quote/${encodeURIComponent(investment.ticker)}`);

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
        let novoValorInvestido = valorMercado * investment.quantity;
        investment.investedValue=novoValorInvestido;

        const newN= await prismaClient.investment.update({
            where:{
                id:investment.id
            },
            data:{
                investedValue:investment.investedValue,
                updated_at: new Date(),
            },
            select:{
                id:true,
                name:true,
                ticker:true,
                investedValue:true,
                quantity:true,
                user_id:true
            }
        })
 

        

        return newN;

    }
}

export {GetInvestmentService}


