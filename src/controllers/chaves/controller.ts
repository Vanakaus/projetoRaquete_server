import { Request, Response } from "express";
import { GerarChaveUseCase } from "./gerarChave";
import { LimparChaveUseCase } from "./limparChave";

const jwt = require('jsonwebtoken');



export class GerarChaveController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const { id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const gerarChaveUseCase = new GerarChaveUseCase();
        
        const result = await gerarChaveUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Chaves geradas com sucesso";

        return res.status(201).json(result);
    }
}



export class LimparChaveController {
    async handle(req: Request, res: Response) {
        
        var cpf = '';
        const { id_jogador } = req.query as any;
        const { id_campeonato } = req.query as any;
        const token = req.headers['x-access-token']

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: { cpf: string; }) => {
            cpf = decoded.cpf;
        });


        const limparChaveUseCase = new LimparChaveUseCase();
        
        const result = await limparChaveUseCase.execute({ cpf, id_jogador, id_campeonato }) as any;
        result.status= "success";
        result.mensagem = "Chaves deletadas com sucesso";

        return res.status(201).json(result);
    }
}

