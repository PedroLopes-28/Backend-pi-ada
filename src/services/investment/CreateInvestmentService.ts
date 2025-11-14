import { InvestmentRequest } from "../../interfaces/investments/InvestmentRequest";
import prismaClient from "../../prisma";


class CreateInvestmentService {

    async execute ({name,ticker,investedValue, quantity, user_id}:InvestmentRequest)
    {
        if(!user_id){
            throw new Error ("Id do usuário é necessária para realizar o investimento");
        }
        const investment = await prismaClient.investment.create({
            data:{
                user_id:user_id,
                name:name,
                ticker:ticker,
                investedValue:Number(investedValue),
                quantity:Number(quantity)
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
        return investment;      
    }

}

export {CreateInvestmentService}