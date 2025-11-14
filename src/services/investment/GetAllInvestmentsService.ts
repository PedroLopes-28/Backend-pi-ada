import fetch from "node-fetch"

export interface FetchInvestment{
    ticker: string;
    name:string;
    pricePerAction:number;
}

type BrapiStockItem = {
  stock?: string;
  name?: string;
  close?: number;
};

type BrapiListResponse = {
  stocks?: BrapiStockItem[];
  hasNextPage?: boolean;
  currentPage?: number;
  totalPages?: number;
};


class GetAllInvestmentService{
    private readonly token= process.env.BRAPI_TOKEN;
    private readonly brappiUrl=process.env.BRAPI_URL;
    async execute(){
        const fetchFn = globalThis.fetch.bind(globalThis) as typeof fetch;
        const perPage=100;
        let page=1;
        let nextPage=true;

        const allInvestments=[];

        while(nextPage){
            const url=new URL(`${this.brappiUrl}/quote/list`);
            url.searchParams.set("type", "stock");
            url.searchParams.set("limit", String(perPage));
            url.searchParams.set("page", String(page));
            url.searchParams.set("token", this.token);

            const resp = await fetchFn(url.toString(),{
                method: "GET",
                headers:{Authorization : `Bearer ${this.token}`},
            });

            if (!resp.ok){
                const text = await resp.text().catch(()=>  "")
                if (resp.status == 401){
                    throw new Error ("Falha de autenticação na brapi (401), verifique o token")
                }
                throw new Error(`Erro ao consultar a brapi, (status ${resp.status})`);


            }

            const data = (await resp.json()) as BrapiListResponse;// precisa da referencia a interface por causa da tipagem
            const stocks: any[] = Array.isArray(data?.stocks) ? data.stocks : [];
            
            for (const stock of stocks){

                //extrai os dados do vetor stocks que veio da brappi
                const ticker = String(stock?.stock ?? "").trim();
                const name = String(stock?.name ?? "").trim();
                const price = Number(stock?.close ?? NaN);

                //se deu tudo certo, coloca todos os valores dentro do vetor de resposta
                if (ticker && name && Number.isFinite(price)) {
                allInvestments.push({ ticker, name, price });
                }

            }
            nextPage= Boolean(data?.hasNextPage);
            page+=1;
        }
        return allInvestments
        

    }
}

export {GetAllInvestmentService}



