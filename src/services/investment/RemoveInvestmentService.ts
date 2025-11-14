import prismaClient from "../../prisma";
import { RemoveInvestmentRequest } from "../../interfaces/investments/RemoveInvestmentRequest";

class RemoveInvestmentService{
    async execute({investment_id}:RemoveInvestmentRequest){

        if (!investment_id){
            throw new Error("O id do investimento precisa ser enviado");
        }

        const investment = await prismaClient.investment.delete({
            where:{
                id:investment_id
            }
        });
        return ({message:"investimento deletado com sucesso"});

    }
}

export {RemoveInvestmentService};