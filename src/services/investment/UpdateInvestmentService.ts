import { UpdateInvestmentRequest } from "../../interfaces/investments/UpdateInvestmentRequest";
import prismaClient from "../../prisma";

type BrapiQuoteResponse = {
  results?: BrapiQuoteItem[];
};//resposta da api da brapi


type BrapiQuoteItem = {
  symbol?: string;
  shortName?: string;
  regularMarketPrice?: number;
};//o item em si dentro da lista da resposta

class UpdateInvestmentService{
    private readonly token= process.env.BRAPI_TOKEN;
    private readonly brappiUrl=process.env.BRAPI_URL;

    async execute({investment_id, quantity}:UpdateInvestmentRequest){
        if(!investment_id){
            throw new Error("O id do investimento deve ser enviado");
        }

        const updatedInvestment= await prismaClient.investment.update({
            where:{
                id:investment_id
            },
            data:{
                quantity: Number(quantity)
            }
        })
        if (!this.token) {
      throw new Error("Token da brapi não configurado. Defina BRAPI_TOKEN no ambiente.");
        }

        const url=new URL(`${this.brappiUrl}/quote/${encodeURIComponent(updatedInvestment.ticker)}`);//gera a url da requisição com o objeto

        url.searchParams.set("token", this.token);//envia o token de autentificação

        const resp = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${this.token}` },
        });//faz o fetch com o metodo get, enviando a autentificação

        if (!resp.ok) {// se a resposta não chegou bem, trata o erro
            const text = await resp.text().catch(() => "");
            if (resp.status === 401) {
            throw new Error("Falha de autenticação na brapi (401), verifique o token.");
            }
            throw new Error(`Erro ao consultar a brapi (status ${resp.status}). ${text?.slice(0, 200)}`);
        }
        //coloca a resposta dos dados dentro do objeto de resposta
        const data = (await resp.json()) as BrapiQuoteResponse;
        const quote = data?.results?.[0];// data results é a resposta, mas o dado que buscamosn está em results.[0]

        let valorMercado=Number(quote.regularMarketPrice);
        let novoValorInvestido = valorMercado * updatedInvestment.quantity;
        updatedInvestment.investedValue=novoValorInvestido;

        const newN= await prismaClient.investment.update({
            where:{
                id:updatedInvestment.id
            },
            data:{
                investedValue:updatedInvestment.investedValue,
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

export {UpdateInvestmentService}

