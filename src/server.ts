import express, {Request, Response, NextFunction} from "express"
import {router} from './routes'
import "dotenv/config";
import cors from "cors"
import path from "path"


const app=express();
const port=process.env.PORT;

app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(router)


app.use((err:Error, request:Request, response:Response, next:NextFunction )=>{
    if (err instanceof Error){
        return response.status(400).json({
            error:err.message
        })
    }

    return response.status(500).json({
        status:'error',
        message: 'Internal server error.'
    })
})


app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port} - Projeto final - Web`)
})

